'use client'

import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

import { B, clamp, kick, type Impact } from './armed'

/*
 * 02 Proof: four facts, slammed one per beat when the row reaches the
 * middle of the screen, each with its own kick. The words are in the page
 * from the start; only the entrance waits.
 */

interface Cred {
  big: string
  label: string
  note: string
  href: string
}

const IMPACTS: Impact[] = [0, 1, 2, 3].map((i) => ({
  t: i * B,
  k: i === 0 ? 0.5 : 0.3,
  ghost: i === 0 ? 0.6 : 0.3,
}))

export function Proof({ creds }: { creds: Cred[] }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bigs = Array.from(el.querySelectorAll<HTMLElement>('.v6-cred-big'))
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true })
      bigs.forEach((b, i) => {
        tl.fromTo(
          b,
          { opacity: 0, scale: 1.7, filter: 'blur(18px)' },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.18,
            ease: 'expo.out',
          },
          i * B
        )
      })
      tl.fromTo(
        '.v6-cred-label, .v6-cred-note',
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'expo.out',
          stagger: { each: B / 2 },
        },
        0.06
      )
      tl.eventCallback('onUpdate', () => {
        const t = tl.time()
        bigs.forEach((b, i) => {
          const k = kick([IMPACTS[i]], t)
          const g = clamp(k.gh)
          b.style.textShadow =
            g > 0.02
              ? `${(-18 * g).toFixed(1)}px ${(4 * g).toFixed(1)}px 0 rgba(201, 104, 106, ${(0.7 * g).toFixed(3)})`
              : ''
          b.style.translate = k.s
            ? `${(k.x * 0.4).toFixed(1)}px ${(k.y * 0.4).toFixed(1)}px`
            : ''
        })
      })
      tl.progress(0)
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            io.disconnect()
            tl.play(0)
          }
        },
        { rootMargin: '0px 0px -35% 0px' }
      )
      io.observe(el)
      return () => io.disconnect()
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="v6-creds">
      {creds.map((c) => (
        <a key={c.label} className="v6-cred" href={c.href}>
          <span className="v6-cred-big">{c.big}</span>
          <span className="v6-cred-label">{c.label}</span>
          <span className="v6-cred-note v6-mono">{c.note}</span>
        </a>
      ))}
    </div>
  )
}
