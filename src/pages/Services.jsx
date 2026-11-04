import PageHero from '../components/PageHero'
import { CTA, ServicesBlock } from '../components/Sections'

export default function Services() {
  return (
    <>
      <PageHero eyebrow="Services" title="Installation, maintenance and breakdown support." crumbs={[{ label: 'Services' }]}
        text="From the first site survey to long-term AMC, one local team looks after your compressed-air system." />
      <ServicesBlock />
      <CTA />
    </>
  )
}
