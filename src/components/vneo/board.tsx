'use client'

import { gsap } from 'gsap'

import {
  B,
  BAR,
  E,
  decode,
  driver,
  lerp,
  prog,
  type Impact,
} from '@/components/v6/armed'
import { Shot } from '@/components/v6/shot'
import { FringePath } from '@/components/v7/optic'
import { vneo } from '@/content/vneo/site'

/*
 * The systems board: FLY's equivalent for everything that is not a drone, on
 * the same three bars. Bar one: sense, decide, act, one word a beat, as a
 * camera, a microcontroller, and an actuator wire up into one loop, and the
 * loop closes. Bar two: the focus areas fly at the lens through a tunnel of
 * chip outlines. Bar three: the board comes up to face you, its traces route
 * themselves into RK., and the lock closes on them; then signal runs through
 * the letters.
 */

const IMPACTS: Impact[] = [
  { t: 0, k: 1.1, flash: 0.8, ghost: 1 },
  { t: B, k: 0.4 },
  { t: 2 * B, k: 0.4 },
  { t: 3 * B, k: 0.4 },
  { t: 4 * B, k: 0.6, flash: 0.3, ghost: 0.6 },
  { t: 8 * B, k: 0.8, flash: 0.5, ghost: 0.8 },
]
const c = vneo.loop.board

/* ---------- bar one: the loop ---------- */
const CAM = { x: 460, y: 380 }
const MCU = { x: 960, y: 380 }
const ARM = { x: 1460, y: 470 }
const TRACE_1 = 'M 570 400 H 690 L 738 352 H 838'
const TRACE_2 = 'M 1082 404 H 1190 L 1276 490 H 1380'
const FEEDBACK =
  'M 1540 490 H 1600 L 1650 540 V 560 L 1610 600 H 300 L 260 560 V 420 L 300 380 H 350'
const PINS = [-72, -48, -24, 0, 24, 48, 72]

/* ---------- bar three: RK. in traces ---------- */
const CELL = 66
const GX = 498
const GY = 350
const at = ([col, row]: number[]) => `${GX + col * CELL} ${GY + row * CELL}`
const route = (pts: number[][]) => `M ${pts.map(at).join(' L ')}`
const RK = [
  [
    [0, 6],
    [0, 0],
  ],
  [
    [0, 0],
    [3, 0],
    [4, 1],
    [4, 2],
    [3, 3],
    [0, 3],
  ],
  [
    [2, 3],
    [4, 5],
    [4, 6],
  ],
  [
    [7, 0],
    [7, 6],
  ],
  [
    [11, 0],
    [7, 4],
  ],
  [
    [8, 3],
    [11, 6],
  ],
].map(route)
const VIAS = [
  [0, 6],
  [4, 6],
  [7, 0],
  [7, 6],
  [11, 0],
  [11, 6],
]
const CHIP = { x: GX + 13.5 * CELL, y: GY + 5.5 * CELL }

