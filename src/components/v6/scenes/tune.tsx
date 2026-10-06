'use client'

import { B, E, clamp, driver, type Impact } from '../armed'
import { ACCENT2_RGB, ACCENT_RGB, C, PAPER_RGB } from '../palette'
import { Shot, type Rect } from '../shot'

/* 07 TUNE: a step response tuned on sixteenths until it settles (simulated). */

const IMPACTS: Impact[] = [
  { t: 0, k: 0.55, invert: true },
  { t: 2 * B, k: 0.3 },
]
const CROP: Rect = [90, 110, 1740, 900]
const CHIPS = [
  'Independent instances',
  'Anti-windup',
  'Derivative filter',
  'Output limits',
  'Runtime tuning',
  'Relay autotuner',
]

const W = 1700,
  H = 660
const X0 = 120,
  X1 = 1640,
  Y0 = 570,
  Y1 = 310 // step from 0 (Y0) to setpoint (Y1)
const STEP_AT = 0.07
const RUNS = [0.06, 0.16, 0.36, 0.72] // damping per sixteenth, ringing to settled
const SIX = B / 4

/** Unit step of a second-order loop; u is 0..1 across the trace. */
function response(z: number, u: number) {
  const tau = Math.max(0, u - STEP_AT) * 46
  if (tau <= 0) return 0
  const wd = Math.sqrt(1 - z * z)
  return (
    1 -
    Math.exp(-z * tau) * (Math.cos(wd * tau) + (z / wd) * Math.sin(wd * tau))
  )
}
const yOf = (v: number) => Y0 + (Y1 - Y0) * v

function build(root: HTMLElement, tl: gsap.core.Timeline) {
  const cv = root.querySelector<HTMLCanvasElement>('.s07-cv')!
  const g = cv.getContext('2d')!
  const zetaEl = root.querySelector<HTMLElement>('.s07-zeta b')!

  function trace(
    z: number,
    upto: number,
    alpha: number,
    width: number,
    glow: boolean
  ) {
    g.save()
    g.lineJoin = 'round'
    g.lineCap = 'round'
    g.strokeStyle = `rgba(${ACCENT_RGB}, ${alpha.toFixed(3)})`
    if (glow) {
      g.shadowColor = `rgba(${ACCENT2_RGB}, 0.8)`
      g.shadowBlur = 18
    }
    g.lineWidth = width
    g.beginPath()
    const n = Math.max(2, Math.floor(upto * 420))
    for (let i = 0; i <= n; i++) {
      const u = i / 420
      const x = X0 + (X1 - X0) * u
      const y = yOf(response(z, u))
      if (i === 0) g.moveTo(x, y)
      else g.lineTo(x, y)
    }
    g.stroke()
    if (glow && upto < 1) {
      const x = X0 + (X1 - X0) * upto,
        y = yOf(response(z, upto))
      g.fillStyle = C.paper
      g.shadowColor = `rgba(${PAPER_RGB}, 0.9)`
      g.shadowBlur = 26
      g.beginPath()
      g.arc(x, y, 7, 0, Math.PI * 2)
      g.fill()
    }
    g.restore()
  }

  function draw(l: number) {
    g.clearRect(0, 0, W, H)
    // setpoint: a dashed square step
    g.save()
    g.setLineDash([14, 12])
    g.strokeStyle = `rgba(${PAPER_RGB}, 0.5)`
    g.lineWidth = 3
    g.beginPath()
    const xs = X0 + (X1 - X0) * STEP_AT
    g.moveTo(X0, Y0)
    g.lineTo(xs, Y0)
    g.lineTo(xs, Y1)
    g.lineTo(X1, Y1)
    g.stroke()
    g.restore()
    // each run sweeps in one sixteenth; older runs cool like phosphor
    RUNS.forEach((z, i) => {
      const t0 = i * SIX
      if (l < t0) return
      const sweep = clamp((l - t0) / (SIX * 0.9))
      const age = Math.max(0, l - (t0 + SIX * 0.9))
      const last = i === RUNS.length - 1
      const alpha = last ? 1 : Math.max(0.12, Math.exp(-age / 0.12))
      trace(z, E.out(sweep), alpha, last ? 6 : 4, last || age < 0.05)
    })
    const k = Math.min(RUNS.length - 1, Math.floor(l / SIX + 1e-6))
    zetaEl.textContent = RUNS[k].toFixed(2)
  }

  tl.fromTo(
    '.s07-scope',
    { scaleY: 0.02, opacity: 1 },
    { scaleY: 1, duration: 0.12, ease: 'expo.out' },
    0
  )
  tl.fromTo(
    '.s07-k, .s07-zeta',
    { opacity: 0 },
    { opacity: 1, duration: 0.05, ease: 'none', stagger: 0.03 },
    0.06
  )
  tl.fromTo(
    '.s07-title',
    { opacity: 0, x: -80, filter: 'blur(14px)' },
    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.2, ease: 'expo.out' },
    0.04
  )
  tl.fromTo(
    '.s07-no, .s07-meta',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.22, ease: 'expo.out', stagger: 0.04 },
    0.12
  )
  tl.fromTo(
    '.s07-ok',
    { opacity: 0 },
    { opacity: 1, duration: 0.001, ease: 'none' },
    B
  )
  tl.fromTo(
    '.s07-ok',
    { scale: 0.4 },
    { scale: 1, duration: 0.2, ease: 'back.out(2.6)' },
    B
  )
  const d = driver(draw)
  tl.fromTo(d, { p: 0 }, { p: 4 * B, duration: 4 * B, ease: 'none' }, 0)
  // what the library does, stamped on sixteenths
  root.querySelectorAll('.s07-chip').forEach((c, i) => {
    tl.fromTo(
      c,
      { opacity: 0, y: 18, scale: 0.7 },
      { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'back.out(2.2)' },
      2 * B + i * (B / 4)
    )
  })
}

export function TuneShot({
  label,
  replay,
}: {
  label: string
  replay?: string
}) {
  return (
    <Shot
      scene="s07"
      label={label}
      impacts={IMPACTS}
      build={build}
      crop={CROP}
      replay={replay}
    >
      <div className="s07-scope">
        <canvas className="s07-cv" width={W} height={H} />
      </div>
      <div className="m s07-k">Step response · simulated</div>
      <div className="m s07-zeta">
        <span style={{ textTransform: 'none' }}>ζ</span> <b>0.06</b>
      </div>
      <div className="m s07-ok">Settled</div>
      <div className="s07-title">
        easy<em>PID</em>
      </div>
      <div className="m s07-no">07 · Tune</div>
      <div className="m s07-meta">
        v1.1.0 · Arduino Library Manager
        <br />
        hardware-agnostic · MIT
      </div>
      <div className="s07-chips">
        {CHIPS.map((c) => (
          <span key={c} className="s07-chip">
            {c}
          </span>
        ))}
      </div>
    </Shot>
  )
}
