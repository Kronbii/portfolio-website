'use client'

import { B, BAR, driver, type Impact } from '../armed'
import { Shot } from '../shot'

/* 09 SHIP: five upstream pull requests: three merged, one open, one closed. */

const IMPACTS: Impact[] = [
  { t: 0, k: 0.6, flash: 0.3, ghost: 0.5 },
  { t: B, k: 0.25 },
  { t: 2 * B, k: 0.25 },
]

const LANES = [
  {
    lane: 'M190 640 C 240 640 210 500 270 500 H 520',
    merge: 'M520 500 C 580 500 550 640 600 640',
    fork: 190,
    commits: [
      [310, 500],
      [415, 500],
    ],
  },
  {
    lane: 'M520 640 C 570 640 540 780 600 780 H 850',
    merge: 'M850 780 C 910 780 880 640 930 640',
    fork: 520,
    commits: [
      [640, 780],
      [745, 780],
    ],
  },
  {
    lane: 'M850 640 C 900 640 870 500 930 500 H 1180',
    merge: 'M1180 500 C 1240 500 1210 640 1260 640',
    fork: 850,
    commits: [
      [970, 500],
      [1075, 500],
    ],
  },
  {
    lane: 'M1180 640 C 1230 640 1200 780 1260 780 H 1560',
    fork: 1180,
    commits: [
      [1300, 780],
      [1390, 780],
    ],
  },
  {
    lane: 'M1480 640 C 1530 640 1500 500 1560 500 H 1800',
    fork: 1480,
    commits: [
      [1600, 500],
      [1660, 500],
    ],
  },
]
const DOTS = [600, 930, 1260]

/** The pull requests, as the record lists them. */
const PRS = [
  {
    repo: 'Betaflight',
    no: '#15706',
    what: 'Redpine debug mode',
    at: [270, 408],
    pill: 'Merged',
    kind: 'merged',
    pillAt: [560, 582],
  },
  {
    repo: 'OpenFront',
    no: '#4868',
    what: 'Progressive timer warning',
    at: [600, 806],
    pill: 'Merged',
    kind: 'merged',
    pillAt: [890, 662],
  },
  {
    repo: 'OpenFront',
    no: '#4985',
    what: 'iOS HUD zoom fix',
    at: [930, 408],
    pill: 'Merged',
    kind: 'merged',
    pillAt: [1220, 582],
  },
  {
    repo: 'Betaflight',
    no: '#15705',
    what: 'W25M flash read',
    at: [1260, 806],
    pill: 'Open',
    kind: 'open',
    pillAt: [1540, 720],
  },
  {
    repo: 'PX4',
    no: '#28286',
    what: 'EKF2 range-height reset',
    at: [1560, 408],
    pill: 'Closed · test-backed',
    kind: 'closed',
    pillAt: [1514, 526],
  },
]

