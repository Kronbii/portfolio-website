'use client'

import { gsap } from 'gsap'

import { FringePath } from '../optic'
import { Scene } from '../scene'
import { B, drawIn, focusIn, focusOut } from '../tempo'

/*
 * For families in a crisis, NASNA: a family's request is saved on the field
 * agent's device while the connection is down, syncs when it returns, and
 * reaches only the organisation whose coverage matches it; the family's
 * phone number never travels into the feed.
 */

const IN = 'M 300 600 C 400 600 430 600 520 600'
const OUT = 'M 680 600 C 790 600 800 600 900 600'
const OUT_UP = 'M 680 600 C 790 600 800 360 900 360'
const OUT_DOWN = 'M 680 600 C 790 600 800 840 900 840'

function along(
  path: SVGPathElement | null,
  dot: SVGCircleElement | null,
  tl: gsap.core.Timeline,
  from: number,
  to: number,
  at: number,
  dur: number
) {
  if (!path || !dot) return
  const len = path.getTotalLength()
  const p = { t: from }
  const place = () => {
    const pt = path.getPointAtLength(p.t * len)
    dot.setAttribute('cx', pt.x.toFixed(1))
    dot.setAttribute('cy', pt.y.toFixed(1))
  }
  tl.fromTo(
    p,
    { t: from },
    {
      t: to,
      duration: dur,
      ease: 'sine.inOut',
      onUpdate: place,
      onStart: place,
      immediateRender: false,
    },
    at
  )
}

function build(root: HTMLElement, tl: gsap.core.Timeline) {
  const inPath = root.querySelector<SVGPathElement>('.n-in .v7-fl-c')
  const outPath = root.querySelector<SVGPathElement>('.n-out .v7-fl-c')
  const dot = root.querySelector<SVGCircleElement>('.n-dot')
  focusIn(tl, '.n-node', 0, { stagger: 0.3 * B, scale: 0.92 })
  drawIn(tl, '.n-in, .n-ghost', 1.4 * B, 1.0 * B)
  tl.fromTo('.n-dot', { opacity: 0 }, { opacity: 1, duration: 0.2 * B }, 2 * B)
  along(inPath, dot, tl, 0, 0.45, 2 * B, 0.7 * B)
  // the connection drops: saved on the device, then synced when it returns
  focusIn(tl, '.n-off', 2.6 * B, { y: 16 })
  focusOut(tl, '.n-off', 3.7 * B)
  focusIn(tl, '.n-sync', 3.9 * B, { y: 16 })
  along(inPath, dot, tl, 0.45, 1, 4.1 * B, 0.7 * B)
  tl.to(
    '.n-hub',
    {
      '--glow': 1,
      duration: 0.4 * B,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut',
    },
    4.8 * B
  )
  // only the organisation whose coverage matches it
  drawIn(tl, '.n-out', 5.1 * B, 1.0 * B)
  along(outPath, dot, tl, 0, 1, 5.2 * B, 1.0 * B)
  tl.to(
    '.n-org.dim',
    { opacity: 0.32, duration: 0.6 * B, ease: 'sine.out' },
    5.1 * B
  )
  tl.to(
    '.n-org.hit',
    { '--lit': 1, duration: 0.6 * B, ease: 'sine.out' },
    6 * B
  )
  focusIn(tl, '.n-lock', 6.2 * B, { y: 16 })
  focusIn(tl, '.n-foot', 6.9 * B, { y: 10 })
}

export function FamiliesScene({
  label,
  replay,
}: {
  label: string
  replay: string
}) {
  return (
    <Scene name="families" label={label} build={build} replay={replay}>
      <div className="n-node n-fam">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M10 30 32 12l22 18v24H10z M26 54V40h12v14" fill="none" />
        </svg>
        <span>A family</span>
      </div>
      <div className="n-node n-hub">
        <span className="n-ar" lang="ar" dir="rtl">
          ناسنا
        </span>
        <span>NASNA</span>
      </div>
      <div className="n-node n-org dim" style={{ top: 300 }}>
        <span>NGO</span>
      </div>
      <div className="n-node n-org hit" style={{ top: 540 }}>
        <span>NGO</span>
        <small>covers this area and need</small>
      </div>
      <div className="n-node n-org dim" style={{ top: 780 }}>
        <span>Volunteers</span>
      </div>
      <svg className="v7-lines" viewBox="0 0 1200 1200">
        <FringePath className="n-in" d={IN} width={5} />
        <FringePath className="n-ghost" d={OUT_UP} width={2} />
        <FringePath className="n-ghost" d={OUT_DOWN} width={2} />
        <FringePath className="n-out" d={OUT} width={5} />
        <circle className="n-dot" r={13} cx={300} cy={600} opacity={0} />
      </svg>
      <div className="n-badge n-off">
        <i />
        Saved on the device
      </div>
      <div className="n-badge n-sync">
        <i />
        Synced when back online
      </div>
      <div className="n-lock">
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M9 14V10a7 7 0 0 1 14 0v4 M6 14h20v14H6z" fill="none" />
        </svg>
        The family’s phone number stays out of the feed
      </div>
      <div className="n-foot">Open source · nasna.world</div>
    </Scene>
  )
}
