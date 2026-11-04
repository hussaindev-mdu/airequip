import * as THREE from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { makeMaterials, buildMachine } from './models'
import { COLLECTION } from './data'

const N = COLLECTION.length
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }

function radialTexture(stops, size = 128) {
  const c = document.createElement('canvas'); c.width = c.height = size
  const g = c.getContext('2d'), grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  stops.forEach(([o, col]) => grd.addColorStop(o, col))
  g.fillStyle = grd; g.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}

/** Adds halo + floor pool to a machine and returns the staged group. */
function stage(item, M) {
  const m = buildMachine(item.kind, M)
  const glow = new THREE.Color(item.glow)
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture([[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,.35)'], [1, 'rgba(255,255,255,0)']]), color: glow, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.4 }))
  halo.scale.set(9, 9, 1); halo.position.set(0, m.userData.height * 0.55, -1.4); m.add(halo)
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: radialTexture([[0, 'rgba(255,255,255,1)'], [0.5, 'rgba(255,255,255,.25)'], [1, 'rgba(255,255,255,0)']]), color: glow, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.5 }))
  pool.rotation.x = -Math.PI / 2; pool.position.y = 0.012; pool.scale.setScalar(6.5 / m.scale.x); m.add(pool)
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: radialTexture([[0, 'rgba(0,0,0,1)'], [0.55, 'rgba(0,0,0,.45)'], [1, 'rgba(0,0,0,0)']]), transparent: true, depthWrite: false, opacity: 0.3 }))
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.016; shadow.scale.set(5.2 / m.scale.x, 3.2 / m.scale.x, 1); shadow.renderOrder = 1; m.add(shadow)
  m.userData.halo = halo; m.userData.pool = pool; m.userData.glow = glow; m.userData.shadow = shadow
  return m
}

/** Studio shots of each machine for the product page — rendered one at a time so they never freeze the page. */
function createThumbRenderer(low) {
  const W = low ? 480 : 760, H = low ? 352 : 560
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
  r.setPixelRatio(1); r.setSize(W, H); r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05
  const pm = new THREE.PMREMGenerator(r), env = pm.fromScene(new RoomEnvironment(), 0.04).texture
  const M = makeMaterials()
  return {
    renderAt(i) {
      const item = COLLECTION[i]
      const s = new THREE.Scene(); s.environment = env; s.environmentIntensity = 0.85
      const m = buildMachine(item.kind, M); m.rotation.y = -0.5; s.add(m)
      const k = new THREE.DirectionalLight(0xffffff, 2.4); k.position.set(3, 5, 6); s.add(k)
      const rim = new THREE.PointLight(new THREE.Color(item.glow), 60, 22); rim.position.set(-4, 3, -3); s.add(rim)
      const cam = new THREE.PerspectiveCamera(24, W / H, 0.5, 80)
      m.updateMatrixWorld(true)
      const bb = new THREE.Box3().setFromObject(m), sz = bb.getSize(new THREE.Vector3()), ct = bb.getCenter(new THREE.Vector3())
      const t = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
      const dist = Math.max((sz.y * 1.32) / (2 * t), (Math.max(sz.x, sz.z) * 1.3) / (2 * t * cam.aspect)) + sz.z * 0.5
      cam.position.set(ct.x + dist * 0.3, ct.y + sz.y * 0.12, ct.z + dist * 0.95); cam.lookAt(ct.x, ct.y - sz.y * 0.02, ct.z)
      r.setClearColor(0x000000, 0); r.render(s, cam)
      return r.domElement.toDataURL('image/webp', 0.9)
    },
    dispose() { r.dispose(); pm.dispose() },
  }
}

/**
 * Scroll-driven showcase. The camera travels down a zig-zag line of machines and turns to face each in turn.
 * Callbacks: onThumbs(urls), onIndex(i), onHud({ intro, focus, atTop, inHero }), onFail().
 */
