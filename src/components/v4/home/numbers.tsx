'use client'

import { ArrowRight, ArrowUpRight, RotateCcw } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'

import { v4Home } from '@/content/v4/home'

import { gsap } from '../motion/gsap'
import { useMotion } from '../motion/use-motion'
import styles from './numbers.module.css'
import { Slate } from './slate'

/*
 * The record as motion infographics: each fact draws itself once when it
 * comes into view, and again when you point at it. The graphic says the same
 * thing as the sentence beside it; nothing in the animation is a new claim.
 */

type Item = (typeof v4Home.numbers.items)[number]
type Build = (svg: SVGSVGElement) => gsap.core.Timeline

const q = (el: Element, s: string) => Array.from(el.querySelectorAll(s))

/* ---------- 3rd of 95+: the field, then the podium ---------- */

const TEAMS = Array.from({ length: 95 }, (_, i) => ({ x: 34 + (i % 19) * 15, y: 44 + Math.floor(i / 19) * 15 }))
const OURS = 47

function WroGraphic() {
  return (
    <svg viewBox="0 0 640 220" className={styles.svg} aria-hidden="true">
      {TEAMS.map((t, i) => (i === OURS ? null : <circle key={i} data-team="" cx={t.x} cy={t.y} r="3.2" className={styles.fillInk} />))}
      <circle data-ours="" cx={TEAMS[OURS].x} cy={TEAMS[OURS].y} r="4.2" className={styles.fillSignal} />
      <text data-count-label="" x="34" y="150" className={styles.mono}>
        <tspan data-count="">95</tspan>+ teams · Future Engineers
      </text>
      <path className={styles.dim} d="M408,192 L620,192" />
      <rect data-bar="" x="420" y="122" width="58" height="70" className={styles.bar} />
      <rect data-bar="" x="482" y="92" width="58" height="100" className={styles.bar} />
      <rect data-bar="" x="544" y="140" width="58" height="52" className={styles.barSignal} />
      <text x="449" y="142" textAnchor="middle" className={styles.place}>
        2
      </text>
      <text x="511" y="112" textAnchor="middle" className={styles.place}>
        1
      </text>
      <text x="573" y="172" textAnchor="middle" className={styles.placeInk}>
        3
      </text>
    </svg>
  )
}
const wro: Build = (svg) => {
  const tl = gsap.timeline()
  const ours = svg.querySelector('[data-ours]')!
  // radius, not scale: nothing to measure, so 95 dots start in one frame without a layout pass
  tl.fromTo(q(svg, '[data-team]'), { attr: { r: 0 } }, { attr: { r: 3.2 }, duration: 0.3, stagger: { each: 0.005, from: 'random' }, ease: 'back.out(2)' }, 0)
  tl.fromTo(ours, { scale: 0, x: 0, y: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.3, ease: 'back.out(2)' }, 0.3)
  tl.fromTo(svg.querySelector('[data-count]'), { textContent: 0 }, { textContent: 95, duration: 0.8, snap: { textContent: 1 }, ease: 'power2.out' }, 0.1)
  tl.to(q(svg, '[data-team]'), { opacity: 0.16, duration: 0.4 }, 0.95)
  tl.fromTo(q(svg, '[data-bar]'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.5, stagger: 0.1, ease: 'slam' }, 1.0)
  tl.to(ours, { x: 573 - TEAMS[OURS].x, y: 126 - TEAMS[OURS].y, scale: 2.6, duration: 0.7, ease: 'cut' }, 1.35)
  return tl
}

/* ---------- full master's scholarship: graduate, then the award stamp ---------- */

