'use client'

import { gsap } from 'gsap'

import { FringePath, Optic } from '../optic'
import { Scene } from '../scene'
import { B, BAR, drawIn, focusIn } from '../tempo'

/*
 * For voters, Daleel: the platform comes into focus, a fact lifts off it, a
 * thread traces it back to its source, and its earlier versions stack up
 * beneath, kept rather than overwritten. Then the three languages.
 */

const THREAD = 'M 556 846 C 610 846 610 784 676 784'
const DOWN = 'M 862 846 L 862 884'

function build(root: HTMLElement, tl: gsap.core.Timeline) {
  focusIn(tl, '.d-plate', 0, { dur: 1.6 * B, blur: 16, ca: 16, scale: 1.04 })
  focusIn(tl, '.d-fact', 1.5 * B, { y: -150, ca: 10 })
  drawIn(tl, '.d-thread', 2.5 * B)
  focusIn(tl, '.d-src', 3.3 * B, { x: 30 })
  drawIn(tl, '.d-down', 4.2 * B, 0.6 * B)
  focusIn(tl, '.d-v', 4.6 * B, { y: 24, stagger: 0.45 * B })
  focusIn(tl, '.d-lang span', 6.4 * B, { y: 14, stagger: 0.25 * B })
}

/** A spark runs the thread from the fact to its source, once a bar. */
function ambient(root: HTMLElement) {
  const path = root.querySelector<SVGPathElement>('.d-thread .v7-fl-c')
  const spark = root.querySelector<SVGCircleElement>('.d-spark')
  if (!path || !spark) return
  const len = path.getTotalLength()
  const p = { t: 0 }
  return gsap
    .timeline({ repeat: -1, repeatDelay: BAR - 1.4 * B })
    .set(spark, { opacity: 1 })
    .to(p, {
      t: 1,
      duration: 1.4 * B,
      ease: 'sine.inOut',
      onUpdate: () => {
        const pt = path.getPointAtLength(p.t * len)
        spark.setAttribute('cx', pt.x.toFixed(1))
        spark.setAttribute('cy', pt.y.toFixed(1))
      },
    })
    .set(spark, { opacity: 0 })
}

export function VotersScene({
  label,
  replay,
}: {
  label: string
  replay: string
}) {
  return (
    <Scene
      name="voters"
      label={label}
      build={build}
      ambient={ambient}
      replay={replay}
    >
      <Optic
        className="d-plate"
        src="/images/authority/daleel/hero.jpeg"
        position="50% 30%"
      />
      <div className="d-fact card">
        <span className="tag">
          <i />A fact
        </span>
        <span className="bar" style={{ width: 300 }} />
        <span className="bar" style={{ width: 220 }} />
      </div>
      <div className="d-src card">
        <svg viewBox="0 0 40 48" className="doc" aria-hidden="true">
          <path
            d="M4 2h22l10 10v34H4z M26 2v10h10 M10 22h20 M10 30h20 M10 38h12"
            fill="none"
          />
        </svg>
        <span className="t">Its source</span>
      </div>
      <div className="d-hist">
        <div className="d-v card sm">
          <span className="t">Earlier</span>
          <span className="k">kept</span>
        </div>
        <div className="d-v card sm">
          <span className="t">Earlier</span>
          <span className="k">kept</span>
        </div>
        <div className="d-v card sm now">
          <span className="t">Now</span>
          <span className="k">current</span>
        </div>
      </div>
      <svg className="v7-lines" viewBox="0 0 1200 1200">
        <FringePath className="d-thread" d={THREAD} width={4} />
        <FringePath className="d-down" d={DOWN} width={4} />
        <circle className="d-spark" r={7} cx={556} cy={846} opacity={0} />
      </svg>
      <div className="d-lang">
        <span lang="ar">العربية</span>
        <span>English</span>
        <span lang="fr">Français</span>
      </div>
    </Scene>
  )
}
