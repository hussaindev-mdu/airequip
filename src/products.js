import { asset } from './lib/asset'

/**
 * The VAYU range — product data taken from https://www.vayupower.com/products
 * (category pages: fixed-speed-compressors, variable-speed-compressors, dryers, filters, air-receivers).
 * Specifications are the manufacturer's and are "subject to change without prior notice".
 */

export const SPEC_NOTE = 'Due to continuous improvements, the specifications are subject to change without prior notice.'

export const RANGE_INTRO = {
  eyebrow: 'The VAYU range',
  title: 'Choose the right VAYU for your factory',
  lead: 'Reliable compressed air starts with a system built around your work.',
  text: [
    'Every manufacturing operation has its own air demand, production rhythm and working conditions. The VAYU range brings together fixed-speed and variable-speed screw compressors, refrigerated air dryers, downstream filters and air receivers.',
    'Each product has a clear role in helping deliver reliable airflow, efficient operation and simple ownership, so your factory can keep moving with confidence.',
  ],
}

/** "The VAYU Subsystem & Features" */
export const SUBSYSTEM = [
  { t: 'High-Performance Air End', d: 'Engineered for optimised airflow, durability and dependable performance through demanding operations.' },
  { t: 'Low Oil Carry-Over', d: 'An advanced separation system helps reduce oil carry-over while protecting downstream equipment.' },
  { t: 'High-Efficiency Motor', d: 'An IE3, Class F motor is designed around the compressor’s operating requirements for reliable performance.' },
  { t: 'Industrial-Grade Protection', d: 'Integrated safeguards and effective thermal management help protect critical electrical components.' },
  { t: 'Simple Monitoring', d: 'An intuitive controller makes operating information, alerts and diagnostics easier to understand.' },
]
export const SYSTEM_STATEMENT = {
  title: 'Built to work as one',
  text: 'The right combination of compression, air treatment and storage helps keep air reliable and production moving.',
}

/** Where each product sits in a complete system (used on the product pages). Order follows VAYU's guidance:
 *  compressor → receiver → dryer → filters. */
export const chain = [
  { t: 'Screw compressor', s: 'Fixed speed or VFD', d: 'Air starts here' },
  { t: 'Air receiver', s: '500 / 1,000 litres', d: 'Stable pressure' },
  { t: 'Refrigerated dryer', s: '26–300 CFM', d: 'Moisture control' },
  { t: 'Downstream filters', s: '29–281 CFM', d: 'Clean air' },
]

/* ---------------- spec tables ---------------- */

const COMPRESSOR_COLS = ['Model', 'Power (kW)', 'Pressure (bar g)', 'Flow (CFM)', 'Flow at minimum speed (VFD)', 'Noise (±3 dBA)', 'Weight (kg)', 'Air outlet (BSP)', 'L × B × H (mm)']
const COMPRESSOR_ROWS = [
  ['SL 5', '5', '7 / 8 / 9.5', '23 / 22 / 20', '9 / 9 / 8', '65', '200', 'G ¾"', '875 × 650 × 760'],
  ['SL 7', '7', '7 / 8 / 9.5 / 12.5', '40 / 38 / 27 / 24', '16 / 15 / 11 / 10', '65', '240', 'G ¾"', '875 × 650 × 760'],
  ['SL 11', '11', '7 / 8 / 9.5 / 12.5', '68 / 64 / 55 / 43', '27 / 27 / 21 / 17', '74', '365', 'G 1"', '1170 × 775 × 965'],
  ['SL 15', '15', '7 / 8 / 9.5 / 12.5', '85 / 80 / 68 / 58', '32 / 30 / 22 / 18', '74', '385', 'G 1"', '1170 × 775 × 965'],
  ['SL 18', '18', '7 / 8 / 9.5 / 12.5', '111 / 104 / 91 / 65', '40 / 36 / 33 / 27', '76', '395', 'G 1"', '1170 × 775 × 965'],
  ['SL 22', '22', '7 / 8 / 9.5 / 12.5', '130 / 127 / 104 / 83', '48 / 45 / 42 / 32', '76', '415', 'G 1"', '1170 × 775 × 965'],
  ['SL 30', '30', '7 / 8 / 9.5 / 12.5', '179 / 163 / 141 / 125', '69 / 62 / 55 / 49', '76', '590', 'G 1-1¼"', '1500 × 950 × 1200'],
  ['SL 37', '37', '7 / 8 / 9.5 / 12.5', '230 / 222 / 187 / 154', '90 / 85 / 75 / 62', '76', '665', 'G 1-1¼"', '1500 × 950 × 1200'],
  ['SL 45', '45', '7 / 8 / 9.5 / 12.5', '280 / 265 / 234 / 185', '112 / 109 / 75 / 62', '76', '830', 'G 1-1¼"', '1500 × 950 × 1200'],
]
const vfdRows = COMPRESSOR_ROWS.map(([m, ...rest]) => [`${m}V`, ...rest])

