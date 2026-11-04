import PageHero from '../components/PageHero'
import { CTA, IndustriesGrid } from '../components/Sections'

export default function Industries() {
  return (
    <>
      <PageHero eyebrow="Industries" title="Air systems for the way your plant actually runs." crumbs={[{ label: 'Industries' }]}
        text="We help workshops and factories choose the right capacity, air quality and service plan for their machines." />
      <IndustriesGrid noHead />
      <CTA />
    </>
  )
}
