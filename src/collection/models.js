import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/* ---------- materials ---------- */
export function makeMaterials() {
  const std = (o) => new THREE.MeshStandardMaterial(o)
  const phys = (o) => new THREE.MeshPhysicalMaterial(o)
  return {
    orange: phys({ color: '#ff5f00', metalness: 0.25, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08 }),
    black: std({ color: '#0c0d10', metalness: 0.6, roughness: 0.36 }),
    charcoal: phys({ color: '#252830', metalness: 0.45, roughness: 0.5, clearcoat: 0.4, clearcoatRoughness: 0.3 }),
    tank: phys({ color: '#aab1bc', metalness: 0.35, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.06 }),
    recv: phys({ color: '#2b2e36', metalness: 0.55, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.1 }),
    steel: std({ color: '#c3c8d1', metalness: 1, roughness: 0.26 }),
    brass: std({ color: '#d29a4a', metalness: 1, roughness: 0.3 }),
    rubber: std({ color: '#050506', metalness: 0, roughness: 0.9 }),
    red: std({ color: '#c71414', metalness: 0.2, roughness: 0.4 }),
    yellow: std({ color: '#f2c200', metalness: 0.2, roughness: 0.5 }),
    white: new THREE.MeshBasicMaterial({ color: '#f4f4f4' }),
    screen: (() => { const t = screenTexture(); return std({ color: '#02131a', map: t, emissive: '#ffffff', emissiveMap: t, emissiveIntensity: 1.1, roughness: 0.25 }) })(),
    ledBlue: std({ color: '#06121f', emissive: '#3ea0ff', emissiveIntensity: 2.4 }),
    ledGreen: std({ color: '#04120a', emissive: '#27e072', emissiveIntensity: 2 }),
    anodBlue: phys({ color: '#2b66e8', metalness: 0.85, roughness: 0.25, clearcoat: 0.5 }),
    anodOrange: phys({ color: '#ff6a00', metalness: 0.85, roughness: 0.25, clearcoat: 0.5 }),
  }
}

function screenTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 160
  const g = c.getContext('2d')
  g.fillStyle = '#031219'; g.fillRect(0, 0, 256, 160)
  g.fillStyle = '#38d5ff'; g.font = '700 20px Inter, system-ui, sans-serif'; g.fillText('VAYU', 14, 28)
  g.fillStyle = '#27e072'; g.beginPath(); g.arc(236, 22, 6, 0, 7); g.fill()
  g.fillStyle = '#e9fbff'; g.font = '700 54px Sora, Inter, system-ui, sans-serif'; g.fillText('7.5', 14, 92)
  g.fillStyle = '#38d5ff'; g.font = '600 20px Inter, system-ui, sans-serif'; g.fillText('bar', 118, 92)
  g.fillStyle = 'rgba(56,213,255,.25)'; g.fillRect(14, 112, 228, 8)
  g.fillStyle = '#38d5ff'; g.fillRect(14, 112, 150, 8)
  g.fillStyle = 'rgba(233,251,255,.7)'; g.font = '500 15px Inter, system-ui, sans-serif'; g.fillText('RUNNING · LOADED', 14, 146)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}

function plateMaterial(text, sub) {
  return new THREE.MeshBasicMaterial({ map: plateTexture(text, sub), toneMapped: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 })
}

function plateTexture(text, sub) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 320
  const g = c.getContext('2d'); g.scale(2, 2)
  g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, 512, 160)
  g.fillStyle = '#ff6a00'; g.beginPath(); g.moveTo(36, 40); g.lineTo(76, 40); g.lineTo(96, 100); g.lineTo(116, 40); g.lineTo(156, 40); g.lineTo(106, 126); g.lineTo(86, 126); g.closePath(); g.fill()
  g.fillStyle = '#ffffff'; g.textBaseline = 'middle'; g.font = '800 78px Sora, Inter, system-ui, sans-serif'; g.fillText(text, 186, sub ? 66 : 84)
  if (sub) { g.fillStyle = '#ffb27a'; g.font = '600 30px Inter, system-ui, sans-serif'; g.fillText(sub, 190, 124) }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t
}

