'use client'

import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

import { B, focusIn } from '@/components/v7/tempo'

/*
 * At a glance (v3's credential facts), arriving the way everything here
 * does: out of a colour fringe into focus, one a beat, when the row reaches
 * the reader. The facts are in the page from the first paint.
 */

interface Cred {
  big: string
  label: string
  note: string
  href: string
}

export function Glance({ items, label }: { items: Cred[]; label: string }) {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = root.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true })
      focusIn(tl, '.v7-glance b', 0, { stagger: B, ca: 10, y: 10 })
      focusIn(tl, '.v7-glance span, .v7-glance small', 0.3 * B, {
        stagger: B / 2,
        ca: 4,
        blur: 6,
        y: 8,
      })
      tl.progress(0)
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            io.disconnect()
            tl.play(0)
          }
        },
        { rootMargin: '0px 0px -20% 0px' }
      )
      io.observe(el)
      return () => io.disconnect()
    }, el)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={root} className="v7-glance" aria-label={label}>
      <ul>
        {items.map((p) => (
          <li key={p.label}>
            <a href={p.href}>
              <b className="fx">{p.big}</b>
              <span className="fx">{p.label}</span>
              <small>{p.note}</small>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
