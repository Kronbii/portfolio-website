'use client'

import { memo, useId, type ReactNode } from 'react'

import { gsap } from '../motion/gsap'
import styles from './explainers.module.css'

/*
 * One short motion explainer per featured project: a few seconds that show
 * how the thing works, drawn from its record (its stages, its real images
 * where it has them). Each is an SVG and a looping timeline builder; the work
 * player and the case pages decide when they play.
 */

export type ExplainerBuild = (svg: SVGSVGElement) => gsap.core.Timeline

const q = (el: Element, s: string) => Array.from(el.querySelectorAll(s))
const one = (el: Element, s: string) => el.querySelector(s)!

/* ---------- the race car: see, decide, steer, around the markers ---------- */

const LAP =
  'M85,180 L85,150 Q85,80 155,80 L195,80 C215,80 222,104 240,104 C258,104 265,80 285,80 L325,80 Q395,80 395,150 C395,165 370,168 370,180 C370,192 395,195 395,210 Q395,280 325,280 L285,280 C265,280 258,256 240,256 C222,256 215,280 195,280 L155,280 Q85,280 85,210 Z'

function RaceCar() {
  return (
    <>
      <rect x="40" y="36" width="400" height="288" rx="96" className={styles.dim} />
      <rect x="132" y="124" width="216" height="112" rx="48" className={styles.dim} />
      <path data-route="" d={LAP} fill="none" />
      <path data-trail="" d={LAP} className={styles.trail} />
      <circle cx="240" cy="72" r="9" className={styles.fillA} />
      <circle cx="406" cy="180" r="9" className={styles.fillB} />
      <circle cx="240" cy="288" r="9" className={styles.fillA} />
      <g data-car="">
        <path d="M16,0 L58,-20 L58,20 Z" className={styles.cone} />
        <rect x="-16" y="-9" width="32" height="18" rx="4" className={styles.fillSignal} />
        <rect x="-11" y="-12" width="7" height="3" rx="1" className={styles.fillInk} />
        <rect x="4" y="-12" width="7" height="3" rx="1" className={styles.fillInk} />
        <rect x="-11" y="9" width="7" height="3" rx="1" className={styles.fillInk} />
        <rect x="4" y="9" width="7" height="3" rx="1" className={styles.fillInk} />
      </g>
      {['see', 'decide', 'steer'].map((w, i) => (
        <g key={w} data-chip="">
          <rect x={150 + i * 64} y="164" width="58" height="22" rx="11" className={styles.chip} />
          <text x={179 + i * 64} y="179" textAnchor="middle" className={styles.chipText}>
            {w}
          </text>
        </g>
      ))}
    </>
  )
}
const raceCar: ExplainerBuild = (svg) => {
  const tl = gsap.timeline()
  const route = one(svg, '[data-route]') as SVGPathElement
  tl.fromTo(one(svg, '[data-car]'), { opacity: 1 }, { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], autoRotate: true }, duration: 4.5, ease: 'none' }, 0)
  tl.fromTo(one(svg, '[data-trail]'), { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 4.5, ease: 'none' }, 0)
  q(svg, '[data-chip]').forEach((c, i) => {
    tl.fromTo(c, { opacity: 0.35 }, { opacity: 1, duration: 0.2, repeat: 1, repeatDelay: 0.5, yoyo: true }, 0.2 + i * 0.7)
    tl.fromTo(c, { opacity: 0.35 }, { opacity: 1, duration: 0.2, repeat: 1, repeatDelay: 0.5, yoyo: true }, 2.4 + i * 0.7)
  })
  return tl
}

/* ---------- thermal super-resolution: the real input, then the real output ---------- */

