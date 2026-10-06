'use client'

import { useEffect, useRef } from 'react'

import { B, E, hash, lerp, prog } from '@/components/v6/armed'
import { environment } from '@/components/v6/gl/airframe'
import { reelLights, startGL, yieldFrame } from '@/components/v6/gl/host'
import type { ShotClock } from '@/components/v6/shot'

import { makeBoard, makeRoutes, makeShadows } from './board'
import { loadGo2, makePack, STAND, type Pose } from './go2'

/*
 * The pack's 3D layer, FLY's equivalent on the ground: 36 Unitree Go2s on a
 * circuit board. Bar one: they stand milling while a scan ring sweeps the
 * board, fall into ranks, then trot out into a ring as the camera circles.
 * Bar two: four lanes gallop at a low camera and stream past it. Bar three:
 * from a crane, they trot into RK., the board lights a trace between every
 * two of them, a second scan runs out from the letters, and a jump goes
 * through them left to right. Every pose is a pure function of the shot's
 * time, so a replay or a jump to the end lands the same.
 */

const N = 36
type V2 = [number, number]

/** RK. on a 15 x 7 grid, 36 cells, as the drones spell it. */
const CELLS: V2[] = (() => {
  const R = ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X.X..', 'X..X.', 'X...X']
  const K = ['X...X', 'X..X.', 'X.X..', 'XX...', 'X.X..', 'X..X.', 'X...X']
  const out: V2[] = []
  R.forEach((row, r) =>
    [...row].forEach((c, k) => c === 'X' && out.push([k, r]))
  )
  K.forEach((row, r) =>
    [...row].forEach((c, k) => c === 'X' && out.push([k + 7, r]))
  )
  out.push([13, 5], [14, 5], [13, 6], [14, 6])
  return out
})()
/** The crane's resting place in bar three, and its lens. */
const EYE = [0, 15.4, 16.3] as const
const FOV = 36
/**
 * Where a point of the frame (stage pixels) falls on the board, seen from the
 * crane: the letters are laid out as an upright grid on screen and projected
 * down, so they read square, not leaning to the vanishing point.
 */
function onBoard(u: number, v: number): V2 {
  const [ex, ey, ez] = EYE
  const fl = Math.hypot(ex, ey, ez)
  const f = [-ex / fl, -ey / fl, -ez / fl]
  const rl = Math.hypot(f[2], f[0])
  const r = [-f[2] / rl, 0, f[0] / rl]
  const up = [
    r[1] * f[2] - r[2] * f[1],
    r[2] * f[0] - r[0] * f[2],
    r[0] * f[1] - r[1] * f[0],
  ]
  const t = Math.tan((FOV * Math.PI) / 360)
  const nx = ((u / 1920) * 2 - 1) * t * (1920 / 1080)
  const ny = (1 - (v / 1080) * 2) * t
  const d = [0, 1, 2].map((k) => f[k] + r[k] * nx + up[k] * ny)
  const k = -ey / d[1]
  return [ex + k * d[0], ez + k * d[2]]
}
/** A letter cell's place on the board: the glyph spans the lock's frame. */
const cellAt = ([c, r]: V2): V2 => onBoard(390 + (c / 14) * 1140, 365 + r * 62)

const bt = (n: number) => n * B
const mix = (a: V2, b: V2, k: number): V2 => [
  a[0] + (b[0] - a[0]) * k,
  a[1] + (b[1] - a[1]) * k,
]
const RUN = 6.5
const LANES = [-2.7, -1.3, 1.3, 2.7]
const FACE = -Math.PI / 2

/** Where robot i stands at time l, and the way it faces when it is not walking. */
function place(i: number, l: number): [number, number, number] {
  if (l < bt(4)) {
    const a = i * 2.399963
    const r = 2.6 * Math.sqrt((i + 0.5) / N)
    const pack: V2 = [Math.cos(a) * r, Math.sin(a) * r]
    const rank: V2 = [((i % 6) - 2.5) * 1.2, (Math.floor(i / 6) - 2.5) * 1.05]
    const ra = (i / N) * Math.PI * 2 + Math.max(0, l - bt(2)) * 0.55
    const ring: V2 = [Math.cos(ra) * 4.3, Math.sin(ra) * 4.3]
    const d = (i % 9) * 0.012
    let p = mix(pack, rank, E.inOut(prog(l, bt(1) + d, bt(1) + d + 0.55)))
    p = mix(p, ring, E.inOut(prog(l, bt(2) + d, bt(2) + d + 0.6)))
    const rest = l < bt(1) + 0.3 ? (hash(i, 5) - 0.5) * Math.PI * 2 : FACE
    return [p[0], p[1], rest]
  }
  if (l < bt(8)) {
    const row = Math.floor(i / 4)
    const x = LANES[i % 4] + (hash(i, 8) - 0.5) * 0.3
    const z = 3 - row * 1.6 + (hash(i, 9) - 0.5) * 0.5 + (l - bt(4)) * RUN
    return [x, z, FACE]
  }
  const slot = cellAt(CELLS[(i * 7) % N])
  const from: V2 = [
    slot[0] * 1.2 + (hash(i, 10) - 0.5) * 1.5,
    slot[1] - 6.5 - hash(i, 11) * 1.5,
  ]
  const d = (i % 6) * 0.03
  const p = mix(from, slot, E.out(prog(l, bt(8) + d, bt(8) + d + 1)))
  return [p[0], p[1], FACE]
}

