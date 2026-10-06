'use client'

import { useEffect } from 'react'

/*
 * The lens. The whole page is seen through one piece of glass with lateral
 * chromatic aberration: each wavelength is magnified a little differently, so
 * colours separate in proportion to the distance from the optical axis, and
 * not at all on it. The axis is your pointer (the frame's centre when there is
 * none), so whatever you look at is sharp and the rest of the page fringes
 * away from it.
 *
 * The lens also breathes: scrolling fast throws it out of focus and smears the
 * fringe along the motion, and holding the mouse down anywhere that is not a
 * control pulls focus until you let go. Display type takes the fringe as two
 * coloured shadows; photographs take it as two colour channels shifted against
 * each other (see LensImage). This writes two numbers per element per frame,
 * --lx and --ly, in pixels; CSS does the rest.
 */

const GAIN: Record<string, number> = { off: 0, subtle: 0.55, strong: 1, wild: 2.4 }
const TARGETS = '#v3-main :is(h1, h2), [data-lens], [data-lens-img]'
/** Fringe, in pixels, at the frame's corner with the default gain. */
const MAX_TEXT = 2.9
const MAX_IMG = 2.6
const CONTROLS = 'a, button, input, select, textarea, label, summary, canvas, [role="button"], [role="slider"], [data-lock]'

export function Lens() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-v3]')
    if (!root) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches

    let els: HTMLElement[] = []
    let stale = true
    const collect = () => {
      els = Array.from(document.querySelectorAll<HTMLElement>(TARGETS))
      stale = false
    }

    const axis = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const goal = { x: axis.x, y: axis.y }
    let lastMove = -1e9
    let hold = 0
    let holdGoal = 0
    let breath = 0
    let vy = 0
    let lastY = window.scrollY
    let raf = 0
    let last = 0
    const prev = new WeakMap<HTMLElement, number>()

    const frame = (now: number) => {
      raf = 0
      if (stale) collect()
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      const gain = GAIN[root.dataset.aberration ?? 'strong'] ?? 1
      const vw = window.innerWidth
      const vh = window.innerHeight

      // the optical axis: the pointer, or the frame's centre when it is idle or absent
      const idle = !fine || reduced || now - lastMove > 4500
      const gx = idle ? vw / 2 : goal.x
      const gy = idle ? vh / 2 : goal.y
      const ka = reduced ? 1 : 1 - Math.exp(-dt * 9)
      axis.x += (gx - axis.x) * ka
      axis.y += (gy - axis.y) * ka

      // breathing: scroll speed defocuses, and focus returns when the page stops
      const y = window.scrollY
      const v = (y - lastY) / dt
      lastY = y
      vy += (v - vy) * (1 - Math.exp(-dt * 8))
      if (reduced) vy = 0
      const bGoal = Math.min(1.25, Math.abs(vy) / 1800)
      breath += (bGoal - breath) * (1 - Math.exp(-dt * (bGoal > breath ? 14 : 4.5)))
      hold += (holdGoal - hold) * (1 - Math.exp(-dt * (holdGoal > hold ? 2.6 : 6)))

      const dyn = gain * (1 + breath + hold * 4.5)
      const trail = gain * Math.max(-1, Math.min(1, vy / 2600)) * 2
      const half = Math.hypot(vw, vh) / 2

      // read every position first, then write: interleaving the two would make
      // each read wait for a fresh layout
      const rects = els.map((el) => el.getBoundingClientRect())
      for (let i = 0; i < els.length; i++) {
        const el = els[i]
        const r = rects[i]
        if (r.bottom < -80 || r.top > vh + 80 || r.width === 0) continue
        const w = parseFloat(el.dataset.lens ?? '') || 1
        const max = el.hasAttribute('data-lens-img') ? MAX_IMG : MAX_TEXT
        const dx = (r.left + r.width / 2 - axis.x) / half
        const dy = (r.top + r.height / 2 - axis.y) / half
        // quarter-pixel steps: finer than the eye reads a fringe, and display type
        // only repaints when a step changes
        const qx = Math.round(dx * max * dyn * w * 4)
        const qy = Math.round((dy * max * dyn * w + trail * w) * 4)
        const key = qx * 100003 + qy
        if (prev.get(el) === key) continue
        prev.set(el, key)
        el.style.setProperty('--lx', String(qx / 4))
        el.style.setProperty('--ly', String(qy / 4))
      }

      const settling =
        Math.abs(gx - axis.x) + Math.abs(gy - axis.y) > 0.4 ||
        breath > 0.004 ||
        Math.abs(vy) > 4 ||
        Math.abs(hold - holdGoal) > 0.004 ||
        hold > 0.004
      if (settling && !document.hidden) raf = requestAnimationFrame(frame)
      else last = 0
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      goal.x = e.clientX
      goal.y = e.clientY
      lastMove = performance.now()
      wake()
    }
    const onDown = (e: PointerEvent) => {
      if (reduced || e.pointerType !== 'mouse' || e.button !== 0) return
      if ((e.target as Element | null)?.closest?.(CONTROLS)) return
      holdGoal = 1
      wake()
    }
    const onUp = () => {
      if (!holdGoal) return
      holdGoal = 0
      wake()
    }
    const onStale = () => {
      stale = true
      wake()
    }

    // a page swap, or a section that changes what it shows, brings new type;
    // live readouts that only rewrite their text do not
    const main = document.getElementById('v3-main')
    const mo = new MutationObserver((records) => {
      const nodes = (r: MutationRecord) => [...Array.from(r.addedNodes), ...Array.from(r.removedNodes)]
      if (records.some((r) => nodes(r).some((n) => n.nodeType === 1))) onStale()
    })
    if (main) mo.observe(main, { childList: true, subtree: true })

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('pointercancel', onUp, { passive: true })
    window.addEventListener('blur', onUp)
    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', wake)
    window.addEventListener('v3-aberration', onStale)
    document.addEventListener('visibilitychange', wake)
    wake()

    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('blur', onUp)
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', wake)
      window.removeEventListener('v3-aberration', onStale)
      document.removeEventListener('visibilitychange', wake)
    }
  }, [])

  return null
}
