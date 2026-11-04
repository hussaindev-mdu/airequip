import { motion } from 'framer-motion'
import { Compass, Layers, MapPin } from 'lucide-react'
import PageHero from '../components/PageHero'
import { CTA, fade } from '../components/Sections'
import { stats } from '../data'

const pillars = [
  { Icon: Compass, t: 'Assess first', d: 'We assess airflow, pressure, duty cycle and future demand before recommending equipment — not simply the biggest machine on the list.' },
  { Icon: Layers, t: 'One complete system', d: 'Compressors, dryers, receivers, filters and piping are selected as one dependable production system.' },
  { Icon: MapPin, t: 'Support that stays local', d: 'Planned maintenance, genuine spares and breakdown diagnosis from a team that knows your site.' },
]

export default function About() {
  return (
    <>
      <PageHero eyebrow="About us" title="Air Equipment & Solutions." crumbs={[{ label: 'About' }]}
        text="An authorised VAYU dealer and service partner delivering compressed-air sales, installation and service across South Tamil Nadu." />
      <section className="section !pt-10">
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map(({ Icon, t, d }, i) => (
            <motion.div key={t} {...fade} transition={{ duration: 0.6, delay: i * 0.1 }} className="glass glass-hover rounded-[2rem] p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-flame/15 text-flame"><Icon size={22} /></span>
              <h3 className="mt-5 font-display text-xl font-bold text-fg">{t}</h3>
              <p className="mt-2 text-sm text-fg-3">{d}</p>
            </motion.div>
          ))}
        </div>
        <motion.div {...fade} className="glass mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-fg/5 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-surface/50 px-6 py-6">
              <div className="font-display text-2xl font-bold text-fg">{s.v}</div>
              <div className="text-sm text-fg-4">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </section>
      <CTA />
    </>
  )
}