function AwardGraphic() {
  return (
    <svg viewBox="0 0 400 220" className={styles.svg} aria-hidden="true">
      <circle data-node="" cx="58" cy="110" r="22" className={styles.ink} />
      <text x="58" y="115" textAnchor="middle" className={styles.monoSmall}>
        2025
      </text>
      <text x="58" y="152" textAnchor="middle" className={styles.mono}>
        graduate
      </text>
      <path data-arrow="" className={styles.signal} d="M86,110 C140,110 150,110 196,110" />
      <path data-head="" className={styles.signal} d="M188,102 L198,110 L188,118" />
      <g data-stamp="">
        <circle cx="290" cy="110" r="66" className={styles.stampRing} />
        <circle cx="290" cy="110" r="56" className={styles.stampInner} />
        <text x="290" y="104" textAnchor="middle" className={styles.stampBig}>
          FULL
        </text>
        <text x="290" y="124" textAnchor="middle" className={styles.stampSmall}>
          MASTER’S SCHOLARSHIP
        </text>
      </g>
      <circle data-burst="" cx="290" cy="110" r="66" className={styles.burst} />
    </svg>
  )
}
const award: Build = (svg) => {
  const tl = gsap.timeline()
  tl.fromTo(svg.querySelector('[data-node]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'glide' }, 0)
  tl.fromTo(svg.querySelector('[data-arrow]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power2.inOut' }, 0.4)
  tl.fromTo(svg.querySelector('[data-head]'), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.85)
  tl.fromTo(svg.querySelector('[data-stamp]'), { scale: 2.4, rotation: -26, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, rotation: -9, opacity: 1, duration: 0.45, ease: 'slam' }, 0.95)
  tl.fromTo(svg.querySelector('[data-burst]'), { scale: 1, opacity: 0.8, transformOrigin: '50% 50%' }, { scale: 1.6, opacity: 0, duration: 0.6, ease: 'power2.out' }, 1.1)
  return tl
}

/* ---------- ~40 a day: a team of three, then one person with the pipeline ---------- */

const person = (x: number, y: number, key: string) => (
  <g key={key} data-person="">
    <circle cx={x} cy={y} r="8" className={styles.ink} />
    <path className={styles.ink} d={`M${x - 13},${y + 26} Q${x},${y + 8} ${x + 13},${y + 26}`} />
  </g>
)
const FORTY = Array.from({ length: 40 }, (_, i) => ({ x: 236 + (i % 8) * 19, y: 70 + Math.floor(i / 8) * 22 }))

function ImagenGraphic() {
  return (
    <svg viewBox="0 0 400 220" className={styles.svg} aria-hidden="true">
      {person(58, 60, 'a')}
      {person(90, 60, 'b')}
      {person(122, 60, 'c')}
      {[0, 1, 2].map((i) => (
        <rect key={i} data-before="" x={68 + i * 20} y="112" width="14" height="18" rx="2" className={styles.photo} />
      ))}
      <text x="90" y="160" textAnchor="middle" className={styles.mono}>
        2–3 a day, all three
      </text>
      <path className={styles.dim} d="M168,30 L168,190" />
      {person(204, 60, 'd')}
      {FORTY.map((p, i) => (
        <rect key={i} data-after="" x={p.x} y={p.y} width="14" height="18" rx="2" className={styles.photoSignal} />
      ))}
      <text x="306" y="190" textAnchor="middle" className={styles.mono}>
        <tspan data-forty="">40</tspan> a day, each
      </text>
    </svg>
  )
}
const imagen: Build = (svg) => {
  const tl = gsap.timeline()
  tl.fromTo(q(svg, '[data-person]'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: 'glide' }, 0)
  tl.fromTo(q(svg, '[data-before]'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.3, stagger: 0.25, ease: 'back.out(2)' }, 0.35)
  tl.fromTo(q(svg, '[data-after]'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.025, ease: 'back.out(2)' }, 0.9)
  tl.fromTo(svg.querySelector('[data-forty]'), { textContent: 0 }, { textContent: 40, duration: 1, snap: { textContent: 1 }, ease: 'none' }, 0.9)
  return tl
}

/* ---------- 3 merged: three fixes branch off and merge back ---------- */

function MergedGraphic() {
  const merges = [
    { from: 50, to: 130, label: 'betaflight' },
    { from: 160, to: 240, label: 'openfront' },
    { from: 270, to: 350, label: 'openfront' },
  ]
  return (
    <svg viewBox="0 0 400 220" className={styles.svg} aria-hidden="true">
      <path data-main="" className={styles.ink} d="M20,70 L380,70" />
      {merges.map((m, i) => (
        <g key={i}>
          <path data-branch="" className={styles.fringe} d={`M${m.from},70 C${m.from + 22},70 ${m.from + 16},132 ${m.from + 40},132 C${m.to - 16},132 ${m.to - 22},70 ${m.to},70`} />
          <circle data-commit="" cx={m.from + 40} cy="132" r="5" className={styles.fillA} />
          <circle data-merge="" cx={m.to} cy="70" r="8" className={styles.merge} />
          <text data-tag="" x={(m.from + m.to) / 2} y="160" textAnchor="middle" className={styles.mono}>
            {m.label}
          </text>
        </g>
      ))}
      <text x="20" y="200" className={styles.mono}>
        merged: <tspan data-n="">3</tspan>
      </text>
    </svg>
  )
}
const merged: Build = (svg) => {
  const tl = gsap.timeline()
  tl.fromTo(svg.querySelector('[data-main]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'glide' }, 0)
  q(svg, '[data-branch]').forEach((b, i) => {
    const at = 0.35 + i * 0.4
    tl.fromTo(b, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power1.inOut' }, at)
    tl.fromTo(q(svg, '[data-commit]')[i], { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.2, ease: 'back.out(3)' }, at + 0.2)
    tl.fromTo(q(svg, '[data-merge]')[i], { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.3, ease: 'slam' }, at + 0.45)
    tl.fromTo(q(svg, '[data-tag]')[i], { opacity: 0 }, { opacity: 1, duration: 0.2 }, at + 0.4)
  })
  tl.fromTo(svg.querySelector('[data-n]'), { textContent: 0 }, { textContent: 3, duration: 1.2, snap: { textContent: 1 }, ease: 'steps(3)' }, 0.5)
  return tl
}

/* ---------- ~45 a second: frames pass through the model and come out sharp ---------- */

const FRAMES = Array.from({ length: 12 }, (_, i) => i)
function frame(i: number, sharp: boolean) {
  const x = 10 + i * 64
  return (
    <g key={i}>
      <rect x={x} y="70" width="56" height="44" rx="3" className={styles.frame} />
      {sharp ? (
        <>
          <circle cx={x + 28 + ((i * 7) % 11) - 5} cy={92} r="16" className={styles.heatGlow} />
          <circle cx={x + 28 + ((i * 7) % 11) - 5} cy={92} r="10" className={styles.heat} />
        </>
      ) : (
        [0, 1, 2, 3, 4, 5].map((k) => (
          <rect
            key={k}
            x={x + 4 + (k % 3) * 16}
            y={74 + Math.floor(k / 3) * 18}
            width="16"
            height="18"
            className={k === 1 || k === 4 ? styles.heatBlock : styles.coldBlock}
          />
        ))
      )}
    </g>
  )
}
function FpsGraphic() {
  return (
    <svg viewBox="0 0 400 220" className={styles.svg} aria-hidden="true">
      <defs>
        <clipPath id="v4-fps-after">
          <rect x="200" y="0" width="200" height="220" />
        </clipPath>
        <clipPath id="v4-fps-before">
          <rect x="0" y="0" width="200" height="220" />
        </clipPath>
      </defs>
      <g clipPath="url(#v4-fps-before)">
        <g data-strip="">{FRAMES.map((i) => frame(i, false))}</g>
      </g>
      <g clipPath="url(#v4-fps-after)">
        <g data-strip="">{FRAMES.map((i) => frame(i, true))}</g>
      </g>
      <rect x="186" y="56" width="28" height="72" rx="6" className={styles.model} />
      <text x="200" y="146" textAnchor="middle" className={styles.monoSmall}>
        model
      </text>
      <text x="200" y="196" textAnchor="middle" className={styles.mono}>
        <tspan data-fps="">45</tspan> frames · 1 second
      </text>
    </svg>
  )
}
const fps: Build = (svg) => {
  const tl = gsap.timeline()
  tl.fromTo(q(svg, '[data-strip]'), { x: 0 }, { x: -64 * 6, duration: 2, ease: 'none' }, 0)
  tl.fromTo(svg.querySelector('[data-fps]'), { textContent: 0 }, { textContent: 45, duration: 1, snap: { textContent: 1 }, ease: 'none' }, 0.5)
  return tl
}

/* ---------- the talk: the question types itself; a big model squeezes onto a chip ---------- */

function TalkGraphic() {
  return (
    <svg viewBox="0 0 640 220" className={styles.svg} aria-hidden="true">
      <rect x="18" y="26" width="330" height="168" rx="10" className={styles.slide} />
      <text x="40" y="70" className={styles.slideKicker}>
        GDG DEVFEST TRIPOLI · 2025
      </text>
      <text x="40" y="108" className={styles.slideTitle}>
        <tspan data-l1="">Can we fit GPT-Vision</tspan>
      </text>
      <text x="40" y="138" className={styles.slideTitle}>
        <tspan data-l2="">on small hardware?</tspan>
      </text>
      <g data-live="">
        <circle cx="46" cy="170" r="4" className={styles.fillB} />
        <text x="56" y="174" className={styles.monoSmall}>
          live demo
        </text>
      </g>
      <rect data-model="" x="400" y="46" width="200" height="120" rx="8" className={styles.big} />
      <text data-model-label="" x="500" y="112" textAnchor="middle" className={styles.mono}>
        vision-language model
      </text>
      <g data-chip="">
        <rect x="470" y="76" width="60" height="60" rx="6" className={styles.chip} />
        <path className={styles.pins} d="M478,76 L478,66 M490,76 L490,66 M502,76 L502,66 M514,76 L514,66 M478,136 L478,146 M490,136 L490,146 M502,136 L502,146 M514,136 L514,146 M470,88 L460,88 M470,100 L460,100 M470,112 L460,112 M470,124 L460,124 M530,88 L540,88 M530,100 L540,100 M530,112 L540,112 M530,124 L540,124" />
      </g>
      <text data-fits="" x="500" y="186" textAnchor="middle" className={styles.mono}>
        on-device
      </text>
    </svg>
  )
}
const talk: Build = (svg) => {
  const tl = gsap.timeline()
  tl.fromTo(svg.querySelector('[data-l1]'), { text: '' }, { text: 'Can we fit GPT-Vision', duration: 0.8, ease: 'none' }, 0.1)
  tl.fromTo(svg.querySelector('[data-l2]'), { text: '' }, { text: 'on small hardware?', duration: 0.7, ease: 'none' }, 0.9)
  tl.fromTo(svg.querySelector('[data-model]'), { scale: 1, opacity: 1, transformOrigin: '50% 50%' }, { scale: 0.3, opacity: 0, duration: 0.7, ease: 'cut' }, 1.1)
  tl.fromTo(svg.querySelector('[data-model-label]'), { opacity: 1 }, { opacity: 0, duration: 0.3 }, 1.1)
  tl.fromTo(svg.querySelector('[data-chip]'), { scale: 0, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.45, ease: 'slam' }, 1.55)
  tl.fromTo(svg.querySelector('[data-fits]'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 }, 1.8)
  tl.fromTo(svg.querySelector('[data-live]'), { opacity: 0 }, { opacity: 1, duration: 0.15, repeat: 3, yoyo: true }, 1.7)
  return tl
}

const GRAPHICS: Record<string, { graphic: ReactNode; build: Build; size: 'wide' | 'third' | 'full' | 'half' }> = {
  wro: { graphic: <WroGraphic />, build: wro, size: 'wide' },
  award: { graphic: <AwardGraphic />, build: award, size: 'third' },
  imagen: { graphic: <ImagenGraphic />, build: imagen, size: 'third' },
  merged: { graphic: <MergedGraphic />, build: merged, size: 'third' },
  fps: { graphic: <FpsGraphic />, build: fps, size: 'third' },
  talk: { graphic: <TalkGraphic />, build: talk, size: 'full' },
}

function Card({ item, replay }: { item: Item; replay: string }) {
  const g = GRAPHICS[item.id]
  const stage = useRef<HTMLDivElement>(null)
  const [take, setTake] = useState(0)
  useMotion(stage, (el) => g.build(el.querySelector('svg')!), { key: take })
  const external = item.href.startsWith('http')

  return (
    <li
      className={styles.card}
      data-size={g.size}
      // a scroll moving the card under a still mouse also fires enter; only a moving hand replays
      onPointerEnter={(e) => e.pointerType === 'mouse' && (e.movementX !== 0 || e.movementY !== 0) && setTake((t) => t + 1)}
    >
      <div ref={stage} className={styles.stage}>
        {g.graphic}
        <button type="button" className={styles.replay} onClick={() => setTake((t) => t + 1)} aria-label={`${replay}: ${item.figure} ${item.unit}`}>
          <RotateCcw size={14} strokeWidth={2} />
        </button>
      </div>
      <div className={styles.body}>
        <p className={styles.fig}>
          <span className={styles.figure} data-lens="0.9">
            {item.figure}
          </span>
          <span className={styles.unit}>{item.unit}</span>
        </p>
        <p className={styles.text}>{item.text}</p>
        <a
          className={styles.source}
          href={item.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          data-lock="Source"
        >
          {item.source}
          {external ? <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" /> : <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />}
        </a>
      </div>
    </li>
  )
}

export function Numbers() {
  const copy = v4Home.numbers
  return (
    <section className={styles.section} id="numbers" aria-labelledby="numbers-h">
      <div className={styles.wrap}>
        <Slate scene={3} label={copy.slate} title={copy.title} lede={copy.lede} id="numbers-h" />
        <ul className={styles.grid}>
          {copy.items.map((item) => (
            <Card key={item.id} item={item} replay={copy.replay} />
          ))}
        </ul>
      </div>
    </section>
  )
}
