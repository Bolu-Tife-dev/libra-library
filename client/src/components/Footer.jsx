import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'

const title = 'mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'
const link = 'block py-1 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'

export default function Footer() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link to={user ? '/dashboard' : '/'} className="group flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-[0_3px_0_#312e81] transition-transform group-hover:-translate-y-0.5">L</span>
              <span className="text-base font-semibold text-slate-900 dark:text-white">Libra</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              A library catalog for students and staff. Browse books, borrow them, and keep track of loans.
            </p>
          </div>

          <div className="md:col-span-2">
            <p className={title}>Platform</p>
            <Link to="/#features" className={link}>Features</Link>
            <Link to="/#how-it-works" className={link}>How it works</Link>
            <Link to="/#about" className={link}>About</Link>
            <Link to="/#contact" className={link}>Contact</Link>
          </div>

          <div className="md:col-span-3">
            <p className={title}>Library</p>
            <Link to={user ? '/catalog' : '/register'} className={link}>Browse catalog</Link>
            <Link to={user ? '/dashboard' : '/register'} className={link}>Dashboard</Link>
            <Link to={user ? '/my-loans' : '/register'} className={link}>My loans and fines</Link>
            {user?.role === 'admin' && <Link to="/admin" className={link}>Admin panel</Link>}
            <a href="mailto:hello@libra.app" className={link}>Email us</a>
          </div>

          <div className="md:col-span-3">
            <p className={title}>Legal</p>
            <Link to="/privacy" className={link}>Privacy policy</Link>
            <Link to="/terms" className={link}>Terms and conditions</Link>
            <Link to="/cookies" className={link}>Cookie policy</Link>
            <Link to="/accessibility" className={link}>Accessibility</Link>
            <Link to="/disclaimer" className={link}>Disclaimer</Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Libra Library. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-900 dark:hover:text-white">Terms</Link>
            <button
              onClick={toggleTheme}
              className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
