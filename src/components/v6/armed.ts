/*
 * The reel's clock, ported from videos/armed-30/assets/js/core.js: the beat
 * grid every scene is cut to, its easing curves, deterministic noise for the
 * camera kicks, and the seek-safe tween driver. Everything is a pure function
 * of time, so a shot lands the same whether it plays, replays, or is jumped
 * to its end for reduced motion.
 */

export const BPM = 128
export const B = 60 / BPM // 0.46875 s
export const BAR = 4 * B // 1.875 s
export const beat = (n: number) => n * B

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const prog = (t: number, a: number, b: number) =>
  clamp((t - a) / (b - a))

export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const ax = 3 * x1 - 3 * x2 + 1,
    bx = 3 * x2 - 6 * x1,
    cx = 3 * x1
  const ay = 3 * y1 - 3 * y2 + 1,
    by = 3 * y2 - 6 * y1,
    cy = 3 * y1
  const sx = (u: number) => ((ax * u + bx) * u + cx) * u
  const sy = (u: number) => ((ay * u + by) * u + cy) * u
  const dx = (u: number) => (3 * ax * u + 2 * bx) * u + cx
  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let u = x
    for (let i = 0; i < 8; i++) {
      const e = sx(u) - x
      const d = dx(u)
      if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break
      u -= e / d
    }
    return sy(clamp(u))
  }
}

export const E = {
  linear: (t: number) => t,
  out: bezier(0.23, 1, 0.32, 1),
  inOut: bezier(0.77, 0, 0.175, 1),
  soft: bezier(0.45, 0, 0.55, 1),
  in: bezier(0.55, 0, 1, 0.45),
}

/** Integer hash to [0, 1). */
export function hash(i: number, seed: number) {
  let h = Math.imul(i | 0, 374761393) + Math.imul(seed | 0, 668265263)
  h = (h ^ (h >>> 13)) >>> 0
  h = Math.imul(h, 1274126177) >>> 0
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

/** Value noise with a smootherstep, a pure function of (x, seed). */
export function noise(x: number, seed: number) {
  const i = Math.floor(x)
  const f = x - i
  const u = f * f * f * (f * (f * 6 - 15) + 10)
  return hash(i, seed) * (1 - u) + hash(i + 1, seed) * u
}

/**
 * A tween target whose `p` runs fn on every write, seeks included (an
 * onUpdate callback can be skipped on a seek; a setter cannot).
 */
export function driver(fn: (p: number) => void) {
  const o = {} as { p: number }
  let v = 0
  Object.defineProperty(o, 'p', {
    get: () => v,
    set: (x: number) => {
      v = x
      fn(x)
    },
  })
  return o
}

/** A hit on the cut: the frame kicks, and may flash, ghost, or invert. k is strength. */
export interface Impact {
  t: number
  k: number
  flash?: number
  ghost?: number
  invert?: boolean
}

/** The frame's offset at local time t: decaying noise kicks, as the reel's camera rig. */
export function kick(impacts: Impact[], t: number) {
  let x = 0,
    y = 0,
    r = 0,
    s = 0,
    fl = 0,
    gh = 0,
    inv = 0
  impacts.forEach((im, i) => {
    const d = t - im.t
    if (d < 0 || d > 0.6) return
    const env = Math.exp(-d * 11) * im.k
    x += (noise(d * 38, 3 + i) - 0.5) * 52 * env
    y += (noise(d * 41, 9 + i) - 0.5) * 52 * env
    r += (noise(d * 30, 17 + i) - 0.5) * 1.6 * env
    s += 0.07 * Math.exp(-d * 9) * im.k
    if (im.flash) fl += im.flash * Math.exp(-d * 20)
    if (im.ghost) gh += im.ghost * Math.exp(-d * 13)
    if (im.invert && d < 0.06) inv = 1
  })
  return { x, y, r, s, fl, gh, inv }
}

/** 00:00:SS:FF at 30 frames a second. */
export function timecode(t: number) {
  const f = Math.max(0, Math.floor(t * 30 + 1e-6))
  const s = Math.floor(f / 30)
  return `00:${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`
}

export const GLYPHS = 'ABCDEFGHJKLMNPRSTUVXYZ0123456789#/<>*+='

/** A line decoding out of glyph noise: characters before p resolve; the rest churn by frame. */
export function decode(text: string, p: number, frame: number) {
  return text
    .split('')
    .map((c, i) =>
      c === ' ' || i / text.length < p
        ? c
        : GLYPHS[Math.floor(hash(i, frame) * GLYPHS.length)]
    )
    .join('')
}