const PLATE = '/images/authority/thermal-super-resolution/thermal-plate.webp'
function Thermal({ uid }: { uid: string }) {
  // each copy of the explainer needs its own clip ids
  return (
    <>
      <defs>
        <clipPath id={`${uid}-frame`}>
          <rect x="0" y="0" width="480" height="360" />
        </clipPath>
        <clipPath id={`${uid}-wipe`}>
          <rect data-wipe="" x="0" y="0" width="0" height="360" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-frame)`}>
        <image href={PLATE} x="0" y="0" width="960" height="361" preserveAspectRatio="none" />
        <g clipPath={`url(#${uid}-wipe)`}>
          <image href={PLATE} x="-480" y="0" width="960" height="361" preserveAspectRatio="none" />
        </g>
      </g>
      <rect data-scan="" x="0" y="0" width="3" height="360" className={styles.fillSignal} />
      <g>
        <rect x="14" y="14" width="66" height="22" rx="4" className={styles.tagDark} />
        <text x="47" y="29" textAnchor="middle" className={styles.tagInk}>
          input
        </text>
      </g>
      <g data-out="">
        <rect x="380" y="14" width="86" height="22" rx="4" className={styles.fillSignal} />
        <text x="423" y="29" textAnchor="middle" className={styles.tagOn}>
          ×3 output
        </text>
      </g>
      <g data-edge="">
        <rect x="134" y="318" width="212" height="26" rx="13" className={styles.tagDark} />
        <text x="240" y="335" textAnchor="middle" className={styles.tagInk}>
          on the device, beside the sensor
        </text>
      </g>
    </>
  )
}
const thermal: ExplainerBuild = (svg) => {
  const tl = gsap.timeline()
  tl.set(one(svg, '[data-wipe]'), { attr: { width: 0 } }, 0)
  tl.set(one(svg, '[data-out]'), { opacity: 0 }, 0)
  tl.fromTo(one(svg, '[data-scan]'), { attr: { x: 0 }, opacity: 1 }, { attr: { x: 477 }, duration: 1.5, ease: 'power1.inOut' }, 0.9)
  tl.to(one(svg, '[data-wipe]'), { attr: { width: 480 }, duration: 1.5, ease: 'power1.inOut' }, 0.9)
  tl.to(one(svg, '[data-scan]'), { opacity: 0, duration: 0.2 }, 2.4)
  tl.to(one(svg, '[data-out]'), { opacity: 1, duration: 0.25, ease: 'glide' }, 2.3)
  tl.fromTo(one(svg, '[data-edge]'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'glide' }, 2.5)
  tl.to({}, { duration: 1.6 })
  return tl
}

/* ---------- the panorama: one sweep, many frames, one picture ---------- */

