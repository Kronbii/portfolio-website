'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { vneo } from '@/content/vneo/site'

/*
 * Every arrow is a tracker (from v2): each arrow is a one-axis PD loop,
 * θ'' = Kp·e − Kd·θ', turning toward the light (your pointer, or an orbiting
 * source when you are away). In Sage, and seen through the same glass as the
 * rest of the site: an arrow that swings fast disperses into green and
 * magenta along its motion, and gathers as it settles.
 */

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))
const SAGE: [number, number, number] = [183, 211, 168]
const INK: [number, number, number] = [238, 241, 236]

export function Tracker() {
  const c = vneo.tracker
  const [preset, setPreset] = useState(c.presets[0].id)
  const gains = useRef(c.presets[0])
  const canvas = useRef<HTMLCanvasElement>(null)
  const err = useRef<HTMLElement>(null)
  const src = useRef<HTMLElement>(null)

  useEffect(() => {
    gains.current = c.presets.find((p) => p.id === preset) ?? c.presets[0]
  }, [preset, c.presets])

  useEffect(() => {
    const cv = canvas.current
    const g = cv?.getContext('2d')
    if (!cv || !g) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0,
      h = 0,
      dpr = 1
    let arrows: { x: number; y: number; th: number; om: number }[] = []
    const layout = () => {
      const r = cv.getBoundingClientRect()
      w = r.width
      h = r.height
      dpr = Math.min(devicePixelRatio || 1, 2)
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      const gap = w < 560 ? 38 : 46
      const cols = Math.max(4, Math.floor(w / gap))
      const rows = Math.max(3, Math.floor(h / gap))
      const ox = (w - (cols - 1) * gap) / 2
      const oy = (h - (rows - 1) * gap) / 2
      const prev = arrows
      arrows = []
      for (let r2 = 0; r2 < rows; r2++)
        for (let k = 0; k < cols; k++) {
          const old = prev[r2 * cols + k]
          arrows.push({
            x: ox + k * gap,
            y: oy + r2 * gap,
            th: old?.th ?? -Math.PI / 2,
            om: 0,
          })
        }
    }
    const pointer = { x: 0, y: 0, active: false, at: 0 }
    const toLocal = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      pointer.active = true
      pointer.at = performance.now()
      wake()
    }
    const leave = () => (pointer.active = false)
    cv.addEventListener('pointermove', toLocal)
    cv.addEventListener('pointerdown', toLocal)
    cv.addEventListener('pointerleave', leave)

    let t = 0,
      last = performance.now(),
      raf = 0,
      visible = false,
      ui = 0,
      cursor = false
    const light = () => {
      if (pointer.active && performance.now() - pointer.at < 2500)
        return { x: pointer.x, y: pointer.y, cursor: true }
      if (reduced) return { x: w * 0.62, y: h * 0.42, cursor: false }
      return {
        x: w / 2 + Math.cos(t * 0.42) * w * 0.32,
        y: h / 2 + Math.sin(t * 0.61) * h * 0.3,
        cursor: false,
      }
    }
    const stroke = (
      a: { x: number; y: number; th: number },
      dx: number,
      dy: number
    ) => {
      const len = 9
      const cx = Math.cos(a.th),
        sy = Math.sin(a.th)
      const x = a.x + dx,
        y = a.y + dy
      g.beginPath()
      g.moveTo(x - cx * len, y - sy * len)
      g.lineTo(x + cx * len, y + sy * len)
      g.moveTo(
        x + cx * len - Math.cos(a.th - 0.6) * 6,
        y + sy * len - Math.sin(a.th - 0.6) * 6
      )
      g.lineTo(x + cx * len, y + sy * len)
      g.lineTo(
        x + cx * len - Math.cos(a.th + 0.6) * 6,
        y + sy * len - Math.sin(a.th + 0.6) * 6
      )
      g.stroke()
    }
    const frame = (now: number) => {
      raf = 0
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      t += dt
      const L = light()
      const { kp, kd } = gains.current
      let sum = 0
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      g.clearRect(0, 0, w, h)
      g.lineCap = 'round'
      g.lineJoin = 'round'
      for (const a of arrows) {
        const target = Math.atan2(L.y - a.y, L.x - a.x)
        if (reduced) {
          a.th = target
          a.om = 0
        } else {
          for (let k = 0; k < 3; k++) {
            a.om += (kp * wrap(target - a.th) - kd * a.om) * (dt / 3)
            a.th += a.om * (dt / 3)
          }
        }
        sum += Math.abs(wrap(target - a.th))
        const p = Math.max(0, 1 - Math.hypot(L.x - a.x, L.y - a.y) / 260)
        // dispersion: the faster it turns, the further its colours separate, across its motion
        const d = Math.min(3.2, Math.abs(a.om) * 0.05)
        if (d > 0.25) {
          const nx = -Math.sin(a.th) * Math.sign(a.om) * d,
            ny = Math.cos(a.th) * Math.sign(a.om) * d
          g.lineWidth = 1.6
          g.strokeStyle = `rgba(224, 143, 208, ${(0.55 * Math.min(1, d / 2)).toFixed(3)})`
          stroke(a, -nx, -ny)
          g.strokeStyle = `rgba(166, 230, 143, ${(0.55 * Math.min(1, d / 2)).toFixed(3)})`
          stroke(a, nx, ny)
        }
        const col = [0, 1, 2].map((i) =>
          Math.round(INK[i] + (SAGE[i] - INK[i]) * p)
        )
        g.strokeStyle = `rgba(${col.join(',')},${(0.24 + p * 0.76).toFixed(3)})`
        g.lineWidth = 1.4 + p * 0.6
        stroke(a, 0, 0)
      }
      // the light
      g.fillStyle = 'rgb(183, 211, 168)'
      g.strokeStyle = 'rgb(183, 211, 168)'
      g.lineWidth = 1.5
      g.beginPath()
      g.arc(L.x, L.y, 5, 0, Math.PI * 2)
      g.fill()
      for (let i = 0; i < 8; i++) {
        const an = (i / 8) * Math.PI * 2
        g.beginPath()
        g.moveTo(L.x + Math.cos(an) * 10, L.y + Math.sin(an) * 10)
        g.lineTo(L.x + Math.cos(an) * 15, L.y + Math.sin(an) * 15)
        g.stroke()
      }
      ui += dt
      if (ui > 0.1 || reduced) {
        ui = 0
        const mean = arrows.length ? (sum / arrows.length) * (180 / Math.PI) : 0
        if (err.current)
          err.current.textContent = `${mean.toFixed(1).padStart(4, '0')}°`
        if (L.cursor !== cursor && src.current) {
          cursor = L.cursor
          src.current.textContent = L.cursor
            ? c.lightStates.cursor
            : c.lightStates.orbit
        }
      }
      if (visible && !reduced) raf = requestAnimationFrame(frame)
    }
    function wake() {
      if (!raf && visible) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    }
    const ro = new ResizeObserver(() => {
      layout()
      if (!raf) frame(performance.now())
    })
    ro.observe(cv)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) wake()
    })
    io.observe(cv)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      cv.removeEventListener('pointermove', toLocal)
      cv.removeEventListener('pointerdown', toLocal)
      cv.removeEventListener('pointerleave', leave)
    }
  }, [c.lightStates])

  const cur = c.presets.find((p) => p.id === preset) ?? c.presets[0]
  const zeta = cur.kd / (2 * Math.sqrt(cur.kp))
  const [lead, hot] = [
    c.heading.text.replace(c.heading.emphasis ?? '', ''),
    c.heading.emphasis ?? '',
  ]

  return (
    <section id="tracker" className="vn-tracker" aria-labelledby="tracker-h">
      <div className="vn-tracker-copy">
        <span className="v7-label">
          <i aria-hidden="true" />
          {c.label}
        </span>
        <h2 id="tracker-h" data-lens="">
          {lead}
          <em>{hot}</em>
        </h2>
        <p className="v7-ch-line">{c.body}</p>
        <div className="vn-presets" role="group" aria-label="Damping">
          {c.presets.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={preset === p.id}
              onClick={() => setPreset(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <dl className="vn-readouts">
          <div>
            <dt>{c.readouts.damping}</dt>
            <dd>ζ {zeta.toFixed(2)}</dd>
          </div>
          <div>
            <dt>{c.readouts.error}</dt>
            <dd>
              <span ref={err}>00.0°</span>
            </dd>
          </div>
          <div>
            <dt>{c.readouts.light}</dt>
            <dd>
              <span ref={src}>{c.lightStates.orbit}</span>
            </dd>
          </div>
        </dl>
        <p className="v7-ch-links">
          {c.links.map((l, i) => (
            <Link
              key={l.href}
              className={`v7-go${i ? ' quiet' : ''}`}
              href={l.href}
            >
              {l.label} →
            </Link>
          ))}
        </p>
      </div>
      <figure className="vn-tracker-plate">
        <canvas
          ref={canvas}
          role="img"
          aria-label="A field of arrows that each turn toward a moving light under PD control."
        />
        <figcaption>
          {c.simulated} · Kp {cur.kp} · Kd {cur.kd}
        </figcaption>
      </figure>
    </section>
  )
}
