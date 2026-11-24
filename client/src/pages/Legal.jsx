import { Link } from 'react-router-dom'
import TiltCard from '../components/TiltCard'

const docs = {
  privacy: {
    title: 'Privacy Policy',
    updated: '24 November 2026',
    intro: 'This policy explains what information Libra collects, how it is used, and the choices available to you. We keep it simple and transparent.',
    sections: [
      { heading: 'Information we collect', paragraphs: ['When you create an account, we store your name, email address, account role and a securely hashed password. If you register as staff, we also store the details of the ID card you provide for verification.', 'While you use Libra, we record your borrowing activity — books borrowed, due dates, returns and any late fines — so that your loan history stays accurate.'] },
      { heading: 'How we use your information', paragraphs: ['Your information is used only to operate the library: to authenticate you, manage loans, calculate fines, and allow administrators to maintain the catalog.', 'We do not sell, rent or share your personal information with third parties for marketing purposes.'] },
      { heading: 'Data storage and security', paragraphs: ['Account and loan data is stored in our database with access limited to authorised library staff. Passwords are never stored in readable form.', 'In this demo build, data is kept locally in your browser. Production deployments replace this with a secured database and server-side validation.'] },
      { heading: 'Your choices', paragraphs: ['You may update your account details at any time by contacting library support. You may also request a copy of your loan history or ask for your account to be removed.'] },
      { heading: 'Contact us', paragraphs: ['Questions about this policy can be sent to privacy@libra.app. We aim to respond within five working days.'] },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    updated: '24 November 2026',
    intro: 'These terms govern your use of Libra. By creating an account or borrowing a book, you agree to the guidelines below.',
    sections: [
      { heading: 'Eligibility', paragraphs: ['Student accounts are available to enrolled members of the school community. Staff or administrator accounts require verification with a valid ID card and are granted only to authorised personnel.'] },
      { heading: 'Borrowing rules', paragraphs: ['Each loan lasts fourteen days from the date of borrowing. You are responsible for returning books on or before the due date shown in My Loans.', 'A late fine of one dollar per day is applied to overdue returns. Fines are calculated automatically and displayed in your account.'] },
      { heading: 'Account responsibilities', paragraphs: ['You are responsible for keeping your login credentials confidential and for all activity carried out under your account. Notify library staff immediately if you suspect unauthorised access.'] },
      { heading: 'Acceptable use', paragraphs: ['Do not attempt to gain unauthorised access to admin features, interfere with the catalog, or misrepresent your identity during registration. Accounts found in breach may be suspended.'] },
      { heading: 'Changes to these terms', paragraphs: ['We may update these terms as the service evolves. Material changes will be communicated through the library before taking effect.'] },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    updated: '24 November 2026',
    intro: 'Libra uses a minimal amount of browser storage to keep the experience working smoothly. This page explains what is stored and why.',
    sections: [
      { heading: 'What we store', paragraphs: ['We use local browser storage to remember your theme preference, your signed-in session, the catalog data and your borrowing records. This allows the app to work without repeated logins on the same device.'] },
      { heading: 'What we do not use', paragraphs: ['Libra does not use advertising cookies, tracking pixels or third-party analytics. We do not build advertising profiles or follow you across other websites.'] },
      { heading: 'Managing storage', paragraphs: ['You can clear all stored data at any time through your browser settings or by clearing site data for Libra. Doing so will sign you out and reset local demo data.'] },
      { heading: 'Updates', paragraphs: ['If the type of data we store changes, this policy will be updated and the new version will be published here.'] },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    updated: '24 November 2026',
    intro: 'We want Libra to be usable by every member of the school community, regardless of device, ability or environment.',
    sections: [
      { heading: 'Our commitment', paragraphs: ['We aim to follow recognised accessibility guidelines, including sufficient colour contrast, readable typography, keyboard-friendly controls and clear labels for interactive elements.'] },
      { heading: 'Theme and readability', paragraphs: ['Both light and dark themes are available from the navigation bar and footer. The interface respects your system colour preference on first visit and remembers your choice afterwards.'] },
      { heading: 'Known limitations', paragraphs: ['Some animated decorative elements in the landing page may be distracting. These animations are purely visual and never block access to content or controls.'] },
      { heading: 'Feedback', paragraphs: ['If you encounter an accessibility barrier, please email accessibility@libra.app with the page and a short description so we can improve it.'] },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    updated: '24 November 2026',
    intro: 'Please read this notice regarding the scope and limitations of the Libra service.',
    sections: [
      { heading: 'Nature of the service', paragraphs: ['Libra is a demonstration library application created to showcase a complete frontend, backend and database workflow. It is intended for educational use.', 'In the current build, authentication, ID verification and fine calculation are simulated in the browser. A production deployment moves these checks to a secured server.'] },
      { heading: 'Availability', paragraphs: ['The service is provided as-is. While we aim for uninterrupted access, temporary downtime may occur during development or maintenance.'] },
      { heading: 'Liability', paragraphs: ['Libra is not liable for indirect losses arising from the use of the service, including missed due dates or inaccurate records caused by factors outside our control.'] },
      { heading: 'Contact', paragraphs: ['For questions about this notice, write to legal@libra.app.'] },
    ],
  },
}

const others = [
  { to: '/privacy', label: 'Privacy policy' },
  { to: '/terms', label: 'Terms & conditions' },
  { to: '/cookies', label: 'Cookie policy' },
  { to: '/accessibility', label: 'Accessibility' },
  { to: '/disclaimer', label: 'Disclaimer' },
]

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export default function Legal({ doc }) {
  const data = docs[doc]

  return (
    <div className="py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* header */}
        <TiltCard className="p-8 sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">Legal</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">{data.title}</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Last updated: {data.updated}</p>
          <p className="mt-5 max-w-2xl leading-relaxed text-slate-600 dark:text-slate-300">{data.intro}</p>
        </TiltCard>

        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
          {/* table of contents */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">On this page</p>
            <nav className="space-y-1 border-l border-slate-200 dark:border-slate-800">
              {data.sections.map((s) => (
                <a
                  key={s.heading}
                  href={`#${slug(s.heading)}`}
                  className="block border-l-2 border-transparent py-1.5 pl-3 text-sm text-slate-500 transition-colors hover:border-indigo-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                >
                  {s.heading}
                </a>
              ))}
            </nav>
            <div className="mt-8 border-t border-slate-200 pt-5 dark:border-slate-800">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Other documents</p>
              <div className="space-y-1">
                {others.filter((o) => o.to !== `/${doc}`).map((o) => (
                  <Link key={o.to} to={o.to} className="block text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">{o.label}</Link>
                ))}
              </div>
            </div>
          </aside>

          {/* content */}
          <article className="space-y-10">
            {data.sections.map((s, i) => (
              <section key={s.heading} id={slug(s.heading)} className="scroll-mt-24">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium tabular-nums text-indigo-600 dark:text-indigo-400">{String(i + 1).padStart(2, '0')}</span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{s.heading}</h2>
                </div>
                <div className="mt-4 space-y-3 pl-10">
                  {s.paragraphs.map((p, j) => (
                    <p key={j} className="text-sm leading-7 text-slate-600 dark:text-slate-300">{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>

        {/* contact */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-7 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Still have a question?</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Our team is happy to clarify anything in this document.</p>
          </div>
          <a href="mailto:legal@libra.app" className="btn-primary">Contact legal team →</a>
        </div>
      </div>
    </div>
  )
}