const PANO = '/images/authority/spherical-panorama/panorama.jpg'
const SLICES = 8
function slice(i: number, x: number, y: number, w: number, h: number) {
  // the panorama's middle band, cut into adjacent slices
  const sw = 4096 / SLICES
  return (
    <svg key={i} data-slice="" x={x} y={y} width={w} height={h} viewBox={`${i * sw} 640 ${sw} 900`} preserveAspectRatio="xMidYMid slice">
      <image href={PANO} width="4096" height="2048" />
    </svg>
  )
}
function Panorama() {
  return (
    <>
      <path className={styles.dim} strokeDasharray="2 6" d="M60,150 Q240,30 420,150" />
      <g data-phone="">
        <path d="M0,-18 L-46,-92 L46,-92 Z" className={styles.cone} />
        <rect x="-16" y="-24" width="32" height="54" rx="6" className={styles.phone} />
        <circle cx="0" cy="-16" r="3" className={styles.fillSignal} />
      </g>
      {Array.from({ length: SLICES }, (_, i) => slice(i, 20 + i * 55, 196, 55, 110))}
      <rect data-strip="" x="20" y="196" width="440" height="110" className={styles.stripLine} />
      <text data-count="" x="240" y="334" textAnchor="middle" className={styles.label}>
        309 frames · one 360° panorama
      </text>
    </>
  )
}
const panorama: ExplainerBuild = (svg) => {
  const tl = gsap.timeline()
  const phone = one(svg, '[data-phone]')
  const slices = q(svg, '[data-slice]')
  tl.set(phone, { x: 240, y: 186 }, 0)
  tl.fromTo(phone, { rotation: -48, svgOrigin: '240 186' }, { rotation: 48, svgOrigin: '240 186', duration: 2, ease: 'power1.inOut' }, 0)
  slices.forEach((s, i) => {
    const t = (i / (SLICES - 1)) * 2
    const a = ((-48 + (96 * i) / (SLICES - 1)) * Math.PI) / 180
    // the frame appears where the phone is pointing, then drops into the strip
    tl.fromTo(
      s,
      { opacity: 0, attr: { x: 240 + Math.sin(a) * 150 - 27, y: 186 - Math.cos(a) * 120 - 55 } },
      { opacity: 1, duration: 0.15 },
      t,
    )
    tl.to(s, { attr: { x: 20 + i * 55, y: 196 }, duration: 0.55, ease: 'cut' }, 2.1 + i * 0.04)
  })
  tl.fromTo(one(svg, '[data-strip]'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2.8)
  tl.fromTo(one(svg, '[data-count]'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35, ease: 'glide' }, 2.9)
  tl.to({}, { duration: 1.4 })
  return tl
}

/* ---------- the desk: it sees how you sit, and moves ---------- */

const SLOUCH = 'M150,214 C152,190 160,172 176,160'
const UPRIGHT = 'M150,214 C150,192 150,172 152,154'
function Desk() {
  return (
    <>
      <path className={styles.dim} d="M30,318 L450,318" />
      {/* chair */}
      <path className={styles.dim} d="M118,214 L178,214 M126,214 L126,318 M170,214 L170,318 M118,214 L112,160" />
      {/* the person: hips, spine, head, arm to the desk */}
      <path data-spine="" className={styles.ink} d={SLOUCH} />
      <circle data-head="" cx="184" cy="144" r="15" className={styles.ink} />
      <path data-arm="" className={styles.ink} d="M168,170 L214,196 L246,196" />
      <path className={styles.ink} d="M150,214 L210,218 L212,318" />
      {/* keypoints the camera reads */}
      {[
        [184, 144],
        [176, 160],
        [162, 186],
        [150, 214],
      ].map(([x, y], i) => (
        <circle key={i} data-key="" cx={x} cy={y} r="5" className={styles.keyBad} />
      ))}
      {/* the desk: leg, and a top that rises and tilts */}
      <rect x="320" y="218" width="12" height="100" className={styles.fillDim} />
      <g data-top="">
        <path className={styles.ink} d="M236,212 L420,212" />
        <circle data-led="" cx="414" cy="222" r="5" className={styles.fillB} />
        <path className={styles.ink} d="M410,212 L410,120" />
        <rect x="392" y="104" width="30" height="18" rx="3" className={styles.camera} />
        <path data-fov="" d="M392,113 L232,74 L232,170 Z" className={styles.cone} />
      </g>
      <text data-note="" x="240" y="350" textAnchor="middle" className={styles.label}>
        posture read · height and tilt adjusted
      </text>
    </>
  )
}
const desk: ExplainerBuild = (svg) => {
  const tl = gsap.timeline()
  const keys = q(svg, '[data-key]')
  tl.set(one(svg, '[data-spine]'), { attr: { d: SLOUCH } }, 0)
  tl.set(one(svg, '[data-head]'), { attr: { cx: 184, cy: 144 } }, 0)
  tl.set(keys, { attr: { class: styles.keyBad } }, 0)
  tl.set(one(svg, '[data-led]'), { attr: { class: styles.fillB } }, 0)
  tl.set(one(svg, '[data-top]'), { rotation: 0, y: 0, svgOrigin: '326 212' }, 0)
  tl.fromTo(one(svg, '[data-fov]'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.2)
  tl.fromTo(keys, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.25, stagger: 0.1, ease: 'back.out(3)' }, 0.5)
  tl.to(one(svg, '[data-top]'), { rotation: -6, y: -26, svgOrigin: '326 212', duration: 0.9, ease: 'power2.inOut' }, 1.5)
  tl.to(one(svg, '[data-spine]'), { attr: { d: UPRIGHT }, duration: 0.9, ease: 'power2.inOut' }, 1.6)
  tl.to(one(svg, '[data-head]'), { attr: { cx: 154, cy: 136 }, duration: 0.9, ease: 'power2.inOut' }, 1.6)
  const upright = [
    [154, 136],
    [152, 154],
    [150, 184],
    [150, 214],
  ]
  keys.forEach((k, i) => tl.to(k, { attr: { cx: upright[i][0], cy: upright[i][1] }, duration: 0.9, ease: 'power2.inOut' }, 1.6))
  tl.set(keys, { attr: { class: styles.keyGood } }, 2.4)
  tl.set(one(svg, '[data-led]'), { attr: { class: styles.fillSignal } }, 2.4)
  tl.fromTo(one(svg, '[data-note]'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2.5)
  tl.to({}, { duration: 1.4 })
  return tl
}

/* ---------- upstream: branch, review, merge — a different fix each loop ---------- */

const FIXES = ['betaflight #15706', 'openfront #4868', 'openfront #4985']
function Upstream() {
  return (
    <>
      <path data-main="" className={styles.ink} d="M30,120 L450,120" />
      {[60, 210, 420].map((x) => (
        <circle key={x} cx={x} cy="120" r="6" className={styles.fillInk} />
      ))}
      <path data-branch="" className={styles.fringe} d="M100,120 C134,120 130,214 172,214 L300,214 C342,214 340,120 372,120" />
      <circle data-commit="" cx="196" cy="214" r="7" className={styles.fillA} />
      <circle data-commit="" cx="262" cy="214" r="7" className={styles.fillA} />
      <g data-pr="">
        <rect x="160" y="244" width="160" height="62" rx="10" className={styles.pr} />
        <text data-name="" x="176" y="268" className={styles.prTitle}>
          {FIXES[0]}
        </text>
        <path data-check="" className={styles.check} d="M178,286 L184,292 L195,280" />
        <text x="202" y="291" className={styles.label}>
          tests
        </text>
        <path data-check="" className={styles.check} d="M248,286 L254,292 L265,280" />
        <text x="272" y="291" className={styles.label}>
          review
        </text>
      </g>
      <circle data-ring="" cx="372" cy="120" r="12" className={styles.ring} />
      <circle data-merge="" cx="372" cy="120" r="12" className={styles.merge} />
      <g data-pill="">
        <rect x="334" y="66" width="76" height="24" rx="12" className={styles.mergePill} />
        <text x="372" y="82" textAnchor="middle" className={styles.mergeText}>
          merged
        </text>
      </g>
    </>
  )
}
const upstream: ExplainerBuild = (svg) => {
  let k = 0
  const name = one(svg, '[data-name]')
  const tl = gsap.timeline({
    onRepeat() {
      k = (k + 1) % FIXES.length
      name.textContent = FIXES[k]
    },
  })
  tl.fromTo(one(svg, '[data-main]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'glide' }, 0)
  tl.fromTo(one(svg, '[data-branch]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.2, ease: 'power1.inOut' }, 0.3)
  tl.fromTo(q(svg, '[data-commit]'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.25, stagger: 0.3, ease: 'back.out(3)' }, 0.6)
  tl.fromTo(one(svg, '[data-pr]'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'glide' }, 1.0)
  tl.fromTo(q(svg, '[data-check]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.25, stagger: 0.35 }, 1.4)
  tl.fromTo(one(svg, '[data-merge]'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.4, ease: 'slam' }, 2.1)
  tl.fromTo(one(svg, '[data-ring]'), { scale: 1, opacity: 0.9, transformOrigin: '50% 50%' }, { scale: 3, opacity: 0, duration: 0.7, ease: 'power2.out' }, 2.15)
  tl.fromTo(one(svg, '[data-pill]'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: 'slam' }, 2.2)
  tl.to({}, { duration: 1.3 })
  return tl
}

/* ---------- Imagen (illustration): brackets in, the photographer's edit out ---------- */

const EV = [-6, -3, 0, 3, 6]
function room(key: string) {
  return (
    <g key={key}>
      <rect x="0" y="0" width="120" height="90" rx="4" className={styles.roomBg} />
      <rect x="66" y="12" width="40" height="44" className={styles.window} />
      <path className={styles.roomLine} d="M0,66 L120,66 M14,66 L14,40 L46,40 L46,66 M30,40 L30,22 M24,22 L36,22" />
    </g>
  )
}
function Imagen() {
  return (
    <>
      {EV.map((ev, i) => (
        <g key={ev} data-bracket="" transform="translate(180 96)">
          {room(`r${ev}`)}
          <rect x="0" y="0" width="120" height="90" rx="4" className={ev < 0 ? styles.under : styles.over} style={{ opacity: Math.abs(ev) / 7.5 }} />
          <text x="60" y="106" textAnchor="middle" className={styles.label}>
            {ev > 0 ? `+${ev}` : ev} EV
          </text>
        </g>
      ))}
      <g data-edit="" transform="translate(150 84)">
        <rect x="-4" y="-4" width="188" height="142" rx="8" className={styles.editFrame} />
        <g transform="scale(1.5)">{room('edit')}</g>
        <rect x="0" y="0" width="180" height="135" rx="6" className={styles.grade} />
      </g>
      <text data-cap="" x="240" y="280" textAnchor="middle" className={styles.label}>
        five exposures → the photographer’s edit
      </text>
      <text x="240" y="340" textAnchor="middle" className={styles.fine}>
        illustration · the client’s photographs stay private
      </text>
    </>
  )
}
const imagen: ExplainerBuild = (svg) => {
  const tl = gsap.timeline()
  const brackets = q(svg, '[data-bracket]')
  tl.set(one(svg, '[data-edit]'), { opacity: 0, scale: 0.9, svgOrigin: '240 151' }, 0)
  tl.set(one(svg, '[data-cap]'), { opacity: 0 }, 0)
  tl.set(q(svg, '[data-bracket] text'), { opacity: 1 }, 0)
  brackets.forEach((b, i) => {
    tl.fromTo(b, { opacity: 0, x: 180, y: 96 }, { opacity: 1, x: 20 + i * 90, y: 96, duration: 0.6, ease: 'cut' }, 0.1 + i * 0.08)
  })
  tl.to(q(svg, '[data-bracket] text'), { opacity: 0, duration: 0.2 }, 1.45)
  tl.to(brackets, { x: 180, y: 96, opacity: 0.35, duration: 0.6, stagger: 0.04, ease: 'cut' }, 1.6)
  tl.to(brackets, { opacity: 0, duration: 0.2 }, 2.2)
  tl.to(one(svg, '[data-edit]'), { opacity: 1, scale: 1, svgOrigin: '240 151', duration: 0.5, ease: 'slam' }, 2.15)
  tl.to(one(svg, '[data-cap]'), { opacity: 1, duration: 0.3 }, 2.4)
  tl.to({}, { duration: 1.4 })
  return tl
}

export const EXPLAINERS: Record<string, { graphic: (p: { uid: string }) => ReactNode; build: ExplainerBuild; label: string }> = {
  'brainiacs-autonomous-race-car': { graphic: RaceCar, build: raceCar, label: 'A self-driving car steering around the course markers.' },
  'thermal-super-resolution': { graphic: Thermal, build: thermal, label: 'A low-resolution thermal frame, then the same frame upscaled three times.' },
  '360-spherical-panorama-stitching': { graphic: Panorama, build: panorama, label: 'A phone sweep turning into frames, and the frames into one panorama.' },
  'posture-aware-classroom-desk': { graphic: Desk, build: desk, label: 'A desk camera reading posture, and the desk adjusting its height and tilt.' },
  'upstream-open-source-contributions': { graphic: Upstream, build: upstream, label: 'A fix branching off, passing tests and review, and being merged.' },
  'imagen-raw-to-edit-dataset-pipeline': { graphic: Imagen, build: imagen, label: 'Five bracketed exposures combining into one edited photograph (an illustration).' },
}

export const ExplainerSvg = memo(function ExplainerSvg({ slug, className }: { slug: string; className?: string }) {
  const uid = `x${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const e = EXPLAINERS[slug]
  if (!e) return null
  const G = e.graphic
  return (
    <svg viewBox="0 0 480 360" className={`${styles.svg} ${className ?? ''}`} role="img" aria-label={e.label}>
      <G uid={uid} />
    </svg>
  )
})

export const explainerStyles = styles
