'use client'

import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

import { v6Copy } from '@/content/v6/reel'

import { B, clamp, decode, driver, kick, type Impact } from './armed'

/*
 * 01 ID, from the reel's s03-name: the name drops, rattles for three frames,
 * KRONBI side-snaps in on the next beat, the ID-lock brackets snap onto it,
 * and the subtitle decodes out of glyph noise while the chapter chips stamp
 * on sixteenths. When the preflight played, the name is already where it
 * landed, so the shot picks up at the lock.
 */

const IMPACTS: Impact[] = [
  { t: 0, k: 0.8, flash: 0.35, ghost: 1 },
  { t: B, k: 0.5, flash: 0.12, ghost: 0.5 },
  { t: 2 * B, k: 0.25 },
]
const LOCK_AT = 2 * B

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const c = v6Copy.hero

  useEffect(() => {
    const el = root.current
    if (!el) return
    const host = el.closest<HTMLElement>('[data-intro-root]')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const rig = el.querySelector<HTMLElement>('.v6-hero-rig')!
    const name = el.querySelector<HTMLElement>('#v6-name')!
    const flash = el.querySelector<HTMLElement>('.v6-hero-flash')!
    const sub = el.querySelector<HTMLElement>('.v6-hero-sub')!

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true })
      // the drop: RAMI slams from huge, then rattles for three frames
      tl.fromTo(
        '.v6-n1',
        { opacity: 0, scale: 1.7, filter: 'blur(26px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.16,
          ease: 'expo.out',
        },
        0
      )
      tl.fromTo(
        '.v6-n1',
        { x: 0 },
        {
          keyframes: [
            { x: 14, duration: 1 / 60 },
            { x: -10, duration: 1 / 60 },
            { x: 6, duration: 1 / 60 },
            { x: 0, duration: 1 / 60 },
          ],
          immediateRender: false,
        },
        0.16
      )
      tl.fromTo(
        '.v6-hero-glow',
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' },
        0
      )
      // KRONBI side-snaps in from the right on the next beat
      tl.fromTo(
        '.v6-n2',
        { opacity: 0, x: '57vw', filter: 'blur(30px)' },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.2,
          ease: 'expo.out',
        },
        B
      )
      tl.fromTo(
        '.v6-n2 > span',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(3)' },
        B + 0.18
      )
      // ID lock: brackets snap onto the name, the label blinks
      el.querySelectorAll('.v6-lock i').forEach((b, i) => {
        tl.fromTo(
          b,
          {
            opacity: 0,
            x: [-120, 120, -120, 120][i],
            y: [-80, -80, 80, 80][i],
          },
          { opacity: 1, x: 0, y: 0, duration: 0.22, ease: 'expo.out' },
          LOCK_AT + i * 0.02
        )
      })
      tl.fromTo(
        '.v6-hero-id',
        { opacity: 0 },
        { opacity: 1, duration: 0.04, ease: 'none', repeat: 4, yoyo: true },
        LOCK_AT + 0.05
      )
      // the subtitle decodes out of glyph noise
      let last = ''
      const dec = driver((p) => {
        const shown = decode(c.sub, p, Math.floor(p * 24))
        if (shown !== last) sub.textContent = last = shown
      })
      tl.fromTo(dec, { p: 0 }, { p: 1, duration: 0.4, ease: 'none' }, LOCK_AT)
      // the chapter chips stamp on sixteenths, then where, and what now
      tl.fromTo(
        '.v6-chip',
        { opacity: 0, y: 26, scale: 0.6 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.18,
          ease: 'back.out(2.2)',
          stagger: B / 4,
        },
        3 * B
      )
      tl.fromTo(
        '.v6-where',
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.25, ease: 'expo.out' },
        4 * B
      )
      tl.fromTo(
        '.v6-hero-now, .v6-roll',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out', stagger: 0.06 },
        4 * B + 0.05
      )

      // the camera kicks, flash, and a chromatic ghost on the name
      const paint = (t: number) => {
        const k = kick(IMPACTS, t)
        rig.style.transform = k.s
          ? `translate(${(k.x * 0.6).toFixed(2)}px, ${(k.y * 0.6).toFixed(2)}px) rotate(${k.r.toFixed(3)}deg) scale(${(1 + k.s * 0.6).toFixed(4)})`
          : ''
        flash.style.opacity = clamp(k.fl * 0.5).toFixed(3)
        const g = clamp(k.gh)
        name.style.textShadow =
          g > 0.02
            ? `${(-26 * g).toFixed(1)}px ${(6 * g).toFixed(1)}px 0 rgba(201, 104, 106, ${(0.75 * g).toFixed(3)})`
            : ''
      }
      tl.eventCallback('onUpdate', () => paint(tl.time()))
      tl.eventCallback('onComplete', () => paint(10))

      if (reduce) {
        tl.progress(1)
        sub.textContent = c.sub
        el.dataset.rolled = ''
        return
      }
      const intro = () => host?.dataset.intro
      const start = () => {
        // the preflight already landed the name: begin at the lock
        if (intro() === 'done')
          tl.progress(0)
            .seek(LOCK_AT - 0.02, false)
            .play()
        else tl.play(0)
      }
      // hide what has not happened yet, then wait for the preflight if it is flying
      tl.progress(0)
      el.dataset.rolled = ''
      if (intro() === 'on' || intro() === 'playing' || intro() === 'reveal') {
        // the name is the preflight's to place: keep it at rest, under its overlay
        gsap.set('.v6-n1, .v6-n2, .v6-n2 > span', {
          opacity: 1,
          scale: 1,
          x: 0,
          filter: 'none',
        })
        const mo = new MutationObserver(() => {
          const s = intro()
          if (s === 'done' || s === 'off') {
            mo.disconnect()
            start()
          }
        })
        if (host)
          mo.observe(host, {
            attributes: true,
            attributeFilter: ['data-intro'],
          })
        return () => mo.disconnect()
      }
      start()
    }, el)
    return () => ctx.revert()
  }, [c.sub])

  return (
    <section
      ref={root}
      id="id"
      className="v6-hero"
      data-sec-no="01"
      data-sec-label="ID"
      aria-labelledby="v6-name"
    >
      <div className="v6-hero-glow" aria-hidden="true" />
      <div className="v6-hero-rig">
        <p className="v6-hero-id v6-mono" aria-hidden="true">
          {c.id}
        </p>
        <div className="v6-name-box">
          {/* exactly two lines: the preflight's name lands on them one to one */}
          <h1 id="v6-name" className="v6-name">
            <span className="v6-n1">{c.first}</span>
            <span className="v6-n2">
              {c.last}
              <span>.</span>
            </span>
          </h1>
          <span className="v6-lock" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
      <div className="v6-hero-foot">
        <div>
          <p className="v6-hero-sub" aria-label={c.sub}>
            {c.sub}
          </p>
          <p className="v6-hero-now">
            <span
              className="v6-mono v6-kicker"
              style={{ display: 'inline', marginRight: 10 }}
            >
              {c.now.label}
            </span>
            <a href={c.now.href}>{c.now.text}</a>
          </p>
        </div>
        <div className="v6-hero-side">
          <nav className="v6-chips v6-mono" aria-label="Chapters">
            {c.chips.map((ch) => (
              <a key={ch.href} className="v6-chip" href={ch.href}>
                {ch.label}
              </a>
            ))}
          </nav>
          <span className="v6-where v6-mono">{c.where}</span>
          <a className="v6-roll v6-mono" href="#proof">
            {c.roll}
            <svg viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M7 1v11M2.5 7.5 7 12l4.5-4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
      <div className="v6-hero-flash" aria-hidden="true" />
    </section>
  )
}
