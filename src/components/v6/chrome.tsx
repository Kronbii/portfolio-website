'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { V6, v6Chrome } from '@/content/v6/reel'

import { B, timecode } from './armed'

/*
 * The reel's four corners, reading the page as the reel: the scroll position
 * is the playhead, so the timecode and the sixteen-bar beat grid run as you
 * read (the whole page is the reel's thirty seconds), and the section in view
 * names itself bottom right, as the reel names its scenes.
 */

const REEL = 30
const BEATS = 64

export function Chrome() {
  const tc = useRef<HTMLSpanElement>(null)
  const grid = useRef<HTMLSpanElement>(null)
  const no = useRef<HTMLElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const path = usePathname()

  useEffect(() => {
    const cells = grid.current
      ? Array.from(grid.current.querySelectorAll('i'))
      : []
    let lastBeat = -2
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      const t = max > 0 ? (scrollY / max) * REEL : 0
      if (tc.current) tc.current.textContent = timecode(t)
      const nb = Math.min(BEATS - 1, Math.floor(t / B + 1e-6))
      if (nb !== lastBeat) {
        cells.forEach(
          (c, i) => (c.dataset.on = i < nb ? 'past' : i === nb ? 'now' : '')
        )
        lastBeat = nb
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)

    // the section in view: the last one whose top has passed a third of the way down
    // (every page marks its sections with data-sec-no and data-sec-label)
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-sec-no]')
    )
    let current: HTMLElement | null = null
    const pick = () => {
      const line = innerHeight / 3
      let at = els[0]
      for (const el of els) if (el.getBoundingClientRect().top <= line) at = el
      if (!at || at === current) return
      current = at
      if (no.current) no.current.textContent = at.dataset.secNo ?? ''
      if (label.current) label.current.textContent = at.dataset.secLabel ?? ''
    }
    const onPick = () => requestAnimationFrame(pick)
    pick()
    addEventListener('scroll', onPick, { passive: true })
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      removeEventListener('scroll', onPick)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [path])

  return (
    <div className="v6-chrome v6-mono">
      <div className="v6-top">
        <Link href={V6} className="v6-brand">
          {v6Chrome.brand} <span>— {v6Chrome.reel}</span>
        </Link>
        <nav className="v6-nav" aria-label="Primary">
          {v6Chrome.nav.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <span className="v6-tc" aria-hidden="true">
          <i />
          <span ref={tc}>00:00:00:00</span>
        </span>
      </div>
      <div className="v6-bottom" aria-hidden="true">
        <span ref={grid} className="v6-grid">
          {Array.from({ length: BEATS / 4 }, (_, b) => (
            <span key={b}>
              <i />
              <i />
              <i />
              <i />
            </span>
          ))}
          <b>{v6Chrome.bpm}</b>
        </span>
        <span className="v6-sec-label">
          <b ref={no}>01</b>
          <span ref={label}>ID</span>
        </span>
      </div>
    </div>
  )
}
