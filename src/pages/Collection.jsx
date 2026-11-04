import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Download, Minus, Pause, Play, Plus } from 'lucide-react'
import { COLLECTION, bands, chain } from '../collection/data'
import { createShowcase } from '../collection/engine'
import { industries } from '../data'
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
  const [thumbs, setThumbs] = useState([])
  const [ready, setReady] = useState(false)
  const [fail, setFail] = useState(false)
  const [sel, setSel] = useState(0)

  useEffect(() => {
    const eng = createShowcase({
      mount: mountRef.current, hero: heroRef.current, interval: INTERVAL,
      onThumbs: setThumbs, onReady: () => setReady(true), onIndex: setIdx, onHud: (h) => setInHero(h.inHero), onFail: () => setFail(true),
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
  const [sizeOpen, setSizeOpen] = useState(0) // reserved for future size selector
  void sizeOpen; void setSizeOpen

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
            <p className="mb-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.26em] text-[#e85d00] dark:text-[#ff9a4d] sm:mb-4 sm:gap-4 sm:text-[11px] sm:tracking-[.3em]">Air Equipment & Solutions <span className="h-px w-10 bg-current opacity-50 sm:w-14" /></p>
            <h1 className="font-display text-3xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">Complete<br />the <span className="bg-gradient-to-r from-[#ff6a00] to-[#ffa24d] bg-clip-text text-transparent">Collection</span></h1>
          </div>

          {/* machine on stage */}
          <div className="absolute bottom-16 left-5 right-5 max-w-lg sm:bottom-[7vh] sm:left-12 sm:right-20">
            <div className="mb-3 flex items-center gap-3 font-display text-sm tracking-[.3em] sm:mb-4 sm:gap-4" style={{ color: cur.glow }}>
              0{idx + 1} / 0{N}<span className="h-px w-16 bg-current opacity-50" />
              <button onClick={() => setPaused((v) => !v)} aria-label={paused ? 'Resume autoplay' : 'Pause autoplay'} className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full border border-fg/20 bg-surface/60 text-fg backdrop-blur transition hover:bg-surface/90 dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
                {paused ? <Play size={13} /> : <Pause size={13} />}
              </button>
            </div>
            <h2 key={cur.id} className="animate-[fadeUp_.7s_cubic-bezier(.2,.7,.2,1)_both] font-display text-3xl font-bold leading-[1.05] sm:text-6xl">{cur.name}</h2>
            <p key={cur.id + 't'} className="mb-4 mt-2 animate-[fadeUp_.7s_.08s_cubic-bezier(.2,.7,.2,1)_both] text-sm tracking-wide text-fg-3 dark:text-white/65 sm:mb-6 sm:mt-3">{cur.tag}</p>
            <button onClick={() => toDetails(idx)} className="inline-flex items-center gap-3 rounded-full border border-fg/20 bg-surface/60 px-5 py-2.5 dark:border-white/25 dark:bg-white/10 dark:text-white text-[11px] font-semibold uppercase tracking-[.2em] text-fg sm:px-6 sm:py-3 sm:text-xs shadow-[inset_0_1px_0_rgba(255,255,255,.3)] backdrop-blur-xl transition hover:-translate-y-0.5">
              View details <ArrowRight size={14} />
            </button>
          </div>

          {/* progress: one bar per machine, the active one fills over the interval */}
          <nav className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 sm:bottom-auto sm:left-auto sm:right-8 sm:top-1/2 sm:-translate-x-0 sm:-translate-y-1/2 sm:flex-col sm:items-end" aria-label="Machines">
            {COLLECTION.map((c, i) => (
              <button key={c.id} onClick={() => jump(i)} aria-label={`Show ${c.name}`} aria-current={i === idx} className="group flex h-8 items-center justify-end sm:h-6 sm:w-14">
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

        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="glass relative grid aspect-[4/3.1] place-items-center overflow-hidden rounded-[2rem]">
              <div className="absolute inset-0 transition-all duration-700" style={{ background: `radial-gradient(circle at 50% 62%, ${p.glow}55, transparent 62%)` }} />
              {!thumbs[sel] && <span className="relative z-10 h-8 w-8 animate-spin rounded-full border-2 border-fg/15 border-t-flame" />}
              {thumbs[sel] && <img key={p.id} src={thumbs[sel]} alt={p.name} className="relative z-10 h-[92%] w-auto animate-[fadeUp_.7s_cubic-bezier(.2,.7,.2,1)_both] object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,.35)]" />}
            </div>
            <div className="mt-3 grid grid-cols-5 gap-3">
              {COLLECTION.map((c, i) => (
                <button key={c.id} onClick={() => pick(i)} aria-label={c.name} className={`glass rounded-2xl p-2 transition ${i === sel ? '!border-[var(--accent)]' : 'opacity-70 hover:opacity-100'}`}>
                  {thumbs[i] && <img src={thumbs[i]} alt="" className="mx-auto h-14 w-full object-contain" />}
                  <small className="mt-1 block text-center text-[9px] uppercase tracking-[.14em] text-fg-4">{c.short}</small>
                </button>
              ))}
            </div>
          </div>

          {/* info */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[.28em]" style={{ color: p.glow }}>{p.tag}</p>
            <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-fg sm:text-6xl">{p.name}</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-3">{p.lead}</p>

            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {p.specs.map(([k, v]) => (
                <div key={k} className="glass rounded-2xl p-4">
                  <dt className="text-[10px] uppercase tracking-[.2em] text-fg-4">{k}</dt>
                  <dd className="mt-1.5 font-display text-lg font-bold leading-tight text-fg">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={openQuote} className="btn btn-primary">Request a quote <ArrowRight size={16} /></button>
              <button onClick={openCatalogue} className="btn btn-glass"><Download size={16} /> Catalogue</button>
            </div>
            <p className="mt-4 text-sm text-fg-4">{p.note}</p>

            <div className="mt-10 border-t border-fg/10">
              <Acc title="Key features" open>
                <ul className="space-y-3">{p.features.map((f) => <li key={f} className="flex gap-3 text-fg-3"><Check size={18} className="mt-0.5 shrink-0" style={{ color: p.glow }} />{f}</li>)}</ul>
              </Acc>
              <Acc title="Models & sizes">
                {p.sizes === 'bands' ? (
                  <div className="overflow-hidden rounded-2xl border border-fg/10">
                    {bands.map((b) => (
                      <div key={b.n} className="grid grid-cols-[1fr_auto] gap-x-4 border-b border-fg/10 px-4 py-3 last:border-b-0 sm:grid-cols-[1.1fr_1fr_1fr]">
                        <div><div className="font-display font-bold text-fg">{b.m}</div><div className="text-xs text-fg-4">{b.t}</div></div>
                        <div className="text-sm text-fg-2 sm:order-none">{b.s}</div>
                        <div className="col-span-2 text-xs text-fg-4 sm:col-span-1">{b.x}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">{p.sizes.map((s) => <span key={s} className="glass rounded-full px-4 py-2 text-sm text-fg-2">{s}</span>)}</div>
                )}
              </Acc>
              <Acc title="Where it fits in your system">
                <ol className="grid gap-2 sm:grid-cols-5">
                  {chain.map((c, i) => (
                    <li key={c.t} className={`rounded-2xl border p-3 text-center text-xs ${i === p.step ? 'border-[var(--accent)] bg-fg/5 text-fg' : 'border-fg/10 text-fg-4'}`}>
                      <span className="mb-1 block font-display text-base font-bold" style={{ color: p.glow }}>{i + 1}</span>{c.t}
                    </li>
                  ))}
                </ol>
              </Acc>
              <Acc title="Industries we supply">
                <div className="flex flex-wrap gap-2">{industries.map((x) => <span key={x.t} className="glass rounded-full px-4 py-2 text-sm text-fg-2">{x.t}</span>)}</div>
              </Acc>
              <Acc title="Service & support">
                <p className="text-fg-3">Site survey and sizing, installation and commissioning, preventive maintenance and AMC, genuine spares and breakdown support — from a local team across seven districts of South Tamil Nadu.</p>
              </Acc>
            </div>
          </div>
        </div>

        {/* complete the collection */}
        <div className="mt-28">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl">Complete the <span className="text-flame">collection</span></h3>
            <button onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} className="btn btn-glass">Back to the scene ↑</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {COLLECTION.map((c, i) => (
              <button key={c.id} onClick={() => pick(i)} className={`glass glass-hover rounded-3xl p-4 text-left ${i === sel ? '!border-[var(--accent)]' : ''}`}>
                <div className="relative grid h-36 place-items-center">
                  <div className="absolute inset-2 rounded-full opacity-50 blur-xl" style={{ background: c.glow + '66' }} />
                  {thumbs[i] && <img src={thumbs[i]} alt={c.name} className="relative h-full w-full object-contain" />}
                </div>
                <h4 className="mt-3 font-display text-base font-bold text-fg">{c.name}</h4>
                <p className="mt-1 text-xs text-fg-4">{c.tag}</p>
                <p className="mt-3 text-xs font-semibold" style={{ color: c.glow }}>{c.specs[0][1]}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Acc({ title, children, open }) {
  return (
    <details className="group border-b border-fg/10" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-xs font-semibold uppercase tracking-[.2em] text-fg [&::-webkit-details-marker]:hidden">
        {title}
        <span className="relative h-4 w-4"><Plus size={16} className="absolute inset-0 transition group-open:opacity-0" /><Minus size={16} className="absolute inset-0 opacity-0 transition group-open:opacity-100" /></span>
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  )
}
