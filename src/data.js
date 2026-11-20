import { asset } from './lib/asset'

export const BRAND = 'Air Equipments & Solutions'

export const nav = [
  { label: 'Products', to: '/products' },
  { label: 'Collection', to: '/collection' },
  { label: 'Services', to: '/services' },
  { label: 'Industries', to: '/industries' },
  { label: 'Locations', to: '/locations' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const stats = [
  { v: '5–45 kW', l: 'Compressor range' },
  { v: '7–12.5 bar', l: 'Pressure options' },
  { v: '26–300 CFM', l: 'Dryer capacity' },
  { v: '7 districts', l: 'Local support' },
]

export const services = [
  { t: 'Site survey & system sizing', d: 'Airflow, pressure, duty cycle and future demand — measured, not guessed.' },
  { t: 'Installation & commissioning', d: 'Neat, safe installation with full commissioning and operator hand-over.' },
  { t: 'Preventive maintenance & AMC', d: 'Planned visits that keep efficiency up and surprises down.' },
  { t: 'Genuine spares & service kits', d: 'Original filters, oils and kits delivered when you need them.' },
  { t: 'Breakdown diagnosis & support', d: 'A local team that knows your system and reaches your site fast.' },
]

export const industries = [
  { t: 'Engineering & fabrication', d: 'CNC machining, fabrication, pneumatic tools and continuous production.', img: asset('/images/machining.webp') },
  { t: 'Food & process', d: 'Reliable treated air for process lines, handling and packaging.', img: asset('/images/food-processing.webp') },
  { t: 'Packaging & plastics', d: 'Stable pressure for moulding, forming and packaging machinery.', img: asset('/images/plastics.webp') },
  { t: 'Ceramics, foundries & process', d: 'Dependable air for material handling, process control and demanding plant conditions.', img: asset('/images/ceramics.webp') },
  { t: 'Automotive & manufacturing', d: 'Practical systems for tools, paint, assembly and everyday workshop loads.', img: asset('/images/garage.webp') },
  { t: 'Textiles & garment', d: 'Efficient air for looms, controls, cleaning and garment-production equipment.', img: asset('/images/textiles.webp') },
  { t: 'Grains & pulses colour sorting', d: 'Dependable compressed air for grain and pulse colour-sorting applications.', img: asset('/images/grains-pulses.webp') },
]

export const districts = ['Madurai', 'Dindigul', 'Theni', 'Sivaganga', 'Virudhunagar', 'Ramanathapuram', 'Tenkasi']
export const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const faqs = [
  ['How do I choose the correct compressor capacity?', 'We calculate the total air demand of your machines, operating pressure, duty cycle, simultaneous usage, leakage allowance and likely future expansion.'],
  ['Should I choose fixed speed or VFD?', 'Fixed speed suits steady demand. VFD is usually better when demand changes through the shift because output follows actual consumption.'],
  ['Why does my factory need a refrigerated dryer?', 'A dryer removes moisture from compressed air, protecting tools, valves and finished products from water-related problems.'],
  ['What pressure options do VAYU compressors offer?', 'The common VAYU SL range is available across 7 to 12.5 bar. The correct pressure depends on the highest real requirement plus distribution losses.'],
  ['Can you supply a complete system?', 'Yes. We can supply the VAYU compressor, dryer, receiver and filters together, selected to work as one complete compressed-air system.'],
  ['Can you maintain an existing compressor?', 'We provide preventive maintenance, AMC support, genuine spares and breakdown diagnosis across our service area.'],
]

// Company contact numbers (India, +91). Email is intentionally not listed until a real address is provided.
const intl = (n) => `+91 ${n.slice(0, 5)} ${n.slice(5)}`
const tel = (n) => `+91${n}`
export const contact = {
  salesService: { label: 'Sales & Service', display: intl('9514149505'), tel: tel('9514149505') },
  pipeline: { label: 'PPR Pipeline', display: intl('9514149504'), tel: tel('9514149504') },
  whatsapp: { label: 'WhatsApp', display: intl('9514149505'), number: '919514149505', href: 'https://wa.me/919514149505' },
}