/* ---------- little builders ---------- */
function kit(M) {
  const g = new THREE.Group()
  const add = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); g.add(m); return m }
  const box = (w, h, d, mat, x, y, z, r = 0.02) => add(new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)), mat, x, y, z)
  const cyl = (rt, rb, h, mat, x, y, z, seg = 40) => add(new THREE.CylinderGeometry(rt, rb, h, seg), mat, x, y, z)
  const tor = (R, r, mat, x, y, z, rx = 0, ry = 0) => { const m = add(new THREE.TorusGeometry(R, r, 12, 56), mat, x, y, z); m.rotation.set(rx, ry, 0); return m }
  const plate = (w, text, sub, x, y, z) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 0.3125), plateMaterial(text, sub))
    m.position.set(x, y, z); m.renderOrder = 2; g.add(m); return m
  }
  // nameplate wrapped around a round tank so it hugs the curve instead of floating off it
  const wrapPlate = (w, text, sub, radius, x, y) => {
    const len = w / radius
    const m = new THREE.Mesh(new THREE.CylinderGeometry(radius + 0.006, radius + 0.006, w * 0.3125, 48, 1, true, -len / 2, len), plateMaterial(text, sub))
    m.position.set(x, y, 0); m.renderOrder = 2; g.add(m); return m
  }
  const dial = (r, x, y, z) => { // pressure gauge facing +z
    cyl(r, r, 0.04, M.steel, x, y, z, 40).rotation.x = Math.PI / 2
    const face = new THREE.Mesh(new THREE.CircleGeometry(r * 0.86, 40), M.white); face.position.set(x, y, z + 0.022); g.add(face)
    const nd = new THREE.Mesh(new THREE.BoxGeometry(0.008, r * 0.7, 0.004), new THREE.MeshBasicMaterial({ color: '#d11' })); nd.position.set(x + r * 0.15, y + r * 0.22, z + 0.026); nd.rotation.z = -0.7; g.add(nd)
  }
  const fan = (R, x, y, z, vertical) => { // blades in a group that the engine spins
    const grp = new THREE.Group(); grp.position.set(x, y, z)
    for (let i = 0; i < 7; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(R * 0.28, R * 0.92, 0.012), M.charcoal)
      const a = (i / 7) * Math.PI * 2; b.position.set(Math.sin(a) * R * 0.42, Math.cos(a) * R * 0.42, 0); b.rotation.z = -a; b.rotation.x = 0.25; grp.add(b)
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.16, R * 0.16, 0.05, 24), M.orange); hub.rotation.x = Math.PI / 2; grp.add(hub)
    if (vertical) grp.rotation.x = -Math.PI / 2
    const holder = new THREE.Group(); holder.add(grp); holder.position.copy(grp.position); grp.position.set(0, 0, 0); g.add(holder)
    return { obj: grp, axis: 'z', speed: 9 }
  }
  const grille = (R, x, y, z, vertical) => {
    const grp = new THREE.Group(); grp.position.set(x, y, z)
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(R, 0.016, 10, 56), M.steel))
    ;[0.34, 0.62, 0.9].forEach((k) => grp.add(new THREE.Mesh(new THREE.TorusGeometry(R * k, 0.006, 8, 48), M.steel)))
    for (let i = 0; i < 4; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(R * 2, 0.01, 0.01), M.steel); s.rotation.z = (i * Math.PI) / 4; grp.add(s) }
    if (vertical) grp.rotation.x = -Math.PI / 2
    g.add(grp)
  }
  return { g, add, box, cyl, tor, plate, wrapPlate, dial, fan, grille }
}

