import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { asset } from '../lib/asset'

/**
 * Procedural models of the five VAYU products, built to match the product photos on vayupower.com
 * (shapes, proportions, panel layout) with the real VAYU logo cut from those photos as a decal.
 * Front of every model faces +z.
 */

/* ---------- shared textures ---------- */
const loader = new THREE.TextureLoader()
const loadTex = (path) => { const t = loader.load(asset(path)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t }
/** White, high-resolution "VAYU" lettering (tinted per use). Redrawn once web fonts are ready so it always uses the bold display face. */
function vayuTextTexture() {
  const c = document.createElement('canvas'); c.width = 2048; c.height = 640
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16
  const draw = () => {
    const g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height)
    g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.textAlign = 'center'
    g.font = '700 430px Sora, "Arial Black", Inter, system-ui, sans-serif'
    if ('letterSpacing' in g) g.letterSpacing = '40px'
    g.fillText('VAYU', c.width / 2, c.height / 2 + 14)
    t.needsUpdate = true
  }
  draw(); document.fonts?.load('800 100px Sora').then(draw).catch(() => {})
  return t
}
let DECALS
const decals = () => (DECALS ||= { logo: loadTex('/textures/vayu-logo.png'), emblem: loadTex('/textures/vayu-emblem.png'), text: vayuTextTexture() })
const ASPECT = { logo: 640 / 265, emblem: 285 / 265, text: 2048 / 640 }

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}

/** Controller readout shown on the compressor and dryer displays. */
function screenTexture(label = 'RUNNING') {
  return canvasTex(256, 160, (g) => {
    g.fillStyle = '#031219'; g.fillRect(0, 0, 256, 160)
    g.fillStyle = '#38d5ff'; g.font = '700 20px Inter, system-ui, sans-serif'; g.fillText('VAYU', 14, 28)
    g.fillStyle = '#27e072'; g.beginPath(); g.arc(236, 22, 6, 0, 7); g.fill()
    g.fillStyle = '#e9fbff'; g.font = '700 54px Sora, Inter, system-ui, sans-serif'; g.fillText('7.5', 14, 92)
    g.fillStyle = '#38d5ff'; g.font = '600 20px Inter, system-ui, sans-serif'; g.fillText('bar', 118, 92)
    g.fillStyle = 'rgba(56,213,255,.25)'; g.fillRect(14, 112, 228, 8); g.fillStyle = '#38d5ff'; g.fillRect(14, 112, 150, 8)
    g.fillStyle = 'rgba(233,251,255,.7)'; g.font = '500 15px Inter, system-ui, sans-serif'; g.fillText(label, 14, 146)
  })
}

/** Dark finned grille (condenser / ventilation mesh). */
function grilleTexture(rows = 9, vertical = false) {
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#08090b'; g.fillRect(0, 0, w, h)
    const n = rows, gap = h / n
    for (let i = 0; i < n; i++) {
      g.fillStyle = '#2b2e34'; g.fillRect(8, i * gap + gap * 0.18, w - 16, gap * 0.34)
      g.fillStyle = '#4b4f58'; g.fillRect(8, i * gap + gap * 0.18, w - 16, gap * 0.08)
      if (!vertical) { g.fillStyle = '#16181c'; for (let x = 14; x < w - 14; x += 18) g.fillRect(x, i * gap + gap * 0.18, 2, gap * 0.34) }
    }
    g.strokeStyle = '#1b1d22'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6)
  })
}

function labelTexture(text, color = '#111') {
  return canvasTex(256, 96, (g, w, h) => {
    g.fillStyle = color; g.font = '600 46px Inter, system-ui, sans-serif'; g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillText(text, 6, h / 2)
  })
}

