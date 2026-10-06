'use client'

import Matter from 'matter-js'
import { RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { SheetLink } from '../sheet-link'
import styles from './topic-tray.module.css'

export interface TrayTopic {
  slug: string
  label: string
  count: number
  href: string
}

interface TopicTrayProps {
  topics: TrayTopic[]
  states: { falling: string; resting: string; grid: string }
  dropLabel: string
  size?: 'regular' | 'large'
}

type State = 'grid' | 'falling' | 'resting'

/*
 * The index as physical tags. By default (and without JavaScript, and under
 * reduced motion) it is a plain grid of links: the module. When it scrolls
 * into view the tags fall into the tray; you can grab and throw them; once
 * they come to rest they glide back to the module. Raised by Studio Dumbar:
 * however far the parts are thrown, the system locks back together.
 */
export function TopicTray({ topics, states, dropLabel, size = 'regular' }: TopicTrayProps) {
  const tray = useRef<HTMLDivElement>(null)
  const pills = useRef<(HTMLAnchorElement | null)[]>([])
  const api = useRef<{ drop: () => void } | null>(null)
  const [state, setState] = useState<State>('grid')
  const [live, setLive] = useState(false)

  useEffect(() => {
    const box = tray.current
    if (!box) return
    // Reduced motion still gets the module layout; it just never falls.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const { Engine, Bodies, Body, Composite, Constraint } = Matter
    let disposed = false
    let raf = 0
    let mode: State = 'grid'
    let width = 0
    let height = 0
    let targets: { x: number; y: number; w: number; h: number }[] = []
    let bodies: Matter.Body[] = []
    let walls: Matter.Body[] = []
    let restSince = 0
    // Stacks of chamfered bodies can jitter just above any rest threshold;
    // whatever the residue, tags return to the module this long after a touch.
    const SETTLE_CAP = 4200
    let touchedAt = 0
    let glide: { from: { x: number; y: number; a: number }[]; start: number } | null = null
    let drag: { body: Matter.Body; c: Matter.Constraint; sx: number; sy: number; moved: boolean } | null = null
    let suppressClick = false

    const engine = Engine.create({ gravity: { x: 0, y: 1.15 }, enableSleeping: false })

    const set = (m: State) => {
      mode = m
      setState(m)
    }

    const place = (i: number, x: number, y: number, a: number) => {
      const el = pills.current[i]
      const t = targets[i]
      if (!el || !t) return
      el.style.transform = `translate3d(${x - t.w / 2}px, ${y - t.h / 2}px, 0) rotate(${a}rad)`
    }

    /*
     * The module: the tray's own 80px graph paper. Tags pack left to right in
     * whole columns, rows stack up from the floor, every tag starts on a column
     * line and sits centred in its row, and the tray is sized to the stack plus
     * headroom so the field is never mostly empty.
     */
    const MODULE = 80
    const measure = () => {
      pills.current = Array.from(box.querySelectorAll<HTMLAnchorElement>('a[data-pill]'))
      box.dataset.measuring = 'true'
      const sizes = pills.current.map((el) => {
        const r = el?.getBoundingClientRect() ?? { width: 0, height: 0 }
        return { w: r.width, h: r.height }
      })
      delete box.dataset.measuring
      width = box.clientWidth
      const cols = Math.max(1, Math.floor(width / MODULE))
      const rows: { i: number; span: number }[][] = [[]]
      let used = 0
      sizes.forEach((sz, i) => {
        const span = Math.min(cols, Math.ceil((sz.w + 12) / MODULE))
        if (used + span > cols && rows[rows.length - 1].length) {
          rows.push([])
          used = 0
        }
        rows[rows.length - 1].push({ i, span })
        used += span
      })
      const headroom = cols >= 8 ? 2 : 1
      height = (rows.length + headroom) * MODULE
      // border-box: add the 1px frame on each side so the inside is whole modules
      box.style.height = `${height + 2}px`
      targets = new Array(sizes.length)
      rows.forEach((row, r) => {
        const span = row.reduce((n, it) => n + it.span, 0)
        let c = Math.floor((cols - span) / 2)
        const y = height - (r + 0.5) * MODULE
        row.forEach(({ i, span: sp }) => {
          const { w, h } = sizes[i]
          targets[i] = { x: c * MODULE + w / 2, y, w, h }
          c += sp
        })
      })
    }

    const buildWalls = () => {
      if (walls.length) Composite.remove(engine.world, walls)
      const t = 200
      walls = [
        Bodies.rectangle(width / 2, height + t / 2, width * 3, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, height / 2 - 600, t, height * 3 + 1200, { isStatic: true }),
        Bodies.rectangle(width + t / 2, height / 2 - 600, t, height * 3 + 1200, { isStatic: true }),
      ]
      Composite.add(engine.world, walls)
    }

    const toGridInstant = () => {
      targets.forEach((t, i) => place(i, t.x, t.y, 0))
    }

    const startPhysics = (fromAbove: boolean) => {
      if (bodies.length) Composite.remove(engine.world, bodies)
      bodies = targets.map((t, i) => {
        const x = fromAbove ? t.w / 2 + Math.random() * Math.max(1, width - t.w) : t.x
        const y = fromAbove ? -60 - i * 70 - Math.random() * 120 : t.y
        const b = Bodies.rectangle(x, y, t.w, t.h, {
          chamfer: { radius: t.h / 2 - 1 },
          restitution: 0.32,
          friction: 0.3,
          frictionAir: 0.012,
          density: 0.0018,
        })
        Body.setAngle(b, fromAbove ? (Math.random() - 0.5) * 0.9 : 0)
        return b
      })
      Composite.add(engine.world, bodies)
      restSince = 0
      touchedAt = performance.now()
      glide = null
      set('falling')
      loop()
    }

    const beginGlide = () => {
      glide = {
        from: bodies.map((b) => ({ x: b.position.x, y: b.position.y, a: wrapAngle(b.angle) })),
        start: performance.now(),
      }
    }

    let last = performance.now()
    function loop() {
      if (raf || disposed) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }

    function tick(now: number) {
      raf = 0
      const dt = Math.min(now - last, 33)
      last = now

      if (glide) {
        const k = Math.min(1, (now - glide.start) / 760)
        const e = 1 - Math.pow(1 - k, 4)
        glide.from.forEach((f, i) => {
          const t = targets[i]
          place(i, f.x + (t.x - f.x) * e, f.y + (t.y - f.y) * e, f.a * (1 - e))
        })
        if (k >= 1) {
          glide = null
          Composite.remove(engine.world, bodies)
          bodies = []
          set('grid')
          return
        }
        raf = requestAnimationFrame(tick)
        return
      }

      Engine.update(engine, dt)
      let fastest = 0
      bodies.forEach((b, i) => {
        place(i, b.position.x, b.position.y, b.angle)
        fastest = Math.max(fastest, b.speed, Math.abs(b.angularVelocity) * 20)
      })

      if (!drag && fastest < 0.3) {
        if (!restSince) restSince = now
        if (mode !== 'resting' && now - restSince > 400) set('resting')
        if (now - restSince > 1400) beginGlide()
      } else {
        restSince = 0
        if (mode === 'resting') set('falling')
      }
      if (!drag && !glide && now - touchedAt > SETTLE_CAP) beginGlide()
      raf = requestAnimationFrame(tick)
    }

    // ---- dragging
    const local = (e: PointerEvent) => {
      const r = box.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const onDown = (e: PointerEvent) => {
      if (reduced) return
      const el = (e.target as Element).closest('a')
      const i = pills.current.findIndex((p) => p === el)
      if (i < 0) return
      if (mode === 'grid' || glide) {
        if (glide) {
          // catch it mid-glide: hand the current positions back to physics
          const now = pills.current.map((_, k) => readTransform(k))
          glide = null
          startPhysicsAt(now)
        } else {
          startPhysics(false)
        }
      }
      const body = bodies[i]
      if (!body) return
      const p = local(e)
      const c = Constraint.create({
        pointA: p,
        bodyB: body,
        pointB: { x: p.x - body.position.x, y: p.y - body.position.y },
        stiffness: 0.18,
        damping: 0.08,
        length: 0,
      })
      Composite.add(engine.world, c)
      drag = { body, c, sx: e.clientX, sy: e.clientY, moved: false }
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
      loop()
    }

    const onMove = (e: PointerEvent) => {
      if (!drag) return
      const p = local(e)
      drag.c.pointA = p
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) drag.moved = true
    }

    const onUp = () => {
      if (!drag) return
      Composite.remove(engine.world, drag.c)
      suppressClick = drag.moved
      drag = null
      restSince = 0
      touchedAt = performance.now()
    }

    const onClick = (e: MouseEvent) => {
      if (suppressClick) {
        e.preventDefault()
        e.stopPropagation()
        suppressClick = false
      }
    }

    const readTransform = (i: number) => {
      const el = pills.current[i]
      const t = targets[i]
      const m = el ? new DOMMatrixReadOnly(getComputedStyle(el).transform) : new DOMMatrixReadOnly()
      return { x: m.m41 + (t?.w ?? 0) / 2, y: m.m42 + (t?.h ?? 0) / 2, a: Math.atan2(m.m12, m.m11) }
    }

    const startPhysicsAt = (pos: { x: number; y: number; a: number }[]) => {
      if (bodies.length) Composite.remove(engine.world, bodies)
      bodies = targets.map((t, i) => {
        const b = Bodies.rectangle(pos[i].x, pos[i].y, t.w, t.h, {
          chamfer: { radius: t.h / 2 - 1 },
          restitution: 0.32,
          friction: 0.3,
          frictionAir: 0.012,
          density: 0.0018,
        })
        Body.setAngle(b, pos[i].a)
        return b
      })
      Composite.add(engine.world, bodies)
      touchedAt = performance.now()
      set('falling')
    }

    box.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    box.addEventListener('click', onClick, true)

    api.current = {
      drop: () => {
        if (glide) glide = null
        startPhysics(true)
      },
    }

    let dropped = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !dropped) {
          dropped = true
          window.setTimeout(() => !disposed && startPhysics(true), 250)
        }
      },
      { threshold: 0.45 },
    )

    const ready = document.fonts?.ready ?? Promise.resolve()
    ready.then(() => {
      if (disposed) return
      measure()
      buildWalls()
      box.dataset.live = 'true'
      toGridInstant()
      if (reduced) return
      setLive(true)
      io.observe(box)
    })

    const ro = new ResizeObserver(() => {
      if (disposed || !targets.length) return
      if (Math.abs(box.clientWidth - width) < 2) return
      // Re-read the module at the new width, then put everything on it.
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      glide = null
      if (bodies.length) Composite.remove(engine.world, bodies)
      bodies = []
      measure()
      buildWalls()
      toGridInstant()
      set('grid')
    })
    ro.observe(box)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      box.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      box.removeEventListener('click', onClick, true)
      Engine.clear(engine)
      api.current = null
    }
  }, [])

  return (
    <div className={styles.root} data-size={size}>
      <div ref={tray} className={styles.tray}>
        <ul className={styles.list}>
          {topics.map((t) => (
            <li key={t.slug} className={styles.item}>
              <SheetLink href={t.href} className={styles.pill} data-pill="" data-cursor="drag" draggable={false}>
                {t.label}
                <span className={styles.count}>{String(t.count).padStart(2, '0')}</span>
              </SheetLink>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.foot}>
        <span className={styles.state} data-state={state} aria-live="off">
          {states[state]}
        </span>
        {live ? (
          <button type="button" className={styles.drop} onClick={() => api.current?.drop()}>
            <RotateCcw size={14} strokeWidth={1.75} aria-hidden="true" />
            {dropLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}

function wrapAngle(a: number) {
  return Math.atan2(Math.sin(a), Math.cos(a))
}
