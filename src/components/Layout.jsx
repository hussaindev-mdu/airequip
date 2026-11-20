import { Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, Moon, Sun, X, Phone, MessageCircle } from 'lucide-react'
import { BRAND, nav, districts, slugify, contact } from '../data'
import { useQuote } from '../QuoteContext'
import { asset } from '../lib/asset'
import { loadCollection } from '../pages/lazy'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label={`${BRAND} — home`}>
      <span className="grid h-10 shrink-0 place-items-center rounded-xl bg-white px-1.5 shadow-sm ring-1 ring-black/5 sm:h-11">
        <img src={asset('/brand/aes-logo-full.png')} alt="AES logo" width="468" height="302" className="h-8 w-auto sm:h-9" />
      </span>
      <span className="whitespace-nowrap font-display text-[13px] font-bold leading-tight text-fg sm:text-sm">
        Air Equipments<br /><span className="font-medium text-fg-4">& Solutions</span>
      </span>
    </Link>
  )
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const toggle = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch (e) { /* storage unavailable */ }
  }
  return (
    <button type="button" role="switch" aria-checked={dark} onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} title={dark ? 'Light theme' : 'Dark theme'}
      className="glass relative inline-flex h-10 w-[4.5rem] shrink-0 items-center rounded-full p-1 transition">
      <Sun size={15} className={`absolute left-3 transition-opacity ${dark ? 'text-fg-4 opacity-70' : 'opacity-0'}`} />
      <Moon size={15} className={`absolute right-3 transition-opacity ${dark ? 'opacity-0' : 'text-fg-4 opacity-70'}`} />
      <span className={`z-10 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-b from-[#ff9a4d] to-[#ff6a00] text-white shadow-md shadow-orange-500/40 transition-transform duration-300 ${dark ? 'translate-x-8' : 'translate-x-0'}`}>
        {dark ? <Moon size={15} /> : <Sun size={15} />}
      </span>
    </button>
  )
}

// start downloading the 3D page as soon as someone hovers, focuses or touches its link
const prefetch = (to) => (to === '/collection' ? { onMouseEnter: loadCollection, onFocus: loadCollection, onTouchStart: loadCollection } : {})

const linkCls = ({ isActive }) =>
  `rounded-full px-3.5 py-2 text-sm transition ${isActive ? 'bg-fg/10 font-semibold text-fg' : 'text-fg-3 hover:bg-fg/5 hover:text-fg'}`

