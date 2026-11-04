import Hero from '../components/Hero'
import { CTA, IndustriesGrid, LocationsBand, ProductCards, ServicesBlock, SystemsChain } from '../components/Sections'

export default function Home() {
  return (
    <>
      <Hero />
      <ProductCards showAll />
      <SystemsChain />
      <ServicesBlock showAll />
      <IndustriesGrid limit={3} showAll />
      <LocationsBand />
      <CTA />
    </>
  )
}
