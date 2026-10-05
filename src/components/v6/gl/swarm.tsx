'use client'

import { useEffect, useRef } from 'react'
import type * as THREE_NS from 'three'

import { B, E, clamp, lerp, prog } from '../armed'
import type { ShotClock } from '../shot'
import {
  environment,
  loadAirframe,
  makeAirframe,
  spin,
  type Airframe,
} from './airframe'
import { reelLights, startGL, yieldFrame } from './host'
import { makeTerrain } from './terrain'

/*
 * FLY's 3D layer, from the reel's swarmShot: 36 E58s burst out, form a
 * wall, a ring, a helix, run a rolling tunnel, then spell RK. and do a
 * staggered barrel roll. The reel then breaks them past the lens; here they
 * hold the letters and hover. All times are the shot's own (the reel's beat
 * 44 is beat 0 here).
 */

const N = 36
const PITCH = 0.62
type V3 = [number, number, number]

const GLYPH: V3[] = (() => {
  const R = ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X.X..', 'X..X.', 'X...X']
  const K = ['X...X', 'X..X.', 'X.X..', 'XX...', 'X.X..', 'X..X.', 'X...X']
  const out: [number, number][] = []
  R.forEach((row, r) =>
    [...row].forEach((c, k) => c === 'X' && out.push([k, r]))
  )
  K.forEach((row, r) =>
    [...row].forEach((c, k) => c === 'X' && out.push([k + 7, r]))
  )
  ;[
    [13, 5],
    [14, 5],
    [13, 6],
    [14, 6],
  ].forEach((q) => out.push(q as [number, number]))
  return out.map(([c, r]) => [(c - 7) * PITCH, (3 - r) * PITCH + 0.2, 0] as V3)
})()

const bt = (n: number) => n * B
const mix = (a: V3, b: V3, k: number): V3 => [
  a[0] + (b[0] - a[0]) * k,
  a[1] + (b[1] - a[1]) * k,
  a[2] + (b[2] - a[2]) * k,
]

/** Where drone i is at local time l. */
function formation(i: number, l: number): V3 {
  const g = (2.399963 * i) % (Math.PI * 2)
  const fy = 1 - (2 * (i + 0.5)) / N
  const fr = Math.sqrt(1 - fy * fy)
  const burst: V3 = [Math.cos(g) * fr * 3.4, fy * 2.2, Math.sin(g) * fr * 3.4]
  const col = i % 6
  const row = Math.floor(i / 6)
  const wall: V3 = [(col - 2.5) * 1.05, (2.5 - row) * 0.62, 0]
  const ringA = (i / N) * Math.PI * 2 + l * 1.4
  const ring: V3 = [
    Math.cos(ringA) * 3.3,
    0.25 + 0.35 * Math.sin(ringA * 3),
    Math.sin(ringA) * 3.3,
  ]
  const helA = i * 0.52 + l * 2.2
  const helix: V3 = [
    Math.cos(helA) * 1.5,
    -1.9 + i * 0.11,
    Math.sin(helA) * 1.5,
  ]
  const q = Math.floor(i / 6)
  const tunA = ((i % 6) / 6) * Math.PI * 2 + q * 0.5 + l * 1.3
  const tunnel: V3 = [Math.cos(tunA) * 1.7, Math.sin(tunA) * 1.7, -2 - q * 2.6]
  const glyph = GLYPH[(i * 7) % N]
  const d = (i % 9) * 0.009
  const k = (b: number, len = 0.32) =>
    E.out(prog(l, bt(b) + d, bt(b) + d + len))
  let p = mix([0, 0, 0], burst, E.out(prog(l, 0, 0.42)))
  p = mix(p, wall, k(1))
  p = mix(p, ring, k(2))
  p = mix(p, helix, k(3))
  p = mix(p, tunnel, k(4, 0.45))
  p = mix(p, glyph, k(8, 0.5))
  return p
}

