import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, Moon, Sun, Wind, X, Phone, Mail, MessageCircle } from 'lucide-react'
import { BRAND, nav, districts, slugify, contact } from '../data'
import { useQuote } from '../QuoteContext'
import { asset } from '../lib/asset'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="glass grid h-10 w-10 place-items-center rounded-2xl text-flame"><Wind size={20} /></span>
      <span className="font-display text-sm font-bold leading-tight text-fg">
        Air Equipment<br /><span className="font-medium text-fg-4">& Solutions</span>
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
          {nav.map((n) => <NavLink key={n.to} to={n.to} className={linkCls}>{n.label}</NavLink>)}
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
              <NavLink key={n.to} to={n.to} className={({ isActive }) => `block rounded-2xl px-4 py-3 ${isActive ? 'bg-fg/10 font-semibold text-fg' : 'text-fg-2 hover:bg-fg/5'}`}>{n.label}</NavLink>
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
              <li className="flex gap-2"><Phone size={16} className="mt-0.5 text-flame" />Sales: {contact.sales}</li>
              <li className="flex gap-2"><Phone size={16} className="mt-0.5 text-flame" />Service: {contact.service}</li>
              <li className="flex gap-2"><MessageCircle size={16} className="mt-0.5 text-flame" />WhatsApp us</li>
              <li className="flex gap-2"><Mail size={16} className="mt-0.5 text-flame" />{contact.email}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-fg/10 pt-6 text-xs text-fg-4 sm:flex-row">
          <span>© {new Date().getFullYear()} {BRAND}</span>
          <span>Authorised VAYU dealer & service partner · 3D model “Piston compressor WO 6-180” by Nedd_Nelson (CC BY 4.0)</span>
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
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}
