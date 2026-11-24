import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'

const publicLinks = [
  { to: '/#features', label: 'Features' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#about', label: 'About' },
  { to: '/#contact', label: 'Contact' },
]

const navClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm transition-colors ${
    isActive
      ? 'bg-slate-100 font-medium text-slate-900 shadow-[0_2px_0_#e2e8f0] dark:bg-slate-800 dark:text-white dark:shadow-[0_2px_0_#020617]'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
  }`

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
    >
      {theme === 'dark' ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  const links = user
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/catalog', label: 'Catalog' },
        { to: '/my-loans', label: 'My Loans' },
        ...(user.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
      ]
    : publicLinks

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-[0_3px_0_#312e81] transition-transform group-hover:-translate-y-0.5">L</span>
          <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">Libra</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>{link.label}</NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <span className="text-sm text-slate-700 dark:text-slate-200">{user.name}</span>
              <span className="text-xs capitalize text-slate-400 dark:text-slate-500">{user.role}</span>
              <button onClick={handleLogout} className="btn-secondary !py-1.5 !text-xs">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !py-1.5 !text-xs">Log in</Link>
              <Link to="/register" className="btn-primary !py-1.5 !text-xs">Sign up</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 border-t border-slate-200 pt-3 dark:border-slate-800">
              {user ? (
                <button onClick={handleLogout} className="btn-secondary w-full !text-xs">Log out</button>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="btn-secondary flex-1 !text-xs" onClick={() => setOpen(false)}>Log in</Link>
                  <Link to="/register" className="btn-primary flex-1 !text-xs" onClick={() => setOpen(false)}>Sign up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