function build(root: HTMLElement, tl: gsap.core.Timeline) {
  const q = <T extends Element = SVGElement>(s: string) =>
    root.querySelector(s) as T
  const all = (s: string) => Array.from(root.querySelectorAll<SVGElement>(s))
  gsap.set(all('.s14-cam, .s14-mcu, .s14-ring, .s14-sq, .s14-via, .s14-chip'), {
    transformOrigin: '50% 50%',
  })
  gsap.set(q('.s14-tunnel'), { svgOrigin: '960 540' })

  tl.fromTo(
    '.s13-swarm',
    { opacity: 0, x: 40 },
    { opacity: 1, x: 0, duration: 0.25, ease: 'expo.out' },
    0.1
  )
  tl.fromTo(
    '.s14-floor',
    { opacity: 0, transformPerspective: 1100, rotationX: 68, y: 260 },
    { opacity: 1, rotationX: 60, y: 240, duration: BAR, ease: 'none' },
    0
  )

  // one word per beat, each with its own entrance, hard cuts between
  tl.fromTo(
    '.s13-w1',
    { opacity: 0, scale: 1.9, filter: 'blur(26px)' },
    {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.16,
      ease: 'expo.out',
    },
    0
  )
  tl.to('.s13-w1', { opacity: 0, duration: 0.001, ease: 'none' }, B)
  tl.fromTo(
    '.s13-w2',
    { opacity: 0, x: 1400, skewX: -18 },
    { opacity: 1, x: 0, skewX: 0, duration: 0.18, ease: 'expo.out' },
    B
  )
  tl.to('.s13-w2', { opacity: 0, duration: 0.001, ease: 'none' }, 2 * B)
  tl.fromTo(
    '.s13-w3',
    { opacity: 0, y: 340, rotation: -6 },
    { opacity: 1, y: 0, rotation: 0, duration: 0.2, ease: 'back.out(1.8)' },
    2 * B
  )
  tl.to('.s13-w3', { opacity: 0, duration: 0.001, ease: 'none' }, 3 * B)

  // sense: the camera comes up and its lens pulls focus
  tl.fromTo(
    '.s14-cam',
    { opacity: 0, scale: 0.86 },
    { opacity: 1, scale: 1, duration: 0.3, ease: 'expo.out' },
    0
  )
  tl.fromTo(
    '.s14-ring',
    { scale: 1.7, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.42, ease: 'expo.out', stagger: 0.05 },
    0.04
  )
  tl.fromTo(
    '.s14-lab',
    { opacity: 0 },
    { opacity: 1, duration: 0.2, ease: 'none', stagger: B },
    0.12
  )
  // decide: the line to the microcontroller, its pins light around it, and its name decodes
  tl.fromTo(
    '.s14-t1',
    { '--d': 1 },
    { '--d': 0, duration: 0.22, ease: 'power2.out' },
    B
  )
  tl.fromTo(
    '.s14-mcu',
    { opacity: 0, scale: 0.86 },
    { opacity: 1, scale: 1, duration: 0.3, ease: 'expo.out' },
    B + 0.06
  )
  tl.fromTo(
    '.s14-pin',
    { opacity: 0.1 },
    { opacity: 1, duration: 0.05, ease: 'none', stagger: 0.008 },
    B + 0.1
  )
  const label = q<SVGTextElement>('.s14-mcu-t')
  let shown = ''
  const dec = driver((p) => {
    const s = decode('MCU', p, Math.floor(p * 16))
    if (s !== shown) label.textContent = shown = s
  })
  tl.fromTo(dec, { p: 0 }, { p: 1, duration: 0.3, ease: 'none' }, B + 0.1)
  // act: the line to the actuator, which swings into its reach and nods
  tl.fromTo(
    '.s14-t2',
    { '--d': 1 },
    { '--d': 0, duration: 0.22, ease: 'power2.out' },
    2 * B
  )
  tl.fromTo(
    '.s14-arm',
    { opacity: 0 },
    { opacity: 1, duration: 0.15, ease: 'none' },
    2 * B + 0.06
  )
  const l1 = q('.s14-l1')
  const l2 = q('.s14-l2')
  const arm = driver((p) => {
    const t = p * 2 * B
    const reach = E.out(prog(t, 0, 0.6))
    const nod = Math.sin(Math.PI * prog(t, B, B + 0.5))
    l1.setAttribute(
      'transform',
      `rotate(${(lerp(-150, -62, reach) + 14 * nod).toFixed(2)})`
    )
    l2.setAttribute(
      'transform',
      `rotate(${(lerp(110, 38, reach) - 22 * nod).toFixed(2)})`
    )
  })
  tl.fromTo(arm, { p: 0 }, { p: 1, duration: 2 * B, ease: 'none' }, 2 * B)
  // and the loop closes: what the actuator does comes back to the camera
  tl.fromTo(
    '.s14-fb',
    { '--d': 1 },
    { '--d': 0, duration: 0.4, ease: 'power2.inOut' },
    3 * B
  )
  const pulse = (sel: string, t: number, dur = 0.4) => {
    tl.fromTo(
      sel,
      { '--p': 0.08, opacity: 1 },
      { '--p': -1, duration: dur, ease: 'power1.in' },
      t
    )
    tl.to(sel, { opacity: 0, duration: 0.05, ease: 'none' }, t + dur)
  }
  pulse('.s14-p1', B + 0.2, 0.3)
  pulse('.s14-p2', 2 * B + 0.2, 0.3)
  pulse('.s14-pf', 3 * B + 0.1, 0.5)
  tl.to(
    '.s14-loop, .s13-swarm',
    { opacity: 0, duration: 0.15, ease: 'none' },
    BAR
  )
  tl.to('.s14-floor', { opacity: 0, duration: 0.15, ease: 'none' }, BAR)

  // the tunnel run: chip outlines rush the lens, rolling, as the focus areas fly at it
  tl.fromTo(
    '.s14-tunnel',
    { rotation: 0 },
    { rotation: 42, duration: BAR, ease: 'none' },
    BAR
  )
  all('.s14-sq').forEach((sq, i, list) => {
    const t = BAR + (i * (BAR - 0.6)) / list.length
    tl.fromTo(
      sq,
      { scale: 0.12 },
      { scale: 5.2, duration: 0.95, ease: 'power2.in' },
      t
    )
    tl.fromTo(
      sq,
      { opacity: 0 },
      { opacity: 0.9, duration: 0.22, ease: 'none' },
      t
    )
    tl.to(sq, { opacity: 0, duration: 0.25, ease: 'none' }, t + 0.7)
  })
  root.querySelectorAll('.s13-fly').forEach((s, i) => {
    const t = BAR + i * B
    tl.fromTo(
      s,
      { opacity: 0, scale: 0.42, filter: 'blur(6px)' },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.16,
        ease: 'expo.out',
      },
      t
    )
    tl.to(
      s,
      {
        scale: 2.4,
        opacity: 0,
        filter: 'blur(18px)',
        duration: 0.24,
        ease: 'power3.in',
      },
      t + B - 0.24
    )
  })

  // the board comes up to face you, and its traces route themselves into RK.
  tl.fromTo(
    '.s14-floor',
    { opacity: 0, rotationX: 80, y: 0 },
    {
      opacity: 0.7,
      rotationX: 0,
      y: 0,
      duration: 0.6,
      ease: 'expo.out',
      immediateRender: false,
    },
    2 * BAR - 0.2
  )
  all('.s14-rk').forEach((g, i) => {
    tl.fromTo(
      g,
      { '--draw': 1, '--ca': 12 },
      { '--draw': 0, '--ca': 0, duration: 0.45, ease: 'power2.out' },
      2 * BAR + 0.04 + i * 0.06
    )
  })
  tl.fromTo(
    '.s14-via',
    { scale: 0 },
    { scale: 1, duration: 0.3, ease: 'back.out(2.4)', stagger: 0.04 },
    2 * BAR + 0.36
  )
  tl.fromTo(
    '.s14-chip',
    { opacity: 0, scale: 1.5, y: -30 },
    { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'expo.out' },
    2 * BAR + 0.42
  )
  // on the next beat the lock snaps around them
  root.querySelectorAll('.s13-l').forEach((s, i) => {
    tl.fromTo(
      s,
      {
        opacity: 0,
        x: [-160, 160, -160, 160][i],
        y: [-100, -100, 100, 100][i],
      },
      { opacity: 1, x: 0, y: 0, duration: 0.24, ease: 'expo.out' },
      2 * BAR + B + i * 0.02
    )
  })
  tl.fromTo(
    '.s13-id',
    { opacity: 0 },
    { opacity: 1, duration: 0.04, ease: 'none', repeat: 4, yoyo: true },
    2 * BAR + B + 0.05
  )
  tl.fromTo(
    '.s13-cap',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.25, ease: 'expo.out' },
    2 * BAR + B + 0.1
  )
  // and signal runs through the letters, twice
  all('.s14-rkp').forEach((p, i) => {
    for (const t of [2 * BAR + 2 * B, 2 * BAR + 3 * B]) {
      tl.fromTo(
        p,
        { '--p': 0.08, opacity: 1 },
        { '--p': -1, duration: 0.5, ease: 'power1.inOut' },
        t + i * 0.03
      )
      tl.to(p, { opacity: 0, duration: 0.05, ease: 'none' }, t + i * 0.03 + 0.5)
    }
  })
}