/* ---------- materials ---------- */
export function makeMaterials() {
  const std = (o) => new THREE.MeshStandardMaterial(o)
  const phys = (o) => new THREE.MeshPhysicalMaterial(o)
  const screenMap = screenTexture()
  return {
    orange: phys({ color: '#f06a14', metalness: 0.18, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
    black: phys({ color: '#0e0f12', metalness: 0.5, roughness: 0.42, clearcoat: 0.3, clearcoatRoughness: 0.35 }),
    charcoal: phys({ color: '#22252b', metalness: 0.5, roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.3 }),
    grey: phys({ color: '#434850', metalness: 0.4, roughness: 0.46, clearcoat: 0.5, clearcoatRoughness: 0.25 }),
    tank: phys({ color: '#aab1bc', metalness: 0.3, roughness: 0.3, clearcoat: 0.9, clearcoatRoughness: 0.08 }),
    steel: std({ color: '#c3c8d1', metalness: 1, roughness: 0.28 }),
    brass: std({ color: '#d29a4a', metalness: 1, roughness: 0.3 }),
    rubber: std({ color: '#050506', metalness: 0, roughness: 0.9 }),
    red: std({ color: '#c71414', metalness: 0.2, roughness: 0.4 }),
    yellow: std({ color: '#f2c200', metalness: 0.2, roughness: 0.5 }),
    white: new THREE.MeshBasicMaterial({ color: '#f1f1f1' }),
    sticker: new THREE.MeshBasicMaterial({ color: '#2f7be0' }),
    screen: std({ color: '#02131a', map: screenMap, emissive: '#ffffff', emissiveMap: screenMap, emissiveIntensity: 1.1, roughness: 0.25 }),
    ledGreen: std({ color: '#04120a', emissive: '#27e072', emissiveIntensity: 2 }),
    ledRed: std({ color: '#150404', emissive: '#ff3b2f', emissiveIntensity: 1.6 }),
    grilleDark: std({ color: '#ffffff', map: grilleTexture(9), metalness: 0.3, roughness: 0.55 }),
    grilleSide: std({ color: '#ffffff', map: grilleTexture(14, true), metalness: 0.3, roughness: 0.55 }),
    hole: std({ color: '#050506', metalness: 0.6, roughness: 0.5 }),
  }
}

/* ---------- little builders ---------- */
function kit(M) {
  const g = new THREE.Group()
  const add = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); g.add(m); return m }
  const box = (w, h, d, mat, x, y, z, r = 0.02) => add(new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001)), mat, x, y, z)
  const cyl = (rt, rb, h, mat, x, y, z, seg = 40) => add(new THREE.CylinderGeometry(rt, rb, h, seg), mat, x, y, z)
  const tor = (R, r, mat, x, y, z, rx = 0, ry = 0) => { const m = add(new THREE.TorusGeometry(R, r, 12, 56), mat, x, y, z); m.rotation.set(rx, ry, 0); return m }
  /** Flat decal on a face. `color` tints it (use black for the lettering on the orange door). */
  const decal = (key, w, x, y, z, color = 0xffffff, rotZ = 0) => {
    const mat = new THREE.MeshBasicMaterial({ map: decals()[key], color, transparent: true, toneMapped: false, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 })
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w / ASPECT[key]), mat)
    m.position.set(x, y, z); m.rotation.z = rotZ; m.renderOrder = 2; g.add(m); return m
  }
  /** Decal wrapped onto a vertical cylinder of radius r at angle `a` (0 = facing +z). */
  const decalOnCyl = (key, w, r, a, y, color = 0xffffff, rotZ = 0, cx = 0) => {
    const m = decal(key, w, 0, y, 0, color, rotZ)
    m.position.set(cx + Math.sin(a) * (r + 0.004), y, Math.cos(a) * (r + 0.004)); m.rotation.set(0, a, rotZ, 'YXZ'); return m
  }
  const flat = (w, h, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.set(x, y, z); m.renderOrder = 1; g.add(m); return m }
  const dial = (r, x, y, z) => {
    cyl(r, r, 0.04, M.steel, x, y, z, 40).rotation.x = Math.PI / 2
    const face = new THREE.Mesh(new THREE.CircleGeometry(r * 0.86, 40), M.white); face.position.set(x, y, z + 0.022); g.add(face)
    const nd = new THREE.Mesh(new THREE.BoxGeometry(0.008, r * 0.7, 0.004), new THREE.MeshBasicMaterial({ color: '#d11' })); nd.position.set(x + r * 0.15, y + r * 0.22, z + 0.026); nd.rotation.z = -0.7; g.add(nd)
  }
  const estop = (x, y, z) => { cyl(0.05, 0.05, 0.014, M.yellow, x, y, z, 32).rotation.x = Math.PI / 2; cyl(0.032, 0.032, 0.035, M.red, x, y, z + 0.014, 32).rotation.x = Math.PI / 2 }
  const display = (w, h, x, y, z) => { box(w + 0.04, h + 0.04, 0.014, M.black, x, y, z, 0.01); flat(w, h, M.screen, x, y, z + 0.009) }
  return { g, add, box, cyl, tor, decal, decalOnCyl, flat, dial, estop, display }
}

