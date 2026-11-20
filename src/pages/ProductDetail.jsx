import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import PageHero from '../components/PageHero'
import { CTA, Head, fade } from '../components/Sections'
import { Highlights, ProductFaq, RelatedProducts, SpecTables } from '../components/ProductParts'
import { getProduct } from '../products'
import { useQuote } from '../QuoteContext'
import NotFound from './NotFound'

export default function ProductDetail() {
  const { slug } = useParams()
  const { openQuote, openCatalogue } = useQuote()
  const p = getProduct(slug)
  if (!p) return <NotFound />
  return (
    <>
      <PageHero eyebrow={p.tag} title={p.name} crumbs={[{ label: 'Products', to: '/products' }, { label: p.name }]} text={p.lead}>
        <div className="mt-7 flex flex-wrap gap-3">
          <button onClick={openQuote} className="btn btn-primary">Request a quote <ArrowRight size={16} /></button>
          <button onClick={openCatalogue} className="btn btn-glass"><Download size={16} /> Catalogue</button>
          <Link to="/collection" className="btn btn-glass">See it in the collection</Link>
        </div>
      </PageHero>

      <section className="section !pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div {...fade} className="glass relative overflow-hidden rounded-[2rem] p-3">
            <div className="absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 50% 60%, ${p.glow}, transparent 65%)` }} />
            <img src={p.image} alt={`${p.name} — VAYU`} className="relative aspect-square w-full rounded-[1.5rem] object-cover" />
          </motion.div>
          <div>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {p.stats.map(([k, v]) => (
                <div key={k} className="glass rounded-2xl p-4">
                  <dt className="text-[11px] uppercase tracking-[.18em] text-fg-4">{k}</dt>
                  <dd className="mt-1.5 font-display text-xl font-bold leading-tight text-fg">{v}</dd>
                </div>
              ))}
            </dl>
            <h2 className="mt-8 font-display text-2xl font-bold text-fg sm:text-3xl">{p.highlightsTitle}</h2>
            <div className="mt-5"><Highlights product={p} /></div>
          </div>
        </div>
      </section>

      <section className="section !pt-0">
        <Head eyebrow="Technical data" title={`${p.name} — specifications`} />
        <SpecTables product={p} />
      </section>

      <section className="section !pt-0">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <Head eyebrow="Frequently asked questions" title={`About ${p.short.toLowerCase()}`} text="Straight answers before you invest." />
          <ProductFaq product={p} />
        </div>
      </section>

      <section className="section !pt-0">
        <Head eyebrow="Complete your compressed air system" title="Add the right air treatment and storage"
          text="Bring compression, drying, filtration and storage together around your work." />
        <RelatedProducts product={p} />
      </section>
      <CTA />
    </>
  )
}
