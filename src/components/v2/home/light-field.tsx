'use client'

import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { v2Home } from '@/content/v2/home'

import { Emph } from '../emph'
import { SheetLink } from '../sheet-link'
import styles from './light-field.module.css'

/*
 * Every arrow is a one-axis tracker. A proportional term turns it toward the
 * light (your cursor, or an orbiting source when the cursor is away) and a
 * derivative term damps the swing: θ'' = Kp·e − Kd·θ'. The presets change Kd,
 * which is the damping ratio ζ = Kd / (2√Kp) printed beside them.
 */

type Rgb = [number, number, number]

function parseColor(value: string, fallback: Rgb): Rgb {
  const v = value.trim()
  const hex = v.match(/^#([0-9a-f]{6})$/i)
  if (hex) {
    const n = parseInt(hex[1], 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const rgb = v.match(/rgba?\(([^)]+)\)/)
  if (rgb) {
    const [r, g, b] = rgb[1].split(',').map((x) => parseFloat(x))
    return [r, g, b]
  }
  return fallback
}

const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))

/** Height of the readout strip at the foot of the panel, in CSS pixels. */
const GUTTER = 44

export type LightFieldCopy = typeof v2Home.lightField

/** Defaults to the /v2 copy; another version passes its own (same shape, its own links). */
export function LightField({ copy = v2Home.lightField }: { copy?: LightFieldCopy }) {
  const [preset, setPreset] = useState(copy.presets[0].id)
  const gains = useRef(copy.presets[0])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const errorRef = useRef<HTMLElement>(null)
  const lightRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gains.current = copy.presets.find((p) => p.id === preset) ?? copy.presets[0]
  }, [preset, copy.presets])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const root = canvas.closest<HTMLElement>('[data-v2], [data-v3]') ?? document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let ink: Rgb = [251, 245, 234]
    let brand: Rgb = [201, 104, 106]
    const readColors = () => {
      const cs = getComputedStyle(root)
      ink = parseColor(cs.getPropertyValue('--ink'), ink)
      brand = parseColor(cs.getPropertyValue('--brand'), brand)
    }
    readColors()

    let w = 0
    let h = 0
    let dpr = 1
    let arrows: { x: number; y: number; th: number; om: number }[] = []

    const layout = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      const gap = w < 560 ? 38 : 48
      // The bottom strip belongs to the readout; the field never reaches it.
      const fieldH = h - GUTTER
      const cols = Math.max(4, Math.floor(w / gap))
      const rows = Math.max(3, Math.floor(fieldH / gap))
      const ox = (w - (cols - 1) * gap) / 2
      const oy = (fieldH - (rows - 1) * gap) / 2
      const prev = arrows
      arrows = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const old = prev[r * cols + c]
          arrows.push({ x: ox + c * gap, y: oy + r * gap, th: old?.th ?? -Math.PI / 2, om: 0 })
        }
      }
    }

    const pointer = { x: 0, y: 0, active: false, at: 0 }
    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = true
      pointer.at = performance.now()
      wake()
    }
    const onLeave = () => {
      pointer.active = false
    }
    canvas.addEventListener('pointermove', toLocal)
    canvas.addEventListener('pointerdown', toLocal)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('pointercancel', onLeave)

    let t = 0
    let last = performance.now()
    let raf = 0
    let visible = false
    let uiTick = 0
    let usingCursor = false

    const light = () => {
      if (pointer.active && performance.now() - pointer.at < 2500) return { x: pointer.x, y: pointer.y, cursor: true }
      if (reduced) return { x: w * 0.62, y: (h - GUTTER) * 0.42, cursor: false }
      return {
        x: w / 2 + Math.cos(t * 0.42) * w * 0.32,
        y: (h - GUTTER) / 2 + Math.sin(t * 0.61) * (h - GUTTER) * 0.3,
        cursor: false,
      }
    }

    const drawSun = (x: number, y: number) => {
      ctx.strokeStyle = `rgb(${brand.join(',')})`
      ctx.fillStyle = `rgb(${brand.join(',')})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(x + Math.cos(a) * 10, y + Math.sin(a) * 10)
        ctx.lineTo(x + Math.cos(a) * 15, y + Math.sin(a) * 15)
        ctx.stroke()
      }
    }

    const frame = (now: number) => {
      raf = 0
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      t += dt
      const L = light()
      const { kp, kd } = gains.current
      let errSum = 0

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (const a of arrows) {
        const target = Math.atan2(L.y - a.y, L.x - a.x)
        const e = wrapAngle(target - a.th)
        if (reduced) {
          a.th = target
          a.om = 0
        } else {
          // sub-step for stability at high Kp
          const n = 3
          const sdt = dt / n
          for (let k = 0; k < n; k++) {
            const err = wrapAngle(target - a.th)
            a.om += (kp * err - kd * a.om) * sdt
            a.th += a.om * sdt
          }
        }
        errSum += Math.abs(e)
        const dist = Math.hypot(L.x - a.x, L.y - a.y)
        const p = Math.max(0, 1 - dist / 260)
        const c = [0, 1, 2].map((i) => Math.round(ink[i] + (brand[i] - ink[i]) * p))
        ctx.strokeStyle = `rgba(${c.join(',')},${(0.26 + p * 0.74).toFixed(3)})`
        ctx.lineWidth = 1.4 + p * 0.6
        const len = 9
        const cx = Math.cos(a.th)
        const sy = Math.sin(a.th)
        ctx.beginPath()
        ctx.moveTo(a.x - cx * len, a.y - sy * len)
        ctx.lineTo(a.x + cx * len, a.y + sy * len)
        ctx.moveTo(a.x + cx * len - Math.cos(a.th - 0.6) * 6, a.y + sy * len - Math.sin(a.th - 0.6) * 6)
        ctx.lineTo(a.x + cx * len, a.y + sy * len)
        ctx.lineTo(a.x + cx * len - Math.cos(a.th + 0.6) * 6, a.y + sy * len - Math.sin(a.th + 0.6) * 6)
        ctx.stroke()
      }
      drawSun(L.x, L.y)

      uiTick += dt
      if (uiTick > 0.1 || reduced) {
        uiTick = 0
        const mean = arrows.length ? (errSum / arrows.length) * (180 / Math.PI) : 0
        if (errorRef.current) errorRef.current.textContent = `${mean.toFixed(1).padStart(4, '0')}°`
        if (L.cursor !== usingCursor && lightRef.current) {
          usingCursor = L.cursor
          lightRef.current.textContent = L.cursor ? copy.lightStates.cursor : copy.lightStates.orbit
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

    // Resizing a canvas clears it; always repaint once so it is never blank,
    // even while it is off screen and the loop is parked.
    const ro = new ResizeObserver(() => {
      layout()
      if (!raf) frame(performance.now())
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) wake()
    })
    io.observe(canvas)
    const onTheme = () => {
      readColors()
      if (!raf) frame(performance.now())
    }
    window.addEventListener('v2-theme', onTheme)
    window.addEventListener('v3-theme', onTheme)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('v2-theme', onTheme)
      window.removeEventListener('v3-theme', onTheme)
      canvas.removeEventListener('pointermove', toLocal)
      canvas.removeEventListener('pointerdown', toLocal)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('pointercancel', onLeave)
    }
  }, [copy.lightStates])

  const current = copy.presets.find((p) => p.id === preset) ?? copy.presets[0]
  const zeta = current.kd / (2 * Math.sqrt(current.kp))

  return (
    <section className={styles.section} id="tracker" aria-labelledby="tracker-h">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 className={styles.h2} id="tracker-h">
            <Emph {...copy.heading} />
          </h2>
          <p className={styles.body}>{copy.body}</p>

          <div className={styles.presets} role="group" aria-label="Damping">
            {copy.presets.map((p) => (
              <button
                key={p.id}
                type="button"
                className={styles.preset}
                aria-pressed={preset === p.id}
                onClick={() => setPreset(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <dl className={styles.readouts}>
            <div>
              <dt>{copy.readouts.damping}</dt>
              <dd>ζ {zeta.toFixed(2)}</dd>
            </div>
            <div>
              <dt>{copy.readouts.error}</dt>
              <dd>
                <span ref={errorRef}>00.0°</span>
              </dd>
            </div>
            <div>
              <dt>{copy.readouts.light}</dt>
              <dd className={styles.word}>
                <span ref={lightRef}>{copy.lightStates.orbit}</span>
              </dd>
            </div>
          </dl>

          <ul className={styles.links}>
            {copy.links.map((l) => (
              <li key={l.href}>
                <SheetLink href={l.href} className={styles.link}>
                  {l.label}
                  <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
                </SheetLink>
              </li>
            ))}
          </ul>
        </div>

        <figure className={styles.figure}>
          <div className={styles.plate}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              aria-label="A field of arrows that each turn toward a moving light under PD control."
              role="img"
            />
            <span className={styles.sim} aria-hidden="true">
              {copy.simulated} · Kp {current.kp} · Kd {current.kd}
            </span>
          </div>
        </figure>
      </div>
    </section>
  )
}