/* ---------- 1. fixed-speed: compressor on a white tank with a dryer beside it ---------- */
function fixedSpeed(M) {
  const { g, add, box, cyl, tor, decal, flat, dial, estop, display } = kit(M)
  // tank
  add(new THREE.CapsuleGeometry(0.44, 2.5, 18, 56), M.tank, 0, 0.56, 0).rotation.z = Math.PI / 2
  ;[-1.0, 1.0].forEach((x) => { box(0.3, 0.14, 0.7, M.black, x, 0.07, 0, 0.03); box(0.12, 0.08, 0.5, M.rubber, x, 0.01, 0, 0.02) })
  ;[-1.0, 1.0].forEach((x) => tor(0.445, 0.012, M.steel, x, 0.56, 0, 0, Math.PI / 2))
  ;[-1.7, 1.7].forEach((x) => cyl(0.035, 0.035, 0.1, M.steel, x, 0.56, 0, 20).rotation.z = Math.PI / 2)
  dial(0.06, 0.22, 0.54, 0.45)
  // compressor cabinet (black left, orange door right)
  const cx = -0.66
  box(1.56, 0.06, 1.02, M.black, cx, 1.02, 0, 0.01)
  box(1.5, 1.0, 0.95, M.black, cx, 1.55, 0, 0.04)
  box(1.52, 0.04, 0.97, M.charcoal, cx, 2.07, 0, 0.012)
  box(0.68, 0.96, 0.03, M.orange, cx + 0.45, 1.55, 0.485, 0.012)
  box(0.03, 0.96, 0.9, M.orange, cx + 0.77, 1.55, 0, 0.012)
  box(0.03, 0.96, 0.9, M.black, cx - 0.77, 1.55, 0, 0.012)
  display(0.24, 0.17, cx - 0.44, 1.9, 0.5)
  estop(cx - 0.12, 1.9, 0.5)
  decal('emblem', 0.42, cx - 0.38, 1.42, 0.481)
  // door: model tag + VAYU lettering, lock, small warning labels
  const tagMat = new THREE.MeshBasicMaterial({ map: labelTexture('SL 7', '#161616'), transparent: true, toneMapped: false, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 })
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.064), tagMat); tag.position.set(cx + 0.33, 1.62, 0.503); tag.renderOrder = 2; g.add(tag)
  decal('text', 0.6, cx + 0.45, 1.5, 0.503, 0x101010)
  cyl(0.022, 0.022, 0.03, M.black, cx + 0.45, 2.02, 0.5, 20).rotation.x = Math.PI / 2
  ;[0, 1, 2].forEach((i) => flat(0.045, 0.045, i === 0 ? M.red : i === 1 ? M.yellow : M.sticker, cx + 0.19, 1.74 - i * 0.07, 0.503))
  for (let i = 0; i < 4; i++) box(0.5, 0.012, 0.012, M.black, cx - 0.4, 1.06 + i * 0.045, 0.485, 0.003)
  // dryer unit on the tank
  const dx = 1.05
  box(0.8, 0.07, 0.6, M.black, dx, 1.0, 0, 0.01)
  box(0.74, 0.62, 0.56, M.black, dx, 1.34, 0, 0.03)
  box(0.74, 0.03, 0.56, M.charcoal, dx, 1.66, 0, 0.01)
  decal('logo', 0.32, dx - 0.1, 1.5, 0.285)
  flat(0.26, 0.34, M.grilleDark, dx - 0.05, 1.26, 0.286)
  flat(0.2, 0.4, M.grilleSide, dx + 0.27, 1.34, 0.286)
  box(0.12, 0.07, 0.012, M.sticker, dx - 0.18, 1.62, 0.287, 0.004); cyl(0.014, 0.014, 0.014, M.ledRed, dx - 0.04, 1.62, 0.29, 16).rotation.x = Math.PI / 2; cyl(0.014, 0.014, 0.014, M.ledGreen, dx + 0.02, 1.62, 0.29, 16).rotation.x = Math.PI / 2
  // pipework between them
  cyl(0.03, 0.03, 0.46, M.black, 0.4, 1.44, 0.1, 18).rotation.z = Math.PI / 2
  cyl(0.026, 0.026, 0.46, M.black, 0.4, 1.3, -0.05, 18).rotation.z = Math.PI / 2
  cyl(0.026, 0.026, 0.4, M.black, 0.55, 1.2, 0.1, 18)
  g.userData.spin = []; return g
}

