import * as THREE from 'three'

import type { DroneParts } from './geometry'

/**
 * A behavior owns what the machine does each frame.
 *
 * Every behavior receives elapsed time, scroll progress through its host
 * section (0 at the top, 1 once scrolled past), and the camera, so a variant can
 * drive the machine, the frame, or both.
 */

export interface DroneFrame {
  /** seconds since mount */
  t: number
  /** seconds since last frame, clamped */
  dt: number
  /** 0..1 through the host element */
  p: number
  camera: THREE.PerspectiveCamera
  parts: DroneParts
  /** additional machines, for formation variants */
  flight: DroneParts[]
  reduced: boolean
}

export type DroneBehavior = (f: DroneFrame) => void

const spinRotors = (parts: DroneParts, dt: number, rate = 26) => {
  parts.rotors.forEach((r) => {
    r.rotation.y += dt * rate * (r.userData.dir as number)
  })
}

/** The hero: slow yaw drift, scroll tips it over and drops it away. */
export const orbit: DroneBehavior = ({ dt, t, p, parts, camera, reduced }) => {
  if (!reduced) spinRotors(parts, dt)
  const g = parts.group
  g.rotation.y = -0.55 + Math.sin(t * 0.24) * 0.16 + p * 1.9
  g.rotation.x = 0.1 + p * 0.36
  g.rotation.z = Math.sin(t * 0.31) * 0.035 - p * 0.12
  g.position.y = Math.sin(t * 0.62) * 0.045 - p * 0.35
  camera.position.y = 1.35 + p * 0.9
  camera.lookAt(0, -0.05, 0)
}

/** Turntable: pure slow rotation, nothing else. Good beside dense text. */
export const turntable: DroneBehavior = ({ dt, t, parts, reduced }) => {
  if (!reduced) spinRotors(parts, dt, 18)
  parts.group.rotation.y = t * 0.22
  parts.group.rotation.x = 0.22
}

/**
 * Exploded view: scroll pulls the machine apart along its own axes and holds
 * it open. The teardown a drawing set would show.
 */
export const exploded: DroneBehavior = ({ dt, t, p, parts, camera, reduced }) => {
  if (!reduced) spinRotors(parts, dt, 6)
  const e = THREE.MathUtils.smoothstep(p, 0, 0.75)

  parts.booms.forEach((boom, i) => {
    boom.position.x = e * 0.55
    boom.position.y = e * (i % 2 === 0 ? 0.16 : -0.16)
  })
  parts.shell.position.y = 0.1 + e * 0.72
  parts.bay.position.y = 0.2 + e * 0.34
  parts.nose.position.x = 0.58 + e * 0.5
  parts.gimbal.position.y = -0.21 - e * 0.6
  parts.skids.position.y = -e * 0.85
  parts.mast.position.y = 0.3 + e * 0.4

  parts.group.rotation.y = -0.5 + t * 0.06
  parts.group.rotation.x = 0.16 + e * 0.1
  camera.position.z = 3.5 + e * 0.9
  camera.lookAt(0, 0, 0)
}

/** Plan view: straight down, the way a drawing sheet shows it. */
export const plan: DroneBehavior = ({ dt, t, p, parts, camera, reduced }) => {
  if (!reduced) spinRotors(parts, dt, 22)
  parts.group.rotation.set(0, t * 0.12 + p * 0.6, 0)
  camera.position.set(0, 4.6, 0.001)
  camera.lookAt(0, 0, 0)
}

/** Approach: comes out of depth and settles as the section arrives. */
export const approach: DroneBehavior = ({ dt, t, p, parts, camera, reduced }) => {
  if (!reduced) spinRotors(parts, dt, 30)
  const a = THREE.MathUtils.smoothstep(p, 0, 0.6)
  const g = parts.group
  g.position.z = -9 + a * 9
  g.position.y = 1.4 - a * 1.4 + Math.sin(t * 0.7) * 0.04
  g.rotation.y = -1.5 + a * 0.95
  g.rotation.x = 0.32 - a * 0.22
  camera.lookAt(0, 0, 0)
}