/* ---------- the five machines ---------- */
function fixedSpeed(M) {
  const { g, add, box, cyl, tor, plate, dial, fan, grille } = kit(M); const spin = []
  const tank = add(new THREE.CapsuleGeometry(0.42, 2.0, 16, 56), M.tank, 0, 0.62, 0); tank.rotation.z = Math.PI / 2
  ;[-0.85, 0.85].forEach((x) => box(0.22, 0.2, 0.7, M.black, x, 0.1, 0, 0.03))
  ;[-0.9, 0.9].forEach((x) => tor(0.427, 0.012, M.steel, x, 0.62, 0, 0, Math.PI / 2))
  box(1.7, 0.05, 0.92, M.black, -0.28, 1.075, 0, 0.01)
  box(1.55, 0.96, 0.86, M.black, -0.28, 1.58, 0, 0.05)
  box(0.78, 0.9, 0.03, M.orange, 0.105, 1.58, 0.445, 0.012)
  box(1.55, 0.9, 0.03, M.orange, -0.28, 1.58, -0.445, 0.012)
  box(0.03, 0.9, 0.84, M.orange, 0.5, 1.58, 0, 0.012); box(0.03, 0.9, 0.84, M.orange, -1.06, 1.58, 0, 0.012)
  box(1.6, 0.04, 0.9, M.charcoal, -0.28, 2.08, 0, 0.01)
  box(0.42, 0.24, 0.014, M.black, 0.105, 1.8, 0.466, 0.01); box(0.37, 0.19, 0.014, M.screen, 0.105, 1.8, 0.472, 0.005)
  plate(0.34, 'VAYU', '', 0.105, 1.97, 0.474)
  ;[M.ledGreen, M.white, M.white].forEach((m, i) => cyl(0.02, 0.02, 0.014, m, 0.0 + i * 0.1, 1.6, 0.466, 24).rotation.x = Math.PI / 2)
  cyl(0.05, 0.05, 0.014, M.yellow, 0.34, 1.42, 0.466, 32).rotation.x = Math.PI / 2
  cyl(0.032, 0.032, 0.035, M.red, 0.34, 1.42, 0.478, 32).rotation.x = Math.PI / 2
  for (let i = 0; i < 4; i++) box(0.56, 0.014, 0.016, M.black, 0.105, 1.26 - i * 0.05, 0.466, 0.004)
  add(new THREE.CylinderGeometry(0.31, 0.31, 0.02, 56), M.black, -0.67, 1.58, 0.445).rotation.x = Math.PI / 2
  grille(0.31, -0.67, 1.58, 0.462); spin.push(fan(0.28, -0.67, 1.58, 0.452))
  cyl(0.012, 0.012, 0.12, M.brass, 0.95, 1.1, 0.02, 16); dial(0.065, 0.95, 1.2, 0.02)
  cyl(0.022, 0.022, 0.1, M.brass, 0.65, 1.09, -0.05, 20); cyl(0.034, 0.03, 0.04, M.steel, 0.65, 1.15, -0.05, 20)
  cyl(0.05, 0.05, 0.12, M.steel, 1.46, 0.62, 0, 24).rotation.z = Math.PI / 2
  box(0.1, 0.014, 0.016, M.red, 1.52, 0.7, 0.07, 0.004)
  g.userData.spin = spin; return g
}