/* ---------- 2. variable-speed: black-framed cabinet on feet, orange doors ---------- */
function vfd(M) {
  const { g, add, box, cyl, tor, decal, flat, estop, display } = kit(M)
  ;[-0.74, 0.74].forEach((x) => [-0.48, 0.48].forEach((z) => box(0.18, 0.2, 0.18, M.black, x, 0.1, z, 0.03)))
  box(1.7, 1.28, 1.14, M.black, 0, 0.84, 0, 0.05)
  box(1.72, 0.05, 1.16, M.charcoal, 0, 1.5, 0, 0.012)
  for (let i = 0; i < 5; i++) box(0.9, 0.012, 0.02, M.black, 0.1, 1.53, -0.3 + i * 0.15, 0.004)
  // front: black panel (display, e-stop, emblem, vent) · orange door · black post · orange panel
  box(0.74, 1.2, 0.03, M.orange, -0.02, 0.86, 0.585, 0.012)
  box(0.42, 1.2, 0.03, M.orange, 0.58, 0.86, 0.585, 0.012)
  display(0.27, 0.19, -0.58, 1.22, 0.6)
  estop(-0.36, 1.22, 0.6)
  decal('emblem', 0.4, -0.58, 0.82, 0.586)
  flat(0.3, 0.34, M.grilleDark, -0.58, 0.42, 0.6)
  const tagMat = new THREE.MeshBasicMaterial({ map: labelTexture('SL 22V', '#161616'), transparent: true, toneMapped: false, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 })
  const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.075), tagMat); tag.position.set(-0.2, 0.98, 0.602); tag.renderOrder = 2; g.add(tag)
  decal('text', 0.66, -0.02, 0.85, 0.602, 0x101010)
  ;[0, 1, 2].forEach((i) => flat(0.05, 0.05, i === 0 ? M.red : i === 1 ? M.yellow : M.sticker, -0.34, 1.12 - i * 0.075, 0.602))
  cyl(0.024, 0.024, 0.03, M.black, -0.02, 1.4, 0.6, 20).rotation.x = Math.PI / 2
  cyl(0.024, 0.024, 0.03, M.black, 0.58, 1.4, 0.6, 20).rotation.x = Math.PI / 2
  // sides
  box(0.03, 1.2, 1.1, M.orange, 0.865, 0.86, 0, 0.012)
  box(0.03, 1.2, 1.1, M.black, -0.865, 0.86, 0, 0.012)
  cyl(0.024, 0.024, 0.03, M.black, 0.88, 1.4, 0.2, 20).rotation.z = Math.PI / 2
  g.userData.spin = []; return g
}

