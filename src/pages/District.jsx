import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import PageHero from '../components/PageHero'
import { CTA, Head, fade } from '../components/Sections'
import { districts, industries, services, slugify } from '../data'
import { useQuote } from '../QuoteContext'
import NotFound from './NotFound'

export default function District() {
  const { slug } = useParams()
  const { openQuote } = useQuote()
  const name = districts.find((d) => slugify(d) === slug)
  if (!name) return <NotFound />
  return (
    <>
      <PageHero eyebrow={`${name} · Sales & service`} title={`Air compressors in ${name}.`}
        crumbs={[{ label: 'Locations', to: '/locations' }, { label: name }]}
        text={`Compressor sales, installation, spares, AMC and breakdown support for factories and workshops in and around ${name}.`}>
        <button onClick={openQuote} className="btn btn-primary mt-7">Book a site visit in {name} <ArrowUpRight size={16} /></button>
      </PageHero>

      <section className="section !pt-12">
        <Head eyebrow="What we do locally" title={`Complete support for ${name} plants.`} />
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((s, i) => (
            <motion.div key={s.t} {...fade} transition={{ duration: 0.5, delay: i * 0.07 }} className="glass flex gap-4 rounded-3xl p-6">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-flame/15 text-flame"><Check size={16} /></span>
              <div><h3 className="font-semibold text-fg">{s.t}</h3><p className="mt-1 text-sm text-fg-3">{s.d}</p></div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section !pt-0">
        <Head eyebrow="Industries" title="Systems for the industries around you." />
        <div className="flex flex-wrap gap-3">
          {industries.map((x) => <span key={x.t} className="glass rounded-full px-5 py-2.5 text-sm text-fg">{x.t}</span>)}
        </div>
      </section>

      <section className="section !pt-0">
        <Head eyebrow="Also serving" title="Other districts." />
        <div className="flex flex-wrap gap-3">
          {districts.filter((d) => d !== name).map((d) => (
            <Link key={d} to={`/locations/${slugify(d)}`} className="glass glass-hover rounded-full px-5 py-2.5 text-sm text-fg">{d}</Link>
          ))}
        </div>
      </section>
      <CTA />
    </>
  )
}
