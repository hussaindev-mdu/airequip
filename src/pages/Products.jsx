import PageHero from '../components/PageHero'
import { CTA, ProductCards, Subsystem, SystemsChain } from '../components/Sections'
import { RANGE_INTRO } from '../products'

export default function Products() {
  return (
    <>
      <PageHero eyebrow="Products" title="The complete VAYU compressed air range." crumbs={[{ label: 'Products' }]}
        text={RANGE_INTRO.text[0]} />
      <ProductCards noHead />
      <Subsystem />
      <SystemsChain />
      <CTA />
    </>
  )
}
