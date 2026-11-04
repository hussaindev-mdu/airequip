import { bands, chain } from '../data'

// The five parts of a complete compressed-air system, in the order the camera visits them.
export const COLLECTION = [
  {
    id: 'fixed-speed', kind: 'fixed', name: 'Fixed-speed compressor', short: 'Fixed speed', tag: 'For consistent air demand', glow: '#ff7a1a', step: 0,
    lead: 'Rugged, straightforward compressed air for steady production loads and long working shifts.',
    specs: [['Power', '5–45 kW'], ['Pressure', '7–12.5 bar'], ['Control', 'Fixed speed'], ['Mounting', 'Tank or skid']],
    features: ['Suited to steady, consistent production loads', 'Simple, rugged design for long working shifts', 'SL range available across 7–12.5 bar', 'Tank-mounted or skid-mounted, depending on model'],
    sizes: 'bands',
    note: 'Final sizing depends on demand, duty cycle and pressure losses — we confirm it with a site survey.',
  },
  {
    id: 'variable-speed', kind: 'vfd', name: 'Variable-speed compressor', short: 'Variable speed', tag: 'For changing air demand', glow: '#3ea0ff', step: 0,
    lead: 'VFD control matches output to real demand to reduce unloaded running and avoid wasted power.',
    specs: [['Control', 'VFD'], ['Output', 'Demand matched'], ['Focus', 'Energy saving'], ['Best for', 'Changing demand']],
    features: ['Output follows actual consumption as machines start and stop', 'Reduces unloaded running', 'Avoids wasted power', 'The usual choice when demand varies through the shift'],
    sizes: 'bands',
    note: 'Choose VFD to match output as machines start and stop. Fixed speed is usually the better fit for steady demand.',
  },
  {
    id: 'refrigerated-dryer', kind: 'dryer', name: 'Refrigerated air dryer', short: 'Air dryer', tag: 'Moisture control', glow: '#38d5ff', step: 1,
    lead: 'Removes moisture from compressed air, protecting tools, valves, piping and finished products from water-related problems.',
    specs: [['Capacity', '26–300 CFM'], ['Role', 'Moisture control'], ['Position', 'After compressor'], ['Part of', 'Complete system']],
    features: ['Removes moisture from compressed air', 'Protects tools, valves, piping and finished products', 'Improves compressed-air reliability', 'Selected together with the compressor as one system'],
    sizes: ['26–300 CFM dryer range'],
    note: 'Dryer capacity is matched to the compressor’s output and your working conditions.',
  },
  {
    id: 'air-receiver', kind: 'receiver', name: 'Air receiver', short: 'Air receiver', tag: 'Stable pressure', glow: '#9aa7ff', step: 2,
    lead: 'Stores compressed air and steadies line pressure, so machines see a stable supply even when demand spikes.',
    specs: [['Capacity', '500 / 1,000 L'], ['Role', 'Stable pressure'], ['Position', 'After dryer'], ['Part of', 'Complete system']],
    features: ['Stabilises pressure across the plant', 'Available in 500 and 1,000 litre sizes', 'Helps the compressor cycle less often', 'Supplied as part of a complete air system'],
    sizes: ['500 litres', '1,000 litres'],
    note: 'We size the receiver to your demand pattern and compressor capacity.',
  },
  {
    id: 'filters', kind: 'filters', name: 'Downstream filters', short: 'Filters', tag: 'Clean air', glow: '#ffb347', step: 3,
    lead: 'Final air treatment right before your machines — clean air for tools, process lines and finished products.',
    specs: [['Capacity', '29–281 CFM'], ['Role', 'Clean air'], ['Position', 'Before machines'], ['Part of', 'Complete system']],
    features: ['Improves compressed-air quality at the point of use', 'Protects downstream equipment', '29–281 CFM range', 'Specified alongside the dryer and receiver'],
    sizes: ['29–281 CFM filter range'],
    note: 'Filtration grade is chosen for your application — from general workshop use to process air.',
  },
]

export { bands, chain }
