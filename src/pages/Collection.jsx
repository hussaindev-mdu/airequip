import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Download, ExternalLink, Pause, Play } from 'lucide-react'
import { COLLECTION, chain } from '../collection/data'
import { Highlights, ProductFaq, RelatedProducts, SpecTables } from '../components/ProductParts'
import { createShowcase } from '../collection/engine'
import { useQuote } from '../QuoteContext'

const N = COLLECTION.length

const INTERVAL = 2500

export default function Collection() {
  const { openQuote, openCatalogue } = useQuote()
  const heroRef = useRef(null), mountRef = useRef(null), engineRef = useRef(null), picked = useRef(false)
  const [idx, setIdx] = useState(0)
  const [inHero, setInHero] = useState(true)
  const [paused, setPaused] = useState(false)
  const [tick, setTick] = useState(0) // restarts the progress bar when the visitor jumps to a machine
  const [ready, setReady] = useState(false)
  const [fail, setFail] = useState(false)
  const [sel, setSel] = useState(0)

  useEffect(() => {
    const eng = createShowcase({
      mount: mountRef.current, hero: heroRef.current, interval: INTERVAL,
      onReady: () => setReady(true), onIndex: setIdx, onHud: (h) => setInHero(h.inHero), onFail: () => setFail(true),
    })
    engineRef.current = eng
    return () => { eng.dispose(); engineRef.current = null }
  }, [])
  useEffect(() => { engineRef.current?.setPaused(paused) }, [paused])

  // product details follow the machine on stage until the visitor picks one themselves
  useEffect(() => { if (inHero) picked.current = false }, [inHero])
  useEffect(() => { if (!picked.current) setSel(idx) }, [idx])

  const jump = (i) => { engineRef.current?.goTo(i); setTick((t) => t + 1) }
  const toDetails = (i) => { picked.current = true; setSel(i); document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' }) }
  const pick = (i) => { picked.current = true; setSel(i) }

  const cur = COLLECTION[Math.min(idx, N - 1)]
  const p = COLLECTION[sel]

  return (
    <>
      {/* ------------------------------ autoplay stage ------------------------------ */}
      <section ref={heroRef} className="relative h-screen" aria-label="The collection">
        <div className="relative h-full overflow-hidden bg-base text-fg">
          <div ref={mountRef} className="absolute inset-0" />
          <div className={`pointer-events-none absolute inset-0 z-10 grid place-items-center bg-base transition-opacity duration-700 ${ready || fail ? 'opacity-0' : 'opacity-100'}`} role="status" aria-live="polite">
            <div className="flex flex-col items-center gap-4">
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-fg/15 border-t-flame" />
              <p className="text-[11px] font-semibold uppercase tracking-[.3em] text-fg-4">Loading the collection</p>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_45%,rgba(217,225,239,.55)_100%),linear-gradient(to_top,rgba(217,225,239,.8),transparent_30%),linear-gradient(to_bottom,rgba(217,225,239,.7),transparent_20%)] dark:bg-[radial-gradient(ellipse_at_50%_45%,transparent_38%,rgba(0,0,0,.55)_100%),linear-gradient(to_top,rgba(0,0,0,.7),transparent_34%),linear-gradient(to_bottom,rgba(0,0,0,.5),transparent_22%)]" />

          {/* title */}
          <div className="pointer-events-none absolute left-5 top-[12vh] max-w-xl sm:left-12 sm:top-[19vh]">
            <p className="mb-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.26em] text-[#e85d00] dark:text-[#ff9a4d] sm:mb-4 sm:gap-4 sm:text-[11px] sm:tracking-[.3em]">Air Equipments & Solutions <span className="h-px w-10 bg-current opacity-50 sm:w-14" /></p>
            <h1 className="font-display text-3xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">Complete<br />the <span className="bg-gradient-to-r from-[#ff6a00] to-[#ffa24d] bg-clip-text text-transparent">Collection</span></h1>
          </div>

          {/* machine on stage */}
          <div className="absolute bottom-16 left-5 right-5 max-w-lg sm:bottom-[7vh] sm:left-12 sm:right-20">
            <div className="mb-3 flex items-center gap-3 font-display text-sm font-bold tracking-[.3em] text-[color-mix(in_srgb,var(--g)_45%,#0f172a)] dark:text-[var(--g)] sm:mb-4 sm:gap-4" style={{ "--g": cur.glow }}>
              0{idx + 1} / 0{N}<span className="h-px w-16 bg-current opacity-50" />
              <button onClick={() => setPaused((v) => !v)} aria-label={paused ? 'Resume autoplay' : 'Pause autoplay'} className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full border border-fg/20 bg-surface/60 text-fg backdrop-blur transition hover:bg-surface/90 dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
                {paused ? <Play size={13} /> : <Pause size={13} />}
              </button>
            </div>
            <h2 key={cur.slug} className="animate-[fadeUp_.7s_cubic-bezier(.2,.7,.2,1)_both] font-display text-3xl font-bold leading-[1.05] sm:text-6xl">{cur.name}</h2>
            <p key={cur.slug + 't'} className="mb-4 mt-2 animate-[fadeUp_.7s_.08s_cubic-bezier(.2,.7,.2,1)_both] text-sm tracking-wide text-fg-3 dark:text-white/65 sm:mb-6 sm:mt-3">{cur.tag}</p>
            <button onClick={() => toDetails(idx)} className="inline-flex items-center gap-3 rounded-full border border-fg/20 bg-surface/60 px-5 py-2.5 dark:border-white/25 dark:bg-white/10 dark:text-white text-[11px] font-semibold uppercase tracking-[.2em] text-fg sm:px-6 sm:py-3 sm:text-xs shadow-[inset_0_1px_0_rgba(255,255,255,.3)] backdrop-blur-xl transition hover:-translate-y-0.5">
              View details <ArrowRight size={14} />
            </button>
          </div>

          {/* progress: one bar per machine, the active one fills over the interval */}
          <nav className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-auto sm:left-auto sm:right-8 sm:top-1/2 sm:-translate-x-0 sm:-translate-y-1/2 sm:flex-col sm:items-end" aria-label="Machines">
            {COLLECTION.map((c, i) => (
              <button key={c.slug} onClick={() => jump(i)} aria-label={`Show ${c.name}`} aria-current={i === idx} className="group flex h-8 items-center justify-end sm:h-6 sm:w-14">
                <span className={`relative block h-[3px] overflow-hidden rounded-full bg-fg/25 transition-all group-hover:bg-fg/45 dark:bg-white/25 dark:group-hover:bg-white/45 sm:h-[2px] ${i === idx ? 'w-12 sm:w-14' : 'w-6'}`}>
                  {i === idx && (
                    <span key={`${idx}-${tick}`} className="absolute inset-y-0 left-0 block w-full origin-left rounded-full"
                      style={{ background: c.glow, animation: `fillBar ${INTERVAL}ms linear both`, animationPlayState: paused || !inHero ? 'paused' : 'running' }} />
                  )}
                </span>
              </button>
            ))}
          </nav>

          {fail && <div className="absolute inset-0 grid place-items-center p-8 text-center text-fg-3">Your browser couldn’t start the 3D showcase. The product details are just below.</div>}
        </div>
      </section>

      {/* ------------------------------ product page ------------------------------ */}
      <section id="details" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28" aria-label="Product details" style={{ '--accent': p.glow }}>
        <nav className="mb-10 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[.2em] text-fg-4">
          <Link to="/" className="hover:text-fg">Home</Link><span>/</span><span>Collection</span><span>/</span><b className="font-medium text-fg">{p.name}</b>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* gallery: the real VAYU product photo */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="glass relative overflow-hidden rounded-[2rem] p-2.5">
              <div className="absolute inset-0 transition-all duration-700" style={{ background: `radial-gradient(circle at 50% 62%, ${p.glow}44, transparent 62%)` }} />
              <img key={p.slug} src={p.image} alt={`${p.name} — VAYU`} className="relative aspect-square w-full animate-[fadeUp_.7s_cubic-bezier(.2,.7,.2,1)_both] rounded-[1.6rem] object-cover" />
            </div>
            <div className="mt-3 grid grid-cols-5 gap-3">
              {COLLECTION.map((c, i) => (
                <button key={c.slug} onClick={() => pick(i)} aria-label={c.name} className={`glass overflow-hidden rounded-2xl p-1.5 transition ${i === sel ? '!border-[var(--accent)]' : 'opacity-70 hover:opacity-100'}`}>
                  <img src={c.image} alt="" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
                  <small className="mt-1 block truncate text-center text-[9px] uppercase tracking-[.1em] text-fg-4">{c.short}</small>
                </button>
              ))}
            </div>
          </div>

          {/* info */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.28em]" style={{ color: p.glow }}>{p.tag}</p>
            <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-fg sm:text-5xl">{p.name}</h2>
            <p className="mt-5 text-base leading-relaxed text-fg-3">{p.lead}</p>

            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {p.stats.map(([k, v]) => (
                <div key={k} className="glass rounded-2xl p-4">
                  <dt className="text-[10px] uppercase tracking-[.2em] text-fg-4">{k}</dt>
                  <dd className="mt-1.5 font-display text-lg font-bold leading-tight text-fg">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={openQuote} className="btn btn-primary">Request a quote <ArrowRight size={16} /></button>
              <button onClick={openCatalogue} className="btn btn-glass"><Download size={16} /> Catalogue</button>
              <Link to={`/products/${p.slug}`} className="btn btn-glass">Full product page <ExternalLink size={15} /></Link>
            </div>

            <h3 className="mt-10 font-display text-2xl font-bold text-fg">{p.highlightsTitle}</h3>
            <div className="mt-4"><Highlights product={p} /></div>

            <h3 className="mt-10 font-display text-2xl font-bold text-fg">Where it fits in your system</h3>
            <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {chain.map((c, i) => (
                <li key={c.t} className={`rounded-2xl border p-3 text-center text-xs ${i === p.chainStep ? 'border-[var(--accent)] bg-fg/5 text-fg' : 'border-fg/10 text-fg-4'}`}>
                  <span className="mb-1 block font-display text-base font-bold" style={{ color: p.glow }}>{i + 1}</span>{c.t}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* full technical data */}
        <div className="mt-20">
          <p className="eyebrow">Technical data</p>
          <h3 className="mb-8 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">{p.name} — specifications</h3>
          <SpecTables product={p} />
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">Frequently asked questions</p>
            <h3 className="font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">About {p.short.toLowerCase()}</h3>
            <p className="mt-4 text-fg-3">Straight answers before you invest.</p>
          </div>
          <ProductFaq product={p} />
        </div>

        <div className="mt-20">
          <p className="eyebrow">Complete your compressed air system</p>
          <h3 className="mb-8 font-display text-3xl font-bold tracking-tight text-fg sm:text-4xl">Add the right air treatment and storage</h3>
          <RelatedProducts product={p} />
        </div>

        {/* complete the collection */}
        <div className="mt-28">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl">Complete the <span className="text-flame">collection</span></h3>
            <button onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} className="btn btn-glass">Back to the scene ↑</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {COLLECTION.map((c, i) => (
              <button key={c.slug} onClick={() => pick(i)} className={`glass glass-hover overflow-hidden rounded-3xl p-3 text-left ${i === sel ? '!border-[var(--accent)]' : ''}`}>
                <img src={c.image} alt={`${c.name} — VAYU`} loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
                <h4 className="mt-3 font-display text-base font-bold text-fg">{c.name}</h4>
                <p className="mt-1 text-xs text-fg-4">{c.tag}</p>
                <p className="mt-2 text-xs font-semibold" style={{ color: c.glow }}>{c.bullets[0]}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
