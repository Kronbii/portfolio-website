/*
 * One Loop — the signal engine.
 *
 * Everything here is a pure function of time. The signal is a list of timed
 * pieces in world space; each piece is sampled with the time the head passes
 * every point, so the phosphor tail (exp(-age/tau), the oscilloscope-trace
 * block's closed-form persistence) is exact at any seek. The camera is keyed
 * between "follow the head" and "hold on a station" (viewport-change,
 * multi-phase-camera). World units are pixels at scale 1.
 */
;(function () {
  'use strict'

  /* ---------------------------------------------------------------- math */
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
  const lerp = (a, b, k) => a + (b - a) * k
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
    const sx = (u) => ((ax * u + bx) * u + cx) * u
    const sy = (u) => ((ay * u + by) * u + cy) * u
    return (x) => {
      if (x <= 0) return 0
      if (x >= 1) return 1
      let lo = 0, hi = 1, u = x
      for (let i = 0; i < 30; i++) {
        if (sx(u) < x) lo = u
        else hi = u
        u = (lo + hi) / 2
      }
      return sy(u)
    }
  }
  const E = {
    linear: (x) => x,
    out: bezier(0.23, 1, 0.32, 1),
    inOut: bezier(0.77, 0, 0.175, 1),
    soft: bezier(0.45, 0, 0.55, 1),
    in: bezier(0.55, 0, 1, 0.45),
  }

  /** Damped free response of the airframe's self-level loop, released at amp. */
  function damped(tau, amp, zeta, omega) {
    if (tau <= 0) return amp
    const wd = omega * Math.sqrt(1 - zeta * zeta)
    return amp * Math.exp(-zeta * omega * tau) * (Math.cos(wd * tau) + ((zeta * omega) / wd) * Math.sin(wd * tau))
  }
  /** Unit step response of an underdamped second-order system (x in px). */
  function step(x, zeta, omega) {
    if (x <= 0) return 0
    const wd = omega * Math.sqrt(1 - zeta * zeta)
    return 1 - Math.exp(-zeta * omega * x) * (Math.cos(wd * x) + ((zeta * omega) / wd) * Math.sin(wd * x))
  }

  /* ---------------------------------------------------------- the world */
  const W = {
    row: [600, 1600, 2600],
    xR: 5650,
    xL: 0,
    turnR: 500,
    name: { x: 1250, baseline: 586, period: [2505, 564] },
    ticks: [2900, 4060, 5200],
    pano: { x: 4250, y: 1300, w: 1200, h: 600 },
    thermal: { x: 2400, y: 1258, w: 900, h: 685 },
    race: { x: 760, y: 1338, w: 700, h: 525, lap: [720, 1298, 1500, 1902], r: 60 },
    pid: { x0: 720, x1: 1940, up: 760, down: 1350, amp: 300, zeta: 0.35, omega: 0.0254 },
    daleel: { x: 2660, y: 2075, w: 1000, h: 486 },
    merges: [
      [4450, 4650],
      [4700, 4900],
      [4950, 5150],
    ],
    end: [5650, 2600],
    sig: { x: 4450, y: 2700, w: 1200, h: 264 },
    page: { x: 2825, y: 1690, s: 0.2647 },
  }

  /** Airframe roll used both by the drone and by the first stretch of line. */
  const T_CATCH = 0.4
  function roll(t) {
    if (t < T_CATCH) return 0.42 * clamp((t - 0.05) / (T_CATCH - 0.05), 0, 1)
    return damped(t - T_CATCH, 0.42, 0.26, 8.6)
  }

  /* --------------------------------------------------- path primitives */
  // A polyline with arc-length parametrisation: f(u) walks it at constant speed.
  function poly(points) {
    const acc = [0]
    for (let i = 1; i < points.length; i++) {
      acc.push(acc[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]))
    }
    const total = acc[acc.length - 1] || 1
    return {
      len: total,
      at(u) {
        const d = clamp(u, 0, 1) * total
        let lo = 0, hi = acc.length - 1
        while (hi - lo > 1) {
          const m = (lo + hi) >> 1
          if (acc[m] <= d) lo = m
          else hi = m
        }
        const seg = acc[hi] - acc[lo] || 1
        const k = (d - acc[lo]) / seg
        return [lerp(points[lo][0], points[hi][0], k), lerp(points[lo][1], points[hi][1], k)]
      },
    }
  }
  const cubic = (p0, p1, p2, p3, n = 24) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const u = i / n, v = 1 - u
      return [
        v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0],
        v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1],
      ]
    })
  const arc = (cx, cy, r, a0, a1, n = 64) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const a = a0 + ((a1 - a0) * i) / n
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
    })
  const line = (x0, x1, y, n = 2) => Array.from({ length: n + 1 }, (_, i) => [lerp(x0, x1, i / n), y])
  const join = (...parts) => parts.reduce((a, p) => a.concat(a.length ? p.slice(1) : p), [])

  /* ------------------------------------------------------- the pieces */
  const [Y1, Y2, Y3] = W.row
  const P = []
  const add = (t0, t1, ease, f) => P.push({ t0, t1, ease, f })

  // 0. telemetry: the drone's roll, written behind it as the camera pans.
  add(T_CATCH, 2.0, E.linear, (u) => {
    const t = lerp(T_CATCH, 2.0, u)
    return [1040 * u, Y1 - 190 * roll(t)]
  })
  // 1. freed: runs flat beneath the name and curls up into the full stop.
  {
    const [px, py] = W.name.period
    const g = poly(join(line(1040, 2430, Y1, 8), cubic([2430, Y1], [2478, Y1], [px - 4, py + 22], [px, py])))
    add(2.0, 3.0, E.out, (u) => g.at(u))
    add(3.0, 3.35, E.linear, () => [px, py])
    const g2 = poly(join(cubic([px, py], [px + 8, py + 26], [px + 50, Y1], [px + 110, Y1]), line(px + 110, W.xR, Y1, 12)))
    add(3.35, 4.62, E.linear, (u) => g2.at(u))
  }
  // 2. row turn: right-hand U.
  {
    const g = poly(arc(W.xR, (Y1 + Y2) / 2, W.turnR, -Math.PI / 2, Math.PI / 2, 90))
    add(4.62, 5.1, E.soft, (u) => g.at(u))
  }
  // 3. row two, right to left: panorama horizon, then the thermal wipe.
  {
    const g = poly(line(W.xR, 3700, Y2, 8))
    add(5.1, 5.95, E.out, (u) => g.at(u))
    const g2 = poly(line(3700, 3300, Y2, 2))
    add(5.95, 6.55, E.soft, (u) => g2.at(u))
    const g3 = poly(line(3300, 2400, Y2, 4))
    add(6.55, 7.3, E.soft, (u) => g3.at(u))
    const g4 = poly(line(2400, 1620, Y2, 4))
    add(7.3, 7.55, E.in, (u) => g4.at(u))
  }
  // 4. the lap: one and a half laps of the race car's plate, then out left.
  {
    const [x0, y0, x1, y1] = W.race.lap
    const r = W.race.r
    const lap = (start) =>
      join(
        [[x1, start], [x1, y0 + r]],
        arc(x1 - r, y0 + r, r, 0, -Math.PI / 2, 12),
        [[x1 - r, y0], [x0 + r, y0]],
        arc(x0 + r, y0 + r, r, -Math.PI / 2, -Math.PI, 12),
        [[x0, y0 + r], [x0, y1 - r]],
        arc(x0 + r, y1 - r, r, Math.PI, Math.PI / 2, 12),
        [[x0 + r, y1], [x1 - r, y1]],
        arc(x1 - r, y1 - r, r, Math.PI / 2, 0, 12),
        [[x1, y1 - r], [x1, Y2]],
      )
    const half = join(
      [[x1, Y2], [x1, y0 + r]],
      arc(x1 - r, y0 + r, r, 0, -Math.PI / 2, 12),
      [[x1 - r, y0], [x0 + r, y0]],
      arc(x0 + r, y0 + r, r, -Math.PI / 2, -Math.PI, 12),
      [[x0, y0 + r], [x0, Y2]],
    )
    const g = poly(join([[1620, Y2], [x1, Y2]], lap(Y2), half, [[x0, Y2], [W.xL, Y2]]))
    add(7.55, 8.95, E.soft, (u) => g.at(u))
  }
  // 5. row turn: left-hand U.
  {
    const g = poly(arc(W.xL, (Y2 + Y3) / 2, W.turnR, -Math.PI / 2, -Math.PI * 1.5, 90))
    add(8.95, 9.5, E.soft, (u) => g.at(u))
  }
  // 6. row three: the step response (superposed up and down steps), Daleel, upstream, settle.
  {
    const { x0, x1, up, down, amp, zeta, omega } = W.pid
    const pts = []
    for (let x = x0; x <= x1; x += 4) pts.push([x, Y3 - amp * (step(x - up, zeta, omega) - step(x - down, zeta, omega))])
    add(9.5, 9.62, E.linear, (u) => [lerp(W.xL, x0, u), Y3])
    const g = poly(pts)
    add(9.62, 10.5, E.linear, (u) => g.at(u))
    const g2 = poly(join([[x1, pts[pts.length - 1][1]], [2000, Y3]], line(2000, 3740, Y3, 6)))
    add(10.5, 11.6, E.soft, (u) => g2.at(u))
    add(11.6, 12.45, E.soft, (u) => [lerp(3740, 5150, u), Y3])
    const settle = []
    for (let x = 5150; x <= W.end[0]; x += 3) {
      const k = (x - 5150) / (W.end[0] - 5150)
      settle.push([x, Y3 - 70 * Math.exp(-5 * k) * Math.sin(k * Math.PI * 5.5) * (1 - k)])
    }
    const g3 = poly(settle)
    add(12.45, 13.0, E.out, (u) => g3.at(u))
  }

  // Sample every piece with the time the head passes each point.
  const SAMPLES = []
  for (const p of P) {
    const d = p.t1 - p.t0
    let len = 0, prev = p.f(0)
    for (let i = 1; i <= 64; i++) {
      const q = p.f(i / 64)
      len += Math.hypot(q[0] - prev[0], q[1] - prev[1])
      prev = q
    }
    const n = Math.max(2, Math.ceil(Math.max(len / 5, d * 240)))
    for (let i = 0; i <= n; i++) {
      const tau = i / n
      const [x, y] = p.f(p.ease(tau))
      SAMPLES.push({ x, y, t: p.t0 + d * tau })
    }
  }
  const T_END = P[P.length - 1].t1

  function head(t) {
    if (t <= P[0].t0) return P[0].f(0)
    for (const p of P) {
      if (t <= p.t1) return p.f(p.ease(clamp((t - p.t0) / (p.t1 - p.t0), 0, 1)))
    }
    const last = P[P.length - 1]
    return last.f(1)
  }
  /** First time the head reaches world x moving in direction dir (+1 right, -1 left) on row y. */
  function timeAtX(x, rowY, dir) {
    for (let i = 1; i < SAMPLES.length; i++) {
      const a = SAMPLES[i - 1], b = SAMPLES[i]
      if (Math.abs(a.y - rowY) > 400) continue
      if ((dir > 0 && a.x <= x && b.x >= x) || (dir < 0 && a.x >= x && b.x <= x)) {
        const k = (x - a.x) / (b.x - a.x || 1)
        return lerp(a.t, b.t, k)
      }
    }
    return null
  }

  /* -------------------------------------------------------- the camera */
  const hold = (x, y, s = 1) => ({ x, y, s })
  const follow = (ox, oy, s = 1) => ({ follow: [ox, oy], s })
  const KEYS = [
    [0, 2.0, follow(220, 60), follow(220, 60), E.linear],
    [2.0, 2.6, follow(220, 60), hold(1880, 520), E.inOut],
    [2.6, 3.35, hold(1880, 520), hold(1880, 520), E.linear],
    [3.35, 3.75, hold(1880, 520), follow(220, 80), E.inOut],
    [3.75, 4.62, follow(220, 80), follow(220, 80), E.linear],
    [4.62, 5.1, follow(220, 80), follow(-120, 60), E.soft],
    [5.1, 5.45, follow(-120, 60), hold(4540, 1540), E.inOut],
    [5.45, 5.95, hold(4540, 1540), hold(4540, 1540), E.linear],
    [5.95, 6.45, hold(4540, 1540), hold(2540, 1528), E.inOut],
    [6.45, 7.35, hold(2540, 1528), hold(2540, 1528), E.linear],
    [7.35, 7.85, hold(2540, 1528), hold(800, 1540), E.inOut],
    [7.85, 8.95, hold(800, 1540), hold(800, 1540), E.linear],
    [8.95, 9.5, hold(800, 1540), follow(-200, 60), E.soft],
    [9.5, 9.75, follow(-200, 60), hold(1000, 2540), E.inOut],
    [9.75, 10.6, hold(1000, 2540), hold(1000, 2540), E.linear],
    [10.6, 10.95, hold(1000, 2540), hold(2840, 2505), E.inOut],
    [10.95, 11.6, hold(2840, 2505), hold(2840, 2505), E.linear],
    [11.6, 11.95, hold(2840, 2505), hold(4725, 2560), E.inOut],
    [11.95, 13.0, hold(4725, 2560), hold(4725, 2560), E.linear],
    [13.0, 14.1, hold(4725, 2560), hold(W.page.x, W.page.y, W.page.s), bezier(0.65, 0, 0.25, 1)],
    [14.1, 15.0, hold(W.page.x, W.page.y, W.page.s), hold(W.page.x + 30, W.page.y - 10, W.page.s * 1.025), E.soft],
  ]
  function resolve(spec, t) {
    if (!spec.follow) return [spec.x, spec.y, spec.s]
    const [hx, hy] = head(t)
    // follow: the head sits at screen centre minus the offset
    return [hx - spec.follow[0] / spec.s, hy - spec.follow[1] / spec.s, spec.s]
  }
  function camera(t) {
    let k = KEYS[KEYS.length - 1]
    for (const key of KEYS) {
      if (t <= key[1]) {
        k = key
        break
      }
    }
    const u = k[4](clamp((t - k[0]) / (k[1] - k[0]), 0, 1))
    const a = resolve(k[2], t), b = resolve(k[3], t)
    // scale interpolates geometrically so a 4x pull-back reads as a steady zoom
    const s = Math.exp(lerp(Math.log(a[2]), Math.log(b[2]), u))
    // translate interpolates on screen-centre targets weighted by scale
    return { x: lerp(a[0], b[0], u), y: lerp(a[1], b[1], u), s }
  }

  /* ---------------------------------------------------------- drawing */
  const BRAND = [201, 104, 106]
  const BRAND_HI = [224, 138, 139]
  const INK = [251, 245, 234]
  const TAU = 0.12 // phosphor persistence, seconds
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`

  function draw(ctx, t, cam, opts) {
    const SW = 1920, SH = 1080
    const sx = (x) => (x - cam.x) * cam.s + SW / 2
    const sy = (y) => (y - cam.y) * cam.s + SH / 2
    ctx.clearRect(0, 0, SW, SH)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const w = Math.max(1.6, 3.4 * Math.sqrt(cam.s))

    // secondary marks: ticks, the PID setpoint, the upstream branches, the end setpoint
    drawSecondary(ctx, t, sx, sy, cam)

    // the permanent trace
    const now = Math.min(t, T_END)
    ctx.strokeStyle = rgba(BRAND, 0.92)
    ctx.lineWidth = w
    ctx.beginPath()
    let started = false, lastI = -1
    for (let i = 0; i < SAMPLES.length; i++) {
      const p = SAMPLES[i]
      if (p.t > now) break
      lastI = i
      const X = sx(p.x), Y = sy(p.y)
      if (!started) {
        ctx.moveTo(X, Y)
        started = true
      } else ctx.lineTo(X, Y)
    }
    const hp = head(now)
    if (started && t >= P[0].t0) ctx.lineTo(sx(hp[0]), sy(hp[1]))
    if (started) ctx.stroke()
    if (t < P[0].t0) return

    // phosphor tail: additive, decaying with age since the head passed
    ctx.globalCompositeOperation = 'lighter'
    const window = 3 * TAU
    let prevX = sx(hp[0]), prevY = sy(hp[1])
    for (let i = lastI; i >= 0; i--) {
      const p = SAMPLES[i]
      const age = now - p.t
      if (age > window) break
      const a = Math.exp(-age / TAU)
      const X = sx(p.x), Y = sy(p.y)
      ctx.beginPath()
      ctx.moveTo(prevX, prevY)
      ctx.lineTo(X, Y)
      ctx.strokeStyle = rgba(BRAND, a * 0.16)
      ctx.lineWidth = w * 5
      ctx.stroke()
      ctx.strokeStyle = rgba(BRAND_HI, a * 0.85)
      ctx.lineWidth = w * 1.5
      ctx.stroke()
      if (a > 0.55) {
        ctx.strokeStyle = rgba(INK, (a - 0.55) * 1.6)
        ctx.lineWidth = w * 0.55
        ctx.stroke()
      }
      prevX = X
      prevY = Y
    }
    ctx.globalCompositeOperation = 'source-over'

    // the head: hot core in a burgundy bloom; it cools once the loop has settled
    const live = opts.headLive
    const X = sx(hp[0]), Y = sy(hp[1])
    const R = (live ? 30 : 18) * Math.max(0.6, Math.sqrt(cam.s))
    const g = ctx.createRadialGradient(X, Y, 0, X, Y, R)
    g.addColorStop(0, rgba(BRAND_HI, live ? 0.75 : 0.5))
    g.addColorStop(0.35, rgba(BRAND, live ? 0.35 : 0.22))
    g.addColorStop(1, rgba(BRAND, 0))
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(X, Y, R, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = live ? rgba(INK, 0.95) : rgba(BRAND_HI, 1)
    ctx.beginPath()
    ctx.arc(X, Y, Math.max(2.4, 5 * Math.sqrt(cam.s)), 0, Math.PI * 2)
    ctx.fill()
  }

  function dashed(ctx, x0, y0, x1, y1, color, width, dash) {
    ctx.save()
    ctx.setLineDash(dash)
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
    ctx.restore()
  }

  function drawSecondary(ctx, t, sx, sy, cam) {
    const hair = 'rgba(251,245,234,0.28)'
    const ds = Math.max(0.35, cam.s)
    // ticks on row one
    for (const x of W.ticks) {
      const tt = timeAtX(x, W.row[0], 1)
      if (tt == null || t < tt - 0.05) continue
      const k = E.out(clamp((t - tt + 0.05) / 0.25, 0, 1))
      ctx.strokeStyle = rgba(INK, 0.6)
      ctx.lineWidth = Math.max(1.5, 3 * Math.sqrt(cam.s))
      ctx.beginPath()
      ctx.moveTo(sx(x), sy(W.row[0] - 34 * k))
      ctx.lineTo(sx(x), sy(W.row[0] + 34 * k))
      ctx.stroke()
    }
    // PID: setpoint square wave (dashed) appears as the head approaches the scope
    {
      const { x0, x1, up, down, amp } = W.pid
      const t0 = 9.5
      if (t >= t0) {
        const k = E.out(clamp((t - t0) / 0.4, 0, 1))
        const Y = W.row[2]
        const xEnd = lerp(x0, x1, k)
        ctx.save()
        ctx.setLineDash([10 * ds, 10 * ds])
        ctx.strokeStyle = hair
        ctx.lineWidth = Math.max(1, 2 * Math.sqrt(cam.s))
        ctx.beginPath()
        ctx.moveTo(sx(x0), sy(Y))
        const seg = [[up, Y], [up, Y - amp], [down, Y - amp], [down, Y], [x1, Y]]
        for (const [x, y] of seg) {
          if (x > xEnd) {
            ctx.lineTo(sx(xEnd), sy(y))
            break
          }
          ctx.lineTo(sx(x), sy(y))
        }
        ctx.stroke()
        ctx.restore()
        // scope graticule: hairline frame and divisions
        ctx.strokeStyle = `rgba(251,245,234,${(0.1 * k).toFixed(3)})`
        ctx.lineWidth = 1
        for (let i = 0; i <= 6; i++) {
          const x = sx(lerp(x0 - 20, x1 + 20, i / 6))
          ctx.beginPath()
          ctx.moveTo(x, sy(Y - amp - 150))
          ctx.lineTo(x, sy(Y + 150))
          ctx.stroke()
        }
        for (let i = 0; i <= 4; i++) {
          const y = sy(lerp(Y - amp - 150, Y + 150, i / 4))
          ctx.beginPath()
          ctx.moveTo(sx(x0 - 20), y)
          ctx.lineTo(sx(x1 + 20), y)
          ctx.stroke()
        }
      }
    }
    // upstream: each branch leaves the line, carries a commit, and merges back
    W.merges.forEach(([a, b]) => {
      const ta = timeAtX(a, W.row[2], 1)
      const tb = timeAtX(b, W.row[2], 1)
      if (ta == null || t < ta) return
      const k = clamp((t - ta) / Math.max(0.05, tb - ta), 0, 1)
      const Y = W.row[2]
      const lift = 110
      const n = 40
      ctx.strokeStyle = rgba(BRAND, 0.9)
      ctx.lineWidth = Math.max(1.4, 2.6 * Math.sqrt(cam.s))
      ctx.beginPath()
      for (let i = 0; i <= n * k; i++) {
        const u = i / n
        const x = lerp(a, b, u)
        const y = Y - lift * Math.pow(Math.sin(Math.PI * u), 0.6)
        if (i === 0) ctx.moveTo(sx(x), sy(y))
        else ctx.lineTo(sx(x), sy(y))
      }
      ctx.stroke()
      // the commit on the branch, and the merge dot once it lands
      const mid = sx((a + b) / 2), top = sy(Y - lift)
      if (k > 0.5) {
        ctx.fillStyle = rgba(INK, 1)
        ctx.beginPath()
        ctx.arc(mid, top, Math.max(3, 7 * Math.sqrt(cam.s)), 0, Math.PI * 2)
        ctx.fill()
      }
      if (k >= 1) {
        const pop = E.out(clamp((t - tb) / 0.25, 0, 1))
        ctx.fillStyle = rgba(BRAND_HI, 1)
        ctx.beginPath()
        ctx.arc(sx(b), sy(Y), Math.max(3, 9 * pop * Math.sqrt(cam.s)), 0, Math.PI * 2)
        ctx.fill()
      }
    })
    // the setpoint at the end of the line
    if (t >= 12.6) {
      const k = E.out(clamp((t - 12.6) / 0.4, 0, 1))
      const [ex, ey] = W.end
      dashed(ctx, sx(ex - 520 * k), sy(ey), sx(ex + 60), sy(ey), hair, Math.max(1, 2 * Math.sqrt(cam.s)), [8 * ds, 8 * ds])
    }
  }

  window.OneLoop = { W, E, P, SAMPLES, T_END, clamp, lerp, roll, head, timeAtX, camera, draw, bezier }
})()
