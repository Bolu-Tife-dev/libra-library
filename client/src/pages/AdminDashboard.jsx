import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../components/Modal'
import TiltCard from '../components/TiltCard'
import { createBook, deleteBook, getBooks, getBorrows, updateBook } from '../api'

const EMPTY_FORM = { title: '', author: '', isbn: '', category: '', copiesTotal: 1, publishedYear: '', description: '' }

function BookForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
      <div><label className="label">Title</label><input className="input" required value={form.title} onChange={set('title')} /></div>
      <div><label className="label">Author</label><input className="input" required value={form.author} onChange={set('author')} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">ISBN</label><input className="input" value={form.isbn} onChange={set('isbn')} /></div>
        <div><label className="label">Category</label><input className="input" placeholder="e.g. Fiction" value={form.category} onChange={set('category')} /></div>
        <div><label className="label">Total copies</label><input className="input" type="number" min="1" required value={form.copiesTotal} onChange={set('copiesTotal')} /></div>
        <div><label className="label">Published year</label><input className="input" type="number" value={form.publishedYear} onChange={set('publishedYear')} /></div>
      </div>
      <div><label className="label">Description</label><textarea className="input" rows="3" value={form.description} onChange={set('description')} /></div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">Save book</button>
      </div>
    </form>
  )
}

export default function AdminDashboard() {
  const [books, setBooks] = useState([])
  const [borrows, setBorrows] = useState([])
  const [modal, setModal] = useState(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    const [b, r] = await Promise.all([getBooks(), getBorrows()])
    setBooks(b)
    setBorrows(r)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(form) {
    if (modal.mode === 'create') await createBook(form)
    else await updateBook(modal.book.id, form)
    setModal(null)
    await load()
  }

  async function handleDelete(book) {
    if (!window.confirm(`Delete "${book.title}"?`)) return
    await deleteBook(book.id)
    await load()
  }

  const th = 'px-5 py-3'
  const thead = 'bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400'

  return (
    <div>
      <Link to="/dashboard" className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">← Dashboard</Link>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Admin</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage books and review borrowing activity.</p>
        </div>
        <button onClick={() => setModal({ mode: 'create' })} className="btn-primary">Add book</button>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <TiltCard className="depth-panel p-5"><p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Books</p><p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{books.length}</p></TiltCard>
        <TiltCard className="depth-panel p-5"><p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Active loans</p><p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{borrows.filter((r) => r.status === 'borrowed').length}</p></TiltCard>
        <TiltCard className="depth-panel p-5"><p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Fines collected</p><p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">${borrows.reduce((s, r) => s + (r.fineAmount || 0), 0).toFixed(2)}</p></TiltCard>
      </div>

      <h2 className="mt-9 mb-3 text-sm font-semibold text-slate-900 dark:text-white">Books</h2>
      <div className="card overflow-x-auto">
        {loading ? <p className="p-8 text-center text-sm text-slate-400">Loading…</p> : (
          <table className="w-full text-left text-sm">
            <thead className={thead}>
              <tr><th className={th}>Title</th><th className={th}>Author</th><th className={th}>Category</th><th className={th}>Copies</th><th className="px-5 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {books.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3 text-slate-800 dark:text-slate-100">{b.title}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{b.author}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{b.category}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{b.copiesAvailable}/{b.copiesTotal}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setModal({ mode: 'edit', book: b })} className="mr-3 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">Edit</button>
                    <button onClick={() => handleDelete(b)} className="text-xs font-medium text-rose-600 hover:underline dark:text-rose-400">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <h2 className="mt-9 mb-3 text-sm font-semibold text-slate-900 dark:text-white">Borrow records</h2>
      <div className="card overflow-x-auto">
        {borrows.length === 0 ? <p className="p-8 text-center text-sm text-slate-400">No borrow records yet.</p> : (
          <table className="w-full text-left text-sm">
            <thead className={thead}>
              <tr><th className={th}>Book</th><th className={th}>Member</th><th className={th}>Borrowed</th><th className={th}>Due</th><th className={th}>Status</th><th className={th}>Fine</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {borrows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3 text-slate-800 dark:text-slate-100">{r.book?.title || 'Deleted book'}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">#{r.memberId}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{new Date(r.borrowDate).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{new Date(r.dueDate).toLocaleDateString()}</td>
                  <td className="px-5 py-3"><span className={`badge ${r.status === 'borrowed' ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>{r.status}</span></td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{r.fineAmount ? `$${r.fineAmount.toFixed(2)}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal.mode === 'create' ? 'Add book' : 'Edit book'} onClose={() => setModal(null)}>
          <BookForm initial={modal.mode === 'edit' ? modal.book : null} onSubmit={handleSubmit} onCancel={() => setModal(null)} />
        </Modal>
      )}
    </div>
  )
}
