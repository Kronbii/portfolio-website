'use client'

import { traceCurve, traceEdges, tracePoints } from '@/content/v6/frames'

import { B, BAR, driver, type Impact } from '../armed'
import { Shot, type Rect } from '../shot'

/* 08 TRACE: a crack mask becomes an ordered path, a curve, and metrics. */

const IMPACTS: Impact[] = [
  { t: 0, k: 0.6, flash: 0.35, ghost: 0.6 },
  { t: 2 * B, k: 0.3 },
]
const CROP: Rect = [1130, 48, 710, 984]
const STEPS = [
  'Pre-segmented mask',
  'Candidate points',
  'Order · classic / MST / greedy',
  'Curve · overlay · metrics',
]
const TAGS = ['Mask', 'Points', 'Order · MST', 'Curve']
const NP = tracePoints.length
const NE = traceEdges.length

function build(root: HTMLElement, tl: gsap.core.Timeline) {
  const tag = root.querySelector<HTMLElement>('.s10-tag')!
  const steps = root.querySelectorAll<HTMLElement>('.s10-step')
  // the plate swings in on its hinge; the mask scans in
  tl.fromTo(
    '.s10-plate',
    { rotationY: -38, x: 260, opacity: 0 },
    { rotationY: 0, x: 0, opacity: 1, duration: 0.3, ease: 'expo.out' },
    0
  )
  tl.fromTo(
    '.s10-no',
    { opacity: 0, x: -40 },
    { opacity: 1, x: 0, duration: 0.2, ease: 'expo.out' },
    0.02
  )
  tl.fromTo(
    '.s10-title .w',
    { yPercent: 115 },
    { yPercent: 0, duration: 0.3, ease: 'expo.out', stagger: 0.045 },
    0.03
  )
  tl.fromTo(
    '.s10-step',
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.2, ease: 'expo.out', stagger: 0.03 },
    0.08
  )
  tl.fromTo(
    '.s10-who',
    { opacity: 0 },
    { opacity: 1, duration: 0.2, ease: 'none' },
    0.2
  )
  tl.fromTo(
    '.s10-ink',
    { clipPath: 'inset(0 0 100% 0)' },
    { clipPath: 'inset(0 0 0% 0)', duration: 0.3, ease: 'power2.out' },
    0.04
  )
  tl.fromTo(
    '.s10-scan',
    { y: 0, opacity: 1 },
    { y: 940, duration: 0.3, ease: 'power2.out' },
    0.04
  )
  tl.to('.s10-scan', { opacity: 0, duration: 0.05, ease: 'none' }, 0.34)
  // candidate points pop down the crack, in tree order
  root.querySelectorAll<SVGCircleElement>('.s10-pt').forEach((c) => {
    const k = +c.dataset.k!
    const x = +c.getAttribute('cx')!,
      y = +c.getAttribute('cy')!
    tl.fromTo(
      c,
      { scale: 0, svgOrigin: `${x} ${y}` },
      { scale: 1, svgOrigin: `${x} ${y}`, duration: 0.14, ease: 'back.out(3)' },
      B + (k / NP) * 0.3
    )
  })
  // the spanning tree grows edge by edge, depth first
  root.querySelectorAll<SVGLineElement>('.s10-ed').forEach((e) => {
    const k = +e.dataset.k!
    const len = +e.getAttribute('stroke-dasharray')!
    tl.fromTo(
      e,
      { strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 0.05, ease: 'none' },
      2 * B + (k / NE) * 0.38
    )
  })
  // the smoothed main run draws, and the exports land
  tl.fromTo(
    '.s10-curve',
    { strokeDashoffset: traceCurve.length },
    { strokeDashoffset: 0, duration: 0.3, ease: 'power2.inOut' },
    3 * B
  )
  tl.fromTo(
    '.s10-ink',
    { opacity: 0.42 },
    { opacity: 0.22, duration: 0.2, ease: 'none', immediateRender: false },
    3 * B
  )
  tl.fromTo(
    '.s10-file',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.18, ease: 'back.out(2.4)', stagger: 0.06 },
    3 * B + 0.2
  )
  let shown = -1
  const state = driver((l) => {
    const k = Math.max(0, Math.min(3, Math.floor(l / B + 1e-6)))
    if (k === shown) return
    tag.innerHTML = `<b>0${k + 1}</b> ${TAGS[k]}`
    steps.forEach((s, j) => s.classList.toggle('on', j === k))
    shown = k
  })
  tl.fromTo(state, { p: 0 }, { p: BAR, duration: BAR, ease: 'none' }, 0)
  ;[0, B, 2 * B, 3 * B].forEach((at) =>
    tl.fromTo(
      '.s10-tag',
      { scale: 1.35 },
      {
        scale: 1,
        duration: 0.2,
        ease: 'back.out(2.4)',
        immediateRender: false,
      },
      at
    )
  )
}

export function TraceShot({
  label,
  replay,
}: {
  label: string
  replay?: string
}) {
  return (
    <Shot
      scene="s10"
      label={label}
      impacts={IMPACTS}
      build={build}
      crop={CROP}
      replay={replay}
    >
      <div className="m s10-no">08 · Trace</div>
      <div className="s10-title">
        <span className="ln">
          <span className="w">Fine-crack</span>
        </span>
        <span className="ln">
          <span className="w">
            <em>tracing</em>
          </span>
        </span>
        <span className="ln">
          <span className="w">toolkit</span>
        </span>
      </div>
      {STEPS.map((s, i) => (
        <div
          key={s}
          className={`m s10-step s10-s${i + 1}${i === 0 ? ' on' : ''}`}
        >
          <b>0{i + 1}</b>
          {s}
        </div>
      ))}
      <div className="m s10-who">
        Python package · CLI
        <br />
        repository owner and maintainer
      </div>
      <div className="s10-stage">
        <div className="s10-plate">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="s10-ink" src="/images/v6/crack-ink.png" alt="" />
          <svg viewBox="0 0 470 944">
            {traceEdges.map(([x1, y1, x2, y2, len, k]) => (
              <line
                key={`e${k}`}
                className="s10-ed"
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeDasharray={len}
                strokeDashoffset={len}
                data-k={k}
              />
            ))}
            <polyline
              className="s10-curve"
              points={traceCurve.points}
              strokeDasharray={traceCurve.length}
              strokeDashoffset={traceCurve.length}
            />
            {tracePoints.map(([x, y, k]) => (
              <circle
                key={`p${k}`}
                className="s10-pt"
                cx={x}
                cy={y}
                r={5}
                data-k={k}
              />
            ))}
          </svg>
          <div className="s10-scan" />
          <div className="s10-tag">
            <b>01</b> Mask
          </div>
          <div className="s10-out">
            <span className="s10-file">CSV</span>
            <span className="s10-file">JSON</span>
          </div>
        </div>
      </div>
    </Shot>
  )
}
