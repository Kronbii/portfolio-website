'use client'

import { ArrowUpRight, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { v4Home, type BeatId } from '@/content/v4/home'

import { gsap, reducedMotion, SplitText } from '../motion/gsap'
import styles from './reel.module.css'

/*
 * The hero reel: what Rami builds, as a motion-graphics loop cut on the beat.
 * Six beats, each a word set in kinetic type over its own small animated
 * graphic, with a wipe for every cut. It is a summary, not decoration: each
 * beat names a real thing and links to it, the chapter buttons jump to a beat,
 * and it can be paused (it loops, so it must be). Under reduced motion it holds
 * still on a beat and the buttons step through them.
 */

const BEAT = 2.5
const FPS = 24

const tc = (t: number) => {
  const s = Math.floor(t)
  const f = Math.floor((t - s) * FPS)
  const p = (n: number) => String(n).padStart(2, '0')
  return `00:00:${p(s)}:${p(f)}`
}

/* ---------- the six graphics, each a timeline under BEAT seconds ---------- */

function drones(g: SVGGElement) {
  const tl = gsap.timeline()
  const quad = g.querySelector('[data-quad]')!
  tl.fromTo(g.querySelector('[data-trail]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 2.1, ease: 'none', immediateRender: false }, 0)
  tl.fromTo(
    quad,
    { opacity: 1 },
    {
      motionPath: { path: g.querySelector('[data-route]') as SVGPathElement, align: g.querySelector('[data-route]') as SVGPathElement, alignOrigin: [0.5, 0.5], autoRotate: 90 },
      duration: 2.1,
      ease: 'none',
      immediateRender: false,
    },
    0,
  )
  tl.fromTo(g.querySelectorAll('[data-rotor]'), { rotation: 0 }, { rotation: 1440, transformOrigin: '50% 50%', duration: 2.1, ease: 'none', immediateRender: false }, 0)
  return tl
}

function vision(g: SVGGElement) {
  const tl = gsap.timeline()
  tl.fromTo(g.querySelectorAll('[data-shape]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, stagger: 0.06, ease: 'glide', immediateRender: false }, 0)
  tl.fromTo(g.querySelector('[data-scan]'), { attr: { y: 24 }, opacity: 1 }, { attr: { y: 262 }, duration: 0.9, ease: 'power1.inOut', immediateRender: false }, 0.25)
  tl.to(g.querySelector('[data-scan]'), { opacity: 0, duration: 0.15 }, 1.15)
  g.querySelectorAll<SVGGElement>('[data-box]').forEach((box, i) => {
    tl.fromTo(box, { opacity: 0, scale: 1.25, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.32, ease: 'slam', immediateRender: false }, 0.5 + i * 0.22)
    const label = box.querySelector('text')!
    tl.to(label, { duration: 0.4, scrambleText: { text: label.dataset.text ?? '', chars: 'lowerCase', speed: 0.6 } }, 0.55 + i * 0.22)
  })
  return tl
}

function control(g: SVGGElement) {
  const tl = gsap.timeline()
  const curve = g.querySelector('[data-curve]') as SVGPathElement
  tl.fromTo(g.querySelector('[data-axes]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4, ease: 'glide', immediateRender: false }, 0)
  tl.fromTo(g.querySelector('[data-set]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'glide', immediateRender: false }, 0.15)
  tl.fromTo(curve, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.5, ease: 'power1.inOut', immediateRender: false }, 0.35)
  tl.fromTo(
    g.querySelector('[data-dot]'),
    { opacity: 1 },
    { motionPath: { path: curve, align: curve, alignOrigin: [0.5, 0.5] }, duration: 1.5, ease: 'power1.inOut', immediateRender: false },
    0.35,
  )
  tl.fromTo(g.querySelector('[data-settled]'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3, ease: 'glide', immediateRender: false }, 1.7)
  return tl
}

function robots(g: SVGGElement) {
  const tl = gsap.timeline()
  const route = g.querySelector('[data-route]') as SVGPathElement
  tl.fromTo(g.querySelectorAll('[data-pillar]'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.3, stagger: 0.08, ease: 'back.out(3)', immediateRender: false }, 0)
  tl.fromTo(g.querySelector('[data-trail]'), { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 2.1, ease: 'none', immediateRender: false }, 0.1)
  tl.fromTo(
    g.querySelector('[data-car]'),
    { opacity: 1 },
    { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], autoRotate: true }, duration: 2.1, ease: 'none', immediateRender: false },
    0.1,
  )
  return tl
}

function third(g: SVGGElement) {
  const tl = gsap.timeline()
  const dots = g.querySelectorAll('[data-team]')
  const ours = g.querySelector('[data-ours]')!
  tl.fromTo(dots, { opacity: 0, attr: { r: 0 } }, { opacity: 1, attr: { r: 3 }, duration: 0.25, stagger: { each: 0.004, from: 'random' }, ease: 'back.out(2)', immediateRender: false }, 0)
  tl.fromTo(ours, { opacity: 0, scale: 0, x: 0, y: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2)', immediateRender: false }, 0.2)
  tl.to(dots, { opacity: 0.18, duration: 0.3 }, 0.75)
  tl.fromTo(g.querySelectorAll('[data-bar]'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.45, stagger: 0.1, ease: 'slam', immediateRender: false }, 0.7)
  // our dot drops from the field onto the third step
  tl.to(ours, { x: 271 - 196, y: 182 - 78, scale: 2.4, duration: 0.55, ease: 'cut' }, 1.0)
  tl.fromTo(g.querySelector('[data-of]'), { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: false }, 1.35)
  tl.fromTo(g.querySelector('[data-count]'), { textContent: 0 }, { textContent: 95, duration: 0.6, snap: { textContent: 1 }, ease: 'power2.out', immediateRender: false }, 1.3)
  return tl
}

function merged(g: SVGGElement) {
  const tl = gsap.timeline()
  tl.fromTo(g.querySelector('[data-main]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'glide', immediateRender: false }, 0)
  tl.fromTo(g.querySelectorAll('[data-commit]'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.25, stagger: 0.08, ease: 'back.out(3)', immediateRender: false }, 0.2)
  tl.fromTo(g.querySelector('[data-branch]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: 'power1.inOut', immediateRender: false }, 0.45)
  tl.fromTo(g.querySelectorAll('[data-fix]'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.25, stagger: 0.18, ease: 'back.out(3)', immediateRender: false }, 0.75)
  tl.fromTo(g.querySelector('[data-merge]'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.4, ease: 'slam', immediateRender: false }, 1.35)
  tl.fromTo(g.querySelector('[data-ring]'), { scale: 1, opacity: 0.9, transformOrigin: '50% 50%' }, { scale: 3.2, opacity: 0, duration: 0.7, ease: 'power2.out', immediateRender: false }, 1.4)
  tl.fromTo(g.querySelector('[data-pill]'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: 'slam', immediateRender: false }, 1.45)
  const label = g.querySelector('[data-label]') as SVGTextElement
  tl.to(label, { duration: 0.6, scrambleText: { text: label.dataset.text ?? '', chars: '0123456789#abcdefghijklmnopqrstuvwxyz', speed: 0.5 } }, 0.5)
  return tl
}

const BUILD: Record<BeatId, (g: SVGGElement) => gsap.core.Timeline> = { drones, vision, control, robots, third, merged }

/* ---------- the stage ---------- */

function Graphics() {
  const teams = Array.from({ length: 95 }, (_, i) => ({ x: 70 + (i % 19) * 14, y: 50 + Math.floor(i / 19) * 14 }))
  return (
    <svg className={styles.svg} viewBox="0 0 400 300" aria-hidden="true">
      {/* drones */}
      <g data-beat="drones" className={styles.beat}>
        <path data-route="" className={styles.dim} strokeDasharray="2 7" d="M60,190 C80,70 230,40 300,92 C370,145 330,252 230,228 C140,206 100,268 60,190" />
        <path data-trail="" className={styles.signal} d="M60,190 C80,70 230,40 300,92 C370,145 330,252 230,228 C140,206 100,268 60,190" />
        <g data-quad="">
          <path className={styles.ink} d="M-16,-16 L16,16 M16,-16 L-16,16" />
          {[
            [-16, -16],
            [16, -16],
            [-16, 16],
            [16, 16],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} data-rotor="" cx={x} cy={y} r="10" className={styles.rotor} />
          ))}
          <rect x="-6" y="-9" width="12" height="18" rx="3" className={styles.fillSignal} />
        </g>
      </g>

      {/* vision */}
      <g data-beat="vision" className={styles.beat}>
        <path data-shape="" className={styles.dim} d="M20,262 L380,262" />
        <circle data-shape="" cx="88" cy="150" r="13" className={styles.ink} />
        <path data-shape="" className={styles.ink} d="M88,163 L88,214 M88,180 L70,202 M88,180 L106,202 M88,214 L74,258 M88,214 L102,258" />
        <path data-shape="" className={styles.ink} d="M168,236 L168,214 Q168,204 178,202 L196,178 L250,178 L266,202 Q280,204 280,214 L280,236 Z" />
        <circle data-shape="" cx="192" cy="240" r="11" className={styles.ink} />
        <circle data-shape="" cx="256" cy="240" r="11" className={styles.ink} />
        <path data-shape="" className={styles.ink} d="M334,262 L334,158" />
        <circle data-shape="" cx="334" cy="140" r="19" className={styles.ink} />
        <rect data-scan="" x="20" y="24" width="360" height="2" className={styles.fillSignal} />
        {[
          { x: 64, y: 128, w: 48, h: 134, t: 'person' },
          { x: 158, y: 168, w: 132, h: 86, t: 'car' },
          { x: 308, y: 114, w: 52, h: 150, t: 'sign' },
        ].map((b) => (
          <g key={b.t} data-box="">
            <rect x={b.x} y={b.y} width={b.w} height={b.h} className={styles.box} />
            <rect x={b.x} y={b.y - 15} width={b.t.length * 7.4 + 10} height="14" rx="2" className={styles.fillSignal} />
            <text x={b.x + 5} y={b.y - 4.5} className={styles.tag} data-text={b.t}>
              {b.t}
            </text>
          </g>
        ))}
      </g>

      {/* control */}
      <g data-beat="control" className={styles.beat}>
        <path data-axes="" className={styles.dim} d="M40,36 L40,262 L380,262" />
        <path data-set="" className={styles.fringe} strokeDasharray="5 6" d="M40,100 L380,100" />
        <text x="380" y="90" textAnchor="end" className={styles.label}>
          setpoint
        </text>
        <path data-curve="" className={styles.signal} d="M40,262 C92,262 96,58 140,70 C172,79 176,124 206,106 C230,92 246,104 270,100 L380,100" />
        <circle data-dot="" r="7" className={styles.fillSignal} />
        <text data-settled="" x="380" y="128" textAnchor="end" className={styles.label}>
          settled
        </text>
      </g>

      {/* robots */}
      <g data-beat="robots" className={styles.beat}>
        <rect x="36" y="34" width="328" height="232" rx="64" className={styles.dim} />
        <rect x="112" y="104" width="176" height="92" rx="34" className={styles.dim} />
        <path data-route="" fill="none" d="M74,150 L74,112 Q74,70 116,70 L162,70 C182,70 186,94 200,94 C214,94 218,70 238,70 L284,70 Q326,70 326,112 L326,128 C326,142 304,150 304,162 C304,174 326,180 326,192 L326,190 Q326,230 284,230 L116,230 Q74,230 74,190 Z" />
        <path data-trail="" className={styles.signal} strokeDasharray="1 7" d="M74,150 L74,112 Q74,70 116,70 L162,70 C182,70 186,94 200,94 C214,94 218,70 238,70 L284,70 Q326,70 326,112 L326,128 C326,142 304,150 304,162 C304,174 326,180 326,192 L326,190 Q326,230 284,230 L116,230 Q74,230 74,190 Z" />
        <circle data-pillar="" cx="200" cy="64" r="8" className={styles.fillA} />
        <circle data-pillar="" cx="338" cy="160" r="8" className={styles.fillB} />
        <g data-car="">
          <path d="M14,0 L48,-16 L48,16 Z" className={styles.cone} />
          <rect x="-14" y="-8" width="28" height="16" rx="4" className={styles.fillSignal} />
        </g>
      </g>

      {/* third of 95+ */}
      <g data-beat="third" className={styles.beat}>
        {teams.map((t, i) =>
          i === 47 ? null : <circle key={i} data-team="" cx={t.x} cy={t.y} r="3" className={styles.fillInk} />,
        )}
        <circle data-ours="" cx="196" cy="78" r="4" className={styles.fillSignal} />
        <path className={styles.dim} d="M70,262 L330,262" />
        <rect data-bar="" x="113" y="186" width="58" height="76" className={styles.bar} />
        <rect data-bar="" x="171" y="150" width="58" height="112" className={styles.bar} />
        <rect data-bar="" x="242" y="196" width="58" height="66" className={styles.barOurs} />
        <text x="142" y="208" textAnchor="middle" className={styles.place}>
          2
        </text>
        <text x="200" y="174" textAnchor="middle" className={styles.place}>
          1
        </text>
        <text x="271" y="226" textAnchor="middle" className={styles.placeOurs}>
          3
        </text>
        <text data-of="" x="330" y="34" textAnchor="end" className={styles.label}>
          of <tspan data-count="">95</tspan>+ teams
        </text>
      </g>

      {/* merged */}
      <g data-beat="merged" className={styles.beat}>
        <path data-main="" className={styles.ink} d="M24,118 L376,118" />
        {[56, 190, 352].map((x) => (
          <circle key={x} data-commit="" cx={x} cy="118" r="6" className={styles.fillInk} />
        ))}
        <path data-branch="" className={styles.fringe} d="M96,118 C126,118 124,196 160,196 L254,196 C290,196 292,118 322,118" />
        <circle data-fix="" cx="178" cy="196" r="6" className={styles.fillA} />
        <circle data-fix="" cx="236" cy="196" r="6" className={styles.fillA} />
        <circle data-ring="" cx="322" cy="118" r="10" className={styles.ring} />
        <circle data-merge="" cx="322" cy="118" r="10" className={styles.merge} />
        <g data-pill="">
          <rect x="286" y="68" width="72" height="22" rx="11" className={styles.mergePill} />
          <text x="322" y="83" textAnchor="middle" className={styles.mergeText}>
            merged
          </text>
        </g>
        <text data-label="" data-text="betaflight #15706" x="160" y="232" className={styles.label}>
          betaflight #15706
        </text>
      </g>
    </svg>
  )
}

export function Reel() {
  const copy = v4Home.reel
  const beats = copy.beats
  const root = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)
  const segs = useRef<HTMLSpanElement[]>([])
  const time = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = reducedMotion()
    let io: IntersectionObserver | null = null
    let current = -1
    const ctx = gsap.context(() => {
      const groups = beats.map((b) => el.querySelector<SVGGElement>(`[data-beat="${b.id}"]`)!)
      const words = beats.map((b) => el.querySelector<HTMLElement>(`[data-word="${b.id}"]`)!)
      const cut = el.querySelector<HTMLElement>('[data-cut]')!
      const splits = words.map((w) => SplitText.create(w, { type: 'chars', mask: 'chars' }))
      gsap.set([...groups, ...words], { autoAlpha: 0 })
      // GSAP owns the wipe's position from here (the CSS offset would read as pixels)
      gsap.set(cut, { x: 0, xPercent: -101 })

      const tl = gsap.timeline({
        repeat: -1,
        onUpdate() {
          const t = tl.time()
          const i = Math.min(beats.length - 1, Math.floor(t / BEAT))
          const p = (t - i * BEAT) / BEAT
          segs.current.forEach((s, k) => s.style.setProperty('--p', k < i ? '1' : k === i ? p.toFixed(3) : '0'))
          if (time.current) time.current.textContent = tc(t)
          if (i !== current) {
            current = i
            setActive(i)
          }
        },
      })
      beats.forEach((b, i) => {
        const at = i * BEAT
        tl.addLabel(b.id, at)
        tl.set([groups[i], words[i]], { autoAlpha: 1 }, at)
        tl.add(BUILD[b.id](groups[i]), at + 0.05)
        tl.fromTo(splits[i].chars, { yPercent: 118 }, { yPercent: 0, duration: 0.55, stagger: 0.035, ease: 'cut', immediateRender: false }, at + 0.12)
        tl.to(splits[i].chars, { yPercent: -118, duration: 0.3, stagger: 0.02, ease: 'power2.in' }, at + BEAT - 0.5)
        // the cut: a wipe closes over the frame, the beat changes under it, and it opens
        tl.fromTo(cut, { xPercent: -101 }, { xPercent: 0, duration: 0.2, ease: 'power2.in', immediateRender: false }, at + BEAT - 0.2)
        tl.set([groups[i], words[i]], { autoAlpha: 0 }, at + BEAT)
        tl.fromTo(cut, { xPercent: 0 }, { xPercent: 101, duration: 0.26, ease: 'power2.out', immediateRender: false }, at + BEAT)
      })
      tlRef.current = tl
      if (reduced) {
        // hold on the first beat, fully drawn; the buttons step through the rest
        tl.pause(BEAT - 0.6)
        pausedRef.current = true
        setPaused(true)
        return
      }
      tl.pause(0)
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !pausedRef.current) tl.play()
        else tl.pause()
      })
      io.observe(el)
    }, el)
    return () => {
      io?.disconnect()
      ctx.revert()
      tlRef.current = null
    }
  }, [beats])

  const toggle = () => {
    const tl = tlRef.current
    if (!tl) return
    const next = !pausedRef.current
    pausedRef.current = next
    setPaused(next)
    if (next) tl.pause()
    else tl.play()
  }

  const jump = (i: number) => {
    const tl = tlRef.current
    if (!tl) return
    if (pausedRef.current) tl.pause(i * BEAT + BEAT - 0.6)
    else tl.play(i * BEAT)
  }

  const beat = beats[active]
  const external = beat.href.startsWith('http')

  return (
    <figure className={styles.reel} aria-label={copy.ariaLabel}>
      <div ref={root} className={styles.screen}>
        <Graphics />
        <div className={styles.words} aria-hidden="true">
          {beats.map((b) => (
            <span key={b.id} data-word={b.id} className={styles.word}>
              {b.word}
            </span>
          ))}
        </div>
        <div className={styles.hud} aria-hidden="true">
          <span className={styles.rec}>
            <i />
            {copy.label}
          </span>
          <span ref={time} className={styles.tc}>
            00:00:00:00
          </span>
          <span className={styles.idx}>
            {String(active + 1).padStart(2, '0')} / {String(beats.length).padStart(2, '0')}
          </span>
        </div>
        <div data-cut="" className={styles.cut} aria-hidden="true" />
        <i className={styles.c} data-c="tl" aria-hidden="true" />
        <i className={styles.c} data-c="tr" aria-hidden="true" />
        <i className={styles.c} data-c="bl" aria-hidden="true" />
        <i className={styles.c} data-c="br" aria-hidden="true" />
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.play}
          onClick={toggle}
          aria-label={paused ? copy.play : copy.pause}
          aria-pressed={!paused}
          data-lock={paused ? 'Play' : 'Pause'}
        >
          {paused ? <Play size={16} strokeWidth={2} /> : <Pause size={16} strokeWidth={2} />}
        </button>
        <div className={styles.segments} role="group" aria-label="Reel chapters">
          {beats.map((b, i) => (
            <button
              key={b.id}
              type="button"
              className={styles.seg}
              onClick={() => jump(i)}
              aria-label={copy.jump(b.word)}
              aria-current={i === active ? 'true' : undefined}
              data-lock={b.word}
            >
              <span
                ref={(n) => {
                  if (n) segs.current[i] = n
                }}
                className={styles.segFill}
              />
            </button>
          ))}
        </div>
      </div>
      <figcaption className={styles.caption}>
        <a
          href={beat.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className={styles.captionLink}
        >
          <span className={styles.captionWord}>{beat.word}</span>
          <span>{beat.caption}</span>
          <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  )
}
