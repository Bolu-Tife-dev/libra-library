import { Link } from 'react-router-dom'
import Book3D from './Book3D'
import TiltCard from './TiltCard'

const categoryColors = {
  Fiction: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
  Dystopian: 'bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300',
  Technology: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
  History: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  Fantasy: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
}

const bookColors = {
  Fiction: '#4338ca',
  Dystopian: '#334155',
  Technology: '#0f766e',
  History: '#b45309',
  Fantasy: '#047857',
}

export default function BookCard({ book }) {
  const available = book.copiesAvailable > 0

  return (
    <TiltCard className="p-5">
      <div className="perspective-scene mb-5 flex h-28 items-center justify-center">
        <Book3D
          position="relative"
          compact
          title={book.title.split(' ').slice(0, 2).join(' ')}
          author={book.author}
          color={bookColors[book.category] || '#475569'}
          style="translateZ(20px) rotateY(-22deg) rotateZ(3deg) scale(0.78)"
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className={`badge ${categoryColors[book.category] || 'bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300'}`}>
          {book.category}
        </span>
        <span className={`badge ${available ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'}`}>
          {available ? 'Available' : 'On loan'}
        </span>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{book.title}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
      {book.description && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{book.description}</p>}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="text-xs text-slate-400 dark:text-slate-500">{book.copiesAvailable}/{book.copiesTotal} copies</span>
        <Link to={`/books/${book.id}`} className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">View details</Link>
      </div>
    </TiltCard>
  )
}
