import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Book3D from '../components/Book3D'
import TiltCard from '../components/TiltCard'
import Reveal from '../components/Reveal'

export default function Auth({ mode }) {
  const isRegister = mode === 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', idCard: null })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  function chooseRole(role) {
    setForm({ ...form, role, idCard: null })
    setError('')
  }

  function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setForm({ ...form, idCard: { name: file.name, size: file.size, type: file.type } })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (isRegister) await register(form)
      else await login({ email: form.email, password: form.password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-center">
      <div>
      <div className="mb-7">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {isRegister ? 'Create an account' : 'Log in'}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {isRegister ? 'Choose a role to continue.' : 'Sign in to your library account.'}
        </p>
      </div>

      <TiltCard className="depth-panel p-6">
        <div className="mb-6 flex border-b border-slate-200 dark:border-slate-800">
          <Link
            to="/login"
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${!isRegister ? 'border-indigo-600 text-slate-900 dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
          >
            Log in
          </Link>
          <Link
            to="/register"
            className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors ${isRegister ? 'border-indigo-600 text-slate-900 dark:text-white' : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
          >
            Sign up
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="label">Account type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { role: 'student', title: 'Student', sub: 'Borrow and track books' },
                  { role: 'admin', title: 'Staff', sub: 'Manage the library' },
                ].map((option) => (
                  <button
                    key={option.role}
                    type="button"
                    onClick={() => chooseRole(option.role)}
                    className={`rounded-lg border p-3 text-left transition-colors ${
                      form.role === option.role
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10'
                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{option.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{option.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isRegister && (
            <div><label className="label">Full name</label><input className="input" required value={form.name} onChange={set('name')} placeholder="Your full name" /></div>
          )}

          <div><label className="label">Email address</label><input className="input" type="email" required value={form.email} onChange={set('email')} placeholder="you@school.edu" /></div>
          <div><label className="label">Password</label><input className="input" type="password" required minLength="4" value={form.password} onChange={set('password')} placeholder="At least 4 characters" /></div>

          {isRegister && form.role === 'admin' && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Staff ID card required</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Student accounts cannot become staff accounts. Upload your ID card to verify your role.
              </p>
              <label className="mt-3 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-3 py-3 text-sm text-slate-600 transition-colors hover:border-indigo-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
                {form.idCard ? form.idCard.name : 'Choose file (image or PDF)'}
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={onFile} />
              </label>
            </div>
          )}

          {isRegister && form.role === 'student' && (
            <p className="text-xs text-slate-500 dark:text-slate-400">Student accounts can borrow books and view their loans. No ID card needed.</p>
          )}

          {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Please wait…' : isRegister ? `Create ${form.role === 'admin' ? 'staff' : 'student'} account` : 'Log in'}
          </button>
        </form>
      </TiltCard>

      {!isRegister && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <p className="font-medium text-slate-700 dark:text-slate-300">Demo accounts · password 1234</p>
          <div className="mt-3 grid gap-2">
            <button type="button" onClick={() => setForm({ ...form, email: 'student@library.test', password: '1234' })} className="flex items-center justify-between rounded border border-slate-200 px-3 py-2 text-left hover:border-slate-300 dark:border-slate-700">
              <span className="font-mono">student@library.test</span>
              <span className="text-indigo-600 dark:text-indigo-400">Use</span>
            </button>
            <button type="button" onClick={() => setForm({ ...form, email: 'admin@library.test', password: '1234' })} className="flex items-center justify-between rounded border border-slate-200 px-3 py-2 text-left hover:border-slate-300 dark:border-slate-700">
              <span className="font-mono">admin@library.test</span>
              <span className="text-indigo-600 dark:text-indigo-400">Use</span>
            </button>
          </div>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        {isRegister ? 'Already have an account? ' : 'New to Libra? '}
        <Link to={isRegister ? '/login' : '/register'} className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          {isRegister ? 'Log in' : 'Create an account'}
        </Link>
      </p>
      </div>

      {/* 3D bookshelf beside the form */}
      <div className="perspective-scene relative hidden h-[420px] lg:block">
        <div className="grid-floor absolute inset-x-0 bottom-0 h-40 opacity-50" style={{ transform: 'rotateX(68deg) translateY(30px)' }} />
        <div className="sway-3d preserve-3d absolute inset-0">
          <Book3D title="Library Handbook" author="Staff edition" color="#4338ca" className="left-12 top-4" style="translateZ(70px) rotateY(-22deg) rotateX(6deg)" floatClass="animate-float" compact />
          <Book3D title="Reading Room" author="Vol. 01" color="#0f766e" className="left-40 top-24" style="translateZ(15px) rotateY(-12deg) rotateZ(7deg)" floatClass="animate-float-delayed" compact />
          <Book3D title="Loan Records" author="Vol. 02" color="#9f1239" className="left-6 top-48" style="translateZ(-40px) rotateY(-26deg) rotateZ(-8deg)" floatClass="animate-float-slower" compact />
        </div>
        <p className="absolute bottom-0 left-0 text-xs uppercase tracking-[0.16em] text-slate-400">A library in your hands</p>
      </div>
      </div>
    </div>
  )
}