function build(root: HTMLElement, tl: gsap.core.Timeline) {
  const count = root.querySelector<HTMLElement>('.s11-count')!
  tl.fromTo(
    '.s11-no, .s11-sub',
    { opacity: 0, x: -40 },
    { opacity: 1, x: 0, duration: 0.22, ease: 'expo.out', stagger: 0.04 },
    0.02
  )
  tl.fromTo(
    '.s11-title',
    { opacity: 0, scale: 1.3, filter: 'blur(14px)' },
    {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.2,
      ease: 'expo.out',
      transformOrigin: '0% 50%',
    },
    0
  )
  tl.fromTo(
    '.s11-count, .s11-count-k',
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 0.22, ease: 'expo.out', stagger: 0.04 },
    0.04
  )
  // main draws left to right; every branch forks off it
  tl.fromTo(
    '.s11-main',
    { strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: 0.3, ease: 'power2.out' },
    0
  )
  tl.fromTo(
    '.s11-fork',
    { scale: 0, transformOrigin: '50% 50%' },
    { scale: 1, duration: 0.12, ease: 'back.out(3)', stagger: 0.05 },
    0.1
  )
  for (let i = 0; i < 5; i++) {
    tl.fromTo(
      `.s11-lane${i}`,
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 0.26, ease: 'power2.out' },
      0.12 + i * 0.07
    )
    tl.fromTo(
      `.s11-l${i}`,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.2, ease: 'expo.out' },
      0.18 + i * 0.07
    )
  }
  tl.fromTo(
    '.s11-commit',
    { scale: 0, transformOrigin: '50% 50%' },
    { scale: 1, duration: 0.12, ease: 'back.out(3)', stagger: 0.03 },
    0.3
  )
  // the outcomes, on eighths: three merges, one open, one closed
  const OUT: [number, number][] = [
    [0, B],
    [1, 1.5 * B],
    [2, 2 * B],
    [3, 2.5 * B],
    [4, 3 * B],
  ]
  OUT.forEach(([i, at]) => {
    if (root.querySelector(`.s11-merge${i}`))
      tl.fromTo(
        `.s11-merge${i}`,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.12, ease: 'power2.in' },
        at - 0.12
      )
    tl.fromTo(
      `.s11-dot${i}`,
      { scale: 0, transformOrigin: '50% 50%' },
      { scale: 1, duration: 0.2, ease: 'back.out(3)' },
      at
    )
    tl.fromTo(
      `.s11-p${i}`,
      { opacity: 0, scale: 0.4 },
      { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(2.6)' },
      at
    )
  })
  tl.fromTo(
    '.s11-dot3',
    { opacity: 1 },
    {
      opacity: 0.35,
      duration: 0.12,
      ease: 'none',
      repeat: 4,
      yoyo: true,
      immediateRender: false,
    },
    2.5 * B + 0.2
  )
  let shown = -1
  const c = driver((l) => {
    const n = l >= 2 * B ? 3 : l >= 1.5 * B ? 2 : l >= B ? 1 : 0
    if (n !== shown && count.firstChild) {
      count.firstChild.nodeValue = String(n)
      shown = n
    }
  })
  tl.fromTo(c, { p: 0 }, { p: BAR, duration: BAR, ease: 'none' }, 0)
  ;[B, 1.5 * B, 2 * B].forEach((at) =>
    tl.fromTo(
      '.s11-count',
      { scale: 1.25 },
      {
        scale: 1,
        duration: 0.2,
        ease: 'back.out(2.4)',
        immediateRender: false,
        transformOrigin: '100% 50%',
      },
      at
    )
  )
}

export function ShipShot({
  label,
  replay,
}: {
  label: string
  replay?: string
}) {
  return (
    <Shot
      scene="s11"
      label={label}
      impacts={IMPACTS}
      build={build}
      replay={replay}
    >
      <div className="m s11-no">09 · Ship</div>
      <div className="s11-title">
        Upstream <em>fixes</em>
      </div>
      <div className="m s11-sub">Betaflight · PX4 · OpenFront</div>
      <div className="fig s11-count">
        3<small> / 5</small>
      </div>
      <div className="m s11-count-k">Pull requests merged</div>
      <svg className="s11-svg" viewBox="0 0 1920 1080">
        <path
          className="s11-main"
          d="M110 640 H1810"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
        {LANES.map((l, i) => (
          <g key={i}>
            <path
              className={`s11-lane s11-lane${i}`}
              d={l.lane}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
            {l.merge ? (
              <path
                className={`s11-merge s11-merge${i}`}
                d={l.merge}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1}
              />
            ) : null}
            <circle className="s11-fork" cx={l.fork} cy={640} r={7} />
            {l.commits.map(([x, y]) => (
              <circle key={x} className="s11-commit" cx={x} cy={y} r={6} />
            ))}
          </g>
        ))}
        {DOTS.map((x, i) => (
          <circle
            key={x}
            className={`s11-dot s11-dot${i}`}
            cx={x}
            cy={640}
            r={11}
          />
        ))}
        <circle className="s11-open s11-dot3" cx={1560} cy={780} r={11} />
        <g className="s11-x s11-dot4">
          <path d="M1789 489 L1811 511 M1811 489 L1789 511" />
        </g>
      </svg>
      {PRS.map((p, i) => (
        <div key={p.no}>
          <div
            className={`s11-lab s11-l${i}`}
            style={{ left: p.at[0], top: p.at[1] }}
          >
            <div className="s11-repo">
              {p.repo} <span>{p.no}</span>
            </div>
            <div className="s11-what">{p.what}</div>
          </div>
          <div
            className={`s11-pill s11-k-${p.kind} s11-p${i}`}
            style={{ left: p.pillAt[0], top: p.pillAt[1] }}
          >
            {p.pill}
          </div>
        </div>
      ))}
    </Shot>
  )
}
