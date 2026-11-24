import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBorrows, returnBook } from '../api'
import { useAuth } from '../AuthContext'
import TiltCard from '../components/TiltCard'

const fmt = (d) => (d ? new Date(d).toLocaleDateString() : '—')

export default function MyLoans() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    const data = await getBorrows({ memberId: user.id })
    setRows(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [user.id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleReturn(id) {
    setError('')
    try {
      await returnBook(id)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const active = rows.filter((r) => r.status === 'borrowed')
  const totalFines = rows.reduce((sum, r) => sum + (r.fineAmount || 0), 0)

  return (
    <div>
      <Link to="/dashboard" className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">← Dashboard</Link>

      <div className="mt-5">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">My Loans</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your borrowed books, due dates and fines.</p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <TiltCard className="depth-panel p-5"><p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Currently borrowed</p><p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{active.length}</p></TiltCard>
        <TiltCard className="depth-panel p-5"><p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Total loans</p><p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{rows.length}</p></TiltCard>
        <TiltCard className="depth-panel p-5"><p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Outstanding fines</p><p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">${totalFines.toFixed(2)}</p></TiltCard>
      </div>

      {error && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}

      <div className="card mt-6 overflow-x-auto">
        {loading ? (
          <p className="p-8 text-center text-sm text-slate-400">Loading loans…</p>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">You have no loans yet.</p>
            <Link to="/catalog" className="mt-3 inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400">Browse the catalog</Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">Book</th>
                <th className="px-5 py-3">Borrowed</th>
                <th className="px-5 py-3">Due</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Fine</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3 text-slate-800 dark:text-slate-100">
                    {r.book ? <Link to={`/books/${r.book.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">{r.book.title}</Link> : 'Deleted book'}
                  </td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{fmt(r.borrowDate)}</td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{fmt(r.dueDate)}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${r.status === 'borrowed' ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{r.fineAmount ? `$${r.fineAmount.toFixed(2)}` : '—'}</td>
                  <td className="px-5 py-3 text-right">
                    {r.status === 'borrowed' && <button onClick={() => handleReturn(r.id)} className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">Return</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
