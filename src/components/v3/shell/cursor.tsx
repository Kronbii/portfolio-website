'use client'

import { useEffect, useRef } from 'react'

import styles from './cursor.module.css'

/*
 * The lock-on cursor. At rest it is four corner brackets around a dot that
 * sits exactly on the pointer, so aiming is never lagged. Over anything you
 * can act on, the brackets spring out and frame it, the way a detector boxes
 * an object, and a tag names what it is. Fine pointers only; touch and pens
 * keep the platform's own behaviour, and reduced motion snaps instead of
 * springing. The dot is a point of white light: moved fast, it disperses into
 * the page's two fringe colours along the motion, and gathers when it stops.
 */

const TARGETS = 'a[href], button, [role="button"], [role="tab"], [role="slider"], summary, [data-lock]'
const REST = 22
/** How far the dot disperses at each aberration strength. */
const DISPERSION: Record<string, number> = { off: 0, subtle: 0.6, strong: 1, wild: 1.7 }
const PAD = 7

function labelFor(el: HTMLElement): string {
  if (el.dataset.lock) return el.dataset.lock
  if (el instanceof HTMLAnchorElement) {
    const href = el.getAttribute('href') ?? ''
    if (href.startsWith('mailto:')) return 'Email'
    if (href.startsWith('#') || (href.includes('#') && el.pathname === window.location.pathname)) return 'Jump'
    if (el.origin !== window.location.origin) return 'External'
    return 'Open'
  }
  if (el.getAttribute('aria-pressed') !== null) return 'Toggle'
  if (el.getAttribute('role') === 'slider') return 'Drag'
  return 'Press'
}

export function LockCursor() {
  const box = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const tag = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-v3]')
    const b = box.current
    const d = dot.current
    const t = tag.current
    if (!root || !b || !d || !t) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const px = { x: -100, y: -100 }
    // pointer velocity in px per second, smoothed; drives the dot's dispersion
    const vel = { x: 0, y: 0 }
    let lastEvent = 0
    const cur = { x: -100, y: -100, w: REST, h: REST }
    let target: HTMLElement | null = null
    let label = ''
    let visible = false
    let pressed = false
    let raf = 0
    let last = 0

    const goal = () => {
      if (target && target.isConnected) {
        const r = target.getBoundingClientRect()
        const vw = window.innerWidth
        const vh = window.innerHeight
        const x0 = Math.max(4, r.left - PAD)
        const y0 = Math.max(4, r.top - PAD)
        const x1 = Math.min(vw - 4, r.right + PAD)
        const y1 = Math.min(vh - 4, r.bottom + PAD)
        const inset = pressed ? 3 : 0
        return { x: x0 + inset, y: y0 + inset, w: Math.max(REST, x1 - x0 - inset * 2), h: Math.max(REST, y1 - y0 - inset * 2) }
      }
      const s = pressed ? REST - 6 : REST
      return { x: px.x - s / 2, y: px.y - s / 2, w: s, h: s }
    }

    const frame = (now: number) => {
      raf = 0
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      const g = goal()
      const k = reduced ? 1 : 1 - Math.exp(-dt * (target ? 20 : 34))
      cur.x += (g.x - cur.x) * k
      cur.y += (g.y - cur.y) * k
      cur.w += (g.w - cur.w) * k
      cur.h += (g.h - cur.h) * k
      const decay = Math.exp(-dt * 10)
      vel.x *= decay
      vel.y *= decay
      const ab = DISPERSION[root.dataset.aberration ?? 'strong'] ?? 1
      const sx = reduced ? 0 : Math.max(-9, Math.min(9, vel.x * 0.006)) * ab
      const sy = reduced ? 0 : Math.max(-9, Math.min(9, vel.y * 0.006)) * ab
      d.style.setProperty('--vx', sx.toFixed(2))
      d.style.setProperty('--vy', sy.toFixed(2))
      b.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`
      b.style.width = `${cur.w}px`
      b.style.height = `${cur.h}px`
      d.style.transform = `translate3d(${px.x}px, ${px.y}px, 0)`
      const moving =
        Math.abs(g.x - cur.x) + Math.abs(g.y - cur.y) + Math.abs(g.w - cur.w) + Math.abs(g.h - cur.h) > 0.2 ||
        Math.abs(sx) + Math.abs(sy) > 0.05
      // keep drawing while settling, and while locked (the target may scroll)
      if (visible && (moving || target)) raf = requestAnimationFrame(frame)
      else last = 0
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const setTarget = (el: HTMLElement | null) => {
      if (el === target) return
      target = el
      label = el ? labelFor(el) : ''
      t.textContent = label
      b.dataset.lock = el ? 'on' : 'off'
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        root.dataset.cursor = 'off'
        b.dataset.show = 'off'
        d.dataset.show = 'off'
        visible = false
        return
      }
      const t = e.timeStamp
      if (lastEvent && visible) {
        const dts = Math.max(0.004, (t - lastEvent) / 1000)
        const k = 0.35
        vel.x += ((e.clientX - px.x) / dts - vel.x) * k
        vel.y += ((e.clientY - px.y) / dts - vel.y) * k
      }
      lastEvent = t
      px.x = e.clientX
      px.y = e.clientY
      if (!visible) {
        visible = true
        root.dataset.cursor = 'on'
        b.dataset.show = 'on'
        d.dataset.show = 'on'
        cur.x = px.x - REST / 2
        cur.y = px.y - REST / 2
      }
      const hit = (e.target as Element | null)?.closest?.<HTMLElement>(TARGETS) ?? null
      setTarget(hit && !hit.closest('[data-lock="none"]') ? hit : null)
      wake()
    }
    const onDown = () => {
      pressed = true
      wake()
    }
    const onUp = () => {
      pressed = false
      wake()
    }
    const onLeave = (e: PointerEvent) => {
      if (e.relatedTarget) return
      visible = false
      b.dataset.show = 'off'
      d.dataset.show = 'off'
    }
    const onScroll = () => {
      if (!visible) return
      // whatever is under the pointer now, after the page moved beneath it
      const el = document.elementFromPoint(px.x, px.y)
      setTarget(el?.closest<HTMLElement>(TARGETS) ?? null)
      wake()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('pointerout', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerout', onLeave)
      window.removeEventListener('scroll', onScroll)
      root.dataset.cursor = 'off'
    }
  }, [])

  return (
    <div className={styles.layer} aria-hidden="true">
      <div ref={box} className={styles.box} data-show="off" data-lock="off">
        <i className={styles.c} data-c="tl" />
        <i className={styles.c} data-c="tr" />
        <i className={styles.c} data-c="bl" />
        <i className={styles.c} data-c="br" />
        <span ref={tag} className={styles.tag} />
      </div>
      <div ref={dot} className={styles.dot} data-show="off" />
    </div>
  )
}
