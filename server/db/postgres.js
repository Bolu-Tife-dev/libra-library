import pg from 'pg'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import { config } from '../config.js'
import { HttpError } from '../utils/http.js'

const { Pool } = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SCHEMA_FILE = path.join(__dirname, 'schema.sql')

const LOAN_DAYS = 14
const FINE_PER_DAY = 1
const DAY_MS = 86_400_000

const mapBook = (r) => !r ? null : ({
  id: Number(r.id),
  title: r.title,
  author: r.author,
  isbn: r.isbn || '',
  category: r.category,
  copiesTotal: Number(r.copies_total),
  copiesAvailable: Number(r.copies_available),
  publishedYear: r.published_year == null ? null : Number(r.published_year),
  description: r.description || '',
  createdAt: r.created_at,
})

const mapUser = (r) => !r ? null : ({
  id: Number(r.id),
  name: r.name,
  email: r.email,
  role: r.role,
  idCard: r.id_card || null,
  createdAt: r.created_at,
})

const mapBorrowRow = (r) => ({
  id: Number(r.id),
  bookId: r.book_id == null ? null : Number(r.book_id),
  memberId: Number(r.member_id),
  borrowDate: r.borrow_date,
  dueDate: r.due_date,
  returnDate: r.return_date,
  fineAmount: Number(r.fine_amount),
  status: r.status,
  book: r.bk_id == null ? null : mapBook({
    id: r.bk_id, title: r.bk_title, author: r.bk_author, isbn: r.bk_isbn,
    category: r.bk_category, copies_total: r.bk_copies_total,
    copies_available: r.bk_copies_available, published_year: r.bk_published_year,
    description: r.bk_description, created_at: r.bk_created_at,
  }),
})

const BOOK_JOIN = `
  SELECT br.*,
    b.id AS bk_id, b.title AS bk_title, b.author AS bk_author, b.isbn AS bk_isbn,
    b.category AS bk_category, b.copies_total AS bk_copies_total,
    b.copies_available AS bk_copies_available, b.published_year AS bk_published_year,
    b.description AS bk_description, b.created_at AS bk_created_at
  FROM borrow_records br
  LEFT JOIN books b ON b.id = br.book_id
`

