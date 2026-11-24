import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBooks, getBorrows } from '../api'
import { useAuth } from '../AuthContext'
import Book3D from '../components/Book3D'
import TiltCard from '../components/TiltCard'
import Reveal from '../components/Reveal'

const fmt = (d) => (d ? new Date(d).toLocaleDateString() : '—')
const shelfColors = ['#4338ca', '#0f766e', '#9f1239', '#b45309', '#334155']
const shelfPositions = ['left-[2%]', 'left-[22%]', 'left-[42%]', 'left-[62%]', 'left-[82%]']

export default function Dashboard() {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [loans, setLoans] = useState([])
  const [allLoans, setAllLoans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([getBooks(), getBorrows({ memberId: user.id }), getBorrows()]).then(([b, mine, all]) => {
      if (active) {
        setBooks(b)
        setLoans(mine)
        setAllLoans(all)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [user.id])

  const activeLoans = loans.filter((r) => r.status === 'borrowed')
  const fines = loans.reduce((s, r) => s + (r.fineAmount || 0), 0)
  const isAdmin = user.role === 'admin'
  const available = books.filter((b) => b.copiesAvailable > 0)

  const stats = [
    { label: 'Books in catalog', value: books.length, sub: `${available.length} available` },
    { label: isAdmin ? 'Active loans' : 'My active loans', value: isAdmin ? allLoans.filter((r) => r.status === 'borrowed').length : activeLoans.length, sub: 'currently borrowed' },
    { label: 'Outstanding fines', value: `$${fines.toFixed(2)}`, sub: 'on your account' },
    { label: 'Total loans', value: loans.length, sub: 'all time' },
  ]

  const actions = [
    { to: '/catalog', title: 'Browse catalog', text: 'Search for a book' },
    { to: '/my-loans', title: 'My loans', text: 'Due dates and returns' },
    ...(isAdmin ? [{ to: '/admin', title: 'Admin panel', text: 'Manage books and records' }] : []),
  ]

  return (
    <div className="py-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome back, {user.name}. Here is your library at a glance.
          </p>
        </div>
        <div className="perspective-scene relative hidden h-24 w-44 md:block" aria-hidden="true">
          <Book3D title="Library" author="Today" color="#4338ca" className="left-10 top-0" style="translateZ(30px) rotateY(-24deg) rotateX(6deg)" floatClass="animate-float" compact />
          <Book3D title="Notes" author="Vol. 01" color="#334155" className="left-0 top-10" style="translateZ(-30px) rotateY(-18deg) rotateZ(-6deg)" floatClass="animate-float-delayed" compact />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <TiltCard key={s.label} className="depth-panel p-5">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{s.value}</p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{s.sub}</p>
          </TiltCard>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Quick actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((a) => (
            <TiltCard key={a.to} className="depth-panel p-5">
              <Link to={a.to} className="flex h-full items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{a.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{a.text}</p>
                </div>
                <span className="text-slate-400 dark:text-slate-500">→</span>
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">On the shelf</h2>
        <div className="perspective-scene card relative mt-4 h-40 overflow-hidden">
          <div className="grid-floor absolute inset-x-0 bottom-0 h-20 opacity-40" style={{ transform: 'rotateX(68deg) translateY(26px)' }} />
          <div className="sway-3d preserve-3d absolute inset-0">
            {(available.length ? available : books).slice(0, 5).map((b, i) => (
              <Book3D
                key={b.id}
                compact
                title={b.title.split(' ').slice(0, 2).join(' ')}
                author={b.author}
                color={shelfColors[i % shelfColors.length]}
                className={`${shelfPositions[i]} top-3`}
                style={`translateZ(${20 - i * 12}px) rotateY(-20deg) rotateZ(${i % 2 ? 3 : -3}deg)`}
                floatClass={i % 2 ? 'animate-float' : 'animate-float-delayed'}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Active loans</h2>
            <Link to="/my-loans" className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">View all</Link>
          </div>
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-400">Loading…</p>
          ) : activeLoans.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">No active loans.</p>
              <Link to="/catalog" className="mt-3 inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400">Browse the catalog</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {activeLoans.slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-800 dark:text-slate-100">{r.book?.title || 'Deleted book'}</p>
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Due {fmt(r.dueDate)}</p>
                  </div>
                  <span className="badge bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">On loan</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Available now</h2>
            <Link to="/catalog" className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">See all</Link>
          </div>
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-400">Loading…</p>
          ) : available.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">Everything is on loan right now.</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {available.slice(0, 4).map((b) => (
                <Link key={b.id} to={`/books/${b.id}`} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-800 dark:text-slate-100">{b.title}</p>
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{b.author}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">{b.copiesAvailable} left</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {isAdmin && (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">Staff tools</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Add and edit books, or review all borrow records.</p>
          </div>
          <Link to="/admin" className="btn-secondary !text-xs">Open admin panel</Link>
        </div>
      )}
    </div>
  )
}