function vfd(M) {
  const { g, add, box, cyl, tor, plate, dial, fan, grille } = kit(M); const spin = []
  box(1.9, 0.12, 1.3, M.black, 0, 0.06, 0, 0.02)
  ;[-0.8, 0.8].forEach((x) => [-0.5, 0.5].forEach((z) => box(0.14, 0.08, 0.14, M.rubber, x, 0.02, z, 0.02)))
  box(1.6, 1.95, 1.15, M.black, 0, 1.095, 0, 0.05)
  box(1.05, 1.8, 0.03, M.orange, 0.22, 1.1, 0.585, 0.014)
  box(1.6, 1.8, 0.03, M.orange, 0, 1.1, -0.585, 0.014)
  box(0.03, 1.8, 1.12, M.orange, 0.815, 1.1, 0, 0.014); box(0.03, 1.8, 1.12, M.orange, -0.815, 1.1, 0, 0.014)
  for (let i = 0; i < 14; i++) box(0.4, 0.028, 0.02, M.black, -0.56, 0.45 + i * 0.1, 0.59, 0.006)
  box(0.036, 1.3, 0.016, M.ledBlue, -0.31, 1.1, 0.6, 0.006)
  box(0.62, 0.36, 0.016, M.black, 0.22, 1.62, 0.605, 0.012); box(0.56, 0.3, 0.016, M.screen, 0.22, 1.62, 0.612, 0.006)
  plate(0.5, 'VAYU', 'VFD', 0.22, 1.95, 0.614)
  ;[M.ledGreen, M.white, M.white, M.white].forEach((m, i) => cyl(0.022, 0.022, 0.016, m, 0.02 + i * 0.12, 1.3, 0.6, 24).rotation.x = Math.PI / 2)
  cyl(0.055, 0.055, 0.016, M.yellow, 0.56, 1.02, 0.6, 32).rotation.x = Math.PI / 2
  cyl(0.036, 0.036, 0.04, M.red, 0.56, 1.02, 0.614, 32).rotation.x = Math.PI / 2
  box(0.5, 0.012, 0.016, M.black, 0.22, 0.78, 0.6, 0.004); box(0.5, 0.012, 0.016, M.black, 0.22, 0.72, 0.6, 0.004); box(0.5, 0.012, 0.016, M.black, 0.22, 0.66, 0.6, 0.004)
  box(1.6, 0.3, 1.15, M.charcoal, 0, 2.22, 0, 0.05)
  add(new THREE.CylinderGeometry(0.46, 0.46, 0.02, 56), M.black, 0, 2.375, 0)
  grille(0.46, 0, 2.39, 0, true); spin.push(fan(0.42, 0, 2.381, 0, true))
  ;[1.82, 1.66].forEach((y) => { cyl(0.04, 0.04, 0.12, M.steel, -0.86, y, 0.2, 20).rotation.z = Math.PI / 2 })
  g.userData.spin = spin; return g
}

function dryer(M) {
  const { g, add, box, cyl, tor, plate, dial, fan, grille } = kit(M)
  box(1.4, 0.1, 1.05, M.black, 0, 0.05, 0, 0.02)
  ;[-0.55, 0.55].forEach((x) => [-0.4, 0.4].forEach((z) => box(0.12, 0.07, 0.12, M.rubber, x, 0.015, z, 0.02)))
  box(1.3, 1.35, 0.95, M.charcoal, 0, 0.78, 0, 0.06)
  box(1.32, 0.16, 0.97, M.orange, 0, 1.28, 0, 0.04)
  box(0.34, 0.1, 0.012, M.black, -0.36, 1.28, 0.49, 0.008)
  plate(0.38, 'VAYU', '', -0.36, 1.28, 0.502)
  box(0.62, 0.34, 0.016, M.black, 0.15, 0.95, 0.485, 0.012); box(0.56, 0.28, 0.016, M.screen, 0.15, 0.95, 0.492, 0.006)
  ;[M.ledGreen, M.white].forEach((m, i) => cyl(0.022, 0.022, 0.016, m, -0.3 + i * 0.1, 0.9, 0.485, 24).rotation.x = Math.PI / 2)
  for (let i = 0; i < 8; i++) box(0.72, 0.016, 0.018, M.black, 0, 0.55 - i * 0.055, 0.485, 0.005)
  for (let i = 0; i < 12; i++) box(0.018, 1.0, 0.016, M.black, 0.667, 0.72, -0.28 + i * 0.05, 0.004)
  box(1.34, 0.04, 0.99, M.black, 0, 1.38, 0, 0.012)
  for (let i = 0; i < 9; i++) box(0.9, 0.012, 0.02, M.black, 0, 1.4, -0.35 + i * 0.088, 0.003)
  ;[-0.35, 0.35].forEach((x) => { cyl(0.05, 0.05, 0.3, M.steel, x, 1.54, -0.3, 24); cyl(0.065, 0.065, 0.05, M.steel, x, 1.4, -0.3, 24); cyl(0.05, 0.05, 0.3, M.steel, x, 1.69, -0.3, 24).rotation.z = Math.PI / 2 })
  dial(0.05, 0.4, 0.62, 0.482)
  g.userData.spin = []; return g
}

