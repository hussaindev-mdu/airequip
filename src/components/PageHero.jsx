import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export default function PageHero({ eyebrow, title, text, crumbs = [], children }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-6 pt-36 sm:px-8 sm:pt-44">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-fg-4">
          <Link to="/" className="hover:text-fg">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1">
              <ChevronRight size={12} />
              {c.to ? <Link to={c.to} className="hover:text-fg">{c.label}</Link> : <span className="text-fg-2">{c.label}</span>}
            </span>
          ))}
        </nav>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-fg sm:text-6xl">{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg text-fg-3">{text}</p>}
        {children}
      </motion.div>
    </section>
  )
}
