import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BookCard from '../components/BookCard'
import Reveal from '../components/Reveal'
import { getBooks, getCategories } from '../api'

export default function Catalog() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    getBooks({ search, category, availableOnly }).then((data) => {
      if (active) {
        setBooks(data)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [search, category, availableOnly])

  return (
    <div>
      <Link to="/dashboard" className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">← Dashboard</Link>

      <div className="mt-5">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Catalog</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Find a book and check what is on the shelf.</p>
      </div>

      <div className="mt-7">
        <input
          className="input"
          placeholder="Search by title, author or ISBN"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
        <select className="input w-44" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />
          Available only
        </label>
        <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">{books.length} result{books.length === 1 ? '' : 's'}</span>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="py-16 text-center text-sm text-slate-400">Loading books…</p>
        ) : books.length === 0 ? (
          <div className="card py-16 text-center">
            <p className="text-sm font-medium text-slate-900 dark:text-white">No books found</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book, i) => (
              <Reveal key={book.id} delay={(i % 6) * 50}>
                <BookCard book={book} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
