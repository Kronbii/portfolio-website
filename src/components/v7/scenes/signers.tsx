'use client'

import { gsap } from 'gsap'

import { FringePath } from '../optic'
import { Scene } from '../scene'
import { B, BAR, drawIn, focusIn } from '../tempo'

/*
 * For people who sign, OmniSign: an illustration of a hand as the tracked
 * points a recognition model works from; the skeleton connects, the reading
 * travels out of the hand, and becomes a line of text on a phone, the web,
 * or an offline device. No sign or word is shown: this is how, not what.
 */

// an open right hand, wrist at the bottom: 21 points in the usual landmark order
const P: [number, number][] = [
  [0, 250],
  [-70, 200],
  [-122, 142],
  [-152, 86],
  [-178, 36],
  [-62, 40],
  [-72, -50],
  [-77, -112],
  [-80, -168],
  [0, 30],
  [0, -70],
  [0, -142],
  [0, -204],
  [56, 44],
  [66, -46],
  [71, -110],
  [74, -162],
  [106, 76],
  [126, 12],
  [139, -38],
  [149, -86],
]
const BONES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [0, 17],
]
const O = { x: 380, y: 560, k: 1.45 }
const at = (i: number) => [O.x + P[i][0] * O.k, O.y + P[i][1] * O.k] as const
const bone = ([a, b]: [number, number]) => {
  const [x1, y1] = at(a)
  const [x2, y2] = at(b)
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`
}
const OUT = 'M 600 560 C 650 560 660 520 720 520'

function build(root: HTMLElement, tl: gsap.core.Timeline) {
  root.querySelectorAll<SVGCircleElement>('.o-pt').forEach((c, i) => {
    const x = +c.getAttribute('cx')!,
      y = +c.getAttribute('cy')!
    tl.fromTo(
      c,
      { scale: 0, opacity: 0, svgOrigin: `${x} ${y}` },
      {
        scale: 1,
        opacity: 1,
        svgOrigin: `${x} ${y}`,
        duration: 0.5 * B,
        ease: 'back.out(2)',
      },
      0.1 * B + i * 0.06 * B
    )
  })
  drawIn(tl, '.o-bone', 1.4 * B, 0.9 * B, 0.03 * B)
  // the reading leaves the hand
  tl.fromTo(
    '.o-pt',
    { '--lit': 0 },
    {
      '--lit': 1,
      duration: 0.5 * B,
      ease: 'sine.out',
      stagger: { each: 0.03 * B, from: 'end' },
    },
    3 * B
  )
  drawIn(tl, '.o-out', 3.6 * B, 0.8 * B)
  focusIn(tl, '.o-panel', 4 * B, { x: 30 })
  tl.fromTo(
    '.o-line',
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 0.7 * B,
      ease: 'power2.out',
      stagger: 0.35 * B,
      transformOrigin: '0 50%',
    },
    4.8 * B
  )
  focusIn(tl, '.o-chip', 6.4 * B, { y: 16, stagger: 0.25 * B })
}

/** The hand never holds perfectly still: the points drift, a little. */
function ambient(root: HTMLElement) {
  const pts = root.querySelectorAll('.o-hand')
  return gsap.to(pts, {
    y: -8,
    rotation: -1.5,
    svgOrigin: `${O.x} ${O.y + 250 * O.k}`,
    duration: BAR,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
}

export function SignersScene({
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
      name="signers"
      label={label}
      build={build}
      ambient={ambient}
      replay={replay}
      note={note}
    >
      <div className="o-k">Lebanese Sign Language</div>
      <svg className="v7-lines" viewBox="0 0 1200 1200">
        <g className="o-hand">
          {BONES.map((b, i) => (
            <FringePath key={i} className="o-bone" d={bone(b)} width={4} />
          ))}
          {P.map((_, i) => {
            const [x, y] = at(i)
            return (
              <circle
                key={i}
                className="o-pt"
                cx={x.toFixed(1)}
                cy={y.toFixed(1)}
                r={i % 4 === 0 ? 11 : 9}
              />
            )
          })}
        </g>
        <FringePath className="o-out" d={OUT} width={4} />
      </svg>
      <div className="o-panel card">
        <span className="o-panel-k">Text</span>
        <span className="o-line" style={{ width: 300 }} />
        <span className="o-line" style={{ width: 240 }} />
        <span className="o-line" style={{ width: 280 }} />
      </div>
      <div className="o-chips">
        <span className="o-chip">Phone</span>
        <span className="o-chip">Web</span>
        <span className="o-chip">Offline device</span>
      </div>
    </Scene>
  )
}
