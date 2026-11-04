import PageHero from '../components/PageHero'
import { Bands, CTA, ProductCards, SystemsChain } from '../components/Sections'

export default function Products() {
  return (
    <>
      <PageHero eyebrow="Products" title="Compressors and complete air systems." crumbs={[{ label: 'Products' }]}
        text="Fixed-speed and VFD screw compressors from 5 to 45 kW, with dryers, receivers, filters and piping to match." />
      <ProductCards />
      <Bands />
      <SystemsChain />
      <CTA />
    </>
  )
}