/* ---------- 3. refrigerated dryer: tall black cabinet, controls on top, grille at the bottom ---------- */
function dryer(M) {
  const { g, add, box, cyl, tor, decal, flat, display } = kit(M)
  ;[-0.3, 0.3].forEach((x) => box(0.2, 0.18, 0.6, M.black, x, 0.09, 0, 0.02))
  box(0.96, 2.0, 0.66, M.black, 0, 1.18, 0, 0.04)
  box(0.98, 0.04, 0.68, M.charcoal, 0, 2.2, 0, 0.012)
  // control strip + seam
  box(0.9, 0.012, 0.02, M.charcoal, 0, 1.97, 0.335, 0.004)
  box(0.14, 0.08, 0.012, M.sticker, -0.3, 2.1, 0.337, 0.004)
  ;[M.ledRed, M.ledGreen].forEach((m, i) => cyl(0.018, 0.018, 0.014, m, 0.1 + i * 0.1, 2.1, 0.34, 18).rotation.x = Math.PI / 2)
  box(0.12, 0.05, 0.012, M.charcoal, -0.05, 2.1, 0.337, 0.004)
  display(0.2, 0.12, 0.33, 2.1, 0.337)
  // bolts + logo + sticker
  ;[[-0.4, 1.9], [0.4, 1.9], [-0.4, 0.84], [0.4, 0.84]].forEach(([x, y]) => cyl(0.022, 0.022, 0.012, M.steel, x, y, 0.337, 20).rotation.x = Math.PI / 2)
  decal('logo', 0.56, -0.06, 1.62, 0.336)
  box(0.18, 0.07, 0.012, M.yellow, -0.26, 0.9, 0.337, 0.004)
  // condenser grille
  box(0.78, 0.62, 0.02, M.black, 0, 0.55, 0.335, 0.01)
  flat(0.72, 0.56, M.grilleDark, 0, 0.55, 0.347)
  // side valve + drain
  cyl(0.02, 0.02, 0.12, M.steel, 0.52, 1.35, 0.1, 16).rotation.z = Math.PI / 2
  cyl(0.035, 0.035, 0.05, M.red, 0.6, 1.35, 0.1, 20).rotation.z = Math.PI / 2
  cyl(0.02, 0.02, 0.1, M.steel, 0.52, 1.05, 0.1, 16).rotation.z = Math.PI / 2
  cyl(0.032, 0.032, 0.05, M.red, 0.6, 1.05, 0.1, 20).rotation.z = Math.PI / 2
  g.userData.spin = []; return g
}

