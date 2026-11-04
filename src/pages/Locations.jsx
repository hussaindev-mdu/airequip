import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import PageHero from '../components/PageHero'
import { CTA, fade } from '../components/Sections'
import { districts, slugify } from '../data'

export default function Locations() {
  return (
    <>
      <PageHero eyebrow="Locations" title="Local sales and service across South Tamil Nadu." crumbs={[{ label: 'Locations' }]}
        text="Close enough to understand the urgency — we cover seven districts with survey, installation, maintenance and breakdown support." />
      <section className="section !pt-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d, i) => (
            <motion.div key={d} {...fade} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}>
              <Link to={`/locations/${slugify(d)}`} className="glass glass-hover flex items-center justify-between rounded-[2rem] p-7">
                <span className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-flame/15 text-flame"><MapPin size={22} /></span>
                  <span>
                    <span className="block font-display text-xl font-bold text-fg">{d}</span>
                    <span className="text-sm text-fg-3">Air compressors in {d}</span>
                  </span>
                </span>
                <ArrowUpRight className="text-fg-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <CTA />
    </>
  )
}
