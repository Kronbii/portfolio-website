'use client'

import { useEffect, useRef } from 'react'

import { terrain } from './terrain'

/*
 * The drone's LiDAR, simulated: a grid of returns ahead of the airframe,
 * sampled from the same terrain the chart is drawn from, coloured by height
 * (sea, low ground, ridges, peaks) and swept by a scan band. It turns and
 * climbs with the drone, so the inset is always the ground the map shows
 * under it. It draws only while it is on screen.
 */

const NX = 120
const NZ = 84
const SPAN = 650
const NEAR = 30
const FAR = 1150

const VERT = /* glsl */ `
  attribute vec3 tint;
  uniform float uScan;
  varying vec3 vTint;
  varying float vGlow;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float d = -position.z;
    vGlow = exp(-pow((d - uScan) / 26.0, 2.0));
    vTint = tint;
    gl_PointSize = (2.2 + vGlow * 2.6) * (380.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`
const FRAG = /* glsl */ `
  varying vec3 vTint;
  varying float vGlow;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    gl_FragColor = vec4(mix(vTint, vec3(1.0), vGlow * 0.75), 0.55 + vGlow * 0.45);
  }
`

export interface DroneState {
  x: number
  y: number
  h: number
}

export function Lidar({ drone, on }: { drone: React.RefObject<DroneState>; on: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!on) return
    const el = host.current
    const cv = canvas.current
    if (!el || !cv) return
    let disposed = false
    let cleanup = () => {}
    ;(async () => {
      const THREE = await import('three')
      if (disposed) return
      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try {
        renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true })
      } catch {
        return
      }
      renderer.setClearColor(0x000000, 0)
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(52, 1, 1, 4000)
      const t = terrain()
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array(NX * NZ * 3)
      const tint = new Float32Array(NX * NZ * 3)
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('tint', new THREE.BufferAttribute(tint, 3))
      const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: { uScan: { value: 0 } }, transparent: true, depthWrite: false })
      scene.add(new THREE.Points(geo, mat))

      const SEA = new THREE.Color('#3f74c2')
      const LOW = new THREE.Color('#53c28c')
      const MID = new THREE.Color('#d6d27a')
      const HIGH = new THREE.Color('#ff5fb4')
      const col = new THREE.Color()

      const size = () => {
        const w = el.clientWidth
        const h = el.clientHeight
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      size()
      const ro = new ResizeObserver(size)
      ro.observe(el)

      let visible = true
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
      io.observe(el)
      let raf = 0
      let scan = 0
      let last = 0
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame)
        if (!visible) return
        const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
        last = now
        const d = drone.current
        if (!d) return
        const cos = Math.cos(d.h)
        const sin = Math.sin(d.h)
        const here = Math.max(0, t.sample(d.x, d.y))
        let k = 0
        for (let j = 0; j < NZ; j++) {
          const fz = NEAR + ((FAR - NEAR) * j) / (NZ - 1)
          for (let i = 0; i < NX; i++) {
            const fx = -SPAN + (2 * SPAN * i) / (NX - 1)
            // forward is the heading; right is +90°
            const wx = d.x + cos * fz - sin * fx
            const wy = d.y + sin * fz + cos * fx
            const e = t.sample(wx, wy)
            pos[k] = fx
            pos[k + 1] = Math.max(-0.02, e) * 260
            pos[k + 2] = -fz
            if (e < 0) col.copy(SEA)
            else if (e < 0.45) col.copy(LOW).lerp(MID, e / 0.45)
            else col.copy(MID).lerp(HIGH, Math.min(1, (e - 0.45) / 0.9))
            tint[k] = col.r
            tint[k + 1] = col.g
            tint[k + 2] = col.b
            k += 3
          }
        }
        geo.attributes.position.needsUpdate = true
        geo.attributes.tint.needsUpdate = true
        scan = (scan + dt * 520) % (FAR + 200)
        mat.uniforms.uScan.value = scan
        const alt = here * 260 + 190
        camera.position.set(0, alt, 40)
        camera.lookAt(0, here * 260 - 60, -560)
        renderer.render(scene, camera)
      }
      raf = requestAnimationFrame(frame)
      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        io.disconnect()
        geo.dispose()
        mat.dispose()
        renderer.dispose()
      }
    })()
    return () => {
      disposed = true
      cleanup()
    }
  }, [on, drone])

  return (
    <div ref={host} style={{ position: 'absolute', inset: 0 }}>
      <canvas ref={canvas} style={{ width: '100%', height: '100%', display: 'block' }} aria-hidden="true" />
    </div>
  )
}