export function createShowcase({ mount, hero, interval = 5000, onThumbs, onIndex, onHud, onReady, onFail }) {
  // A fresh canvas per start: React dev mode mounts effects twice, and a canvas whose context was lost can't be reused.
  const canvas = document.createElement('canvas')
  canvas.className = 'absolute inset-0 block h-full w-full'; canvas.setAttribute('aria-hidden', 'true')
  mount.appendChild(canvas)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  // phones / tablets / low-memory devices get a lighter render: lower resolution, no bloom, smaller mirror, fewer particles
  const low = matchMedia('(pointer: coarse)').matches || innerWidth < 820 || (navigator.deviceMemory && navigator.deviceMemory <= 4)
  let raf = 0, disposed = false
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  } catch (e) { canvas.remove(); onFail && onFail(); return { dispose() {} } }

  renderer.setPixelRatio(Math.min(devicePixelRatio, low ? 1.2 : 1.75))
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.92

  const scene = new THREE.Scene(), BG = 0x050507
  scene.background = new THREE.Color(BG); scene.fog = new THREE.FogExp2(BG, 0.03)
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture; scene.environmentIntensity = 0.38

  const camera = new THREE.PerspectiveCamera(32, 1, 1, 160)
  const SPACING = 8.4, SIDE = 2.3
  const M = makeMaterials()
  const items = COLLECTION.map((item, i) => { const m = stage(item, M); m.userData.side = i % 2 === 0 ? -1 : 1; m.userData.base = m.scale.x; m.position.set(m.userData.side * SIDE, 0, -i * SPACING); scene.add(m); return m })

  // glossy floor: mirror + dark veil so reflections stay soft and fade with distance
  const mirror = new Reflector(new THREE.PlaneGeometry(90, 170), { color: 0x8a8a92, textureWidth: low ? 512 : 1024, textureHeight: low ? 512 : 1024, clipBias: 0.003 })
  mirror.rotation.x = -Math.PI / 2; mirror.position.set(0, 0, -50); scene.add(mirror)
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(90, 170), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5, depthWrite: false }))
  veil.rotation.x = -Math.PI / 2; veil.position.set(0, 0.004, -50); scene.add(veil)

  const amb = new THREE.AmbientLight(0xffffff, 0.12); scene.add(amb)
  const key = new THREE.SpotLight(0xfff0dc, 320, 44, 0.6, 0.7, 1.6); scene.add(key, key.target)
  const rimL = new THREE.PointLight(0xffffff, 10, 20, 1.6); scene.add(rimL)
  const fillL = new THREE.PointLight(0x8fa8ff, 8, 26, 1.8); scene.add(fillL)

  // drifting light particles
  const PN = reduce ? 220 : low ? 320 : 650, pos = new Float32Array(PN * 3), col = new Float32Array(PN * 3), seed = []
  const zSpan = (N - 1) * SPACING + 14
  for (let i = 0; i < PN; i++) {
    pos.set([(Math.random() - 0.5) * 22, Math.random() * 8, 10 - Math.random() * (zSpan + 10)], i * 3)
    const c = new THREE.Color().setHSL(0.07 + Math.random() * 0.08, 0.6, 0.72 + Math.random() * 0.2); col.set([c.r, c.g, c.b], i * 3)
    seed.push({ s: 0.08 + Math.random() * 0.35, p: Math.random() * 6.28, a: 0.2 + Math.random() * 0.8 })
  }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); pg.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.085, map: radialTexture([[0, 'rgba(255,255,255,1)'], [0.4, 'rgba(255,255,255,.4)'], [1, 'rgba(255,255,255,0)']], 64), vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }))
  scene.add(dust)

  // depth of field + bloom
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: reduce ? 0.0004 : 0.0011, maxblur: 0.016 })
  composer.addPass(bokeh)
  const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.26, 0.6, 1.0); bloom.enabled = !low; composer.addPass(bloom)
  composer.addPass(new OutputPass())

  // ---- theme: a dark showroom or a pale studio, switched live with the site's theme toggle ----
  const THEMES = {
    dark:  { bg: 0x050507, fog: 0.03,  veil: [0x000000, 0.5],  env: 0.38, exposure: 0.92, amb: 0.12, key: 320, rim: 10, fill: 8,  bloom: [0.26, 1.0],  add: true,
             dust: [0.8, 0.085], haloB: 0.05, haloG: 0.2,  poolB: 0.08, poolG: 0.32, dustCol: null, shadow: 0, tank: '#aab1bc', tankRough: 0.28, orange: ['#ff5f00', 1, 1] },
    light: { bg: 0xd9e1ef, fog: 0.02,  veil: [0xd9e1ef, 0.52], env: 0.5,  exposure: 0.92, amb: 0.35, key: 300, rim: 14, fill: 4,  bloom: [0.04, 1.05], add: false,
             dust: [0.55, 0.07], haloB: 0.05, haloG: 0.16, poolB: 0.08, poolG: 0.22, dustCol: 0x7a6a56, shadow: 0.5, tank: '#6f7888', tankRough: 0.34, orange: ['#e04400', 0.35, 0.3] },
  }
  let T = THEMES.dark
  const applyTheme = (isDark) => {
    T = isDark ? THEMES.dark : THEMES.light
    scene.background.set(T.bg); scene.fog.color.set(T.bg); scene.fog.density = T.fog
    veil.material.color.set(T.veil[0]); veil.material.opacity = T.veil[1]
    scene.environmentIntensity = T.env; renderer.toneMappingExposure = T.exposure
    amb.intensity = T.amb; key.intensity = T.key; rimL.intensity = T.rim; fillL.intensity = T.fill
    bloom.strength = T.bloom[0]; bloom.threshold = T.bloom[1]
    const blend = T.add ? THREE.AdditiveBlending : THREE.NormalBlending
    dust.material.blending = blend; dust.material.opacity = T.dust[0]; dust.material.size = T.dust[1]; dust.material.color.set(T.dustCol ?? 0xffffff); dust.material.needsUpdate = true
    items.forEach((m) => { [m.userData.halo.material, m.userData.pool.material].forEach((mat) => { mat.blending = blend; mat.needsUpdate = true }); m.userData.shadow.material.opacity = T.shadow; m.userData.shadow.visible = T.shadow > 0 })
    M.tank.color.set(T.tank); M.tank.roughness = T.tankRough
    ;[M.orange, M.anodOrange].forEach((mat) => { mat.color.set(T.orange[0]); mat.envMapIntensity = T.orange[1]; mat.clearcoat = T.orange[2] })
  }
  const isDarkNow = () => document.documentElement.classList.contains('dark')
  applyTheme(isDarkNow())
  const themeObs = new MutationObserver(() => applyTheme(isDarkNow()))
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  let portrait = false
  const resize = () => {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight
    renderer.setSize(w, h, false); composer.setSize(w, h); composer.setPixelRatio(renderer.getPixelRatio())
    camera.aspect = w / h; portrait = camera.aspect < 0.9; camera.fov = portrait ? 40 : 32; camera.updateProjectionMatrix()
    mirror.getRenderTarget().setSize(Math.floor(w * (low ? 0.35 : 0.5)), Math.floor(h * (low ? 0.35 : 0.5)))
  }
  resize(); addEventListener('resize', resize)

  let cur = 0, target = 0, timer = 0, fast = false, paused = false, visible = true, lastShown = -1, last = performance.now(), idxNow = 0
  const goTo = (i) => { i = clamp(i, 0, N - 1); fast = i < target; target = i; timer = 0 }
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; onHud && onHud({ inHero: visible }) }, { threshold: 0 }); io.observe(hero)
  const look = new THREE.Vector3(), accent = new THREE.Color(), tmp = new THREE.Color()

  let firstDone = false, thumbTr = null
  const frame = (now) => {
    if (disposed) return
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000); last = now
    if (!visible) return
    const t = now / 1000

    // autoplay: advance to the next machine every `interval` ms (wraps back to the first)
    if (!paused && !document.hidden && !reduce) { timer += dt; if (timer >= interval / 1000) goTo((target + 1) % N) }
    cur += (target - cur) * (1 - Math.exp(-dt * (reduce ? 12 : fast ? 7 : 4.6)))
    const i0 = Math.min(N - 2, Math.floor(cur)), e = clamp(cur - i0, 0, 1)
    idxNow = clamp(cur, 0, N - 1)

    // camera travels the zig-zag and turns toward the machine in focus
    const x0 = items[i0].userData.side * SIDE, x1 = items[i0 + 1].userData.side * SIDE
    const bx = lerp(x0, x1, e), bz = lerp(-i0 * SPACING, -(i0 + 1) * SPACING, e)
    const dist = portrait ? 12.2 : 11
    camera.position.set(bx * 0.4 + Math.sin(t * 0.25) * 0.08, 1.7 + Math.sin(t * 0.3) * 0.04, bz + dist)
    look.set(bx, portrait ? 1.0 : 1.12, bz); camera.lookAt(look)
    bokeh.uniforms['focus'].value = camera.position.distanceTo(look)

    // focused machine: large, sharp, centred. The rest shrink, drift outward and fall away.
    accent.setRGB(0.3, 0.3, 0.3)
    items.forEach((m, i) => {
      const d = i - idxNow, ad = Math.abs(d), foc = smooth(0, 1, 1 - Math.min(ad, 1))
      m.scale.setScalar(m.userData.base * lerp(0.7, 1.32, foc) * (portrait ? 0.85 : 1))
      m.position.x = m.userData.side * (SIDE + (1 - foc) * 2.4 + Math.max(0, ad - 1) * 0.6)
      m.rotation.y = lerp(-m.userData.side * 0.6, -m.userData.side * 0.28, foc) + (reduce ? 0 : Math.sin(t * 0.5 + i) * 0.06 * foc)
      m.userData.halo.material.opacity = T.haloB + T.haloG * foc
      m.userData.pool.material.opacity = T.poolB + T.poolG * foc
      m.userData.spin.forEach((s) => { s.obj.rotation[s.axis] -= dt * s.speed * (0.5 + foc * 1.5) })
      if (foc > 0) { tmp.copy(m.userData.glow).multiplyScalar(foc); accent.add(tmp) }
    })

    // lights follow the focus
    const fb = lerp(items[i0].position.x, items[i0 + 1].position.x, e)
    key.position.set(fb - 3, 8, bz + 6); key.target.position.set(fb, 1.2, bz); key.target.updateMatrixWorld()
    rimL.position.set(fb + 2.4, 3.2, bz - 3.6); rimL.color.copy(accent).addScalar(0.1)
    fillL.position.set(fb - 5, 2, bz + 3)

    const pa = pg.attributes.position
    for (let i = 0; i < PN; i++) {
      const sd = seed[i]; let y = pa.getY(i) + dt * sd.s * (reduce ? 0.3 : 1); if (y > 8) y = 0
      pa.setY(i, y); pa.setX(i, pa.getX(i) + Math.sin(t * 0.4 + sd.p) * 0.003 * sd.a)
    }
    pa.needsUpdate = true
    composer.render()
    if (!firstDone) {
      firstDone = true; onReady && onReady()
      // the product-page images are only needed further down: render them one per idle slot, after the scene is on screen
      const idle = (fn) => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 80))
      const urls = new Array(N).fill(''); let k = 0
      const step = () => {
        if (disposed) return
        try {
          thumbTr = thumbTr || createThumbRenderer(low)
          urls[k] = thumbTr.renderAt(k); onThumbs && onThumbs(urls.slice()); k++
        } catch (e) { console.warn('thumbnails failed', e); k = N }
        if (k < N) idle(step); else { thumbTr.dispose(); thumbTr = null }
      }
      idle(step)
    }

    const show = clamp(Math.round(idxNow), 0, N - 1)
    if (show !== lastShown) { lastShown = show; onIndex && onIndex(show) }
  }
  let started = false
  const begin = () => { if (disposed || started) return; started = true; raf = requestAnimationFrame(frame) }
  // compile shaders off the critical path so the first frame doesn't freeze, but never wait forever
  ;(renderer.compileAsync ? renderer.compileAsync(scene, camera) : Promise.resolve()).catch(() => {}).then(begin)
  setTimeout(begin, 4000)
  onHud && onHud({ inHero: true })

  return {
    goTo, setPaused(v) { paused = v; timer = 0 },
    dispose() {
      disposed = true; cancelAnimationFrame(raf); removeEventListener('resize', resize); io.disconnect(); themeObs.disconnect()
      thumbTr && thumbTr.dispose(); composer.dispose(); pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove()
    },
  }
}
