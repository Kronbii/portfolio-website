'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/*
 * The page as one lens, with its optical axis at the centre of the screen:
 * lateral chromatic aberration grows with distance from the axis. The
 * middle of the screen, where you read, is a sharp zone; headings above and
 * below it fringe green outward and magenta inward, a little more the further
 * out they sit. Scroll and the focus travels with you. Headings only, no
 * blur, quantised so nothing repaints when it would not change.
 */

const MAX = 2.6 // px at the edge of the field
/** The sharp zone: the middle of the screen, where you read, carries no fringe at all. */
const SHARP = 0.4
const field = (d: number) =>
  (Math.sign(d) * Math.max(0, Math.min(1.2, Math.abs(d)) - SHARP)) / (1 - SHARP)

export function Lens() {
  const path = usePathname()
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-lens]')
    )
    const last = new Map<HTMLElement, string>()
    let raf = 0
    const update = () => {
      raf = 0
      const vw = innerWidth,
        vh = innerHeight
      // read every box first, then write
      const boxes = els.map((el) => el.getBoundingClientRect())
      els.forEach((el, i) => {
        const r = boxes[i]
        if (r.bottom < -vh * 0.2 || r.top > vh * 1.2) return
        const dx = (r.left + r.width / 2 - vw / 2) / (vw / 2)
        const dy = (r.top + r.height / 2 - vh / 2) / (vh / 2)
        const q = (v: number) => Math.round(v * MAX * 4) / 4
        const ox = q(field(dx) * 0.5)
        const oy = q(field(dy))
        const v =
          ox || oy
            ? `${-ox}px ${-oy}px 0 rgba(var(--fr-m), .75), ${ox}px ${oy}px 0 rgba(var(--fr-g), .75)`
            : ''
        if (last.get(el) === v) return
        last.set(el, v)
        el.style.textShadow = v
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
      els.forEach((el) => (el.style.textShadow = ''))
    }
  }, [path])
  return null
}
