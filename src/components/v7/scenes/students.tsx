'use client'

import { gsap } from 'gsap'

import { FringePath, Optic } from '../optic'
import { Scene } from '../scene'
import { B, BAR, drawIn, focusIn } from '../tempo'

/*
 * For students, the BEMO desk: the prototype itself, then how it closes the
 * loop, drawn side-on: the camera sees posture, the desktop raises and
 * tilts, slowly (the record's dead bands and slow transitions), and its
 * light answers at once.
 */

function build(root: HTMLElement, tl: gsap.core.Timeline) {
  focusIn(tl, '.k-plate', 0, { dur: 1.6 * B, blur: 16, ca: 14, scale: 1.04 })
  focusIn(tl, '.k-cap', 0.9 * B, { y: 12 })
  focusIn(tl, '.k-desk, .k-person, .k-cam', 1.6 * B, {
    y: 20,
    stagger: 0.2 * B,
  })
  drawIn(tl, '.k-cone', 2.4 * B, 0.9 * B, 0.1 * B)
  focusIn(tl, '.k-s1', 2.8 * B, { y: 12 })
  // the desk answers, slowly
  tl.to(
    '.k-top',
    {
      y: -46,
      rotation: -7,
      svgOrigin: '742 972',
      duration: 2.2 * B,
      ease: 'sine.inOut',
    },
    3.8 * B
  )
  tl.to(
    '.k-leg',
    { attr: { height: 146 }, y: -46, duration: 2.2 * B, ease: 'sine.inOut' },
    3.8 * B
  )
  focusIn(tl, '.k-s2', 4.2 * B, { y: 12 })
  tl.to('.k-led', { '--lit': 1, duration: 0.5 * B, ease: 'sine.out' }, 6 * B)
  focusIn(tl, '.k-s3', 6.2 * B, { y: 12 })
}

/** The light breathes once it has answered. */
function ambient(root: HTMLElement) {
  return gsap.to(root.querySelector('.k-led'), {
    '--lit': 0.55,
    duration: BAR / 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
}

export function StudentsScene({
  label,
  replay,
}: {
  label: string
  replay: string
}) {
  return (
    <Scene
      name="students"
      label={label}
      build={build}
      ambient={ambient}
      replay={replay}
    >
      <Optic
        className="k-plate"
        src="/images/authority/smart-desk/night-pic.jpeg"
      />
      <div className="k-cap">The BEMO prototype</div>
      <svg className="v7-lines" viewBox="0 0 1200 1200">
        <g className="k-cam">
          <rect x={128} y={760} width={64} height={44} rx={10} />
          <circle cx={160} cy={782} r={12} />
          <rect x={154} y={804} width={12} height={290} rx={4} />
        </g>
        <g className="k-person">
          <circle cx={500} cy={780} r={30} />
          <path d="M 498 822 C 488 870 494 912 512 950 L 560 950" />
          <path d="M 500 860 C 530 880 560 900 600 918" />
        </g>
        <FringePath className="k-cone" d="M 192 774 L 466 726" width={3} />
        <FringePath className="k-cone" d="M 192 792 L 466 960" width={3} />
        <g className="k-desk">
          <rect
            className="k-leg"
            x={732}
            y={984}
            width={20}
            height={100}
            rx={4}
          />
          <rect x={672} y={1084} width={140} height={14} rx={7} />
          <g className="k-top">
            <rect x={600} y={960} width={300} height={24} rx={8} />
            <circle className="k-led" cx={884} cy={972} r={9} />
          </g>
        </g>
      </svg>
      <div className="k-step k-s1">
        <b>1</b> The camera sees how you sit
      </div>
      <div className="k-step k-s2">
        <b>2</b> The desk adjusts height and tilt, slowly
      </div>
      <div className="k-step k-s3">
        <b>3</b> A light answers at once
      </div>
    </Scene>
  )
}