/** Descent: the loop ending — the machine settles onto its skids. */
export const descent: DroneBehavior = ({ dt, t, p, parts, camera, reduced }) => {
  const d = THREE.MathUtils.smoothstep(p, 0, 0.85)
  if (!reduced) spinRotors(parts, dt, 30 * (1 - d) + 2)
  const g = parts.group
  g.position.y = 1.1 - d * 1.1 + Math.sin(t * 0.9) * 0.03 * (1 - d)
  g.rotation.x = 0.24 * (1 - d)
  g.rotation.z = Math.sin(t * 0.5) * 0.03 * (1 - d)
  g.rotation.y = -0.6 + t * 0.05
  camera.lookAt(0, 0.1, 0)
}

/**
 * Scan: a perception motif. The machine holds still while the gimbal sweeps,
 * and the nav lamps pulse as if the sensor were sampling.
 */
export const scan: DroneBehavior = ({ dt, t, parts, camera, reduced }) => {
  if (!reduced) spinRotors(parts, dt, 14)
  parts.group.rotation.y = -0.6 + Math.sin(t * 0.18) * 0.1
  parts.group.rotation.x = 0.18
  parts.gimbal.rotation.y = Math.sin(t * 0.9) * 0.7
  parts.gimbal.rotation.z = Math.sin(t * 0.45) * 0.18
  const pulse = (Math.sin(t * 3.2) + 1) / 2
  parts.navLights.forEach((n) => {
    n.scale.setScalar(0.7 + pulse * 0.9)
  })
  camera.lookAt(0, -0.05, 0)
}

/** Formation: several machines holding station, scroll spreads the stack. */
export const swarm: DroneBehavior = ({ dt, t, p, flight, camera, reduced }) => {
  flight.forEach((unit, i) => {
    if (!reduced) spinRotors(unit, dt, 24 + i * 2)
    const phase = i * 1.7
    const lane = i - (flight.length - 1) / 2
    const g = unit.group
    g.position.x = lane * (1.5 + p * 1.1)
    g.position.y = Math.sin(t * 0.6 + phase) * 0.12 + Math.abs(lane) * -0.22
    g.position.z = Math.cos(t * 0.4 + phase) * 0.3 - Math.abs(lane) * 0.5
    g.rotation.y = -0.5 + Math.sin(t * 0.2 + phase) * 0.14
    g.rotation.z = Math.sin(t * 0.5 + phase) * 0.05
    g.rotation.x = 0.12
  })
  camera.lookAt(0, -0.1, 0)
}

/** Scrub: scroll is the only clock. Nothing moves unless the reader moves. */
export const scrub: DroneBehavior = ({ p, parts, camera }) => {
  parts.rotors.forEach((r) => {
    r.rotation.y = p * 34 * (r.userData.dir as number)
  })
  const g = parts.group
  g.rotation.y = -1.1 + p * 3.4
  g.rotation.x = 0.05 + Math.sin(p * Math.PI) * 0.4
  g.position.y = Math.sin(p * Math.PI) * 0.35
  camera.position.z = 3.9 - Math.sin(p * Math.PI) * 0.7
  camera.lookAt(0, 0, 0)
}

/** Bank: a slow coordinated turn, as if holding an orbit over a target. */
export const bank: DroneBehavior = ({ dt, t, parts, camera, reduced }) => {
  if (!reduced) spinRotors(parts, dt, 28)
  const g = parts.group
  g.rotation.y = t * 0.35
  g.rotation.z = -0.34
  g.rotation.x = 0.1
  g.position.y = Math.sin(t * 0.35) * 0.1
  camera.lookAt(0, 0, 0)
}

export const BEHAVIORS = {
  orbit,
  turntable,
  exploded,
  plan,
  approach,
  descent,
  scan,
  swarm,
  scrub,
  bank,
} as const

export type DroneVariant = keyof typeof BEHAVIORS