export function Swarm({
  clock,
  accent,
}: {
  clock: ShotClock
  /** The ground's grid and the rim light; the reel's burgundy by default. */
  accent?: string
}) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvas.current
    if (!cv) return
    return startGL(cv, async (THREE, renderer) => {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(40, 1920 / 1080, 0.02, 200)
      reelLights(THREE, scene, renderer, accent)
      scene.environment = await environment(THREE, renderer)
      await yieldFrame()
      const ground = makeTerrain(THREE)
      if (accent) ground.mat.uniforms.uColor.value.set(accent)
      ground.mesh.position.set(0, -3.6, -8)
      ground.mat.uniforms.uOpacity.value = 0.55
      ground.mat.uniforms.uNear.value = 1.5
      ground.mat.uniforms.uGrid.value = 0.16
      ground.mat.uniforms.uFar.value = 42
      scene.add(ground.mesh)
      const tpl = await loadAirframe(THREE)
      await yieldFrame()
      const swarm: Airframe[] = []
      for (let i = 0; i < N; i++) {
        const af = makeAirframe(THREE, tpl, { lite: true })
        af.scale.setScalar(0.34)
        scene.add(af)
        swarm.push(af)
      }
      const look = new THREE.Vector3()
      const v = new THREE.Vector3()
      const setCam = (
        x: number,
        y: number,
        z: number,
        tx: number,
        ty: number,
        tz: number,
        fov: number,
        roll: number
      ) => {
        camera.position.set(x, y, z)
        camera.up.set(0, 1, 0)
        look.set(tx, ty, tz)
        camera.lookAt(look)
        if (roll) camera.rotateZ(roll)
        if (camera.fov !== fov) {
          camera.fov = fov
          camera.updateProjectionMatrix()
        }
      }
      let cleared = false

      return {
        warm: { scene, camera },
        frame: () => {
          const l = clock.time()
          if (l < 0) {
            if (!cleared) renderer.clear()
            cleared = true
            return
          }
          cleared = false
          const tunnelBar = l >= bt(4) && l < bt(8)
          const glyphBar = l >= bt(8)
          ground.mesh.visible = !tunnelBar
          ground.mat.uniforms.uTime.value = 30 + l * 3
          ground.mat.uniforms.uShift.value = l * 1.5
          const flipK = (i: number) =>
            E.inOut(prog(l, bt(10) + i * 0.011, bt(10) + i * 0.011 + 0.36))
          swarm.forEach((af: THREE_NS.Group & Airframe, i) => {
            af.visible = true
            const pp = formation(i, l)
            const qq = formation(i, l + 1 / 60)
            v.set(
              (qq[0] - pp[0]) * 60,
              (qq[1] - pp[1]) * 60,
              (qq[2] - pp[2]) * 60
            )
            af.position.set(pp[0], pp[1], pp[2])
            af.scale.setScalar(
              lerp(0.34, 0.28, E.out(prog(l, bt(8), bt(8) + 0.5)))
            )
            if (glyphBar) {
              // top to the camera, so each drone reads as a bright X of four rotor discs; a staggered roll on beat 10
              const settle = E.out(prog(l, bt(8), bt(8) + 0.5))
              af.rotation.set(
                (settle * Math.PI) / 2 +
                  clamp(-v.y * 0.02, -0.4, 0.4) +
                  flipK(i) * Math.PI * 2,
                0.06 * Math.sin(i * 1.7),
                clamp(v.x * 0.02, -0.4, 0.4),
                'YZX'
              )
            } else {
              const yaw = tunnelBar
                ? Math.PI / 2
                : -Math.PI / 2 +
                  0.25 * Math.sin(i * 1.7) +
                  clamp(v.x * 0.03, -0.6, 0.6)
              af.rotation.set(
                clamp(-v.x * 0.025, -0.7, 0.7),
                yaw,
                clamp(-v.z * 0.02 + v.y * 0.02, -0.6, 0.6),
                'YZX'
              )
            }
            af.position.y += 0.05 * Math.sin(l * 7 + i)
            spin(af, l * 160 + i, 150, 1)
          })
          if (tunnelBar) {
            // through the tunnel, rolling
            const u = E.inOut(prog(l, bt(4), bt(8)))
            const z = lerp(5.5, -11.5, u)
            setCam(
              0,
              0,
              z,
              0.3 * Math.sin(u * 3),
              0,
              z - 10,
              62,
              u * Math.PI * 1.2
            )
          } else if (glyphBar) {
            const push = E.out(prog(l, bt(8), bt(12)))
            setCam(
              0.3 * Math.sin(l * 0.8),
              0.3,
              lerp(11.5, 10.7, push),
              0,
              0.2,
              0,
              40,
              0.02 * Math.sin(l * 1.7)
            )
          } else {
            const orbit = lerp(-0.55, 0.5, E.soft(prog(l, 0, bt(4))))
            const R = lerp(8.6, 7.6, prog(l, 0, bt(4)))
            setCam(
              Math.sin(orbit) * R,
              1.15 + 0.6 * prog(l, bt(3), bt(4)),
              Math.cos(orbit) * R,
              0,
              -0.1,
              0,
              40,
              0.04 * Math.sin(l * 2.3)
            )
          }
          renderer.render(scene, camera)
        },
        dispose: () => {
          ground.geo.dispose()
          ground.mat.dispose()
          swarm.forEach((af) => af.userData.blurMat.dispose())
          scene.environment?.dispose()
        },
      }
    })
  }, [clock, accent])

  return (
    <canvas ref={canvas} className="v6-canvas" width={1920} height={1080} />
  )
}
