'use client'

import { ArrowRight, ArrowUpRight, Camera, CameraOff, Crosshair, Minus, Moon, Pause, Play, Plus, Radar, Sun, Volume2, VolumeX, X } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import type { MapItem } from '@/content/v5/mission'

import { latLon, metres } from './geo'
import styles from './ground-control.module.css'
import { Lidar, type DroneState } from './lidar'
import { contourPaths, draw, parseColor, pick, relief, toWorld, type Cam, type Chart } from './map-draw'
import { HandTracker } from './sense'
import { Engine } from './sound'
import { terrain, WORLD } from './terrain'

/*
 * Ground Control: the record as a mission on a chart. The map is the place to
 * play (fly the route, visit projects, steer by keyboard or by hand); the
 * flight plan beside it is the place to read, and holds everything a visitor
 * needs in plain words, with every item one click from the map and from its
 * source. Everything the drone "measures" is simulated and says so.
 */

type Mode = 'idle' | 'mission' | 'goto' | 'manual' | 'sense'
type Region = { id: string; label: string; code: string; x: number; y: number }

export interface GroundCopy {
  hud: {
    sim: string
    mode: Record<Mode, string>
    wp: string
    alt: string
    gs: string
    hdg: string
    fly: string
    pause: string
    recenter: string
    zoomIn: string
    zoomOut: string
    zoomHint: string
    keys: string
    hand: string
    handStop: string
    handNote: string
    handHint: string
    handDenied: string
    sound: string
    lidar: string
    lidarNote: string
    sees: string
    open: string
    source: string
    close: string
  }
  briefing: {
    pilot: string
    mission: string
    missionLede: string
    projects: string
    projectsLede: string
    contact: string
    email: string
  }
}

interface Props {
  pilot: { name: string; claim: string; hot: string; now: { label: string; text: string; href: string }; where: string }
  creds: { big: string; label: string; note: string; href: string }[]
  route: MapItem[]
  projects: MapItem[]
  regions: Region[]
  home: { x: number; y: number; label: string; coords: string }
  profiles: { label: string; href: string }[]
  copy: GroundCopy
  base: string
  preview: string
  focus?: string
  dossier?: ReactNode
  /** Which list the flight plan opens on. */
  initialTab?: 'route' | 'projects'
}

const VMAX = 560
const TURN = 2.8
const ACCEL = 720
const external = (href: string) => href.startsWith('http')

function readChart(root: HTMLElement): Chart {
  const cs = getComputedStyle(root)
  const v = (n: string) => cs.getPropertyValue(n).trim()
  return {
    paper: v('--paper'),
    ink: v('--ink'),
    ink2: v('--ink-2'),
    ink3: v('--ink-3'),
    rule: v('--rule'),
    magenta: v('--magenta'),
    blue: v('--blue'),
    green: v('--green'),
    onAccent: v('--on-accent'),
    water: parseColor(v('--water')),
    low: parseColor(v('--t-low')),
    mid: parseColor(v('--t-mid')),
    high: parseColor(v('--t-high')),
    contour: v('--contour'),
    contourMajor: v('--contour-major'),
    night: root.dataset.theme === 'night',
    display: v('--font-v5-display') || "'Barlow Condensed', sans-serif",
    mono: v('--font-v5-mono') || 'monospace',
  }
}

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))

