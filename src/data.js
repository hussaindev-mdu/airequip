import { asset } from './lib/asset'

export const BRAND = 'Air Equipment & Solutions'

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

export const products = [
  { tag: 'For consistent air demand', title: 'Fixed-speed compressors', text: 'Rugged, straightforward compressed air for steady production loads and long working shifts.', spec: '5–45 kW · 7–12.5 bar', img: asset('/images/fixed-speed.webp') },
  { tag: 'For changing air demand', title: 'Variable-speed compressors', text: 'VFD control matches output to real demand to reduce unloaded running and avoid wasted power.', spec: 'Demand matched · Energy focused', img: asset('/images/variable-speed.webp') },
  { tag: 'From source to machine', title: 'Complete air systems', text: 'Compressors, dryers, receivers, filters and piping selected as one dependable production system.', spec: '26–300 CFM · Turnkey support', img: asset('/images/Banner20180826.webp') },
]

export const bands = [
  { n: '01', t: 'Compact workshop', m: 'SL 5 / SL 7', s: '5–7 kW · 20–40 CFM', x: '270 / 500 L tank options' },
  { n: '02', t: 'Growing production', m: 'SL 11 / SL 15', s: '11–15 kW · 43–85 CFM', x: 'Tank or skid mounted' },
  { n: '03', t: 'Multi-machine line', m: 'SL 18 / SL 22', s: '18–22 kW · 65–130 CFM', x: '500 L tank or skid' },
  { n: '04', t: 'High-demand plant', m: 'SL 30 / 37 / 45', s: '30–45 kW · 125–280 CFM', x: 'Skid mounted' },
]

export const chain = [
  { t: 'Screw compressor', s: 'Fixed speed or VFD', d: 'Air starts here' },
  { t: 'Refrigerated dryer', s: '26–300 CFM', d: 'Moisture control' },
  { t: 'Air receiver', s: '500 / 1,000 litres', d: 'Stable pressure' },
  { t: 'Downstream filters', s: '29–281 CFM', d: 'Clean air' },
  { t: 'Air piping', s: 'Efficient distribution', d: 'To your machines' },
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
  { t: 'Packaging & plastics', d: 'Stable pressure for moulding, forming and packaging machinery.', img: asset('/images/packaging.webp') },
  { t: 'Ceramics, foundries & process', d: 'Dependable air for material handling, process control and demanding plant conditions.', img: asset('/images/ceramics.webp') },
  { t: 'Automotive & manufacturing', d: 'Practical systems for tools, paint, assembly and everyday workshop loads.', img: asset('/images/automotive.webp') },
  { t: 'Textiles & garment', d: 'Efficient air for looms, controls, cleaning and garment-production equipment.', img: asset('/images/textiles.webp') },
]

export const districts = ['Madurai', 'Dindigul', 'Theni', 'Sivaganga', 'Virudhunagar', 'Ramanathapuram', 'Tenkasi']
export const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const faqs = [
  ['How do I choose the correct compressor capacity?', 'We calculate the total air demand of your machines, operating pressure, duty cycle, simultaneous usage, leakage allowance and likely future expansion.'],
  ['Should I choose fixed speed or VFD?', 'Fixed speed suits steady demand. VFD is usually better when demand changes through the shift because output follows actual consumption.'],
  ['Why does my factory need a refrigerated dryer?', 'A dryer removes moisture from compressed air, protecting tools, valves, piping and finished products from water-related problems.'],
  ['What pressure options do VAYU compressors offer?', 'The common VAYU SL range is available across 7 to 12.5 bar. The correct pressure depends on the highest real requirement plus distribution losses.'],
  ['Do you provide installation and air piping?', 'Yes. We can supply the compressor, dryer, receiver, filters and efficient distribution piping as one complete system.'],
  ['Can you maintain an existing compressor?', 'We provide preventive maintenance, AMC support, genuine spares and breakdown diagnosis across our service area.'],
]

// TODO: replace with real company contact details
export const contact = {
  sales: '+91 00000 00000',
  service: '+91 00000 00001',
  whatsapp: '910000000000',
  email: 'sales@example.com',
}