export function Header() {
  const { openQuote } = useQuote()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div className={`glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all sm:px-6 ${scrolled ? 'bg-surface/70' : ''}`}>
        <Logo />
        <nav className="hidden items-center gap-0.5 lg:flex">
          {nav.map((n) => <NavLink key={n.to} to={n.to} className={linkCls} {...prefetch(n.to)}>{n.label}</NavLink>)}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={openQuote} className="btn btn-primary hidden !py-2.5 sm:inline-flex">Request a quote <ArrowUpRight size={16} /></button>
          <button aria-label="Menu" onClick={() => setOpen(!open)} className="glass grid h-10 w-10 place-items-center rounded-full lg:hidden">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass mx-auto mt-2 max-w-7xl rounded-3xl bg-surface/85 p-3 lg:hidden">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} {...prefetch(n.to)} className={({ isActive }) => `block rounded-2xl px-4 py-3 ${isActive ? 'bg-fg/10 font-semibold text-fg' : 'text-fg-2 hover:bg-fg/5'}`}>{n.label}</NavLink>
            ))}
            <button onClick={openQuote} className="btn btn-primary mt-2 w-full">Request a quote</button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="relative mx-auto max-w-7xl px-5 pb-10 sm:px-8">
      <div className="glass rounded-[2rem] p-8 sm:p-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-fg-3">Compressed-air sales, installation and service across South Tamil Nadu.</p>
          </div>
          <div>
            <h4 className="eyebrow">Explore</h4>
            <ul className="space-y-2 text-sm text-fg-2">
              <li><Link className="hover:text-fg" to="/">Home</Link></li>
              {nav.map((n) => <li key={n.to}><Link className="hover:text-fg" to={n.to}>{n.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="eyebrow">Service areas</h4>
            <ul className="space-y-2 text-sm text-fg-2">
              {districts.map((d) => <li key={d}><Link className="hover:text-fg" to={`/locations/${slugify(d)}`}>Air compressors in {d}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4 className="eyebrow">Contact</h4>
            <ul className="space-y-3 text-sm text-fg-2">
              <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0 text-flame" /><span>{contact.salesService.label}:<br /><a className="hover:text-fg" href={`tel:${contact.salesService.tel}`}>{contact.salesService.display}</a></span></li>
              <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0 text-flame" /><span>{contact.pipeline.label}:<br /><a className="hover:text-fg" href={`tel:${contact.pipeline.tel}`}>{contact.pipeline.display}</a></span></li>
              <li className="flex gap-2"><MessageCircle size={16} className="mt-0.5 shrink-0 text-flame" /><span>{contact.whatsapp.label}:<br /><a className="hover:text-fg" href={contact.whatsapp.href} target="_blank" rel="noreferrer">{contact.whatsapp.display}</a></span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-fg/10 pt-6 text-xs text-fg-4 sm:flex-row">
          <span>© {new Date().getFullYear()} {BRAND}</span>
          <span>Authorised VAYU dealer & service partner</span>
        </div>
      </div>
    </footer>
  )
}

export const CATALOGUE_URL = asset('/downloads/VAYU-Catalogue.pdf')

export function QuoteModal({ open, onClose, catalogue }) {
  const [sent, setSent] = useState(false)
  useEffect(() => { if (open) setSent(false) }, [open])
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
            className="glass w-full max-w-md rounded-[2rem] bg-surface/85 p-7">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-fg">{catalogue ? 'Download the catalogue' : 'Request a quote'}</h3>
                <p className="mt-1 text-sm text-fg-3">{catalogue ? 'Enter your details to get the compressor and air-system catalogue.' : 'Tell us your application, pressure and working hours.'}</p>
              </div>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-1 text-fg-4 hover:bg-fg/5"><X size={20} /></button>
            </div>
            {sent ? (
              <div className="mt-8 rounded-2xl bg-fg/5 p-5 text-sm text-fg-2">
                {catalogue ? (
                  <>Thank you — your download should start now. If it doesn’t, <a className="font-semibold text-flame underline" href={CATALOGUE_URL} download="VAYU-Catalogue.pdf">click here to download the catalogue</a>.</>
                ) : "Thank you — we'll get back to you shortly."}
              </div>
            ) : (
              <form className="mt-6 space-y-3" onSubmit={(e) => {
                e.preventDefault()
                setSent(true) /* TODO: send the lead to a backend / WhatsApp */
                if (catalogue) {
                  const a = document.createElement('a')
                  a.href = CATALOGUE_URL
                  a.download = 'VAYU-Catalogue.pdf'
                  document.body.appendChild(a)
                  a.click()
                  a.remove()
                }
              }}>
                <input required className="input" placeholder="Name" />
                <input required type="tel" className="input" placeholder="Phone" />
                <input className="input" placeholder="Company" />
                {!catalogue && <textarea rows={3} className="input" placeholder="Application, pressure, working hours…" />}
                <button className="btn btn-primary w-full">{catalogue ? 'Submit & download' : 'Send request'}</button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Floating WhatsApp button, shown on every page. */
function WhatsAppFloat() {
  const href = `${contact.whatsapp.href}?text=${encodeURIComponent('Hello, I would like to know more about your compressors.')}`
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={`Chat on WhatsApp: ${contact.whatsapp.display}`}
      className="group fixed right-3 z-40 grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,.7)] transition [bottom:max(1rem,env(safe-area-inset-bottom))] hover:scale-110 active:scale-95 sm:right-6 sm:h-14 sm:w-14 sm:[bottom:max(1.5rem,env(safe-area-inset-bottom))]">
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 motion-reduce:hidden" aria-hidden="true" />
      <svg viewBox="0 0 32 32" className="h-[26px] w-[26px] sm:h-[30px] sm:w-[30px]" fill="currentColor" aria-hidden="true">
        <path d="M16.04 3C9.4 3 4 8.38 4 15.01c0 2.12.55 4.18 1.6 6L4 29l8.2-1.56a12.02 12.02 0 0 0 3.84.62C22.68 28.06 28 22.68 28 16.04 28 9.38 22.68 3 16.04 3Zm0 22.03c-1.2 0-2.38-.3-3.42-.87l-.5-.28-4.86.93.97-4.74-.3-.52a9.94 9.94 0 0 1-1.5-5.26c0-5.5 4.5-9.97 10.03-9.97 5.54 0 10.04 4.47 10.04 9.97 0 5.52-4.5 10.74-9.96 10.74h-.5Zm5.5-7.5c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.24-.58-.5-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.1 3.2 5.1 4.5.72.3 1.28.5 1.7.63.72.23 1.37.2 1.88.12.58-.08 1.78-.72 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
      </svg>
      <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 sm:block">Chat on WhatsApp</span>
    </a>
  )
}

function PageLoader() {
  return (
    <div className="grid min-h-[70vh] place-items-center" role="status" aria-label="Loading">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-fg/15 border-t-flame" />
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function SiteLayout() {
  const { pathname } = useLocation()
  return (
    <div className="relative">
      {/* iOS-style aurora background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-base">
        <div className="absolute -left-40 -top-40 h-[560px] w-[560px] animate-drift rounded-full bg-orange-300/50 blur-[120px] dark:bg-orange-500/30" />
        <div className="absolute -right-32 top-1/4 h-[520px] w-[520px] animate-drift rounded-full bg-sky-300/60 blur-[120px] dark:bg-[#0a84ff]/30 [animation-delay:-6s]" />
        <div className="absolute -bottom-40 left-1/3 h-[560px] w-[560px] animate-drift rounded-full bg-indigo-300/50 blur-[130px] dark:bg-[#5e5ce6]/25 [animation-delay:-12s]" />
      </div>
      <ScrollToTop />
      <Header />
      <motion.main key={pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <Suspense fallback={<PageLoader />}><Outlet /></Suspense>
      </motion.main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