export function GroundControl({ pilot, creds, route, projects, regions, home, profiles, copy, base, preview, focus, dossier, initialTab }: Props) {
  const items = useMemo(() => [...route, ...projects], [route, projects])
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items])
  const grouped = useMemo(
    () => regions.map((r) => ({ region: r, items: projects.filter((p) => p.field === r.id) })).filter((g) => g.items.length),
    [regions, projects],
  )

  const chartEl = useRef<HTMLDivElement>(null)
  const canvasEl = useRef<HTMLCanvasElement>(null)
  const cardEl = useRef<HTMLDivElement>(null)
  const videoEl = useRef<HTMLVideoElement>(null)
  const senseView = useRef<HTMLCanvasElement>(null)
  const out = {
    mode: useRef<HTMLSpanElement>(null),
    wp: useRef<HTMLSpanElement>(null),
    alt: useRef<HTMLSpanElement>(null),
    gs: useRef<HTMLSpanElement>(null),
    hdg: useRef<HTMLSpanElement>(null),
    where: useRef<HTMLSpanElement>(null),
    elev: useRef<HTMLSpanElement>(null),
    zoom: useRef<HTMLSpanElement>(null),
  }

  const drone = useRef<DroneState & { v: number; spin: number }>({ x: home.x, y: home.y - 34, h: 0, v: 0, spin: 0 })
  const cam = useRef<Cam>({ x: WORLD.w / 2, y: WORLD.h / 2, z: 0.3 })
  const ctl = useRef({
    mode: 'idle' as Mode,
    target: null as MapItem | null,
    leg: 0,
    reached: 0,
    dwell: 0,
    follow: false,
    zGoal: null as number | null,
    keys: new Set<string>(),
    trail: [] as number[],
    hover: null as string | null,
    cursor: null as { x: number; y: number } | null,
    zMin: 0.2,
  })
  const tracker = useRef<HandTracker | null>(null)
  const engine = useRef<Engine | null>(null)
  const rebuild = useRef<() => void>(() => {})
  const reduced = useRef(false)

  const [active, setActive] = useState<string | null>(focus ?? null)
  const activeRef = useRef(active)
  useEffect(() => {
    activeRef.current = active
  }, [active])
  const [reached, setReached] = useState(0)
  const [mode, setModeState] = useState<Mode>('idle')
  const [tab, setTab] = useState<'route' | 'projects'>(initialTab ?? (focus && byId.get(focus)?.kind === 'project' ? 'projects' : 'route'))
  const [night, setNight] = useState(false)
  const [lidarOn, setLidarOn] = useState(true)
  const [soundOn, setSoundOn] = useState(false)
  const [sense, setSense] = useState<'off' | 'starting' | 'on' | 'denied'>('off')
  const [clear, setClear] = useState(false)
  const [hint, setHint] = useState(false)

  const setMode = useCallback((m: Mode) => {
    ctl.current.mode = m
    setModeState(m)
  }, [])

  const arrive = useCallback(
    (it: MapItem) => {
      const c = ctl.current
      setActive(it.id)
      engine.current?.chime()
      const i = route.findIndex((r) => r.id === it.id)
      if (i >= 0) {
        c.reached = Math.max(c.reached, i + 1)
        setReached(c.reached)
      }
      if (c.mode === 'mission') c.dwell = 2.9
      else {
        c.target = null
        setMode('idle')
      }
    },
    [route, setMode],
  )

  const flyTo = useCallback(
    (it: MapItem) => {
      const c = ctl.current
      if (tracker.current) return
      c.target = it
      c.follow = true
      c.zGoal = Math.max(cam.current.z, 0.52)
      setActive(null)
      setMode('goto')
      if (reduced.current) {
        drone.current.x = it.x
        drone.current.y = it.y
        cam.current.x = it.x
        cam.current.y = it.y
        arrive(it)
      }
    },
    [arrive, setMode],
  )

  const startMission = useCallback(
    (from?: number) => {
      const c = ctl.current
      if (tracker.current) return
      if (c.reached >= route.length) c.reached = 0
      c.leg = from ?? c.reached
      c.target = route[c.leg]
      c.dwell = 0
      c.follow = true
      c.zGoal = Math.max(cam.current.z, 0.5)
      setActive(null)
      setMode('mission')
      if (reduced.current) {
        const it = route[c.leg]
        drone.current.x = it.x
        drone.current.y = it.y
        cam.current.x = it.x
        cam.current.y = it.y
        arrive(it)
      }
    },
    [arrive, route, setMode],
  )

  const hold = useCallback(() => {
    ctl.current.target = null
    setMode('idle')
  }, [setMode])

  const zoomBy = useCallback((f: number, at?: { x: number; y: number }) => {
    const c = ctl.current
    const k = cam.current
    const el = canvasEl.current
    const z = Math.max(c.zMin, Math.min(2.2, k.z * f))
    if (at && el) {
      const w = el.clientWidth
      const h = el.clientHeight
      const before = toWorld(k, w, h, at.x, at.y)
      k.z = z
      const after = toWorld(k, w, h, at.x, at.y)
      k.x += before.x - after.x
      k.y += before.y - after.y
      c.follow = false
    } else k.z = z
    c.zGoal = null
  }, [])

  // /v5?tab=projects opens on the projects (the index lives here)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('tab') === 'projects') setTab('projects')
  }, [])

  // wait for the preflight to hand over before starting anything
  useEffect(() => {
    const root = chartEl.current?.closest<HTMLElement>('[data-v5]')
    if (!root) return
    setNight(root.dataset.theme === 'night')
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current) setLidarOn(false)
    const busy = () => ['on', 'playing', 'reveal'].includes(root.dataset.intro ?? '')
    if (!busy()) {
      setClear(true)
      return
    }
    const mo = new MutationObserver(() => {
      if (busy()) return
      setClear(true)
      mo.disconnect()
    })
    mo.observe(root, { attributes: true, attributeFilter: ['data-intro'] })
    return () => mo.disconnect()
  }, [])

  // the chart: drawing, flight, camera, readouts
  useEffect(() => {
    const host = chartEl.current
    const cv = canvasEl.current
    if (!host || !cv) return
    const root = host.closest<HTMLElement>('[data-v5]')!
    const ctx = cv.getContext('2d')!
    const t = terrain()
    let chart = readChart(root)
    const contours = contourPaths(t)
    let base = { relief: relief(t, chart), contours }
    rebuild.current = () => {
      chart = readChart(root)
      base = { relief: relief(t, chart), contours }
    }
    let w = 0
    let h = 0
    let dpr = 1
    const size = () => {
      w = cv.clientWidth
      h = cv.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctl.current.zMin = Math.min(w / WORLD.w, h / WORLD.h) * 0.9
    }
    size()
    // open on the chart filling the window, the coast in view
    const fill = Math.max(w / WORLD.w, h / WORLD.h)
    cam.current = { x: Math.max(WORLD.w / 2, w / 2 / fill), y: WORLD.h / 2, z: fill }
    const ro = new ResizeObserver(size)
    ro.observe(cv)

    let raf = 0
    let last = 0
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(host)

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible || document.hidden) {
        last = 0
        return
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60
      last = now
      const c = ctl.current
      const d = drone.current
      const k = cam.current

      // ---------- flight ----------
      let vGoal = 0
      if ((c.mode === 'goto' || c.mode === 'mission') && c.target) {
        if (c.dwell > 0) {
          c.dwell -= dt
          if (c.dwell <= 0) {
            c.leg++
            if (c.leg >= route.length) {
              c.target = null
              setMode('idle')
            } else {
              c.target = route[c.leg]
              setActive(null)
            }
          }
        } else {
          const dx = c.target.x - d.x
          const dy = c.target.y - d.y
          const dist = Math.hypot(dx, dy)
          const turn = wrap(Math.atan2(dy, dx) - d.h)
          d.h += Math.max(-TURN * dt, Math.min(TURN * dt, turn))
          vGoal = Math.min(VMAX, dist * 1.7 + 30) * Math.max(0.25, Math.cos(turn))
          if (dist < 22) {
            vGoal = 0
            d.v *= 0.5
            arrive(c.target)
          }
        }
      } else if (c.mode === 'manual') {
        const left = c.keys.has('ArrowLeft') || c.keys.has('a')
        const right = c.keys.has('ArrowRight') || c.keys.has('d')
        const up = c.keys.has('ArrowUp') || c.keys.has('w')
        const down = c.keys.has('ArrowDown') || c.keys.has('s')
        d.h += ((right ? 1 : 0) - (left ? 1 : 0)) * TURN * 0.85 * dt
        vGoal = up ? VMAX * 0.8 : down ? 0 : d.v
      } else if (c.mode === 'sense' && tracker.current) {
        const r = tracker.current.read()
        if (r.energy > 0.006) {
          d.h += r.x * TURN * 0.9 * dt
          vGoal = Math.max(0, (0.6 - r.y) / 1.6) * VMAX
        }
      }
      d.v += Math.max(-ACCEL * dt, Math.min(ACCEL * dt, vGoal - d.v))
      d.x = Math.max(20, Math.min(WORLD.w - 20, d.x + Math.cos(d.h) * d.v * dt))
      d.y = Math.max(20, Math.min(WORLD.h - 20, d.y + Math.sin(d.h) * d.v * dt))
      if (!reduced.current) d.spin += dt * (14 + (d.v / VMAX) * 24)
      if (d.v > 8) {
        c.trail.push(d.x, d.y)
        if (c.trail.length > 240) c.trail.splice(0, 2)
      }

      // ---------- camera ----------
      if (c.follow) {
        const kf = 1 - Math.exp(-dt * 3)
        k.x += (d.x - k.x) * kf
        k.y += (d.y - k.y) * kf
      }
      if (c.zGoal !== null) {
        k.z += (c.zGoal - k.z) * (1 - Math.exp(-dt * 2.6))
        if (Math.abs(c.zGoal - k.z) < 0.002) c.zGoal = null
      }
      // never show past the edge of the chart (when it is larger than the window)
      const hw = w / 2 / k.z
      const hh = h / 2 / k.z
      k.x = hw * 2 >= WORLD.w ? WORLD.w / 2 : Math.max(hw, Math.min(WORLD.w - hw, k.x))
      k.y = hh * 2 >= WORLD.h ? WORLD.h / 2 : Math.max(hh, Math.min(WORLD.h - hh, k.y))

      draw(ctx, w, h, dpr, k, base, { route, projects, regions, home, reached: c.reached, trail: c.trail, drone: d, active: activeRef.current, hover: c.hover }, chart)

      // ---------- readouts ----------
      const e = t.sample(d.x, d.y)
      if (out.mode.current) out.mode.current.textContent = copy.hud.mode[c.mode]
      if (out.wp.current) out.wp.current.textContent = `${String(Math.min(route.length, c.reached)).padStart(2, '0')}/${String(route.length).padStart(2, '0')}`
      if (out.alt.current) out.alt.current.textContent = `${(metres(e) + 120).toLocaleString('en')} m`
      if (out.gs.current) out.gs.current.textContent = `${Math.round(d.v * 0.045)} m/s`
      if (out.hdg.current) out.hdg.current.textContent = `${String(Math.round(((((d.h * 180) / Math.PI + 90) % 360) + 360) % 360)).padStart(3, '0')}°`
      const p = c.cursor ?? { x: d.x, y: d.y }
      if (out.where.current) out.where.current.textContent = latLon(p.x, p.y)
      const pe = t.sample(p.x, p.y)
      if (out.elev.current) out.elev.current.textContent = pe < 0 ? 'SEA' : `${metres(pe).toLocaleString('en')} m`
      if (out.zoom.current) out.zoom.current.textContent = `×${k.z.toFixed(2)}`
      engine.current?.speed(d.v / VMAX)

      // ---------- the card follows its point ----------
      const card = cardEl.current
      const a = activeRef.current ? byId.get(activeRef.current) : null
      if (card && a) {
        const sx = w / 2 + (a.x - k.x) * k.z
        const sy = h / 2 + (a.y - k.y) * k.z
        const cw = card.offsetWidth
        const ch = card.offsetHeight
        const left = Math.max(12, Math.min(w - cw - 12, sx + (sx + 24 + cw < w ? 24 : -24 - cw)))
        const top = Math.max(12, Math.min(h - ch - 44, sy - ch / 2))
        card.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0)`
      }
    }
    raf = requestAnimationFrame(frame)

    // ---------- input ----------
    const pointers = new Map<number, { x: number; y: number }>()
    let downAt: { x: number; y: number } | null = null
    let dragged = false
    let pinch = 0
    const local = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onDown = (e: PointerEvent) => {
      const p = local(e)
      pointers.set(e.pointerId, p)
      cv.setPointerCapture(e.pointerId)
      if (pointers.size === 1) {
        downAt = p
        dragged = false
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()]
        pinch = Math.hypot(a.x - b.x, a.y - b.y)
      }
    }
    const onMove = (e: PointerEvent) => {
      const p = local(e)
      const c = ctl.current
      c.cursor = toWorld(cam.current, w, h, p.x, p.y)
      const prev = pointers.get(e.pointerId)
      if (prev) {
        pointers.set(e.pointerId, p)
        if (pointers.size === 2) {
          const [a, b] = [...pointers.values()]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (pinch) zoomBy(dist / pinch, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
          pinch = dist
          dragged = true
          return
        }
        if (downAt && Math.hypot(p.x - downAt.x, p.y - downAt.y) > 5) dragged = true
        if (dragged) {
          cam.current.x -= (p.x - prev.x) / cam.current.z
          cam.current.y -= (p.y - prev.y) / cam.current.z
          c.follow = false
        }
        return
      }
      const hit = pick(cam.current, w, h, p.x, p.y, items)
      c.hover = hit?.id ?? null
      cv.style.cursor = hit ? 'pointer' : 'crosshair'
    }
    const onUp = (e: PointerEvent) => {
      const p = local(e)
      pointers.delete(e.pointerId)
      if (pointers.size < 2) pinch = 0
      if (!dragged && downAt) {
        const hit = pick(cam.current, w, h, p.x, p.y, items, e.pointerType === 'mouse' ? 18 : 28)
        if (hit) flyTo(hit)
      }
      if (!pointers.size) downAt = null
    }
    const onLeave = () => {
      ctl.current.cursor = null
      ctl.current.hover = null
    }
    let hintTimer = 0
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        zoomBy(Math.exp(-e.deltaY * 0.0016), local(e as unknown as PointerEvent))
      } else {
        setHint(true)
        window.clearTimeout(hintTimer)
        hintTimer = window.setTimeout(() => setHint(false), 1400)
      }
    }
    cv.addEventListener('pointerdown', onDown)
    cv.addEventListener('pointermove', onMove)
    cv.addEventListener('pointerup', onUp)
    cv.addEventListener('pointercancel', onUp)
    cv.addEventListener('pointerleave', onLeave)
    cv.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(hintTimer)
      ro.disconnect()
      io.disconnect()
      cv.removeEventListener('pointerdown', onDown)
      cv.removeEventListener('pointermove', onMove)
      cv.removeEventListener('pointerup', onUp)
      cv.removeEventListener('pointercancel', onUp)
      cv.removeEventListener('pointerleave', onLeave)
      cv.removeEventListener('wheel', onWheel)
    }
    // the chart is built once; its handlers read live state through refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // a page that opens on a project flies there; the home page sets off on the route
  useEffect(() => {
    if (!clear) return
    const it = focus ? byId.get(focus) : null
    const timer = window.setTimeout(() => {
      if (it) flyTo(it)
      else if (!reduced.current) startMission(0)
    }, it ? 300 : 1300)
    return () => window.clearTimeout(timer)
  }, [clear, focus, byId, flyTo, startMission])

  useEffect(
    () => () => {
      tracker.current?.stop()
      engine.current?.stop()
    },
    [],
  )

  const onKey = (e: React.KeyboardEvent) => {
    const c = ctl.current
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
    const steer = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'w', 'a', 's', 'd']
    if (steer.includes(key)) {
      e.preventDefault()
      if (tracker.current) return
      if (e.type === 'keydown') {
        c.keys.add(key)
        if (c.mode !== 'manual') {
          c.target = null
          c.follow = true
          setMode('manual')
        }
      } else c.keys.delete(key)
    } else if (e.type === 'keydown' && key === ' ') {
      e.preventDefault()
      startMission(Math.min(route.length - 1, c.mode === 'mission' ? c.leg + 1 : c.reached))
    } else if (e.type === 'keydown' && (key === '+' || key === '=')) zoomBy(1.25)
    else if (e.type === 'keydown' && key === '-') zoomBy(0.8)
    else if (e.type === 'keydown' && key === 'Escape') {
      setActive(null)
      hold()
    }
  }

  const toggleTheme = () => {
    const root = chartEl.current?.closest<HTMLElement>('[data-v5]')
    if (!root) return
    const next = root.dataset.theme === 'night' ? 'day' : 'night'
    root.dataset.theme = next
    setNight(next === 'night')
    try {
      window.localStorage.setItem('v5-theme', next)
    } catch {}
    requestAnimationFrame(() => rebuild.current())
  }

  const toggleSound = () => {
    if (soundOn) {
      engine.current?.stop()
      engine.current = null
      setSoundOn(false)
    } else {
      engine.current = new Engine()
      engine.current.start()
      setSoundOn(true)
    }
  }

  const toggleSense = async () => {
    if (tracker.current) {
      tracker.current.stop()
      tracker.current = null
      setSense('off')
      hold()
      return
    }
    if (!videoEl.current || !senseView.current) return
    setSense('starting')
    const tr = new HandTracker({ motion: '#ff5fb4', box: '#74abff', dim: '#555' })
    const ok = await tr.start(videoEl.current, senseView.current)
    if (!ok) {
      setSense('denied')
      return
    }
    tracker.current = tr
    ctl.current.target = null
    ctl.current.follow = true
    ctl.current.zGoal = Math.max(cam.current.z, 0.5)
    setActive(null)
    setMode('sense')
    setSense('on')
  }

  const card = active ? byId.get(active) : null
  const [first, last] = pilot.name.split(' ')

  return (
    <div className={styles.app}>
      <header className={styles.bar}>
        <Link href={base} className={styles.brand} aria-label={`${pilot.name}, ground control`}>
          <span className={styles.mark} aria-hidden="true">
            RK
          </span>
          <span className={styles.brandName}>{pilot.name}</span>
          <span className={styles.brandSub}>Ground Control</span>
        </Link>
        <span className={styles.preview}>{preview}</span>
        <div className={styles.barRight}>
          <span className={styles.sim}>
            <i />
            {copy.hud.sim}
          </span>
          <button type="button" className={styles.icon} onClick={toggleTheme} aria-label={night ? 'Day chart' : 'Night chart'} title={night ? 'Day chart' : 'Night chart'}>
            {night ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
          </button>
          <a className={styles.contact} href={`mailto:${copy.briefing.email}`}>
            {copy.briefing.contact}
          </a>
        </div>
      </header>

      <div className={styles.body}>
        <section
          ref={chartEl}
          className={styles.chart}
          aria-label="Mission chart"
          aria-describedby="v5-keys"
          tabIndex={0}
          onKeyDown={onKey}
          onKeyUp={onKey}
        >
          <canvas ref={canvasEl} className={styles.canvas} aria-hidden="true" />

          <dl className={styles.hud}>
            <div>
              <dt>MODE</dt>
              <dd ref={out.mode}>{copy.hud.mode[mode]}</dd>
            </div>
            <div>
              <dt>{copy.hud.wp}</dt>
              <dd ref={out.wp}>00/{String(route.length).padStart(2, '0')}</dd>
            </div>
            <div>
              <dt>{copy.hud.alt}</dt>
              <dd ref={out.alt}>—</dd>
            </div>
            <div>
              <dt>{copy.hud.gs}</dt>
              <dd ref={out.gs}>—</dd>
            </div>
            <div>
              <dt>{copy.hud.hdg}</dt>
              <dd ref={out.hdg}>—</dd>
            </div>
          </dl>

          <div className={styles.controls}>
            {mode === 'mission' ? (
              <button type="button" className={styles.primary} onClick={hold}>
                <Pause size={15} strokeWidth={2.2} />
                {copy.hud.pause}
              </button>
            ) : (
              <button type="button" className={styles.primary} onClick={() => startMission()}>
                <Play size={15} strokeWidth={2.2} />
                {copy.hud.fly}
              </button>
            )}
            <button type="button" className={styles.icon} onClick={() => (ctl.current.follow = true)} aria-label={copy.hud.recenter} title={copy.hud.recenter}>
              <Crosshair size={16} strokeWidth={2} />
            </button>
            <button type="button" className={styles.icon} onClick={() => zoomBy(1.3)} aria-label={copy.hud.zoomIn} title={copy.hud.zoomIn}>
              <Plus size={16} strokeWidth={2} />
            </button>
            <button type="button" className={styles.icon} onClick={() => zoomBy(1 / 1.3)} aria-label={copy.hud.zoomOut} title={copy.hud.zoomOut}>
              <Minus size={16} strokeWidth={2} />
            </button>
            <button type="button" className={styles.tool} onClick={toggleSense} aria-pressed={sense === 'on'}>
              {sense === 'on' ? <CameraOff size={15} strokeWidth={2} /> : <Camera size={15} strokeWidth={2} />}
              {sense === 'on' ? copy.hud.handStop : copy.hud.hand}
            </button>
            <button type="button" className={styles.icon} onClick={toggleSound} aria-pressed={soundOn} aria-label={copy.hud.sound} title={copy.hud.sound}>
              {soundOn ? <Volume2 size={16} strokeWidth={2} /> : <VolumeX size={16} strokeWidth={2} />}
            </button>
            <button type="button" className={styles.icon} onClick={() => setLidarOn((o) => !o)} aria-pressed={lidarOn} aria-label={copy.hud.lidar} title={copy.hud.lidar}>
              <Radar size={16} strokeWidth={2} />
            </button>
          </div>

          {/* hand control: what the tracker sees */}
          <figure className={styles.sense} data-on={sense !== 'off' || undefined} aria-live="polite">
            <video ref={videoEl} className={styles.video} muted playsInline aria-hidden="true" />
            <canvas ref={senseView} width={192} height={144} className={styles.senseView} aria-hidden="true" />
            <figcaption>
              <b>{copy.hud.sees}</b>
              <span>{sense === 'denied' ? copy.hud.handDenied : copy.hud.handHint}</span>
              <span className={styles.fine}>{copy.hud.handNote}</span>
            </figcaption>
          </figure>

          {lidarOn ? (
            <figure className={styles.lidar}>
              <Lidar drone={drone} on={lidarOn && clear} />
              <figcaption>
                <b>{copy.hud.lidar}</b> · {copy.hud.lidarNote}
              </figcaption>
            </figure>
          ) : null}

          {card ? (
            <div ref={cardEl} className={styles.card} role="dialog" aria-label={card.title}>
              <button type="button" className={styles.cardClose} onClick={() => setActive(null)} aria-label={copy.hud.close}>
                <X size={14} strokeWidth={2.2} />
              </button>
              <span className={styles.cardMeta}>
                <b>{card.ident}</b> · {card.meta}
              </span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardLine}>{card.line}</p>
              {card.proof ? <span className={styles.cardProof}>{card.proof}</span> : null}
              {external(card.href) ? (
                <a className={styles.cardLink} href={card.href} target="_blank" rel="noopener noreferrer">
                  {copy.hud.source}
                  <ArrowUpRight size={14} strokeWidth={2} />
                </a>
              ) : (
                <Link className={styles.cardLink} href={card.href}>
                  {copy.hud.open}
                  <ArrowRight size={14} strokeWidth={2} />
                </Link>
              )}
            </div>
          ) : null}

          <p className={styles.hint} data-on={hint || undefined}>
            {copy.hud.zoomHint}
          </p>

          <div className={styles.status} aria-hidden="true">
            <span ref={out.where}>{home.coords}</span>
            <span>
              ELEV <span ref={out.elev}>—</span>
            </span>
            <span ref={out.zoom}>×0.30</span>
            <span id="v5-keys" className={styles.keys}>
              {copy.hud.keys}
            </span>
          </div>

          {dossier ? (
            <div className={styles.dossier} role="dialog" aria-label="Dossier">
              <div className={styles.dossierBar}>
                <span>DOSSIER · {focus && byId.get(focus)?.ident}</span>
                <Link href={base} className={styles.dossierClose}>
                  {copy.hud.close}
                  <X size={14} strokeWidth={2.2} />
                </Link>
              </div>
              <div className={styles.dossierBody}>{dossier}</div>
            </div>
          ) : null}
        </section>

        <aside className={styles.plan} aria-label="Flight plan">
          <div className={styles.planHead}>
            <span>FLIGHT PLAN · RK-26</span>
            <span>{copy.briefing.pilot.toUpperCase()}</span>
          </div>
          <div className={styles.pilot}>
            <h1 className={styles.name} id="v5-name">
              <span>{first}</span>
              <span>
                {last}
                <span className={styles.dot}>.</span>
              </span>
            </h1>
            <p className={styles.claim}>{pilot.claim}</p>
            <a className={styles.now} href={pilot.now.href} target="_blank" rel="noopener noreferrer">
              <span>{pilot.now.label.toUpperCase()}</span>
              {pilot.now.text}
            </a>
          </div>

          <ul className={styles.creds} aria-label="Highlights">
            {creds.map((c) => (
              <li key={c.label}>
                <a href={c.href} target={external(c.href) ? '_blank' : undefined} rel={external(c.href) ? 'noopener noreferrer' : undefined}>
                  <b>{c.big}</b>
                  <span>
                    {c.label}
                    <small>{c.note}</small>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.tabs} role="tablist" aria-label="Flight plan">
            <button type="button" role="tab" aria-selected={tab === 'route'} onClick={() => setTab('route')}>
              {copy.briefing.mission}
            </button>
            <button type="button" role="tab" aria-selected={tab === 'projects'} onClick={() => setTab('projects')}>
              {copy.briefing.projects}
            </button>
          </div>

          {tab === 'route' ? (
            <div role="tabpanel" className={styles.panel}>
              <p className={styles.lede}>{copy.briefing.missionLede}</p>
              <ol className={styles.route}>
                {route.map((r, i) => (
                  <li key={r.id} data-on={active === r.id || undefined} data-done={i < reached || undefined}>
                    <button type="button" onClick={() => flyTo(r)}>
                      <span className={styles.tri} aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className={styles.routeText}>
                        <span className={styles.routeMeta}>{r.label}</span>
                        <span className={styles.routeTitle}>{r.title}</span>
                        <span className={styles.routeLine}>{r.line}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div role="tabpanel" className={styles.panel}>
              <p className={styles.lede}>{copy.briefing.projectsLede}</p>
              {grouped.map(({ region, items: list }) => (
                <section key={region.id} className={styles.sector}>
                  <h2 className={styles.sectorHead}>
                    <span>{region.code}</span> {region.label}
                  </h2>
                  <ul>
                    {list.map((p) => (
                      <li key={p.id} data-on={active === p.id || undefined}>
                        <button type="button" onClick={() => flyTo(p)} className={styles.poi}>
                          <span className={styles.ident}>{p.ident}</span>
                          <span className={styles.poiText}>
                            <span className={styles.poiTitle}>{p.title}</span>
                            <span className={styles.poiLine}>{p.line}</span>
                            {p.proof ? <span className={styles.poiProof}>{p.proof}</span> : null}
                          </span>
                        </button>
                        <Link href={p.href} className={styles.poiOpen} aria-label={`${copy.hud.open}: ${p.title}`}>
                          <ArrowRight size={15} strokeWidth={2} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}

          <section className={styles.radio} aria-label={copy.briefing.contact}>
            <h2 className={styles.sectorHead}>
              <span>COM</span> {copy.briefing.contact}
            </h2>
            <a className={styles.email} href={`mailto:${copy.briefing.email}`}>
              {copy.briefing.email}
            </a>
            <ul className={styles.profiles}>
              {profiles.map((p) => (
                <li key={p.href}>
                  <a href={p.href} target="_blank" rel="noopener noreferrer me">
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.fine}>
              {pilot.where} · {preview}: a design exploration, not indexed; the live site stays canonical.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
