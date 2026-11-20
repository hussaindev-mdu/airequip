import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, ChevronDown } from 'lucide-react'
import { PRODUCTS, SPEC_NOTE, getProduct } from '../products'

/** Wide spec table: scrolls sideways on small screens, model column stays pinned. */
export function SpecTable({ table }) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="font-display text-xl font-bold text-fg">{table.title}</h3>
      {table.intro && <p className="mt-1 text-sm text-fg-3">{table.intro}</p>}
      <div className="glass mt-4 overflow-x-auto rounded-2xl">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-fg/10 text-[11px] uppercase tracking-wider text-fg-4">
              {table.cols.map((c, i) => (
                <th key={c} className={`whitespace-nowrap px-4 py-3 font-semibold ${i === 0 ? 'sticky left-0 z-10 bg-base/90 backdrop-blur' : ''}`}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r) => (
              <tr key={r[0]} className="border-b border-fg/5 transition last:border-b-0 hover:bg-fg/5">
                {r.map((cell, i) => (
                  <td key={i} className={`whitespace-nowrap px-4 py-3 ${i === 0 ? 'sticky left-0 z-10 bg-base/90 font-display font-bold text-fg backdrop-blur' : 'text-fg-2'}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function SpecTables({ product }) {
  return (
    <>
      {product.tables.map((t) => <SpecTable key={t.title} table={t} />)}
      <p className="text-xs text-fg-4">{SPEC_NOTE}</p>
    </>
  )
}

export function Highlights({ product }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {product.highlights.map((h) => (
        <li key={h.t} className="glass flex gap-3 rounded-2xl p-4">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ background: product.glow + '26', color: product.glow }}><Check size={15} /></span>
          <span><b className="block font-display text-fg">{h.t}</b><span className="text-sm text-fg-3">{h.d}</span></span>
        </li>
      ))}
    </ul>
  )
}

export function ProductFaq({ product }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="border-y border-fg/10">
      {product.faqs.map(([q, a], i) => (
        <div key={q} className="border-b border-fg/10 last:border-b-0">
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold text-fg">
            {q}<ChevronDown size={18} className={`shrink-0 transition ${open === i ? 'rotate-180 text-flame' : ''}`} />
          </button>
          <motion.div initial={false} animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }} className="overflow-hidden">
            <p className="pb-4 text-sm leading-relaxed text-fg-3">{a}</p>
          </motion.div>
        </div>
      ))}
    </div>
  )
}

/** "Complete your compressed air system" — links to the related VAYU products. */
export function RelatedProducts({ product }) {
  const items = product.related.map(getProduct).filter(Boolean)
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((r) => (
        <Link key={r.slug} to={`/products/${r.slug}`} className="glass glass-hover group flex flex-col overflow-hidden rounded-3xl p-3">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-black/10"><img src={r.image} alt={`${r.name} — VAYU`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
          <div className="p-3">
            <h4 className="font-display font-bold text-fg">{r.name}</h4>
            <p className="mt-1 text-sm text-fg-3">{r.cardText}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-flame">View details <ArrowUpRight size={15} /></span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export { PRODUCTS }