/* ---------- 4. downstream filters: three housings of increasing size ---------- */
function filters(M) {
  const { g, add, box, cyl, tor, decal, decalOnCyl, flat } = kit(M)
  const unit = (x, bodyH, r) => {
    const base = 0.16
    const top = base + bodyH
    cyl(r * 0.2, r * 0.2, 0.08, M.steel, x, base - 0.08, 0, 20)                                // drain stub
    cyl(r, r, bodyH, M.grey, x, base + bodyH / 2, 0, 56)                                       // bowl / body
    tor(r + 0.004, 0.012, M.charcoal, x, top - 0.16, 0, Math.PI / 2, 0)                        // collar
    box(r * 2.5, 0.26, r * 2.3, M.grey, x, top + 0.13, 0, 0.04)                               // head block
    box(r * 1.05, 0.22, r * 1.4, M.grey, x + r * 1.35, top + 0.14, 0.02, 0.03)                // port block (right)
    box(r * 0.55, 0.2, r * 1.1, M.grey, x - r * 1.35, top + 0.14, 0.02, 0.03)                 // port block (left)
    ;[-0.35, 0.35].forEach((o) => cyl(r * 0.2, r * 0.2, 0.02, M.hole, x + r * 1.35 + o * r * 0.7, top + 0.14, r * 0.72, 24).rotation.x = Math.PI / 2)
    cyl(r * 0.12, r * 0.12, 0.05, M.brass, x, top + 0.29, 0, 20)                               // brass vent
    ;[-1.0, 1.0].forEach((a) => box(r * 0.14, bodyH * 0.3, 0.02, M.charcoal, x + Math.sin(a) * r, base + bodyH * 0.58, Math.cos(a) * r, 0.006).rotation.y = a)
    const tw = Math.min(bodyH * 0.7, r * 3.1), ty = base + bodyH * 0.47
    decalOnCyl('text', tw, r, 0, ty, 0xf26a1e, Math.PI / 2, x)                                   // VAYU lettering, reads bottom-to-top
    decalOnCyl('emblem', r * 1.05, r, 0, ty - tw * 0.37 - r * 0.62, 0xffffff, Math.PI / 2, x)   // real VAYU emblem below it
  }
  unit(-1.2, 0.8, 0.15)
  unit(0.05, 1.3, 0.21)
  unit(1.4, 1.75, 0.26)
  g.userData.spin = []; return g
}

/* ---------- 5. vertical air receiver: dished-end tank on three angled legs ---------- */
function receiver(M) {
  const { g, add, box, cyl, tor, decal, decalOnCyl, flat, dial } = kit(M)
  const R = 0.5, H = 1.35, cy = 0.5 + H / 2 + R
  add(new THREE.CapsuleGeometry(R, H, 18, 64), M.grey, 0, cy, 0)
  const topY = cy + H / 2 + R
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + Math.PI / 2
    const leg = box(0.1, 0.62, 0.1, M.charcoal, Math.cos(a) * 0.4, 0.28, Math.sin(a) * 0.4, 0.02)
    leg.rotation.set(Math.sin(a) * 0.28, 0, -Math.cos(a) * 0.28)
  }
  cyl(0.04, 0.04, 0.08, M.steel, 0, topY + 0.03, 0, 20)                                       // top nozzle
  cyl(0.05, 0.04, 0.05, M.charcoal, 0, 0.5, 0.0, 20)                                           // bottom drain
  // orange emblem + vertical VAYU lettering (reads bottom-to-top), upper left of the straight body
  decalOnCyl('text', 1.15, R, -0.5, cy + 0.36, 0xf26a1e, Math.PI / 2)
  decalOnCyl('emblem', 0.2, R, -0.46, cy - 0.18)
  // nameplate + manway
  const plate = flat(0.14, 0.08, M.white, 0, cy + 0.18, R + 0.004)
  tor(0.1, 0.022, M.charcoal, 0, cy - 0.1, R + 0.004)
  add(new THREE.CircleGeometry(0.1, 32), M.black, 0, cy - 0.1, R + 0.006)
  box(0.18, 0.04, 0.03, M.charcoal, 0, cy - 0.1, R + 0.022, 0.01)
  cyl(0.02, 0.02, 0.04, M.steel, 0, cy - 0.1, R + 0.03, 16).rotation.x = Math.PI / 2
  // gauge bracket + side ports
  box(0.1, 0.16, 0.06, M.charcoal, 0.4, cy + 0.82, 0.28, 0.01).rotation.y = 0.7
  cyl(0.035, 0.035, 0.12, M.steel, 0.52, cy + 0.64, 0.1, 18).rotation.z = Math.PI / 2
  cyl(0.03, 0.03, 0.1, M.steel, -0.52, cy - 0.5, 0.05, 18).rotation.z = Math.PI / 2
  cyl(0.03, 0.03, 0.1, M.steel, -0.52, cy + 0.4, 0.05, 18).rotation.z = Math.PI / 2
  cyl(0.03, 0.03, 0.1, M.steel, 0.1, cy + 0.65, R - 0.02, 18).rotation.x = Math.PI / 2
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
