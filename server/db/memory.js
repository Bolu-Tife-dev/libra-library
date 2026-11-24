import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import { HttpError } from '../utils/http.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '..', 'data', 'store.json')

const LOAN_DAYS = 14
const FINE_PER_DAY = 1

const addDays = (date, days) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

const DAY_MS = 86_400_000

// Count calendar days late, not elapsed milliseconds, so returning just after
// midnight on the due date does not add an extra day.
const daysLate = (dueDate, now = new Date()) => {
  const due = new Date(dueDate)
  const end = new Date(now)
  const dueDay = Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate())
  const endDay = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate())
  return Math.max(0, Math.round((endDay - dueDay) / DAY_MS))
}

const seedBooks = () => [
  ['To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'Fiction', 3, 2, 1960, 'A timeless novel about justice, empathy, and growing up in the American South.'],
  ['1984', 'George Orwell', '9780452284234', 'Dystopian', 4, 0, 1949, 'A chilling vision of a surveillance state and the struggle for independent thought.'],
  ['The Pragmatic Programmer', 'David Thomas & Andrew Hunt', '9780201616224', 'Technology', 2, 2, 1999, 'Practical advice and habits for becoming a better, more effective developer.'],
  ['Clean Code', 'Robert C. Martin', '9780132350884', 'Technology', 2, 1, 2008, 'A handbook of agile software craftsmanship and readable, maintainable code.'],
  ['The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Fiction', 3, 3, 1925, 'A portrait of the American Dream and its illusions in the Roaring Twenties.'],
  ['Sapiens', 'Yuval Noah Harari', '9780062316097', 'History', 2, 1, 2011, 'A sweeping history of how Homo sapiens came to dominate the world.'],
  ['Introduction to Algorithms', 'Cormen, Leiserson, Rivest & Stein', '9780262033848', 'Technology', 1, 0, 2009, 'The comprehensive reference on algorithms and data structures.'],
  ['The Hobbit', 'J.R.R. Tolkien', '9780261103344', 'Fantasy', 5, 4, 1937, 'Bilbo Baggins joins a quest to reclaim the lonely mountain.'],
].map(([title, author, isbn, category, copiesTotal, copiesAvailable, publishedYear, description], i) => ({
  id: i + 1,
  title, author, isbn, category, copiesTotal, copiesAvailable, publishedYear, description,
  createdAt: new Date().toISOString(),
}))

const publicUser = ({ id, name, email, role, idCard, createdAt }) => ({ id, name, email, role, idCard: idCard || null, createdAt })

export class MemoryStore {
  async init() {
    try {
      this.data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'))
    } catch {
      this.data = null
    }

    if (!this.data || !Array.isArray(this.data.books)) {
      this.data = { books: seedBooks(), users: [], borrows: [], nextIds: { books: 9, users: 3, borrows: 1 } }
    }
    if (!this.data.users.length) {
      const passwordHash = await bcrypt.hash('1234', 10)
      this.data.users = [
        { id: 1, name: 'Alex Student', email: 'student@library.test', passwordHash, role: 'student', idCard: null, createdAt: new Date().toISOString() },
        { id: 2, name: 'Sam Admin', email: 'admin@library.test', passwordHash, role: 'admin', idCard: null, createdAt: new Date().toISOString() },
      ]
    }
    this.data.nextIds ||= { books: this.data.books.length + 1, users: this.data.users.length + 1, borrows: this.data.borrows.length + 1 }
    await this.save()
  }

  async save() {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(this.data, null, 2))
  }

  /* ------------------------------- books -------------------------------- */

  async listBooks({ search = '', category = '', availableOnly = false } = {}) {
    let rows = [...this.data.books]
    const q = String(search).trim().toLowerCase()
    if (q) {
      rows = rows.filter((b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.isbn || '').toLowerCase().includes(q))
    }
    if (category) rows = rows.filter((b) => b.category === category)
    if (availableOnly === true || availableOnly === 'true') rows = rows.filter((b) => b.copiesAvailable > 0)
    return rows
  }

  async getBook(id) {
    return this.data.books.find((b) => b.id === Number(id)) || null
  }

  async getCategories() {
    return [...new Set(this.data.books.map((b) => b.category))].sort()
  }

  async createBook(data) {
    const book = {
      id: this.data.nextIds.books++,
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      category: data.category,
      copiesTotal: data.copiesTotal,
      copiesAvailable: data.copiesTotal,
      publishedYear: data.publishedYear,
      description: data.description,
      createdAt: new Date().toISOString(),
    }
    this.data.books.unshift(book)
    await this.save()
    return book
  }

  async updateBook(id, data) {
    const book = await this.getBook(id)
    if (!book) throw new HttpError(404, 'Book not found')
    const borrowed = book.copiesTotal - book.copiesAvailable
    Object.assign(book, data, {
      copiesAvailable: Math.max(0, data.copiesTotal - borrowed),
    })
    await this.save()
    return book
  }

  async deleteBook(id) {
    const before = this.data.books.length
    this.data.books = this.data.books.filter((b) => b.id !== Number(id))
    if (this.data.books.length === before) throw new HttpError(404, 'Book not found')
    await this.save()
    return { id: Number(id) }
  }

  /* ------------------------------- users -------------------------------- */

  async findUserByEmail(email) {
    return this.data.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) || null
  }

  async findUserById(id) {
    return this.data.users.find((u) => u.id === Number(id)) || null
  }

  async createUser({ name, email, passwordHash, role, idCard }) {
    if (await this.findUserByEmail(email)) throw new HttpError(409, 'An account with this email already exists')
    const user = { id: this.data.nextIds.users++, name, email, passwordHash, role, idCard: idCard || null, createdAt: new Date().toISOString() }
    this.data.users.push(user)
    await this.save()
    return publicUser(user)
  }

  /* ------------------------------ borrows ------------------------------- */

  withBook = (record) => ({
    ...record,
    book: this.data.books.find((b) => b.id === record.bookId) || null,
  })

  async listBorrows({ memberId, status } = {}) {
    let rows = [...this.data.borrows]
    if (memberId) rows = rows.filter((r) => r.memberId === Number(memberId))
    if (status) rows = rows.filter((r) => r.status === status)
    return rows
      .map((r) => this.withBook(r))
      .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate))
  }

  async getBorrow(id) {
    return this.data.borrows.find((r) => r.id === Number(id)) || null
  }

  async createBorrow({ bookId, memberId }) {
    const book = await this.getBook(bookId)
    if (!book) throw new HttpError(404, 'Book not found')
    if (book.copiesAvailable <= 0) throw new HttpError(409, 'No copies available right now')

    book.copiesAvailable -= 1
    const record = {
      id: this.data.nextIds.borrows++,
      bookId: book.id,
      memberId: Number(memberId),
      borrowDate: new Date().toISOString(),
      dueDate: addDays(new Date(), LOAN_DAYS),
      returnDate: null,
      fineAmount: 0,
      status: 'borrowed',
    }
    this.data.borrows.unshift(record)
    await this.save()
    return this.withBook(record)
  }

  async returnBorrow(id) {
    const record = await this.getBorrow(id)
    if (!record) throw new HttpError(404, 'Borrow record not found')
    if (record.status === 'returned') throw new HttpError(409, 'This book is already returned')

    const now = new Date().toISOString()
    record.returnDate = now
    record.status = 'returned'
    record.fineAmount = Number((daysLate(record.dueDate, new Date(now)) * FINE_PER_DAY).toFixed(2))

    const book = await this.getBook(record.bookId)
    if (book) book.copiesAvailable = Math.min(book.copiesTotal, book.copiesAvailable + 1)
    await this.save()
    return { ...record, book: book || null }
  }
}

export { publicUser }