export function BoardShot({ replay }: { replay?: string }) {
  return (
    <Shot
      scene="s14"
      label={c.alt}
      impacts={IMPACTS}
      build={build}
      hold={3 * BAR}
      replay={replay}
    >
      <div className="s14-floor" />
      <svg className="s14-svg" viewBox="0 0 1920 1080" aria-hidden="true">
        <g className="s14-loop">
          <path className="s14-trace s14-fb" d={FEEDBACK} pathLength={1} />
          <path className="s14-trace s14-t1" d={TRACE_1} pathLength={1} />
          <path className="s14-trace s14-t2" d={TRACE_2} pathLength={1} />
          <path className="s14-pulse s14-pf" d={FEEDBACK} pathLength={1} />
          <path className="s14-pulse s14-p1" d={TRACE_1} pathLength={1} />
          <path className="s14-pulse s14-p2" d={TRACE_2} pathLength={1} />

          <g className="s14-cam">
            <rect
              className="s14-pcb"
              x={CAM.x - 110}
              y={CAM.y - 110}
              width={220}
              height={220}
              rx={24}
            />
            {[
              [-86, -86],
              [86, -86],
              [-86, 86],
              [86, 86],
            ].map(([dx, dy]) => (
              <circle
                key={`${dx}${dy}`}
                className="s14-hole"
                cx={CAM.x + dx}
                cy={CAM.y + dy}
                r={8}
              />
            ))}
            <circle className="s14-ring" cx={CAM.x} cy={CAM.y} r={80} />
            <circle className="s14-ring" cx={CAM.x} cy={CAM.y} r={58} />
            <circle className="s14-ring" cx={CAM.x} cy={CAM.y} r={36} />
            <circle
              className="s14-ring s14-aperture"
              cx={CAM.x}
              cy={CAM.y}
              r={15}
            />
          </g>

          <g className="s14-mcu">
            <rect
              className="s14-pcb"
              x={MCU.x - 100}
              y={MCU.y - 100}
              width={200}
              height={200}
              rx={16}
            />
            {PINS.map((o) => (
              <g key={o}>
                <line
                  className="s14-pin"
                  x1={MCU.x + o}
                  y1={MCU.y - 102}
                  x2={MCU.x + o}
                  y2={MCU.y - 122}
                />
                <line
                  className="s14-pin"
                  x1={MCU.x + 102}
                  y1={MCU.y + o}
                  x2={MCU.x + 122}
                  y2={MCU.y + o}
                />
                <line
                  className="s14-pin"
                  x1={MCU.x - o}
                  y1={MCU.y + 102}
                  x2={MCU.x - o}
                  y2={MCU.y + 122}
                />
                <line
                  className="s14-pin"
                  x1={MCU.x - 102}
                  y1={MCU.y - o}
                  x2={MCU.x - 122}
                  y2={MCU.y - o}
                />
              </g>
            ))}
            <rect
              className="s14-die"
              x={MCU.x - 58}
              y={MCU.y - 58}
              width={116}
              height={116}
              rx={8}
            />
            <circle
              className="s14-joint"
              cx={MCU.x - 76}
              cy={MCU.y - 76}
              r={7}
            />
            <text className="s14-mcu-t" x={MCU.x} y={MCU.y}>
              MCU
            </text>
          </g>

          <g className="s14-arm">
            <rect
              className="s14-pcb"
              x={ARM.x - 80}
              y={ARM.y + 8}
              width={160}
              height={24}
              rx={8}
            />
            <path
              className="s14-pcb"
              d={`M ${ARM.x - 44} ${ARM.y + 8} A 44 44 0 0 1 ${ARM.x + 44} ${ARM.y + 8} Z`}
            />
            <g transform={`translate(${ARM.x} ${ARM.y})`}>
              <g className="s14-l1" transform="rotate(-62)">
                <rect
                  className="s14-link"
                  x={-16}
                  y={-16}
                  width={166}
                  height={32}
                  rx={16}
                />
                <circle className="s14-joint" r={10} />
                <g transform="translate(150 0)">
                  <g className="s14-l2" transform="rotate(38)">
                    <rect
                      className="s14-link"
                      x={-14}
                      y={-14}
                      width={134}
                      height={28}
                      rx={14}
                    />
                    <circle className="s14-joint" r={9} />
                    <path
                      className="s14-grip"
                      d="M 120 -20 H 146 M 120 20 H 146 M 120 -20 V 20"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>

          {c.parts.map((p, i) => (
            <text
              key={p}
              className="s14-lab"
              x={[CAM.x, MCU.x, ARM.x][i]}
              y={556}
            >
              {p.toUpperCase()}
            </text>
          ))}
        </g>

        <g className="s14-tunnel">
          <g transform="translate(960 540)">
            {Array.from({ length: 9 }, (_, i) => (
              <g key={i} className="s14-sq">
                <rect x={-120} y={-120} width={240} height={240} rx={14} />
                {[-75, -45, -15, 15, 45, 75].map((o) => (
                  <path
                    key={o}
                    d={`M ${o} -122 V -138 M 122 ${o} H 138 M ${o} 122 V 138 M -122 ${o} H -138`}
                  />
                ))}
              </g>
            ))}
          </g>
        </g>

        <g className="s14-board">
          {RK.map((d, i) => (
            <FringePath key={i} className="s14-rk" d={d} width={16} />
          ))}
          {RK.map((d, i) => (
            <path key={i} className="s14-pulse s14-rkp" d={d} pathLength={1} />
          ))}
          {VIAS.map((v) => {
            const [x, y] = at(v).split(' ').map(Number)
            return (
              <circle key={v.join()} className="s14-via" cx={x} cy={y} r={15} />
            )
          })}
          <g className="s14-chip">
            <rect
              x={CHIP.x - 42}
              y={CHIP.y - 42}
              width={84}
              height={84}
              rx={8}
            />
            {[-22, 0, 22].map((o) => (
              <path
                key={o}
                d={`M ${CHIP.x + o} ${CHIP.y - 44} V ${CHIP.y - 58} M ${CHIP.x + 44} ${CHIP.y + o} H ${CHIP.x + 58} M ${CHIP.x + o} ${CHIP.y + 44} V ${CHIP.y + 58} M ${CHIP.x - 44} ${CHIP.y + o} H ${CHIP.x - 58}`}
              />
            ))}
            <circle
              className="s14-chip-dot"
              cx={CHIP.x - 26}
              cy={CHIP.y - 26}
              r={6}
            />
          </g>
        </g>
      </svg>

      {c.words.map((w, i) => (
        <div key={w} className={`s13-word s13-w${i + 1}`}>
          {w.toUpperCase()}
          <i>.</i>
        </div>
      ))}
      <div className="m s13-swarm">{c.note}</div>
      {c.focus.map((f) => (
        <div key={f} className="s13-fly">
          {f.toUpperCase()}
        </div>
      ))}
      <div className="m s13-id">{c.id}</div>
      <div className="s13-l s13-l1" />
      <div className="s13-l s13-l2" />
      <div className="s13-l s13-l3" />
      <div className="s13-l s13-l4" />
      <div className="m s13-cap">{c.cap}</div>
    </Shot>
  )
}