/* ---------------- the five products ---------------- */

export const PRODUCTS = [
  {
    slug: 'fixed-speed-compressors', kind: 'fixed', glow: '#ff7a1a',
    name: 'Fixed-Speed Screw Compressors', short: 'Fixed speed',
    tag: 'Steady air. Built for steady work.',
    cardText: 'Reliable airflow for operations with steady and continuous air demand.',
    bullets: ['5–45 kW power range', '7–12.5 bar pressure range', 'Base-mounted and tank-mounted configurations'],
    image: asset('/images/products/fixed-speed-compressors.webp'),
    lead: 'When your operation needs compressed air at a consistent rate, dependable performance matters every day. VAYU fixed-speed screw compressors run at a constant motor speed to deliver reliable airflow with simple operation and straightforward maintenance.',
    stats: [['Power range', '5–45 kW'], ['Pressure range', '7–12.5 bar'], ['Mounting', 'Base / tank']],
    highlightsTitle: 'Engineered for reliable air',
    highlights: [
      { t: 'Reliable airflow', d: 'Constant-speed operation supports consistent compressed air delivery when demand remains steady.' },
      { t: 'Built for continuous work', d: 'Designed to support long operating hours across demanding manufacturing applications.' },
      { t: 'Proven, straightforward design', d: 'Fixed-speed operation keeps everyday use simple and dependable.' },
      { t: 'Simple to operate and maintain', d: 'Clear controls and straightforward servicing help make routine ownership easier.' },
      { t: 'Protected for dependable performance', d: 'Integrated monitoring and safety functions help protect critical components during operation.' },
    ],
    tables: [{ title: 'Technical specifications', intro: 'Choose the model that fits your work and usage.', cols: COMPRESSOR_COLS, rows: COMPRESSOR_ROWS }],
    faqs: [
      ['Is this compressor suitable for my work?', 'Yes. It is designed for daily use in workshops and factories. It works reliably across a wide range of applications including machining, fabrication, food processing, and textile units. Call us with your requirements and we will help you pick the right model.'],
      ['What is a fixed speed compressor?', 'A fixed speed compressor runs its motor at a constant speed regardless of how much air is being used. It is ideal for operations with a steady, continuous demand for compressed air. These compressors are straightforward to operate, easy to maintain, and built for long service life.'],
      ['When should I choose variable speed instead?', 'Choose a variable speed compressor when your air demand changes significantly throughout the day. Variable speed drives adjust motor speed to match the exact demand, which can save energy when usage is inconsistent. For steady, high-demand operations, a fixed speed model is usually the better choice.'],
      ['What industries commonly use fixed speed compressors?', 'Fixed speed compressors are widely used in general engineering, auto parts manufacturing, textile spinning and weaving, food processing units, ceramics and tile factories, plastics and packaging lines, and foundries. Essentially, any industry that requires a reliable and constant supply of compressed air.'],
      ['What pressure ranges are available?', 'Our fixed speed compressors are available in pressure ranges of 7 Bar, 8 Bar, 9.5 Bar, and 12.5 Bar. Power output ranges from 5 KW to 45 KW. Both tank-mounted and skid-mounted configurations are available to suit your space and installation requirements.'],
    ],
    related: ['dryers', 'filters', 'air-receivers'], chainStep: 0,
  },
  {
    slug: 'variable-speed-compressors', kind: 'vfd', glow: '#3ea0ff',
    name: 'Variable-Speed Screw Compressors', short: 'Variable speed',
    tag: 'Air that follows your demand.',
    cardText: 'Output that adjusts to changing air demand, helping improve energy efficiency while maintaining dependable performance.',
    bullets: ['Variable-frequency drive (VFD) control', 'Demand-based air delivery', 'Efficient part-load operation'],
    image: asset('/images/products/variable-speed-compressors.webp'),
    lead: 'Compressed air demand rarely stays the same across every process and shift. VAYU variable-speed screw compressors use a variable-frequency drive to adjust motor speed and air delivery as demand changes. This helps reduce unnecessary energy use during lower-demand periods while supporting the reliable airflow your operation needs.',
    stats: [['Power range', '5–45 kW'], ['Pressure range', '7–12.5 bar'], ['Mounting', 'Base / tank']],
    highlightsTitle: 'Efficiency built around changing demand',
    highlights: [
      { t: 'Airflow suited to the demand', d: 'Compressor output adjusts as air requirements rise or fall across the working day.' },
      { t: 'Efficient part-load operation', d: 'Reduced motor speed during lower demand can help reduce unnecessary energy consumption.' },
      { t: 'Stable system pressure', d: 'Variable-speed control helps maintain steadier pressure as compressed air demand changes.' },
      { t: 'Smooth starting', d: 'Controlled motor acceleration helps reduce starting load on the electrical system.' },
      { t: 'Simple monitoring', d: 'An intuitive controller supports real-time monitoring, fault diagnostics and easier operation.' },
      { t: 'Built-in protection', d: 'Integrated safety functions help protect critical systems and support dependable performance.' },
    ],
    tables: [{ title: 'Technical specifications', intro: 'Choose the model that fits your work and usage.', cols: COMPRESSOR_COLS, rows: vfdRows }],
    faqs: [
      ['Is this compressor suitable for my work?', 'Yes. It is designed for daily use in workshops and factories, and suits operations where air demand varies across a shift. Call us with your requirements and we will help you pick the right model.'],
      ['What is a variable speed compressor?', 'A variable speed compressor uses a variable-frequency drive (VFD) to adjust motor speed in real time based on actual air demand, rather than running at one constant output. This helps reduce unnecessary energy use during lower-demand periods while still delivering reliable airflow when demand rises.'],
      ['When should I choose fixed speed instead?', 'If your operation runs at a steady, continuous demand for compressed air with little fluctuation, a fixed speed compressor is often the simpler choice. Variable speed delivers the most value when demand changes significantly throughout the day.'],
      ['What industries commonly use variable speed compressors?', 'Variable speed compressors suit operations with fluctuating or intermittent air demand — including general engineering, food processing, textile units, ceramics, and plastics and packaging — where usage varies across shifts and energy efficiency during low-demand periods matters.'],
      ['What power and pressure ranges are available?', 'Power and pressure ranges are matched to your VFD requirements. Share your target flow, pressure and duty cycle with our team, and we will help you select the right model.'],
    ],
    related: ['dryers', 'filters', 'air-receivers'], chainStep: 0,
  },
  {
    slug: 'dryers', kind: 'dryer', glow: '#38d5ff',
    name: 'Refrigerated Air Dryers', short: 'Air dryers',
    tag: 'Dry air that protects what comes next.',
    cardText: 'Clean, dry compressed air with reliable dew point performance and low operating losses.',
    bullets: ['26–300 CFM flow range', 'Stable dew point performance', 'Low operating losses'],
    image: asset('/images/products/dryers.webp'),
    lead: 'Moisture in compressed air can affect equipment, tools and process quality. VAYU refrigerated air dryers remove moisture while maintaining reliable dew point performance and low operating losses. Built-in control and protection features help the dryer perform consistently as part of your complete compressed air system.',
    stats: [['Flow range', '26–300 CFM'], ['Pressure dew point', 'Up to 3 °C']],
    highlightsTitle: 'Built to keep moisture out',
    highlights: [
      { t: 'Stable dew point', d: 'Helps maintain consistent drying performance across normal operating conditions.' },
      { t: 'Downstream protection', d: 'Reducing moisture helps protect pneumatic tools, equipment and production processes.' },
      { t: 'Hot-gas bypass control', d: 'Helps maintain stable operation when compressed air demand changes.' },
      { t: 'Compressor protection', d: 'High- and low-pressure switches help protect the refrigeration circuit.' },
      { t: 'Zero-loss drain', d: 'Removes collected condensate without unnecessary loss of compressed air.' },
    ],
    tables: [{
      title: 'Technical specifications', intro: 'Choose the dryer configuration that matches your airflow and operating requirements.',
      cols: ['Model', 'Inlet flow (CFM)', 'Weight (kg)', 'Inlet / outlet (BSP)', 'L × B × H (mm)'],
      rows: [
        ['DR 25', '26', '40', '½"', '387 × 581 × 499'], ['DR 40', '40', '45', '½"', '475 × 580 × 500'],
        ['DR 70', '68', '50', '1"', '430 × 600 × 560'], ['DR 85', '85', '50', '1"', '430 × 600 × 560'],
        ['DR 130', '130', '60', '1-¼"', '416 × 332 × 1295'], ['DR 180', '179', '70', '1-¼"', '416 × 350 × 1320'],
        ['DR 230', '230', '90', '1-¼"', '500 × 405 × 1500'], ['DR 280', '280', '90', '1-¼"', '500 × 405 × 1500'],
        ['DR 300', '300', '110', '1-½"', '600 × 454 × 1496'],
      ],
    }],
    faqs: [
      ['Is this dryer suitable for my work?', 'Yes. It is designed for daily use in workshops and factories. It works reliably across a wide range of applications including machining, fabrication, food processing, and textile units. Call us with your requirements and we will help you pick the right model.'],
      ['What is a refrigerated air dryer?', 'A refrigerated air dryer removes moisture from compressed air by cooling it to near freezing point, causing water vapour to condense and drain away. This protects your equipment and processes from corrosion, contamination, and damage caused by wet air.'],
      ['Do I need a dryer with my compressor?', 'In most industrial applications, yes. Compressed air always contains moisture. Without a dryer, this moisture can corrode pipework, damage tools and machines, and contaminate products. A dryer extends the life of your system and improves output quality.'],
      ['What industries use air dryers?', 'Air dryers are used in general engineering, auto parts manufacturing, textile units, food processing, ceramics, plastics and packaging lines, and pharmaceuticals. Any industry where clean, dry compressed air is critical to product quality or equipment reliability benefits from a dryer.'],
      ['What flow rates are available?', 'Our dryers are available across a range of flow capacities to match compressors from 5 KW to 45 KW. Contact us with your compressor model and we will recommend the right dryer size for your application.'],
    ],
    related: ['fixed-speed-compressors', 'variable-speed-compressors', 'filters'], chainStep: 2,
  },
  {
    slug: 'filters', kind: 'filters', glow: '#ffb347',
    name: 'Downstream Filters', short: 'Filters',
    tag: 'Filtration that protects performance.',
    cardText: 'Efficient filtration with low pressure drop, helping protect downstream equipment and processes.',
    bullets: ['29–281 CFM flow range', 'Up to 16 bar operating pressure', 'Pre-filter, fine-filter and activated-carbon grades'],
    image: asset('/images/products/filters.webp'),
    lead: 'Oil, moisture aerosols and particulates can affect downstream equipment and process quality. VAYU downstream filters deliver efficient filtration with a low pressure drop, helping maintain air quality without placing unnecessary resistance on the system. Three filter grades allow the treatment system to be selected around the needs of your application.',
    stats: [['Flow range', '29–281 CFM'], ['Operating pressure', 'Up to 16 bar'], ['Grades', 'Pre / Fine / Carbon']],
    highlightsTitle: 'Cleaner air. Less resistance.',
    highlights: [
      { t: 'Efficient particle removal', d: 'Pre-filter and fine-filter grades help remove solid particulates from compressed air.' },
      { t: 'Reduced oil carry-over', d: 'Pre, Fine and Activated-Carbon grades help reduce oil carry-over based on the required air quality.' },
      { t: 'Low pressure drop', d: 'An optimised flow path helps maintain efficient filtration without unnecessary pressure loss.' },
      { t: 'High-performance media', d: 'Micro-glass nanofibre media supports effective contaminant removal.' },
      { t: 'Durable construction', d: 'The filter element is designed to maintain integrity through demanding operation.' },
      { t: 'Three filtration grades', d: 'Choose pre-filtration, fine filtration, or activated-carbon treatment to match your process requirement.' },
    ],
    tables: [
      {
        title: 'Types of filter grades', intro: 'Choose the filter grade that matches your required air quality.',
        cols: ['Filter type', 'Particle removal (µm)', 'Max. oil carry-over (mg/m³)', 'Max. inlet air temperature', 'Recommended element replacement'],
        rows: [
          ['FP – Pre filter', '1', '0.1', '80 °C', '3000 hours or 6 months, whichever is earlier'],
          ['FF – Fine filter', '0.1', '0.01', '80 °C', '3000 hours or 6 months, whichever is earlier'],
          ['FC – Activated carbon filter', '—', '0.003', '50 °C', '6 months'],
        ],
      },
      {
        title: 'Technical specifications', intro: 'Choose the flow capacity that matches your system requirements.',
        cols: ['Model', 'End connection (BSP inch)', 'Flow rate @ 7 bar (CFM)', 'A (mm)', 'B (mm)', 'H (mm)', 'Max. operating pressure (bar)'],
        rows: [
          ['FP/FF/FC 29', '¼"', '29', '87', '80', '179', '16'], ['FP/FF/FC 41', '⅜"', '41', '87', '80', '179', '16'],
          ['FP/FF/FC 68', '½"', '68', '87', '80', '249', '16'], ['FP/FF/FC 112', '¾"', '112', '121', '130', '285', '16'],
          ['FP/FF/FC 181', '1"', '181', '121', '130', '385', '16'], ['FP/FF/FC 281', '1-½"', '281', '121', '130', '485', '16'],
        ],
      },
    ],
    faqs: [
      ['Do I need a filter with my compressor?', 'Yes. All compressed air systems produce contaminants — including dust, rust, water droplets, and compressor oil — that can damage equipment and affect product quality. Filters remove these before the air reaches your tools, machines, or processes.'],
      ['What types of filters are available?', 'We offer particulate filters to remove solid particles and dust, coalescing filters to separate oil and water aerosols, high-efficiency filters for fine contamination, and activated carbon filters to remove oil vapour and odours. Most systems use a combination depending on the application.'],
      ['How often should I change the filter element?', 'Filter elements typically need replacing every 6 to 12 months depending on usage, air quality, and operating conditions. A clogged element increases pressure drop across your system and reduces efficiency. Our service team can advise on a maintenance schedule for your specific setup.'],
      ['What filter grade do I need?', 'The right grade depends on your application. General workshop tools usually need a basic particulate filter. Spray painting, food processing, and pharmaceutical applications require oil-free air and benefit from coalescing and activated carbon filters. Contact us with your application and we will recommend the correct grade.'],
      ['Can I use filters with my existing dryer setup?', 'Yes. Filters and dryers work together. A pre-filter before the dryer protects the dryer from bulk contamination, and a post-filter after the dryer removes any remaining particles or oil carryover. VAYU filters are designed to pair directly with our dryer range.'],
    ],
    related: ['dryers', 'air-receivers', 'fixed-speed-compressors'], chainStep: 3,
  },
  {
    slug: 'air-receivers', kind: 'receiver', glow: '#9aa7ff',
    name: 'Vertical Air Receivers', short: 'Air receivers',
    tag: 'Storage that strengthens the system.',
    cardText: 'Safe compressed air storage with robust construction that helps support a stable air supply.',
    bullets: ['500 and 1,000 litre capacities', '10 and 12.5 bar working-pressure options', 'Designed in accordance with IS 2825 standards'],
    image: asset('/images/products/air-receivers.webp'),
    lead: 'Compressed air demand can rise and fall throughout the working day. VAYU vertical air receivers store compressed air and help balance these fluctuations, supporting steadier system pressure and more dependable air availability. Robust construction and standards-based design make them a reliable part of a complete compressed air system.',
    stats: [['Capacity', '500 & 1,000 L'], ['Working pressure', '10 & 12.5 bar'], ['Design standard', 'IS 2825']],
    highlightsTitle: 'Built for a steadier air supply',
    highlights: [
      { t: 'Stored air availability', d: 'Provides a reserve of compressed air to support short-term changes in demand.' },
      { t: 'Steadier system pressure', d: 'Helps reduce pressure fluctuations across the compressed air network.' },
      { t: 'Demand management', d: 'Supports the system when air consumption briefly rises above normal operating demand.' },
      { t: 'Reduced compressor cycling', d: 'When correctly sized, stored air can help reduce frequent loading and unloading of the compressor.' },
      { t: 'Robust construction', d: 'Designed to withstand the stated working pressure across demanding industrial applications.' },
      { t: 'Standards-based design', d: 'Designed in accordance with IS 2825* requirements for compressed air storage.' },
    ],
    tables: [{
      title: 'Technical specifications', intro: 'Choose the receiver capacity that matches your compressor output and demand profile.',
      cols: ['Model', 'Capacity', 'Max. working pressure (bar)', 'End connection', 'Height (mm)', 'Diameter (mm)', 'Shell thickness (mm)', 'Dish thickness (mm)', 'Weight approx. (kg)'],
      rows: [
        ['TA 500-10', '500 Ltr', '10', '1-½" NPT', '2110', '600', '5', '5', '190'],
        ['TA 500-12.5', '500 Ltr', '12.5', '1-½" NPT', '2060', '622', '6', '6', '225'],
        ['TA 1000-10', '1000 Ltr', '10', '2" NPT', '2750', '750', '6', '8', '355'],
        ['TA 1000-12.5', '1000 Ltr', '12.5', '2" NPT', '2750', '750', '8', '8', '436'],
      ],
    }],
    faqs: [
      ['What is an air receiver and why do I need one?', 'An air receiver is a storage tank that holds compressed air between the compressor and your tools or processes. It smooths out demand peaks, reduces how often the compressor starts and stops, and gives the system time to separate moisture before air reaches downstream equipment. Most installations benefit from one.'],
      ['What size receiver do I need?', 'A general guideline is 6–10 litres of receiver capacity per CFM of compressor output. A 5 KW compressor producing around 22 CFM would typically suit a 100–200 litre receiver. If your demand is uneven or you have high-use bursts, a larger receiver reduces compressor cycling significantly. Call us and we will size it correctly for your setup.'],
      ['Does an air receiver replace a dryer or filter?', 'No — they serve different purposes. The receiver stores air and separates bulk moisture by gravity, but it does not dry or filter the air to the level needed for most industrial processes. A dryer and filters should still be used downstream of the receiver for clean, dry compressed air.'],
      ['How often should I drain the receiver?', 'Manual drain valves should be opened at the end of each working shift. If that is inconvenient, an automatic drain valve can be fitted to the bottom of the tank to discharge condensate on a timer or on pressure differential. We can supply and fit automatic drains on request.'],
      ['Are the receivers pressure-tested and certified?', 'Yes. All VAYU air receivers are hydrostatically pressure-tested before dispatch and are built to meet applicable pressure vessel standards. Each unit ships with a test certificate. Contact us for full certification documentation for your installation or inspection requirements.'],
    ],
    related: ['fixed-speed-compressors', 'variable-speed-compressors', 'dryers'], chainStep: 1,
  },
]

export const getProduct = (slug) => PRODUCTS.find((p) => p.slug === slug)