function receiver(M) {
  const { g, add, box, cyl, tor, plate, wrapPlate, dial } = kit(M)
  const H = 1.35, R = 0.55, cy = 0.3 + H / 2 + R
  add(new THREE.CapsuleGeometry(R, H, 18, 64), M.recv, 0, cy, 0)
  ;[-0.52, 0.52].forEach((dy) => tor(R + 0.005, 0.014, M.steel, 0, cy + dy * (H / 2 / 0.52) * 0.95, 0, Math.PI / 2, 0))
  for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2 + 0.5; box(0.12, 0.34, 0.12, M.black, Math.cos(a) * 0.42, 0.17, Math.sin(a) * 0.42, 0.02) }
  tor(0.2, 0.025, M.steel, 0, cy + 0.15, R - 0.01, 0, 0)
  add(new THREE.CircleGeometry(0.19, 40), M.charcoal, 0, cy + 0.15, R + 0.004)
  wrapPlate(0.62, 'VAYU', '500 / 1,000 L', R, 0, cy - 0.38)
  cyl(0.02, 0.02, 0.16, M.brass, 0, cy + H / 2 + R + 0.06, 0, 16); dial(0.07, 0, cy + H / 2 + R + 0.2, 0.02)
  cyl(0.028, 0.028, 0.16, M.brass, 0.34, cy + H / 2 + R - 0.12, 0.16, 20); cyl(0.04, 0.036, 0.05, M.steel, 0.34, cy + H / 2 + R - 0.02, 0.16, 20)
  cyl(0.03, 0.03, 0.12, M.steel, 0, 0.3, 0.3, 20); add(new THREE.SphereGeometry(0.045, 24, 18), M.brass, 0, 0.3, 0.36)
  g.userData.spin = []; return g
}

function filters(M) {
  const { g, add, box, cyl, tor, plate, dial } = kit(M)
  box(2.0, 0.08, 0.8, M.black, 0, 0.04, 0, 0.02)
  ;[-0.92, 0.92].forEach((x) => box(0.1, 1.9, 0.1, M.black, x, 1.0, -0.2, 0.02))
  box(2.0, 0.1, 0.1, M.black, 0, 1.95, -0.2, 0.02)
  cyl(0.06, 0.06, 1.9, M.steel, 0, 1.62, 0.0, 28).rotation.z = Math.PI / 2
  cyl(0.06, 0.06, 0.22, M.steel, -0.98, 1.62, 0, 28).rotation.z = Math.PI / 2; cyl(0.06, 0.06, 0.22, M.steel, 0.98, 1.62, 0, 28).rotation.z = Math.PI / 2
  ;[[-0.5, M.anodBlue, 'A'], [0.5, M.anodOrange, 'B']].forEach(([x, m]) => {
    cyl(0.08, 0.08, 0.2, M.steel, x, 1.5, 0, 28)
    box(0.36, 0.2, 0.36, M.black, x, 1.38, 0, 0.03)
    cyl(0.28, 0.28, 0.95, m, x, 0.8, 0, 56)
    tor(0.285, 0.014, M.steel, x, 1.28, 0, Math.PI / 2, 0); tor(0.285, 0.014, M.steel, x, 0.33, 0, Math.PI / 2, 0)
    cyl(0.22, 0.2, 0.2, M.steel, x, 0.2, 0, 44)
    cyl(0.04, 0.04, 0.06, M.steel, x, 0.07, 0, 20)
    dial(0.058, x, 1.5, 0.12)
    box(0.2, 0.34, 0.012, M.black, x, 0.84, 0.285, 0.006); box(0.17, 0.28, 0.012, M.screen, x, 0.84, 0.292, 0.004)
  })
  plate(0.46, 'VAYU', '', 0, 1.95, -0.144)
  g.userData.spin = []; return g
}

const BUILD = { fixed: fixedSpeed, vfd, dryer, receiver, filters }

/** Builds a machine, rests it on y = 0, and scales it to a consistent presence in the scene. */
export function buildMachine(kind, M, target = { h: 2.3, w: 3.2 }) {
  const g = BUILD[kind](M)
  const box = new THREE.Box3().setFromObject(g)
  const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3())
  const k = Math.min(target.h / size.y, target.w / Math.max(size.x, size.z))
  const wrap = new THREE.Group(); wrap.add(g)
  g.position.set(-c.x, -box.min.y, -c.z)
  wrap.scale.setScalar(k)
  wrap.userData = { spin: g.userData.spin || [], height: size.y * k }
  return wrap
}
