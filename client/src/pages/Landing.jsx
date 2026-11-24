import { Link } from 'react-router-dom'
import Book3D from '../components/Book3D'
import TiltCard from '../components/TiltCard'
import Reveal from '../components/Reveal'

function Icon({ name, className = '' }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
    swap: <><path d="M4 8h13l-3-3" /><path d="M20 16H7l3 3" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 11a3 3 0 0 0 0-6M18 20c0-2.2-.8-4.2-2-5.7" /></>,
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

const features = [
  { icon: 'search', title: 'Search the catalog', text: 'Find books by title, author or ISBN, and filter by category or availability.' },
  { icon: 'swap', title: 'Borrow and return', text: 'Borrowing updates stock instantly and creates a loan with a 14-day due date.' },
  { icon: 'calendar', title: 'Track due dates', text: 'See what is due and what you owe. Late returns add a one dollar daily fine.' },
  { icon: 'users', title: 'Roles and permissions', text: 'Students manage their own loans. Staff manage books and review all activity.' },
]

const steps = [
  { n: '01', title: 'Create an account', text: 'Sign up as a student, or as staff with a verified ID card.' },
  { n: '02', title: 'Find a book', text: 'Search the catalog and check how many copies are available.' },
  { n: '03', title: 'Borrow and return', text: 'Borrow in one click, then return the book from My Loans.' },
]

const shelf = [
  { title: 'Fiction', author: 'Shelf A', color: '#4338ca', left: 'left-[2%]', depth: 'translateZ(40px)', float: 'animate-float' },
  { title: 'History', author: 'Shelf B', color: '#0f766e', left: 'left-[23%]', depth: 'translateZ(10px)', float: 'animate-float-delayed' },
  { title: 'Technology', author: 'Shelf C', color: '#9f1239', left: 'left-[44%]', depth: 'translateZ(60px)', float: 'animate-float-slower' },
  { title: 'Fantasy', author: 'Shelf D', color: '#b45309', left: 'left-[65%]', depth: 'translateZ(20px)', float: 'animate-float' },
  { title: 'Poetry', author: 'Shelf E', color: '#334155', left: 'left-[84%]', depth: 'translateZ(-20px)', float: 'animate-float-delayed' },
]

const eyebrow = 'text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400'

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="overflow-hidden bg-slate-900 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Library catalog</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              A simpler way to run your library.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
              Libra brings the catalog, borrowing and loan tracking together in one clear place — for readers and for staff.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary">Create an account</Link>
              <Link to="/#how-it-works" className="btn border border-white/25 text-white hover:bg-white/10">See how it works</Link>
            </div>
            <p className="mt-7 text-xs text-slate-400">14-day loans · Search and filter · Role-based access</p>
          </Reveal>

          {/* 3D stage */}
          <div className="perspective-scene relative hidden h-[400px] lg:block">
            <div className="grid-floor absolute inset-x-0 bottom-0 h-44 opacity-40" style={{ transform: 'rotateX(68deg) translateY(46px)' }} />
            <div className="sway-3d preserve-3d absolute inset-0">
              <Book3D title="The Art of Borrowing" author="Libra Press" color="#4338ca" className="left-16 top-0" style="translateZ(85px) rotateY(-22deg) rotateX(8deg)" floatClass="animate-float" />
              <Book3D title="Quiet Libraries" author="M. A. Brown" color="#0f766e" className="left-52 top-14" style="translateZ(25px) rotateY(-12deg) rotateZ(7deg)" floatClass="animate-float-delayed" />
              <Book3D title="Pages and Places" author="J. R. Miller" color="#9f1239" className="left-8 top-32" style="translateZ(-35px) rotateY(-28deg) rotateZ(-8deg)" floatClass="animate-float-slower" />
              <Book3D title="Library Notes" author="A. Reader" color="#334155" className="left-64 top-52" style="translateZ(-70px) rotateY(-18deg) rotateZ(4deg)" floatClass="animate-float-delayed" />
            </div>
            <div className="absolute right-2 top-8 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs text-white shadow-lg backdrop-blur-md" style={{ transform: 'translateZ(70px)' }}>Instant borrow</div>
            <div className="absolute bottom-8 left-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs text-white shadow-lg backdrop-blur-md" style={{ transform: 'translateZ(70px)' }}>Due dates</div>
          </div>
        </div>
      </section>

      {/* 3D shelf strip */}
      <section className="border-b border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs uppercase tracking-[0.16em] text-slate-400">One catalog, every category</p>
          <div className="perspective-scene relative mt-4 h-40">
            <div className="absolute inset-x-4 bottom-1 h-9 rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" style={{ transform: 'rotateX(62deg)' }} />
            <div className="sway-3d preserve-3d absolute inset-0">
              {shelf.map((b) => (
                <Book3D key={b.title} compact title={b.title} author={b.author} color={b.color} className={`${b.left} top-2`} style={`${b.depth} rotateY(-18deg) rotateZ(2deg)`} floatClass={b.float} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <p className={eyebrow}>Features</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">The essentials, done well.</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <TiltCard className="depth-panel p-6">
                  <span className="inline-block text-indigo-600 dark:text-indigo-400"><Icon name={f.icon} /></span>
                  <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{f.text}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <p className={eyebrow}>How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Three steps to your first book.</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <TiltCard className="depth-panel p-6">
                  <p className="text-sm font-medium tabular-nums text-indigo-600 dark:text-indigo-400">{s.n}</p>
                  <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{s.text}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <Link to="/register" className="btn-primary mt-10">Get started</Link>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <p className={eyebrow}>About</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Built around the borrowing workflow.</h2>
            <p className="mt-4 leading-relaxed text-slate-500 dark:text-slate-400">
              Libra keeps the catalog, loan records and admin tools in one place. Readers can find and borrow books quickly, while staff can maintain the collection without extra paperwork.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-3 gap-4 self-center">
              {[
                ['48', 'Books'],
                ['14', 'Day loans'],
                ['$1', 'Per day late'],
              ].map(([n, label]) => (
                <div key={label} className="depth-panel rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <p className="text-2xl font-semibold text-slate-900 dark:text-white">{n}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900 sm:py-24">
        <Reveal>
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Ready to get started?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500 dark:text-slate-400">
              Create an account to browse the catalog and borrow your first book.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn-primary">Sign up</Link>
              <Link to="/login" className="btn-secondary">Log in</Link>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <a href="mailto:hello@libra.app" className="hover:text-slate-900 dark:hover:text-white">hello@libra.app</a>
              <span>Mon–Fri, 8:00 AM – 5:00 PM</span>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