/**
 * When robot i jumps: a wave through the letters, left to right, half a beat
 * after the lock; the last lands before the shot holds, so its final frame
 * (all that reduced motion shows) has every robot standing.
 */
const jumpAt = (i: number) => bt(9.5) + (CELLS[(i * 7) % N][0] / 14) * 0.4

/** The jump, as keys of (time, body lift, thigh, calf, pitch). */
const JUMP: [number, number, number, number, number][] = [
  [0, 0, 0.9, -1.8, 0],
  [0.12, -0.09, 1.3, -2.5, 0.05],
  [0.19, 0.07, 0.55, -1.1, -0.18],
  [0.31, 0.42, 1.15, -2.3, -0.05],
  [0.44, 0.05, 0.85, -1.65, 0.1],
  [0.54, -0.07, 1.2, -2.4, 0.04],
  [0.7, 0, 0.9, -1.8, 0],
]
function jump(t: number) {
  if (t <= 0 || t >= 0.7) return null
  let k = 0
  while (JUMP[k + 1][0] < t) k++
  const a = JUMP[k]
  const b = JUMP[k + 1]
  const u = E.inOut((t - a[0]) / (b[0] - a[0]))
  return [1, 2, 3, 4].map((j) => lerp(a[j], b[j], u))
}

const angleTo = (a: number, b: number, k: number) => {
  const d = Math.atan2(Math.sin(b - a), Math.cos(b - a))
  return a + d * k
}
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export function PackGL({
  clock,
  accent,
}: {
  clock: ShotClock
  accent: string
}) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvas.current
    if (!cv) return
    return startGL(cv, async (THREE, renderer) => {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(38, 1920 / 1080, 0.05, 200)
      reelLights(THREE, scene, renderer, accent)
      scene.environment = await environment(THREE, renderer)
      await yieldFrame()
      const board = makeBoard(THREE, accent)
      scene.add(board.mesh)
      const shadows = makeShadows(THREE, N)
      scene.add(shadows.mesh)
      const routes = makeRoutes(THREE, CELLS, cellAt)
      scene.add(routes.group)
      const go2 = await loadGo2(THREE)
      await yieldFrame()
      const pack = makePack(THREE, go2, N)
      scene.add(pack.group)

      // the vision layer: boxes that lock onto a few robots, positioned here, shown by the shot's timeline
      const boxes = Array.from(
        cv.closest('.v6-rig')?.querySelectorAll<HTMLElement>('[data-track]') ??
          []
      )
      const corner = new THREE.Vector3()
      const placeAt = new THREE.Matrix4()
      const turn = new THREE.Quaternion()
      const up = new THREE.Vector3(0, 1, 0)
      const one = new THREE.Vector3(1, 1, 1)

      const look = new THREE.Vector3()
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
        camera.updateMatrixWorld()
      }

      const legs: Pose['legs'] = [
        [0, 0.9, -1.8],
        [0, 0.9, -1.8],
        [0, 0.9, -1.8],
        [0, 0.9, -1.8],
      ]
      const pose: Pose = {
        x: 0,
        y: STAND,
        z: 0,
        heading: 0,
        pitch: 0,
        roll: 0,
        legs,
      }
      const heads = new Float32Array(N)
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
          const bar = l < bt(4) ? 0 : l < bt(8) ? 1 : 2

          // the camera
          if (bar === 0) {
            const u = E.soft(prog(l, 0, bt(4)))
            const reveal = E.inOut(prog(l, bt(2.3), bt(4)))
            const a = lerp(-0.62, 0.45, u)
            const R = lerp(lerp(6.4, 5.8, u), 9.6, reveal)
            const h = lerp(2.0, 5.2, reveal)
            setCam(
              Math.sin(a) * R,
              h,
              Math.cos(a) * R,
              0,
              lerp(0.25, -0.4, reveal),
              0,
              38,
              0.012 * Math.sin(l * 2.3)
            )
          } else if (bar === 1) {
            const t = l - bt(4)
            const zc = 7 + t * 2.2
            setCam(
              0.25 * Math.sin(t * 1.3),
              0.78,
              zc,
              0,
              0.42,
              zc - 10,
              52,
              0.05 * Math.sin(t * 2)
            )
          } else {
            const push = E.out(prog(l, bt(8), bt(12)))
            setCam(
              0.3 * Math.sin(l * 0.6),
              lerp(16.5, EYE[1], push),
              lerp(17.5, EYE[2], push),
              0,
              0,
              0,
              FOV,
              0
            )
          }

          // the board: signal runs on its traces; scans sweep at the start and at the lock
          const m = board.mat.uniforms
          m.uTime.value = l
          if (bar === 0) {
            m.uScanC.value.set(0, 0)
            m.uScan.value = 11 * E.out(prog(l, 0.04, 1.3))
            m.uScanA.value = 1 - prog(l, 0.9, 1.5)
          } else if (bar === 2) {
            m.uScanC.value.set(0, 0)
            m.uScan.value = 14 * E.out(prog(l, bt(9), bt(9) + 1.4))
            m.uScanA.value =
              prog(l, bt(9), bt(9) + 0.05) *
              (1 - prog(l, bt(9) + 0.9, bt(9) + 1.6))
          } else m.uScanA.value = 0
          routes.opacity =
            bar === 2
              ? 0.85 * prog(l, bt(9) + 0.12, bt(9) + 0.4) +
                0.15 * Math.sin(l * 3) * prog(l, bt(10.5), bt(11.5))
              : 0

          // the pack
          const f = bar === 1 ? 3.1 : 2.3
          for (let i = 0; i < N; i++) {
            const [x, z, rest] = place(i, l)
            const [x2, z2] = place(i, l + 1 / 60)
            const vx = (x2 - x) * 60
            const vz = (z2 - z) * 60
            const speed = Math.hypot(vx, vz)
            const w = smooth(0.25, 0.9, speed)
            const moving = Math.atan2(-vz, vx)
            const heading = w > 0.001 ? angleTo(rest, moving, w) : rest
            heads[i] = heading
            const amp = smooth(0.15, 1.1, speed) * (bar === 1 ? 1.25 : 1)
            const phi = Math.PI * 2 * (f * l + hash(i, 3))
            for (let k = 0; k < 4; k++) {
              const ph = phi + (k === 0 || k === 3 ? 0 : Math.PI)
              legs[k][0] = 0
              legs[k][1] = 0.9 + 0.38 * amp * Math.sin(ph)
              legs[k][2] = -1.8 - 0.62 * amp * Math.max(0, -Math.cos(ph))
            }
            pose.x = x
            pose.z = z
            pose.heading = heading
            pose.y =
              STAND -
              0.012 * amp * (1 - Math.cos(2 * phi)) -
              (bar === 1 ? 0.025 * amp : 0) +
              (bar === 2 ? 0.004 * Math.sin(l * 2.2 + i) : 0)
            pose.pitch = 0
            pose.roll = 0.025 * amp * Math.sin(phi)
            let lift = 0
            const jp = bar === 2 ? jump(l - jumpAt(i)) : null
            if (jp) {
              lift = Math.max(0, jp[0])
              pose.y = STAND + jp[0]
              pose.pitch = jp[3]
              for (let k = 0; k < 4; k++) {
                legs[k][1] = jp[1]
                legs[k][2] = jp[2]
              }
            }
            pack.set(i, pose)
            shadows.set(i, x, z, heading, lift)
            // the pad under a jumping robot flashes: the wave reads as light running through the letters
            if (bar === 2) {
              const tj = l - jumpAt(i)
              routes.flash(
                (i * 7) % N,
                tj > 0.08 && tj < 0.8
                  ? Math.sin(Math.PI * prog(tj, 0.08, 0.8)) * 1.2
                  : 0
              )
            }
          }
          pack.commit()
          shadows.commit()
          routes.commit()

          // the vision boxes follow their robots
          if (bar === 0 && l < bt(2.4)) {
            boxes.forEach((el) => {
              const i = Number(el.dataset.track)
              const [x, z] = place(i, l)
              turn.setFromAxisAngle(up, heads[i])
              placeAt.compose(corner.set(x, 0, z), turn, one)
              let x0 = 1e9,
                y0 = 1e9,
                x1 = -1e9,
                y1 = -1e9
              for (let c = 0; c < 8; c++) {
                corner
                  .set(
                    c & 1 ? 0.42 : -0.42,
                    c & 2 ? 0.46 : 0,
                    c & 4 ? 0.2 : -0.2
                  )
                  .applyMatrix4(placeAt)
                  .project(camera)
                const sx = ((corner.x + 1) / 2) * 1920
                const sy = ((1 - corner.y) / 2) * 1080
                x0 = Math.min(x0, sx)
                x1 = Math.max(x1, sx)
                y0 = Math.min(y0, sy)
                y1 = Math.max(y1, sy)
              }
              el.style.transform = `translate(${(x0 - 8).toFixed(1)}px, ${(y0 - 8).toFixed(1)}px)`
              el.style.width = `${(x1 - x0 + 16).toFixed(1)}px`
              el.style.height = `${(y1 - y0 + 16).toFixed(1)}px`
            })
          }

          renderer.render(scene, camera)
        },
        dispose: () => {
          board.geo.dispose()
          board.mat.dispose()
          shadows.dispose()
          routes.dispose()
          pack.dispose()
          scene.environment?.dispose()
        },
      }
    })
  }, [clock, accent])

  return (
    <canvas ref={canvas} className="v6-canvas" width={1920} height={1080} />
  )
}
