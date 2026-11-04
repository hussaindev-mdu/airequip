import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronDown, MapPin, Wrench } from 'lucide-react'
import { products, bands, chain, services, industries, districts, slugify, faqs, contact } from '../data'
import { useQuote } from '../QuoteContext'
import { asset } from '../lib/asset'

export const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.7 } }

export function Head({ eyebrow, title, text, right, className = '', hidden }) {
  if (hidden) return null
  return (
    <motion.div {...fade} className={`mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="h2">{title}</h2>
        {text && <p className="mt-4 text-fg-3">{text}</p>}
      </div>
      {right}
    </motion.div>
  )
}

const MoreLink = ({ to, children }) => (
  <Link to={to} className="btn btn-glass self-start">{children} <ArrowRight size={16} /></Link>
)

export function ProductCards({ showAll }) {
  return (
    <section className="section">
      <Head eyebrow="The complete air system" title="One partner for every part of your compressed-air system."
        text="We assess airflow, pressure, duty cycle and future demand before recommending equipment — not simply the biggest machine on the list."
        right={showAll && <MoreLink to="/products">All products</MoreLink>} />
      <div className="grid gap-6 md:grid-cols-3">
        {products.map((p, i) => (
          <motion.article key={p.title} {...fade} transition={{ duration: 0.7, delay: i * 0.12 }} className="glass glass-hover group overflow-hidden rounded-[2rem] p-3">
            <div className="relative h-56 overflow-hidden rounded-[1.5rem]">
              <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-xs">0{i + 1}</span>
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-300">{p.tag}</p>
              <h3 className="mt-2 font-display text-xl font-bold text-fg">{p.title}</h3>
              <p className="mt-2 text-sm text-fg-3">{p.text}</p>
              <p className="mt-4 inline-block rounded-full bg-fg/5 px-3 py-1 text-xs text-fg-2">{p.spec}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export function Bands() {
  return (
    <section className="section !pt-0">
      <Head eyebrow="Common VAYU starting points" title="Start with the output your machines actually need."
        text="Every SL model is available across 7–12.5 bar; final sizing depends on demand, duty cycle and pressure losses." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bands.map((b, i) => (
          <motion.div key={b.n} {...fade} transition={{ duration: 0.6, delay: i * 0.1 }} className="glass glass-hover rounded-3xl p-6">
            <span className="font-display text-sm text-flame">{b.n}</span>
            <h4 className="mt-3 text-sm text-fg-4">{b.t}</h4>
            <p className="font-display text-2xl font-bold text-fg">{b.m}</p>
            <p className="mt-3 text-sm text-fg-2">{b.s}</p>
            <p className="text-xs text-fg-4">{b.x}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="glass rounded-3xl p-5 text-sm"><b className="text-fg">Steady demand?</b> <span className="text-fg-3">Choose fixed speed for simple, consistent production loads.</span></div>
        <div className="glass rounded-3xl p-5 text-sm"><b className="text-fg">Changing demand?</b> <span className="text-fg-3">Choose VFD to match output as machines start and stop.</span></div>
      </div>
    </section>
  )
}

export function SystemsChain() {
  const { openQuote } = useQuote()
  return (
    <section className="section">
      <Head eyebrow="Complete compressed-air system" title="Everything required between the compressor and your machines."
        text="Correct air treatment, storage and distribution improve air quality, stabilise pressure and reduce avoidable pressure loss."
        right={<button onClick={openQuote} className="btn btn-glass self-start">Ask us to size your compressor <ArrowUpRight size={16} /></button>} />
      <div className="relative grid gap-4 md:grid-cols-5">
        <div className="absolute left-8 right-8 top-1/2 hidden h-px bg-gradient-to-r from-flame via-sky-400 to-flame opacity-50 md:block" />
        {chain.map((c, i) => (
          <motion.div key={c.t} {...fade} transition={{ duration: 0.6, delay: i * 0.1 }} className="glass glass-hover relative rounded-3xl p-6 text-center">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-flame to-orange-700 font-display font-bold text-white shadow-lg shadow-orange-600/40">{i + 1}</div>
            <p className="text-xs uppercase tracking-wider text-sky-600 dark:text-sky-300">{c.d}</p>
            <h3 className="mt-1 font-display text-lg font-bold text-fg">{c.t}</h3>
            <p className="mt-1 text-sm text-fg-3">{c.s}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function ServicesBlock({ showAll }) {
  const { openQuote } = useQuote()
  return (
    <section className="section">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div {...fade} className="glass relative overflow-hidden rounded-[2rem] p-3">
          <img src={asset('/images/vayu-hero-scaled.webp')} alt="Compressor range with service team" loading="lazy" className="h-full max-h-[480px] w-full rounded-[1.5rem] object-cover" />
        </motion.div>
        <div>
          <Head eyebrow="Service that protects uptime" title="Support doesn’t stop after installation."
            text="Planned maintenance, genuine spares and practical breakdown diagnosis — delivered by a local team that knows your system and your site." />
          <div className="space-y-3">
            {services.map((s, i) => (
              <motion.div key={s.t} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }} className="glass glass-hover flex items-center gap-4 rounded-2xl p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-flame/20 text-flame"><Wrench size={18} /></span>
                <div><h3 className="font-semibold text-fg">{s.t}</h3><p className="text-sm text-fg-3">{s.d}</p></div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={openQuote} className="btn btn-primary">Request service support <ArrowUpRight size={16} /></button>
            {showAll && <MoreLink to="/services">All services</MoreLink>}
          </div>
        </div>
      </div>
    </section>
  )
}

export function IndustriesGrid({ limit, showAll, noHead }) {
  const list = limit ? industries.slice(0, limit) : industries
  return (
    <section className="section">
      <Head hidden={noHead} eyebrow="Industries we support" title="Air systems for the industries that keep South Tamil Nadu moving."
        text="We help workshops and factories choose the right capacity, air quality and service plan for the way their machines actually operate."
        right={showAll && <MoreLink to="/industries">All industries</MoreLink>} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((x, i) => (
          <motion.div key={x.t} {...fade} transition={{ duration: 0.6, delay: (i % 3) * 0.1 }} className="group relative h-72 overflow-hidden rounded-[2rem]">
            <img src={x.img} alt={x.t} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
            <div className="glass-dark absolute inset-x-3 bottom-3 rounded-3xl p-4">
              <h3 className="font-display text-lg font-bold text-white">{x.t}</h3>
              <p className="mt-1 text-sm text-white/75">{x.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function LocationsBand() {
  const { openQuote } = useQuote()
  return (
    <section className="section">
      <motion.div {...fade} className="glass rounded-[2.5rem] p-8 text-center sm:p-14">
        <p className="eyebrow">Local sales & service</p>
        <h2 className="h2 mx-auto max-w-2xl">Close enough to understand the urgency.</h2>
        <p className="mx-auto mt-4 max-w-xl text-fg-3">From first survey to installation, maintenance and breakdown support, we stay close to your plant.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {districts.map((d) => (
            <Link key={d} to={`/locations/${slugify(d)}`} className="glass glass-hover inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-fg"><MapPin size={14} className="text-flame" />{d}</Link>
          ))}
        </div>
        <button onClick={openQuote} className="btn btn-primary mt-8">Book a site visit <ArrowUpRight size={16} /></button>
      </motion.div>
    </section>
  )
}

export function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <Head eyebrow="Frequently asked questions" title="Straight answers before you invest." text="The questions factory owners and maintenance teams most often ask before sizing, installing or servicing a compressed-air system." />
        <div className="space-y-3">
          {faqs.map(([q, a], i) => (
            <div key={q} className="glass overflow-hidden rounded-2xl">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-fg">
                {q}<ChevronDown size={18} className={`shrink-0 transition ${open === i ? 'rotate-180 text-flame' : ''}`} />
              </button>
              <motion.div initial={false} animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }} className="overflow-hidden">
                <p className="px-5 pb-5 text-sm text-fg-3">{a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTA() {
  const { openQuote } = useQuote()
  return (
    <section className="section !pb-10">
      <motion.div {...fade} className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-gradient-to-br from-[#ff7a1a] via-[#ff5e00] to-[#2563eb] p-10 text-center shadow-2xl shadow-orange-500/30 sm:p-16">
        <p className="eyebrow !text-white/90">Start with your actual air requirement</p>
        <h2 className="h2 mx-auto max-w-3xl !text-white">Tell us what your factory needs to run.</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/90">Share the application, pressure, working hours and current problems. We’ll recommend the next practical step.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={openQuote} className="btn bg-white text-[#0f172a] hover:bg-white/90">Request a quote <ArrowUpRight size={16} /></button>
          <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-glass">WhatsApp us <ArrowUpRight size={16} /></a>
        </div>
      </motion.div>
    </section>
  )
}
