'use client'

import { Optic } from '../optic'
import { Scene } from '../scene'
import { B, driver, focusIn } from '../tempo'

/*
 * And machines that move: the Brainiacs car comes into focus, twenty days
 * count up, the placing lands, and the drone fix follows, the love.
 */

function build(root: HTMLElement, tl: gsap.core.Timeline) {
  const days = root.querySelector<HTMLElement>('.m-days b')!
  focusIn(tl, '.m-plate', 0, { dur: 1.6 * B, blur: 16, ca: 16, scale: 1.04 })
  focusIn(tl, '.m-days', 1.4 * B, { y: 18 })
  const count = driver((p) => {
    days.textContent = String(Math.round(20 * p))
  })
  tl.fromTo(
    count,
    { p: 0 },
    { p: 1, duration: 2 * B, ease: 'power1.out' },
    1.4 * B
  )
  focusIn(tl, '.m-days-k', 2.2 * B, { y: 12 })
  focusIn(tl, '.m-place', 3.6 * B, { y: 24, ca: 12 })
  focusIn(tl, '.m-place-k', 4.2 * B, { y: 12 })
  focusIn(tl, '.m-love', 5.8 * B, { y: 20 })
}

export function MachinesScene({
  label,
  replay,
  src = '/images/v6/race-crop.jpg',
}: {
  label: string
  replay: string
  /** The car's photograph (the chapter's plate). */
  src?: string
}) {
  return (
    <Scene name="machines" label={label} build={build} replay={replay}>
      <Optic className="m-plate" src={src} position="50% 60%" />
      <div className="m-days fx">
        <b>20</b> days
      </div>
      <div className="m-days-k">to build it, from scratch</div>
      <div className="m-place fx">3rd</div>
      <div className="m-place-k">of 95+ teams · World Robot Olympiad 2023</div>
      <div className="m-love card">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <circle cx="37" cy="11" r="7" />
          <circle cx="11" cy="37" r="7" />
          <circle cx="37" cy="37" r="7" />
          <path d="M16 16l16 16M32 16 16 32" />
          <rect x="19" y="19" width="10" height="10" rx="2" />
        </svg>
        <span className="t">
          And the love: a fix merged into Betaflight, the firmware that flies
          FPV drones
        </span>
      </div>
    </Scene>
  )
}
