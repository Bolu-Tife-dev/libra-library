import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { borrowBook, getBook } from '../api'
import { useAuth } from '../AuthContext'
import Book3D from '../components/Book3D'
import Reveal from '../components/Reveal'

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    getBook(id).then((data) => {
      if (active) {
        setBook(data)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [id])

  async function handleBorrow() {
    if (!user) {
      navigate('/login')
      return
    }
    setBusy(true)
    setMessage(null)
    try {
      await borrowBook(book.id, user.id)
      setBook(await getBook(id))
      setMessage({ type: 'success', text: 'Borrowed. Due in 14 days — see My Loans.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <p className="py-16 text-center text-sm text-slate-400">Loading…</p>
  if (!book) return <p className="py-16 text-center text-sm text-slate-500 dark:text-slate-400">Book not found. <Link to="/catalog" className="text-indigo-600 hover:underline dark:text-indigo-400">Back to catalog</Link></p>

  const available = book.copiesAvailable > 0

  return (
    <div>
      <Link to="/catalog" className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">← Back to catalog</Link>

      <div className="card mt-5 grid gap-8 p-6 sm:p-8 md:grid-cols-[160px_1fr]">
        <div className="perspective-scene flex h-48 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
          <Book3D
            compact
            title={book.title.split(' ').slice(0, 2).join(' ')}
            author={book.author}
            color="#4338ca"
            style="translateZ(20px) rotateY(-20deg) rotateZ(3deg) scale(1.15)"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{book.category}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{book.title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">by {book.author}</p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-slate-100 py-5 text-sm sm:grid-cols-3 dark:border-slate-800">
            <div><dt className="text-slate-400 dark:text-slate-500">Published</dt><dd className="mt-0.5 text-slate-800 dark:text-slate-100">{book.publishedYear || '—'}</dd></div>
            <div><dt className="text-slate-400 dark:text-slate-500">ISBN</dt><dd className="mt-0.5 text-slate-800 dark:text-slate-100">{book.isbn || '—'}</dd></div>
            <div><dt className="text-slate-400 dark:text-slate-500">Copies</dt><dd className="mt-0.5 text-slate-800 dark:text-slate-100">{book.copiesTotal}</dd></div>
          </dl>

          <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{book.description || 'No description available.'}</p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button onClick={handleBorrow} disabled={!available || busy} className="btn-primary">
              {busy ? 'Borrowing…' : available ? 'Borrow book' : 'Unavailable'}
            </button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {available ? `${book.copiesAvailable} of ${book.copiesTotal} available` : 'All copies are on loan'}
            </span>
          </div>

          {message && (
            <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
              {message.text}
            </p>
          )}
          {!user && <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Log in to borrow this book.</p>}
        </div>
      </div>
    </div>
  )
}
