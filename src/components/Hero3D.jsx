import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { asset } from '../lib/asset'

const MODEL = asset('/models/compressor-vayu.glb')

/** Little emitter of "air" particles blowing out of the quick-coupler. */
function Airflow({ origin }) {
  const ref = useRef()
  const N = 70
  const { pos, seed } = useMemo(() => ({
    pos: new Float32Array(N * 3),
    seed: Array.from({ length: N }, () => ({ t: Math.random(), v: 0.25 + Math.random() * 0.35, a: Math.random() * Math.PI * 2, r: Math.random() * 0.04 })),
  }), [])
  useFrame((_, d) => {
    const a = ref.current.geometry.attributes.position
    seed.forEach((p, i) => {
      p.t += d * p.v
      if (p.t > 1) p.t = 0
      const k = p.t
      a.setXYZ(i, origin.x + Math.cos(p.a) * p.r * (1 + k * 4), origin.y + Math.sin(p.a) * p.r * (1 + k * 4) + k * 0.12, origin.z + 0.1 + k * 0.9)
    })
    a.needsUpdate = true
  })
  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={N} array={pos} itemSize={3} /></bufferGeometry>
      <pointsMaterial color="#9fe9ff" size={0.03} transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function Model() {
  const { scene } = useGLTF(MODEL)
  const root = useRef()
  const parts = useRef({})
  const needle = useRef()

  const { obj, offset, coupler } = useMemo(() => {
    const obj = scene.clone(true)
    obj.traverse((o) => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; if (o.material) o.material.envMapIntensity = 1.1 }
    })
    const box = new THREE.Box3().setFromObject(obj)
    const c = box.getCenter(new THREE.Vector3())
    const coupler = obj.getObjectByName('Decor_1')?.position.clone() ?? new THREE.Vector3()
    return { obj, offset: [-c.x, -box.min.y, -c.z], coupler }
  }, [scene])

  // pressure gauge needle, attached to the gauge housing
  useEffect(() => {
    const gauge = obj.getObjectByName('Decor_3')
    if (!gauge) return
    const box = new THREE.Box3().setFromObject(gauge)
    const pivot = new THREE.Group()
    pivot.position.set(0, 0, (box.max.z - box.min.z) / 2 + 0.004)
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.1, 0.004), new THREE.MeshBasicMaterial({ color: '#ff3b1f' }))
    m.position.y = 0.045
    pivot.add(m)
    gauge.add(pivot)
    needle.current = pivot
    return () => { gauge.remove(pivot) }
  }, [obj])

  useFrame((s, d) => {
    const t = s.clock.elapsedTime
    const g = root.current
    // entrance zoom
    const k = THREE.MathUtils.damp(g.scale.x, 1, 2.5, d)
    g.scale.setScalar(k)
    // running vibration + slow breathing
    g.position.x = offset[0] + Math.sin(t * 62) * 0.0016
    g.position.y = offset[1] + Math.sin(t * 71) * 0.0014 + Math.sin(t * 1.2) * 0.012
    // regulator knob turns, gauge needle follows "pressure"
    parts.current.knob ??= obj.getObjectByName('Decor_2')
    if (parts.current.knob) parts.current.knob.rotation.z = Math.sin(t * 0.7) * 1.1
    if (needle.current) needle.current.rotation.z = -1.9 + (Math.sin(t * 0.7) * 0.5 + 0.5) * 3.2
    // power switch flick
    parts.current.sw ??= obj.getObjectByName('Switch')
    if (parts.current.sw) parts.current.sw.rotation.x = Math.sin(t * 0.7) > 0.95 ? 0.25 : 0
  })

  return (
    <group ref={root} scale={0.55} position={offset}>
      <primitive object={obj} />
      <Airflow origin={coupler} />
    </group>
  )
}
useGLTF.preload(MODEL)

function Rig({ children }) {
  const g = useRef()
  useFrame((s, d) => {
    const t = s.clock.elapsedTime
    const scroll = Math.min(window.scrollY, 900) * 0.0035
    const ty = s.pointer.y * 0.12
    const ry = -0.55 + Math.sin(t * 0.35) * 0.55 + s.pointer.x * 0.45 + scroll
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, ry, 2.5, d)
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -ty, 3, d)
  })
  return <group ref={g}>{children}</group>
}

function Stage() {
  const wide = useThree((s) => s.size.width) > 900
  return (
    <>
      <Rig>
        <group position={[wide ? 0.7 : 0, -1.2, 0]} scale={wide ? 1.4 : 1.55}>
          <Model />
        </group>
      </Rig>
      <ContactShadows position={[wide ? 0.7 : 0, -1.21, 0]} opacity={0.38} scale={16} blur={2.8} far={4} color="#1e3a8a" />
    </>
  )
}

export default function Hero3D() {
  return (
    <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 1.2, 9.5], fov: 34 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 6]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-6, 2, 3]} intensity={30} color="#38d5ff" />
      <pointLight position={[6, -1, 4]} intensity={22} color="#ff7a1a" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[0, 5, -4]} scale={[14, 3, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#8fe3ff" />
        <Lightformer form="rect" intensity={3} position={[6, 0, 2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} color="#ffb27a" />
        <Lightformer form="rect" intensity={3} position={[0, 1, 6]} scale={[10, 2, 1]} />
      </Environment>
      <Stage />
    </Canvas>
  )
}
