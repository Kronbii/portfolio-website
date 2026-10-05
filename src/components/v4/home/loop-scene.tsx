'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { memo, useEffect, useRef, useState } from 'react'

import { v4Home } from '@/content/v4/home'

import { gsap, reducedMotion, ScrollTrigger } from '../motion/gsap'
import styles from './loop-scene.module.css'
import { Slate } from './slate'

/*
 * One motion graphic that runs the loop behind every machine on this page:
 * sense, perceive, decide, act. The section pins and the scroll scrubs it, so
 * a reader moves through the four steps at their own pace (and can scrub
 * back). The scene is a road seen from a vehicle's camera. Sense: the
 * picture draws in and a sensor grid turns light into numbers. Perceive:
 * detection boxes lock onto a person, a car, and a sign. Decide: a path is
 * planned around the car and the steering turns. Act: the road streams past
 * and the world moves. Reduced motion shows the scene planned, unpinned.
 */

/** A fixed pseudo-random sequence, so the sensor's numbers are the same on server and client. */
function seeded(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const COLS = 16
const ROWS = 9
const rand = seeded(7)
const CELLS = Array.from({ length: COLS * ROWS }, (_, i) => ({
  x: (i % COLS) * 50,
  y: Math.floor(i / COLS) * 50,
  v: rand() < 0.12 ? Math.floor(rand() * 256) : null,
}))

const Stage = memo(function Stage() {
  const L = v4Home.loop.labels
  return (
    <svg className={styles.svg} viewBox="0 0 800 450" role="img" aria-label="A road seen from a vehicle camera: a person, a car, and a sign, detected and steered around.">
      <g data-grid="">
        {CELLS.map((c, i) => (
          <g key={i}>
            <rect data-cell="" x={c.x + 1} y={c.y + 1} width="48" height="48" className={styles.cell} />
            {c.v !== null ? (
              <text data-num="" x={c.x + 25} y={c.y + 30} textAnchor="middle" className={styles.num}>
                {c.v}
              </text>
            ) : null}
          </g>
        ))}
      </g>

      <path data-shape="" className={styles.dim} d="M12,170 L788,170" />
      <path data-shape="" className={styles.ink} d="M340,170 L70,438" />
      <path data-shape="" className={styles.ink} d="M460,170 L730,438" />
      <path data-lane="" className={styles.lane} d="M400,172 L400,438" />

      <g data-obj="person">
        <circle data-shape="" cx="175" cy="268" r="13" className={styles.ink} />
        <path data-shape="" className={styles.ink} d="M175,281 L175,330 M175,296 L160,316 M175,296 L190,316 M175,330 L163,372 M175,330 L187,372" />
        <g data-box="">
          <rect x="150" y="248" width="50" height="128" className={styles.box} />
          <rect x="150" y="233" width="60" height="14" rx="2" className={styles.tagBg} />
          <text x="155" y="243.5" className={styles.tag}>
            {L.person}
          </text>
        </g>
      </g>

      <g data-obj="car">
        <path data-shape="" className={styles.ink} d="M380,282 L380,262 Q380,254 388,252 L402,232 L452,232 L466,252 Q478,254 478,262 L478,282 Z" />
        <circle data-shape="" cx="398" cy="284" r="9" className={styles.ink} />
        <circle data-shape="" cx="460" cy="284" r="9" className={styles.ink} />
        <g data-box="">
          <rect x="370" y="224" width="118" height="72" className={styles.box} />
          <rect x="370" y="209" width="36" height="14" rx="2" className={styles.tagBg} />
          <text x="375" y="219.5" className={styles.tag}>
            {L.car}
          </text>
        </g>
      </g>

      <g data-obj="sign">
        <path data-shape="" className={styles.ink} d="M640,360 L640,242" />
        <circle data-shape="" cx="640" cy="222" r="20" className={styles.ink} />
        <g data-box="">
          <rect x="612" y="196" width="56" height="168" className={styles.box} />
          <rect x="612" y="181" width="40" height="14" rx="2" className={styles.tagBg} />
          <text x="617" y="191.5" className={styles.tag}>
            {L.sign}
          </text>
        </g>
      </g>

      <path data-plan="" className={styles.plan} d="M400,438 C400,384 414,342 512,312 C546,302 548,250 532,186" />
      <path data-arrow="" className={styles.arrow} d="M522,198 L531,180 L541,197 Z" />
      <text data-plan-label="" x="548" y="300" className={styles.label}>
        {L.path}
      </text>

      <g data-gauge="" transform="translate(706 392)">
        <path className={styles.dim} d="M-34,0 A34,34 0 0 1 34,0" />
        <path data-needle="" className={styles.needle} d="M0,0 L0,-30" />
        <circle r="4" className={styles.hub} />
      </g>

      <path className={styles.frame} d="M40,12 L12,12 L12,40 M760,12 L788,12 L788,40 M40,438 L12,438 L12,410 M760,438 L788,438 L788,410" />
    </svg>
  )
})

export function LoopScene() {
  const copy = v4Home.loop
  const section = useRef<HTMLElement>(null)
  const pinned = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const stepRef = useRef(0)
  const [still, setStill] = useState(false)

  useEffect(() => {
    const el = pinned.current
    const sec = section.current
    if (!el || !sec) return
    const reduced = reducedMotion()
    const ctx = gsap.context(() => {
      const q = (s: string) => Array.from(el.querySelectorAll(s))
      const tl = gsap.timeline({ defaults: { ease: 'none' } })

      // 1 — sense: the picture draws in; the sensor fills with light and reads it as numbers
      tl.fromTo(q('[data-shape]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, stagger: 0.02, ease: 'power1.inOut' }, 0)
      tl.fromTo(q('[data-lane]'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.2)
      tl.fromTo(q('[data-cell]'), { fillOpacity: 0 }, { fillOpacity: 0.34, duration: 0.18, stagger: { each: 0.004, grid: [ROWS, COLS], from: 'center' } }, 0.25)
      tl.to(q('[data-cell]'), { fillOpacity: 0.04, duration: 0.2, stagger: { each: 0.003, grid: [ROWS, COLS], from: 'center' } }, 0.6)
      tl.fromTo(q('[data-num]'), { opacity: 0 }, { opacity: 1, duration: 0.15, stagger: 0.01 }, 0.45)
      tl.to(q('[data-num]'), { opacity: 0, duration: 0.15 }, 0.9)

      // 2 — perceive: each object is boxed and named
      q('[data-box]').forEach((b, i) =>
        tl.fromTo(b, { opacity: 0, scale: 1.3, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.22, ease: 'back.out(2)' }, 1.1 + i * 0.22),
      )

      // 3 — decide: a path around the car, and the wheel turns to take it
      tl.fromTo(q('[data-plan]'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.55, ease: 'power1.inOut' }, 2.1)
      tl.fromTo(q('[data-arrow]'), { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.15, ease: 'back.out(3)' }, 2.62)
      tl.fromTo(q('[data-plan-label]'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 2.4)
      tl.fromTo(q('[data-needle]'), { rotation: 0, svgOrigin: '0 0' }, { rotation: 32, svgOrigin: '0 0', duration: 0.5, ease: 'power2.out' }, 2.3)

      // 4 — act: the road streams by, the car is passed, the sign comes closer
      tl.fromTo(q('[data-lane]'), { strokeDashoffset: 0 }, { strokeDashoffset: -320, duration: 1 }, 3)
      tl.to(q('[data-obj="car"]'), { x: -110, y: 40, scale: 1.35, transformOrigin: '50% 100%', duration: 1 }, 3)
      tl.to(q('[data-obj="sign"]'), { x: 90, y: 20, scale: 1.3, transformOrigin: '50% 100%', duration: 1 }, 3)
      tl.to(q('[data-obj="person"]'), { x: -90, scale: 1.2, opacity: 0.35, transformOrigin: '50% 100%', duration: 1 }, 3)
      tl.to(q('[data-plan]'), { drawSVG: '100% 100%', duration: 1 }, 3)
      tl.to(q('[data-arrow], [data-plan-label]'), { opacity: 0, duration: 0.3 }, 3.6)
      tl.to(q('[data-needle]'), { rotation: 8, svgOrigin: '0 0', duration: 0.6 }, 3.4)

      if (reduced) {
        tl.progress(0.74).pause()
        setStill(true)
        return
      }
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=320%',
        pin: el,
        scrub: 0.5,
        animation: tl,
        onUpdate: (self) => {
          const s = Math.min(3, Math.floor(self.progress * 4))
          if (s !== stepRef.current) {
            stepRef.current = s
            setStep(s)
          }
        },
      })
    }, sec)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={section} className={styles.section} id="loop" aria-labelledby="loop-h">
      <div className={`${styles.wrap} ${styles.head}`}>
        <Slate scene={2} label={copy.slate} title={copy.title} lede={copy.lede} id="loop-h" />
      </div>
      {/* only the steps and the picture hold still while the scroll runs the loop */}
      <div ref={pinned} className={styles.pin}>
        <div className={styles.wrap}>
          <div className={styles.body}>
            <ol className={styles.steps}>
              {copy.steps.map((s, i) => (
                <li key={s.id} className={styles.step} data-on={still || i === step ? 'on' : i < step ? 'past' : 'off'}>
                  <span className={styles.stepNo}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={styles.stepBody}>
                    <h3 className={styles.stepTitle}>{s.title}</h3>
                    <p className={styles.stepText}>{s.text}</p>
                    <div className={styles.chips}>
                      <span className={styles.chipsLabel}>{copy.workLabel}</span>
                      {s.work.map((w) => (
                        <Link key={w.href} href={w.href} className={styles.chip}>
                          {w.label}
                          <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className={styles.stage}>
              <Stage />
              <div className={styles.progress} aria-hidden="true">
                {copy.steps.map((s, i) => (
                  <span key={s.id} data-on={still || i <= step ? 'on' : 'off'}>
                    {s.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
