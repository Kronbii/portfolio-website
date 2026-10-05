'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

/*
 * 11 Path, as an edit: four years on a ruler, each step a clip on its
 * year's track, and a playhead that scrubs across the years as you scroll
 * through the section. A clip lights when the playhead reaches its year.
 * The list is complete and readable without any of this.
 */

interface Point {
  when: string
  what: string
  note: string
  href: string
}

export function Path({ points }: { points: Point[] }) {
  const root = useRef<HTMLDivElement>(null)
  const years = Array.from(new Set(points.map((p) => p.when))).sort()

  useEffect(() => {
    const el = root.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const head = el.querySelector<HTMLElement>('.v6-playhead')!
    const cols = Array.from(el.querySelectorAll<HTMLElement>('.v6-year'))
    let raf = 0
    const update = () => {
      raf = 0
      if (getComputedStyle(head).display === 'none') return
      const r = el.getBoundingClientRect()
      const p = Math.min(
        1,
        Math.max(0, (innerHeight * 0.62 - r.top) / Math.max(1, r.height * 0.8))
      )
      const x = p * r.width
      head.style.setProperty('--ph', `${x.toFixed(1)}px`)
      cols.forEach((c) => {
        const lit = c.offsetLeft <= x + 1
        c.querySelectorAll<HTMLElement>('.v6-clip').forEach(
          (k) => (k.dataset.lit = String(lit))
        )
      })
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

  let n = 0
  return (
    <div ref={root} className="v6-edit">
      <div className="v6-ruler v6-mono" aria-hidden="true">
        {years.map((y) => (
          <span key={y}>
            <b>{y}</b>
          </span>
        ))}
      </div>
      <ol className="v6-tracks">
        {years.map((y) => (
          <li key={y} className="v6-year" data-year={y}>
            <span className="v6-vh">{y}</span>
            <ol>
              {points
                .filter((p) => p.when === y)
                .map((p) => {
                  n += 1
                  const ext = /^https?:/.test(p.href)
                  const body = (
                    <>
                      <span className="v6-clip-no v6-mono">
                        {String(n).padStart(3, '0')} · {p.when}
                      </span>
                      <span className="v6-clip-what">{p.what}</span>
                      <span className="v6-clip-note">{p.note}</span>
                    </>
                  )
                  return (
                    <li key={p.what}>
                      {ext ? (
                        <a className="v6-clip" href={p.href}>
                          {body}
                        </a>
                      ) : (
                        <Link className="v6-clip" href={p.href}>
                          {body}
                        </Link>
                      )}
                    </li>
                  )
                })}
            </ol>
          </li>
        ))}
      </ol>
      <span className="v6-playhead" aria-hidden="true" />
    </div>
  )
}