export class PostgresStore {
  constructor() {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
      ssl: config.databaseUrl.includes('supabase') ? { rejectUnauthorized: false } : undefined,
      // Serverless instances are short-lived; keep each one to a single connection.
      max: process.env.VERCEL ? 1 : 10,
      idleTimeoutMillis: process.env.VERCEL ? 10_000 : 30_000,
    })
  }

  async init() {
    await this.pool.query(await fs.readFile(SCHEMA_FILE, 'utf8'))
    const { rows } = await this.pool.query('SELECT COUNT(*)::int AS n FROM members')
    if (rows[0].n === 0) {
      const hash = await bcrypt.hash('1234', 10)
      await this.pool.query(
        `INSERT INTO members (name, email, password_hash, role) VALUES
         ($1, $2, $3, 'student'), ($4, $5, $3, 'admin')`,
        ['Alex Student', 'student@library.test', hash, 'Sam Admin', 'admin@library.test'],
      )
    }
  }

  /* ------------------------------- books -------------------------------- */

  async listBooks({ search = '', category = '', availableOnly = false } = {}) {
    const clauses = []
    const params = []
    const q = String(search).trim().toLowerCase()
    if (q) {
      params.push(`%${q}%`)
      clauses.push(`(LOWER(title) LIKE $${params.length} OR LOWER(author) LIKE $${params.length} OR LOWER(COALESCE(isbn,'')) LIKE $${params.length})`)
    }
    if (category) {
      params.push(category)
      clauses.push(`category = $${params.length}`)
    }
    if (availableOnly === true || availableOnly === 'true') clauses.push('copies_available > 0')
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
    const { rows } = await this.pool.query(`SELECT * FROM books ${where} ORDER BY id DESC`, params)
    return rows.map(mapBook)
  }

  async getBook(id) {
    const { rows } = await this.pool.query('SELECT * FROM books WHERE id = $1', [id])
    return mapBook(rows[0])
  }

  async getCategories() {
    const { rows } = await this.pool.query('SELECT DISTINCT category FROM books ORDER BY category')
    return rows.map((r) => r.category)
  }

  async createBook(data) {
    const { rows } = await this.pool.query(
      `INSERT INTO books (title, author, isbn, category, copies_total, copies_available, published_year, description)
       VALUES ($1,$2,$3,$4,$5,$5,$6,$7) RETURNING *`,
      [data.title, data.author, data.isbn, data.category, data.copiesTotal, data.publishedYear, data.description],
    )
    return mapBook(rows[0])
  }

  async updateBook(id, data) {
    const current = await this.getBook(id)
    if (!current) throw new HttpError(404, 'Book not found')
    const borrowed = current.copiesTotal - current.copiesAvailable
    const { rows } = await this.pool.query(
      `UPDATE books SET title=$1, author=$2, isbn=$3, category=$4, copies_total=$5,
        copies_available=$6, published_year=$7, description=$8 WHERE id=$9 RETURNING *`,
      [data.title, data.author, data.isbn, data.category, data.copiesTotal,
        Math.max(0, data.copiesTotal - borrowed), data.publishedYear, data.description, id],
    )
    return mapBook(rows[0])
  }

  async deleteBook(id) {
    const { rowCount } = await this.pool.query('DELETE FROM books WHERE id = $1', [id])
    if (!rowCount) throw new HttpError(404, 'Book not found')
    return { id: Number(id) }
  }

  /* ------------------------------- users -------------------------------- */

  async findUserByEmail(email) {
    const { rows } = await this.pool.query('SELECT * FROM members WHERE LOWER(email) = LOWER($1)', [email])
    return rows[0] || null
  }

  async findUserById(id) {
    const { rows } = await this.pool.query('SELECT * FROM members WHERE id = $1', [id])
    return rows[0] || null
  }

  async createUser({ name, email, passwordHash, role, idCard }) {
    try {
      const { rows } = await this.pool.query(
        `INSERT INTO members (name, email, password_hash, role, id_card) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [name, email, passwordHash, role, idCard ? JSON.stringify(idCard) : null],
      )
      return mapUser(rows[0])
    } catch (err) {
      if (err.code === '23505') throw new HttpError(409, 'An account with this email already exists')
      throw err
    }
  }

  /* ------------------------------ borrows ------------------------------- */

  async listBorrows({ memberId, status } = {}) {
    const clauses = []
    const params = []
    if (memberId) { params.push(memberId); clauses.push(`br.member_id = $${params.length}`) }
    if (status) { params.push(status); clauses.push(`br.status = $${params.length}`) }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
    const { rows } = await this.pool.query(`${BOOK_JOIN} ${where} ORDER BY br.borrow_date DESC`, params)
    return rows.map(mapBorrowRow)
  }

  async getBorrow(id) {
    const { rows } = await this.pool.query(`${BOOK_JOIN} WHERE br.id = $1`, [id])
    return rows[0] ? mapBorrowRow(rows[0]) : null
  }

  async createBorrow({ bookId, memberId }) {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const { rows } = await client.query('SELECT * FROM books WHERE id = $1 FOR UPDATE', [bookId])
      const book = rows[0]
      if (!book) throw new HttpError(404, 'Book not found')
      if (book.copies_available <= 0) throw new HttpError(409, 'No copies available right now')

      await client.query('UPDATE books SET copies_available = copies_available - 1 WHERE id = $1', [bookId])
      const dueDate = new Date(Date.now() + LOAN_DAYS * DAY_MS).toISOString()
      const inserted = await client.query(
        `INSERT INTO borrow_records (book_id, member_id, due_date) VALUES ($1,$2,$3) RETURNING *`,
        [bookId, memberId, dueDate],
      )
      await client.query('COMMIT')
      return { ...mapBorrowRow(inserted.rows[0]), book: mapBook({ ...book, copies_available: book.copies_available - 1 }) }
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  }

  async returnBorrow(id) {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const { rows } = await client.query('SELECT * FROM borrow_records WHERE id = $1 FOR UPDATE', [id])
      const record = rows[0]
      if (!record) throw new HttpError(404, 'Borrow record not found')
      if (record.status === 'returned') throw new HttpError(409, 'This book is already returned')

      const now = new Date()
      const due = new Date(record.due_date)
      const dueDay = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate())
      const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      const lateDays = Math.max(0, Math.round((today - dueDay) / DAY_MS))
      const fine = Number((lateDays * FINE_PER_DAY).toFixed(2))
      await client.query(
        `UPDATE borrow_records SET return_date=$1, fine_amount=$2, status='returned' WHERE id=$3`,
        [now.toISOString(), fine, id],
      )
      await client.query('UPDATE books SET copies_available = LEAST(copies_total, copies_available + 1) WHERE id=$1', [record.book_id])
      await client.query('COMMIT')
      return this.getBorrow(id)
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  }
}
