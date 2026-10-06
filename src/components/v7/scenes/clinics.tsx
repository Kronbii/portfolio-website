'use client'

import { gsap } from 'gsap'

import { FringePath } from '../optic'
import { Scene } from '../scene'
import { B, BAR, drawIn, focusIn } from '../tempo'

/*
 * For clinics, Basira: a retinal image (drawn, not a patient's) is read three
 * times, once by each model; their three readings close in on one another to
 * show how far they agree; and the report waits for the doctor, who confirms
 * or overrides it. The one figure is the record's: about two seconds an eye
 * on an ordinary CPU.
 */

const C = { x: 600, y: 470 }
const VESSELS = [
  'M 690 470 C 640 400 560 360 430 330',
  'M 690 470 C 650 540 560 590 440 620',
  'M 690 470 C 720 390 760 320 820 250',
  'M 690 470 C 730 550 770 620 820 690',
  'M 610 380 C 560 410 500 420 400 430',
  'M 600 560 C 560 530 500 520 410 520',
  'M 760 330 C 800 360 850 380 880 420',
  'M 760 620 C 800 590 850 560 885 520',
]
const RINGS = [330, 352, 374]

function ring(r: number) {
  return `M ${C.x} ${C.y - r} a ${r} ${r} 0 1 1 -0.01 0`
}

function build(root: HTMLElement, tl: gsap.core.Timeline) {
  focusIn(tl, '.b-eye', 0, { dur: 1.6 * B, blur: 18, ca: 14, scale: 0.94 })
  drawIn(tl, '.b-vessel', 0.8 * B, 1.4 * B, 0.08 * B)
  focusIn(tl, '.b-fig, .b-fig-k', 1.2 * B, { y: 16, stagger: 0.2 * B })
  // three readings, one a beat
  ;[0, 1, 2].forEach((i) => {
    drawIn(tl, `.b-ring${i}`, (2.2 + i) * B, 0.9 * B)
    focusIn(tl, `.b-m${i}`, (2.4 + i) * B, { y: 18 })
  })
  // how far they agree: the three readings close in on one place
  focusIn(tl, '.b-agree', 5.2 * B, { y: 12 })
  tl.fromTo(
    '.b-tick',
    { x: (i: number) => [-150, 40, 170][i] },
    { x: 0, duration: 1.1 * B, ease: 'sine.inOut', stagger: 0.06 * B },
    5.4 * B
  )
  focusIn(tl, '.b-doc', 6.6 * B, { y: 20 })
  tl.fromTo(
    '.b-ok',
    { scale: 0.6, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.6 * B, ease: 'back.out(2)' },
    7.3 * B
  )
}

/** The readers keep circling, slowly. */
function ambient(root: HTMLElement) {
  return gsap.to(root.querySelectorAll('.b-ring'), {
    rotation: 360,
    svgOrigin: `${C.x} ${C.y}`,
    duration: 6 * BAR,
    ease: 'none',
    repeat: -1,
    stagger: { each: BAR / 2 },
  })
}

export function ClinicsScene({
  label,
  replay,
  note,
}: {
  label: string
  replay: string
  note: string
}) {
  return (
    <Scene
      name="clinics"
      label={label}
      build={build}
      ambient={ambient}
      replay={replay}
      note={note}
    >
      <div className="b-fig fx">~2 s</div>
      <div className="b-fig-k">per eye, on an ordinary CPU</div>
      <div className="b-eye" />
      <svg className="v7-lines" viewBox="0 0 1200 1200">
        <circle className="b-disc" cx={690} cy={470} r={42} />
        {VESSELS.map((d, i) => (
          <FringePath
            key={i}
            className="b-vessel"
            d={d}
            width={i < 4 ? 6 : 3.5}
          />
        ))}
        {RINGS.map((r, i) => (
          <g key={r} className={`b-ring b-ring${i}`}>
            <FringePath d={ring(r)} width={3} />
          </g>
        ))}
      </svg>
      <div className="b-models">
        {['Model 1', 'Model 2', 'Model 3'].map((m, i) => (
          <span key={m} className={`b-m b-m${i}`}>
            <i />
            {m}
          </span>
        ))}
      </div>
      <div className="b-agree">
        <span className="b-agree-k">How far they agree</span>
        <span className="b-line">
          <i className="b-tick" />
          <i className="b-tick" />
          <i className="b-tick" />
        </span>
      </div>
      <div className="b-doc card">
        <span className="t">The doctor confirms or overrides</span>
        <span className="b-ok">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12.5 10 17 19 7" fill="none" />
          </svg>
        </span>
      </div>
    </Scene>
  )
}
