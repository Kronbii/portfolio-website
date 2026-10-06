'use client'

import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

import { v6Chrome, v6Copy } from '@/content/v6/reel'

import { B, BAR, clamp, kick, type Impact } from './armed'
import { Lander } from './gl/lander'
import type { ShotClock } from './shot'

/*
 * 14 LAND, from the reel's s14-sign, as the page's real sign-off: the
 * name lands on the downbeat, the portrait develops, the signature writes
 * itself, the address draws its rule, and the E58 sets down on the pad
 * beside it and disarms. Every link is live from the first paint; only the
 * entrance waits for the section to arrive.
 */

const HOLD = 2 * BAR
const IMPACTS: Impact[] = [
  { t: 0, k: 0.7, ghost: 0.8 },
  { t: 2 * B, k: 0.25 },
  { t: 5 * B, k: 0.2 },
]

export function Land() {
  const root = useRef<HTMLElement>(null)
  const pad = useRef<HTMLSpanElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const played = useRef(false)
  const doneAt = useRef<number | null>(null)
  const clock = useRef<ShotClock>({
    time: () => {
      if (!tl.current || !played.current) return -1
      if (doneAt.current != null)
        return HOLD + (performance.now() - doneAt.current) / 1000
      return tl.current.time()
    },
    playing: () => !!tl.current?.isActive(),
  }).current
  const c = v6Copy.land
  const [lead, hot] = splitLast(c.line)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const name = el.querySelector<HTMLElement>('.v6-land-name')!
    const rig = el.querySelector<HTMLElement>('.v6-land-main')!
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true })
      // the downbeat: everything that was flying lands here
      t.fromTo(
        '.v6-land-name',
        { opacity: 0, scale: 1.45, filter: 'blur(24px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.2,
          ease: 'expo.out',
        },
        0
      )
      t.fromTo(
        '.v6-land-name span',
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' },
        0.16
      )
      // the portrait develops: an inset clip opens, the blur and zoom resolve
      t.fromTo(
        '.v6-portrait',
        { clipPath: 'inset(30% 0 30% 0 round 18px)', opacity: 0 },
        {
          clipPath: 'inset(0% 0 0% 0 round 18px)',
          opacity: 1,
          duration: 0.42,
          ease: 'expo.out',
        },
        0.02
      )
      t.fromTo(
        '.v6-portrait img',
        { scale: 1.18, filter: 'blur(10px)' },
        { scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' },
        0.02
      )
      t.fromTo(
        '.v6-portrait-cap',
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'none' },
        0.3
      )
      t.fromTo(
        '.v6-land-sub',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out' },
        0.1
      )
      t.fromTo(
        '.v6-land-where',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out' },
        0.16
      )
      // the signature writes itself left to right
      t.fromTo(
        '.v6-sig',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'power1.inOut' },
        B
      )
      t.fromTo(
        '.v6-land-line, .v6-land-body',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out', stagger: 0.06 },
        B + 0.2
      )
      // the address
      t.fromTo(
        '.v6-rule',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.4, ease: 'expo.out' },
        2 * B - 0.1
      )
      t.fromTo(
        '.v6-land-mail-k, .v6-land-mail',
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out', stagger: 0.05 },
        2 * B
      )
      t.fromTo(
        '.v6-profiles',
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'none' },
        2 * B + 0.1
      )
      t.fromTo(
        '.v6-model-credit',
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'none' },
        2 * B + 0.2
      )
      // the pad lights, the E58 sets down, and disarms
      t.fromTo(
        '.v6-pad',
        { opacity: 0, scaleX: 1.6 },
        { opacity: 1, scaleX: 1, duration: 0.25, ease: 'expo.out' },
        4 * B
      )
      t.fromTo(
        '.v6-ring',
        { opacity: 0.9, scale: 0.3 },
        {
          opacity: 0,
          scale: 1.6,
          duration: 0.5,
          ease: 'power2.out',
          immediateRender: false,
        },
        5 * B + 0.2
      )
      t.fromTo(
        '.v6-dis',
        { opacity: 0, scale: 1.5 },
        { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(2.4)' },
        6 * B
      )
      // the hold: a slow push on the portrait
      t.fromTo(
        '.v6-portrait img',
        { scale: 1 },
        {
          scale: 1.05,
          duration: HOLD - 0.6,
          ease: 'none',
          immediateRender: false,
        },
        0.62
      )
      t.set({}, {}, HOLD)
      t.eventCallback('onUpdate', () => {
        const k = kick(IMPACTS, t.time())
        rig.style.translate = k.s
          ? `${(k.x * 0.5).toFixed(1)}px ${(k.y * 0.5).toFixed(1)}px`
          : ''
        const g = clamp(k.gh)
        name.style.textShadow =
          g > 0.02
            ? `${(-22 * g).toFixed(1)}px ${(5 * g).toFixed(1)}px 0 rgba(201, 104, 106, ${(0.75 * g).toFixed(3)})`
            : ''
      })
      t.eventCallback('onComplete', () => {
        if (!reduce) doneAt.current = performance.now()
        rig.style.translate = ''
        name.style.textShadow = ''
      })
      tl.current = t
      if (reduce) {
        played.current = true
        t.progress(1)
        return
      }
      t.progress(0)
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting && !played.current) {
            io.disconnect()
            played.current = true
            t.play(0)
          }
        },
        { rootMargin: '0px 0px -40% 0px' }
      )
      io.observe(el.querySelector('.v6-land-grid')!)
      return () => io.disconnect()
    }, el)
    return () => {
      ctx.revert()
      tl.current = null
    }
  }, [])

  return (
    <section
      ref={root}
      id="land"
      className="v6-land"
      data-sec-no="14"
      data-sec-label="Land"
      aria-labelledby="land-h"
    >
      <div className="v6-land-grid">
        <figure className="v6-land-photo">
          <div className="v6-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/home/portrait.jpeg"
              alt={`${c.name}, portrait`}
              loading="lazy"
            />
          </div>
          <figcaption className="v6-portrait-cap v6-mono">{c.cap}</figcaption>
        </figure>
        <div className="v6-land-main">
          <div className="v6-land-gl" aria-hidden="true">
            <Lander clock={clock} pad={pad} />
          </div>
          <p className="v6-land-name" aria-hidden="true">
            {c.name}
            <span>.</span>
          </p>
          <p className="v6-land-sub">{c.sub}</p>
          <span className="v6-land-where v6-mono">{c.where}</span>
          <div
            className="v6-sig"
            role="img"
            aria-label={`${c.name}’s signature`}
          />
          <h2 id="land-h" className="v6-land-line">
            {lead} <em>{hot}</em>
          </h2>
          <p className="v6-land-body">{c.body}</p>
          <div className="v6-rule" />
          <div className="v6-addr">
            <div>
              <span className="v6-land-mail-k v6-mono">{c.emailLabel}</span>
              <a className="v6-land-mail" href={`mailto:${c.email}`}>
                {c.email}
              </a>
              <nav className="v6-profiles v6-mono" aria-label="Profiles">
                {v6Chrome.profiles.map((p) => (
                  <a
                    key={p.href}
                    href={p.href}
                    rel="me noopener"
                    target="_blank"
                  >
                    {p.label}
                  </a>
                ))}
              </nav>
            </div>
            <div className="v6-pad-zone" aria-hidden="true">
              <span className="v6-dis v6-mono">{c.disarmed}</span>
              <span ref={pad} className="v6-pad">
                <i />
                <i />
              </span>
              <span className="v6-ring" />
            </div>
          </div>
          <span className="v6-model-credit v6-mono">{c.credit}</span>
        </div>
      </div>
    </section>
  )
}

/** "Let’s build something that has to work." → ["Let’s build something that has to", "work."] */
function splitLast(s: string): [string, string] {
  const i = s.lastIndexOf(' ')
  return i < 0 ? ['', s] : [s.slice(0, i), s.slice(i + 1)]
}
