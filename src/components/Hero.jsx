// 3D HERO (disabled for now) — to enable: uncomment the 3 blocks marked "3D HERO" in this file
// and change the content wrapper padding back to `pt-[52vh]` (see note below).
// 3D HERO 1/3: imports
// import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarCheck, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { stats } from '../data'
import { useQuote } from '../QuoteContext'

// 3D HERO 2/3: lazy-loaded scene component
// const Hero3D = lazy(() => import('./Hero3D'))

export default function Hero() {
  const { openQuote: onQuote, openCatalogue: onCatalogue } = useQuote()
  return (
    <section id="top" className="relative min-h-screen overflow-hidden">
      {/* 3D HERO 3/3: canvas + overlay
      <div className="absolute inset-x-0 top-24 h-[50vh] sm:bottom-0 sm:h-auto lg:left-[32%] lg:top-24 lg:bottom-4">
        <Suspense fallback={null}><Hero3D /></Suspense>
      </div>
      <div className="pointer-events-none absolute inset-0 lg:bg-gradient-to-r lg:from-base lg:via-transparent lg:to-transparent" />
      */}

      {/* NOTE: with 3D enabled the padding below is `pt-[52vh]` (room for the model on mobile) */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-10 pt-32 sm:px-8 lg:pt-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
          <span className="glass mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide text-fg-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-flame" /> Authorised VAYU dealer & service partner
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-fg sm:text-6xl">
            Compressed air,<br />
            <span className="bg-gradient-to-r from-[#ff6a00] to-[#ffa24d] bg-clip-text text-transparent">engineered right.</span>
          </h1>
          <p className="mt-5 text-base text-fg-3 sm:text-lg">
            Correctly sized compressors, complete air systems and dependable local support — from first survey to long-term service.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/products" className="btn btn-primary">Find your compressor <ArrowRight size={16} /></Link>
            <button onClick={onQuote} className="btn btn-glass"><CalendarCheck size={16} /> Book a site visit</button>
            <button onClick={onCatalogue} className="btn btn-glass"><Download size={16} /> Catalogue</button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
          className="glass mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-fg/5 sm:grid-cols-4 lg:max-w-3xl">
          {stats.map((s) => (
            <div key={s.l} className="bg-surface/50 px-5 py-4">
              <div className="font-display text-xl font-bold text-fg">{s.v}</div>
              <div className="text-xs text-fg-4">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
