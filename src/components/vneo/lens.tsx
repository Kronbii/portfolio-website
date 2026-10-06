'use client'

import { useEffect } from 'react'

/*
 * The lens (v3's): the whole page is seen through one piece of glass with
 * lateral chromatic aberration. Colours separate in proportion to the
 * distance from the optical axis, and not at all on it; the axis is your
 * pointer (the frame's centre when there is none), so what you look at is
 * sharp and the rest fringes away from it, green outward and magenta in.
 *
 * It breathes, too: scrolling fast throws it out of focus and smears the
 * fringe along the motion, and holding the mouse down anywhere that is not
 * a control pulls focus until you let go. Display type takes the fringe as
 * coloured shadows; photographs take it as their colour channels shifted
 * apart (see LensImage). This writes --lx and --ly, in pixels, on each
 * element; vneo.css does the rest.
 *
 * Vneo sets it between v3's subtle (0.55) and strong (1).
 */

const GAIN = 0.78
const TARGETS = '#v7-main :is(h1, h2), [data-lens], [data-lens-img]'
/** Fringe, in pixels, at the frame's corner at a gain of 1. */
const MAX_TEXT = 2.9
const MAX_IMG = 2.6
const CONTROLS =
  'a, button, input, select, textarea, label, summary, canvas, [role="button"], [role="slider"], [data-lock]'

export function Lens() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = matchMedia('(pointer: fine)').matches

    let els: HTMLElement[] = []
    let stale = true
    const collect = () => {
      els = Array.from(document.querySelectorAll<HTMLElement>(TARGETS))
      stale = false
    }

    const axis = { x: innerWidth / 2, y: innerHeight / 2 }
    const goal = { x: axis.x, y: axis.y }
    let lastMove = -1e9
    let hold = 0
    let holdGoal = 0
    let breath = 0
    let vy = 0
    let lastY = scrollY
    let raf = 0
    let last = 0
    const prev = new WeakMap<HTMLElement, number>()

    const frame = (now: number) => {
      raf = 0
      if (stale) collect()
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      const vw = innerWidth
      const vh = innerHeight

      // the optical axis: the pointer, or the frame's centre when it is idle or absent
      const idle = !fine || reduced || now - lastMove > 4500
      const gx = idle ? vw / 2 : goal.x
      const gy = idle ? vh / 2 : goal.y
      const ka = reduced ? 1 : 1 - Math.exp(-dt * 9)
      axis.x += (gx - axis.x) * ka
      axis.y += (gy - axis.y) * ka

      // breathing: scroll speed defocuses, and focus returns when the page stops
      const y = scrollY
      const v = (y - lastY) / dt
      lastY = y
      vy += (v - vy) * (1 - Math.exp(-dt * 8))
      if (reduced) vy = 0
      const bGoal = Math.min(1.25, Math.abs(vy) / 1800)
      breath +=
        (bGoal - breath) * (1 - Math.exp(-dt * (bGoal > breath ? 14 : 4.5)))
      hold +=
        (holdGoal - hold) * (1 - Math.exp(-dt * (holdGoal > hold ? 2.6 : 6)))

      const dyn = GAIN * (1 + breath + hold * 4.5)
      const trail = GAIN * Math.max(-1, Math.min(1, vy / 2600)) * 2
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
        // quarter-pixel steps: finer than the eye reads a fringe, and display
        // type only repaints when a step changes
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
    const main = document.getElementById('v7-main')
    const mo = new MutationObserver((records) => {
      const nodes = (r: MutationRecord) => [
        ...Array.from(r.addedNodes),
        ...Array.from(r.removedNodes),
      ]
      if (records.some((r) => nodes(r).some((n) => n.nodeType === 1))) onStale()
    })
    if (main) mo.observe(main, { childList: true, subtree: true })

    addEventListener('pointermove', onMove, { passive: true })
    addEventListener('pointerdown', onDown, { passive: true })
    addEventListener('pointerup', onUp, { passive: true })
    addEventListener('pointercancel', onUp, { passive: true })
    addEventListener('blur', onUp)
    addEventListener('scroll', wake, { passive: true })
    addEventListener('resize', wake)
    document.addEventListener('visibilitychange', wake)
    wake()

    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      removeEventListener('pointermove', onMove)
      removeEventListener('pointerdown', onDown)
      removeEventListener('pointerup', onUp)
      removeEventListener('pointercancel', onUp)
      removeEventListener('blur', onUp)
      removeEventListener('scroll', wake)
      removeEventListener('resize', wake)
      document.removeEventListener('visibilitychange', wake)
    }
  }, [])

  // the two halves of Sage's split, for photographs: a soft green and a soft
  // magenta, which add back up to the picture exactly
  return (
    <svg className="vn-lens-defs" aria-hidden="true" focusable="false">
      <filter id="vn-ch-g" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.3 0 0 0 0  0 0.62 0 0 0  0 0 0.25 0 0  0 0 0 1 0"
        />
      </filter>
      <filter id="vn-ch-m" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.7 0 0 0 0  0 0.38 0 0 0  0 0 0.75 0 0  0 0 0 1 0"
        />
      </filter>
    </svg>
  )
}

/**
 * A photograph seen through the lens. The first copy carries the alt text and
 * stays invisible; above it, two copies split the picture into Sage's soft
 * green and soft magenta, added back together. Unshifted they rebuild the
 * photograph exactly; the lens moves them apart by --lx/--ly, so the fringe
 * runs through the picture the way it does through glass, not just around
 * its frame. The picture should be opaque.
 */
export function LensImage({
  src,
  alt,
  position,
  className,
  weight,
}: {
  src: string
  alt: string
  position?: string
  className?: string
  weight?: number
}) {
  const style = { objectPosition: position ?? '50% 50%' }
  return (
    <span
      className={`vn-lens-img ${className ?? ''}`}
      data-lens-img=""
      data-lens={weight}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        loading="lazy"
        decoding="async"
        className="vn-li-base"
        src={src}
        alt={alt}
        style={style}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        loading="lazy"
        decoding="async"
        className="vn-li-g"
        src={src}
        alt=""
        aria-hidden="true"
        style={style}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        loading="lazy"
        decoding="async"
        className="vn-li-m"
        src={src}
        alt=""
        aria-hidden="true"
        style={style}
      />
    </span>
  )
}
