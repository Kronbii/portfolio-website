'use client'

import { B, BAR, driver, type Impact } from '../armed'
import { Shot, type Rect } from '../shot'

/*
 * A title card in the reel's grammar, for work the reel has no scene for:
 * the plate whips in, the title rises word by word, the record's stages
 * light one per beat on the plate's tag, the proof and my part land on the
 * passes, and the lock brackets close on the fourth beat. With a verified
 * photograph the plate shows it; without one the plate is the stage list.
 */

const IMPACTS: Impact[] = [
  { t: 0, k: 0.5, flash: 0.25, ghost: 0.5 },
  { t: 2 * B, k: 0.25 },
]
const CROP: Rect = [930, 80, 920, 960]
const BOX = [70, 120, 830, 830]

export interface CardProps {
  label: string
  no: string
  kind: string
  title: string
  proof: string
  part: string
  stages: string[]
  image?: { src: string; position?: string }
  replay?: string
}

function build(root: HTMLElement, tl: gsap.core.Timeline) {
  const tag = root.querySelector<HTMLElement>('.c-tag')
  const steps = root.querySelectorAll<HTMLElement>('.c-steps span, .c-list li')
  const names = Array.from(steps)
    .slice(0, 4)
    .map((s) => s.dataset.name ?? '')
  const n = Math.max(1, Math.min(4, names.length))
  tl.fromTo(
    '.c-plate',
    { x: 760, filter: 'blur(22px)' },
    { x: 0, filter: 'blur(0px)', duration: 0.24, ease: 'expo.out' },
    0
  )
  tl.fromTo(
    '.c-no',
    { opacity: 0, x: -40 },
    { opacity: 1, x: 0, duration: 0.25, ease: 'expo.out' },
    0.02
  )
  tl.fromTo(
    '.c-title .w',
    { yPercent: 115 },
    { yPercent: 0, duration: 0.32, ease: 'expo.out', stagger: 0.035 },
    0.04
  )
  tl.fromTo(
    '.c-steps span',
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.2, ease: 'expo.out', stagger: 0.03 },
    0.08
  )
  tl.fromTo(
    '.c-list li',
    { opacity: 0, x: 40 },
    { opacity: 1, x: 0, duration: 0.24, ease: 'expo.out', stagger: 0.05 },
    0.1
  )
  let shown = -1
  const state = driver((l) => {
    const k = Math.max(0, Math.min(n - 1, Math.floor(l / B + 1e-6)))
    if (k === shown) return
    if (tag) tag.innerHTML = `<b>0${k + 1}</b> ${names[k] ?? ''}`
    steps.forEach((s, j) => s.classList.toggle('on', j === k))
    shown = k
  })
  tl.fromTo(state, { p: 0 }, { p: BAR, duration: BAR, ease: 'none' }, 0)
  for (let i = 0; i < n; i++)
    tl.fromTo(
      '.c-tag',
      { scale: 1.35 },
      {
        scale: 1,
        duration: 0.2,
        ease: 'back.out(2.4)',
        immediateRender: false,
      },
      i * B
    )
  // a scan pass on every beat
  for (let i = 1; i < n; i++) {
    tl.fromTo(
      '.c-scan',
      { opacity: 1, y: 0 },
      {
        opacity: 1,
        y: 896,
        duration: 0.22,
        ease: 'power2.out',
        immediateRender: false,
      },
      i * B
    )
    tl.to('.c-scan', { opacity: 0, duration: 0.06, ease: 'none' }, i * B + 0.22)
  }
  tl.fromTo(
    '.c-proof-k, .c-proof',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.25, ease: 'expo.out', stagger: 0.04 },
    B
  )
  tl.fromTo(
    '.c-part',
    { opacity: 0, x: -50 },
    { opacity: 1, x: 0, duration: 0.25, ease: 'expo.out' },
    2 * B
  )
  const [x0, y0, x1, y1] = BOX
  const corners: [string, number, number, number, number][] = [
    ['.c-b1', 0, 0, x0, y0],
    ['.c-b2', 836, 0, x1 - 64, y0],
    ['.c-b3', 0, 836, x0, y1 - 64],
    ['.c-b4', 836, 836, x1 - 64, y1 - 64],
  ]
  corners.forEach(([s, fx, fy, tx, ty], i) => {
    tl.fromTo(
      s,
      { x: fx, y: fy, opacity: 0 },
      { x: tx, y: ty, opacity: 1, duration: 0.24, ease: 'expo.out' },
      3 * B + i * 0.02
    )
  })
}

export function CardShot({
  label,
  no,
  kind,
  title,
  proof,
  part,
  stages,
  image,
  replay,
}: CardProps) {
  const four = stages.slice(0, 4)
  return (
    <Shot
      scene="sc"
      label={label}
      impacts={IMPACTS}
      build={build}
      crop={CROP}
      replay={replay}
    >
      <div className="m c-no">
        {no} · {kind}
      </div>
      <div
        className="c-title"
        style={
          {
            '--ct': `${title.length <= 22 ? 92 : title.length <= 38 ? 78 : 64}px`,
          } as React.CSSProperties
        }
      >
        {title.split(' ').map((w, i) => (
          <span key={i} className="wm">
            <span className="w">{w}</span>
          </span>
        ))}
      </div>
      <div className="m c-proof-k">Proof</div>
      <div className="c-proof">{proof}</div>
      <div className="c-part">{part}</div>
      <div className="c-plate">
        {image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="lazy"
              decoding="async"
              className="c-img"
              src={image.src}
              alt=""
              style={{ objectPosition: image.position }}
            />
            <div className="c-tag">
              <b>01</b> {four[0]}
            </div>
          </>
        ) : (
          <ol className="c-list">
            {four.map((s, i) => (
              <li key={s} data-name={s}>
                <b>0{i + 1}</b>
                {s}
              </li>
            ))}
          </ol>
        )}
        <div className="c-scan" />
        <div
          className="c-l c-b1"
          style={{ borderTopWidth: 5, borderLeftWidth: 5 }}
        />
        <div
          className="c-l c-b2"
          style={{ borderTopWidth: 5, borderRightWidth: 5 }}
        />
        <div
          className="c-l c-b3"
          style={{ borderBottomWidth: 5, borderLeftWidth: 5 }}
        />
        <div
          className="c-l c-b4"
          style={{ borderBottomWidth: 5, borderRightWidth: 5 }}
        />
      </div>
      {image ? (
        <div className="c-steps">
          {four.map((s, i) => (
            <span key={s} data-name={s}>
              0{i + 1} {s}
            </span>
          ))}
        </div>
      ) : null}
    </Shot>
  )
}
