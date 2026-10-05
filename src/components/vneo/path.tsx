'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { vneo } from '@/content/vneo/site'

/*
 * The path, flown: the career as a route of waypoints (v5's mission, v3's
 * flight log), with a small quad that flies it as you scroll. The flown part
 * of the route turns sage and carries the aberration; each waypoint lights
 * as the drone passes. The list reads completely without any of it.
 */

export function Path() {
  const root = useRef<HTMLOListElement>(null)
  const c = vneo.path

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const drone = el.parentElement!.querySelector<HTMLElement>('.vn-drone')!
    const items = Array.from(el.querySelectorAll<HTMLElement>('li'))
    let raf = 0
    let lastY = scrollY
    let bank = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const line = innerHeight * 0.55
      const y = Math.max(0, Math.min(r.height, line - r.top))
      el.style.setProperty('--flown', `${y.toFixed(1)}px`)
      // bank with the scroll's speed, and settle
      const v = scrollY - lastY
      lastY = scrollY
      bank += (Math.max(-1, Math.min(1, v / 40)) - bank) * 0.25
      drone.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) rotate(${(reduce ? 0 : bank * 14).toFixed(2)}deg)`
      items.forEach((li) => {
        if (li.offsetTop + 14 <= y) li.dataset.lit = ''
        else delete li.dataset.lit
      })
      if (Math.abs(bank) > 0.01 && !reduce) raf = requestAnimationFrame(update)
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => {
      removeEventListener('scroll', on)
      removeEventListener('resize', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const title = c.title.split(c.hot)
  return (
    <section id="path" className="vn-path" aria-labelledby="path-h">
      <span className="v7-label">
        <i aria-hidden="true" />
        {c.label}
      </span>
      <h2 id="path-h" data-lens="">
        {title[0]}
        <em>{c.hot}</em>
        {title[1]}
      </h2>
      <div className="vn-route">
        <span className="vn-drone" aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <circle cx="11" cy="11" r="7" />
            <circle cx="37" cy="11" r="7" />
            <circle cx="11" cy="37" r="7" />
            <circle cx="37" cy="37" r="7" />
            <path d="M16 16l16 16M32 16 16 32" />
            <rect x="19" y="19" width="10" height="10" rx="2" />
          </svg>
        </span>
        <ol ref={root}>
          {c.points.map((p, i) => {
            const ext = /^https?:/.test(p.href)
            const body = (
              <>
                <span className="vn-wp">
                  WP{String(i + 1).padStart(2, '0')} · {p.when}
                </span>
                <b>{p.what}</b>
                <span className="vn-wp-note">{p.note}</span>
              </>
            )
            return (
              <li key={p.what}>
                {ext ? (
                  <a href={p.href} rel="noopener" target="_blank">
                    {body}
                  </a>
                ) : (
                  <Link href={p.href}>{body}</Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
