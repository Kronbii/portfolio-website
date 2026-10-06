/*
 * ARMED: shared clock, beat grid, easing, noise, and the simulated flight.
 * Loaded as a classic script in the root <head>, so every sub-composition
 * and the three.js layer read the same numbers (window.ARMED).
 * Everything here is a pure function of time.
 */
;(function () {
  const BPM = 128
  const B = 60 / BPM // 0.46875 s
  const BAR = 4 * B // 1.875 s
  const beat = (n) => n * B

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
  const lerp = (a, b, t) => a + (b - a) * t
  const prog = (t, a, b) => clamp((t - a) / (b - a))

  function bezier(x1, y1, x2, y2) {
    const ax = 3 * x1 - 3 * x2 + 1, bx = 3 * x2 - 6 * x1, cx = 3 * x1
    const ay = 3 * y1 - 3 * y2 + 1, by = 3 * y2 - 6 * y1, cy = 3 * y1
    const sx = (u) => ((ax * u + bx) * u + cx) * u
    const sy = (u) => ((ay * u + by) * u + cy) * u
    const dx = (u) => (3 * ax * u + 2 * bx) * u + cx
    return (x) => {
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
  const E = {
    linear: (t) => t,
    out: bezier(0.23, 1, 0.32, 1),
    inOut: bezier(0.77, 0, 0.175, 1),
    soft: bezier(0.45, 0, 0.55, 1),
    in: bezier(0.55, 0, 1, 0.45),
    expo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    back: (t) => {
      const c = 1.9
      return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
    },
  }

  // deterministic value noise (integer hash + smootherstep), after the
  // registry's camera-shake component; pure function of (x, seed)
  function hash(i, seed) {
    let h = Math.imul(i | 0, 374761393) + Math.imul(seed | 0, 668265263)
    h = (h ^ (h >>> 13)) >>> 0
    h = Math.imul(h, 1274126177) >>> 0
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296
  }
  function noise(x, seed) {
    const i = Math.floor(x)
    const f = x - i
    const u = f * f * f * (f * (f * 6 - 15) + 10)
    return hash(i, seed) * (1 - u) + hash(i + 1, seed) * u
  }

  // scenes (seconds). Each is one sub-composition; the 3D layer spans all.
  const SCENES = [
    { id: 's01-arm', label: 'ARM', a: 0, b: BAR },
    { id: 's02-flip', label: 'FLIP', a: BAR, b: 2 * BAR },
    { id: 's03-name', label: 'ID', a: 2 * BAR, b: 3 * BAR },
    { id: 's04-see', label: 'SEE', a: 3 * BAR, b: 4 * BAR },
    { id: 's05-map', label: 'MAP', a: 4 * BAR, b: 5 * BAR },
    { id: 's06-heat', label: 'HEAT', a: 5 * BAR, b: 5 * BAR + 2 * B },
    { id: 's07-tune', label: 'TUNE', a: 5 * BAR + 2 * B, b: 6 * BAR },
    { id: 's08-fly', label: 'FLY', a: 6 * BAR, b: 7 * BAR },
    { id: 's09-sign', label: 'SIGN', a: 7 * BAR, b: 8 * BAR },
  ]

  // impacts: camera kicks + flash. k = strength
  const IMPACTS = [
    { t: beat(1), k: 0.55, flash: 0.35 }, // ARMED
    { t: beat(3), k: 0.3, flash: 0 }, // lift
    { t: beat(5), k: 0.35, flash: 0 }, // flip
    { t: beat(8), k: 1.0, flash: 0.9, ghost: 1 }, // the drop, name
    { t: beat(9), k: 0.6, flash: 0.25 },
    { t: beat(12), k: 0.55, flash: 0.3, ghost: 0.6 }, // SEE
    { t: beat(16), k: 0.6, flash: 0.35, ghost: 0.6 }, // MAP
    { t: beat(18), k: 0.4, flash: 0 },
    { t: beat(20), k: 0.6, flash: 0.4, ghost: 0.8 }, // HEAT
    { t: beat(21), k: 0.45, flash: 0.2 },
    { t: beat(22), k: 0.55, flash: 0, invert: 1 }, // TUNE
    { t: beat(24), k: 1.0, flash: 0.8, ghost: 1 }, // FLY
    { t: beat(25), k: 0.35, flash: 0 },
    { t: beat(26), k: 0.35, flash: 0 },
    { t: beat(27), k: 0.35, flash: 0 },
    { t: beat(28), k: 0.9, flash: 0.9, ghost: 0.8 }, // SIGN
    { t: beat(30), k: 0.35, flash: 0 },
  ]

  /* ---------------- the simulated flight (frames 1–2) ----------------
     The OSD and the 3D layer both read this, so the readouts are the
     animation's own state, labelled SIM on screen. */
  const ARM_T = beat(1)
  function throttle(t) {
    if (t < ARM_T) return 0
    if (t < beat(2)) return 0.14
    if (t < beat(3)) return lerp(0.14, 0.58, E.out(prog(t, beat(2), beat(3))))
    if (t < 1.72) return lerp(0.58, 0.7, prog(t, beat(3), 1.72))
    if (t < BAR) return 1
    if (t < beat(5)) return lerp(0.78, 0.62, prog(t, BAR, beat(5)))
    if (t < 2.72) return 0.9 // flip: punch
    if (t < 2 * BAR) return lerp(0.66, 0.95, prog(t, 2.72, 2 * BAR))
    return 0.6
  }
  // blade angle: integral of an angular rate tied to throttle (fixed step,
  // so it is identical however the frame is reached)
  function bladeAngle(t) {
    const dt = 1 / 480
    let a = 0
    for (let s = ARM_T; s < t; s += dt) {
      const thr = throttle(s)
      a += (thr > 0 ? 18 + thr * 150 : 0) * dt
    }
    return a
  }
  function flight(t) {
    // pose of the hero airframe in world units; nose along +x at yaw 0
    const s = { x: 0, y: 0, z: 0, roll: 0, pitch: 0, yaw: 0.55, thr: throttle(t), armed: t >= ARM_T }
    if (t < BAR) {
      const lift = E.out(prog(t, beat(3), 1.74))
      const punch = E.in(prog(t, 1.7, BAR))
      s.y = lift * 0.62 + punch * 5.5
      s.pitch = -0.08 * lift + 0.3 * punch
      s.roll = 0.05 * Math.sin(t * 9) * lift
      return s
    }
    // frame 2: enter from the left, flip, turn to camera, dive at the lens
    const enter = E.out(prog(t, BAR, beat(5)))
    s.x = lerp(-7.5, 0, enter)
    s.y = 0.35 + 0.25 * Math.sin(prog(t, BAR, beat(5)) * Math.PI)
    s.yaw = 0
    s.pitch = -0.35 * (1 - enter)
    const flip = E.inOut(prog(t, beat(5), 2.74))
    s.roll = flip * Math.PI * 2
    s.y += Math.sin(flip * Math.PI) * 0.55
    const turn = E.inOut(prog(t, 2.76, 3.08))
    s.yaw = turn * (-Math.PI / 2) // nose (+x) swings to face the camera (+z)
    // reaches the glass at 3.62, then keeps going through it to the cut
    const dive = E.in(prog(t, 3.06, 3.62)) + 0.14 * prog(t, 3.62, 2 * BAR)
    s.dive = dive
    s.pitch += 0.22 * turn - 0.3 * dive
    return s
  }

  // a tween target whose `p` runs fn on every write, seeks included (an
  // onUpdate callback can be suppressed on seek; a setter cannot)
  function driver(fn) {
    const o = {}
    let v = 0
    Object.defineProperty(o, 'p', { get: () => v, set: (x) => { v = x; fn(x) } })
    return o
  }

  window.ARMED = { driver, BPM, B, BAR, beat, clamp, lerp, prog, bezier, E, hash, noise, SCENES, IMPACTS, ARM_T, throttle, bladeAngle, flight }
})()
