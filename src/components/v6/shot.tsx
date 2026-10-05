'use client'

import { gsap } from 'gsap'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

import { B, BAR, clamp, kick, timecode, type Impact } from './armed'

/*
 * A shot: one of the reel's 1920 x 1080 scenes, set into the page. The stage
 * keeps the composition's own pixel layout and is scaled to the frame in CSS
 * (a container-width ratio, so it is right before any script runs); on a
 * phone the frame can crop to the part of the scene that carries it. The
 * scene's timeline plays on the beat when the shot is mostly in view, once,
 * with the reel's camera kicks, flashes, and chromatic ghost on its impacts,
 * and then holds its last frame. Reduced motion lands on that frame at once.
 *
 * The stage is illustration: it is hidden from assistive tech, and the shot
 * carries a plain description; the page's own copy holds the facts.
 */

export type Rect = [x: number, y: number, w: number, h: number]

export interface ShotProps {
  /** Scene id, for the CSS hooks (e.g. "s04"). */
  scene: string
  /** What the shot shows, for assistive tech. */
  label: string
  impacts: Impact[]
  /** Where the timeline holds. Defaults to one bar. */
  hold?: number
  /** Builds the paused timeline; selectors are scoped to the stage. */
  build: (root: HTMLElement, tl: gsap.core.Timeline) => void | (() => void)
  /** On narrow screens, the region of the 1920 x 1080 stage to show. */
  crop?: Rect
  /** A layer drawn with the scene (e.g. three.js), given the shot's clock. */
  gl?: (clock: ShotClock) => ReactNode
  children: ReactNode
  /** Starts only when this is true (e.g. after the intro). */
  armed?: boolean
  className?: string
  /** Shown on the replay control. */
  replay?: string
}

export interface ShotClock {
  /** Local time of the shot, in seconds: -1 before it starts; past the hold it keeps counting (but not under reduced motion). */
  time: () => number
  /** Subscribe to every frame the shot renders while it plays. */
  playing: () => boolean
}

export function Shot({
  scene,
  label,
  impacts,
  hold = BAR,
  build,
  crop,
  gl,
  children,
  armed = true,
  className,
  replay = 'Replay',
}: ShotProps) {
  const host = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const rig = useRef<HTMLDivElement>(null)
  const flash = useRef<HTMLDivElement>(null)
  const invert = useRef<HTMLDivElement>(null)
  const tc = useRef<HTMLSpanElement>(null)
  const ticks = useRef<HTMLSpanElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const played = useRef(false)
  const [state, setState] = useState<'idle' | 'playing' | 'held'>('idle')
  const doneAt = useRef<number | null>(null)
  // stable for the life of the shot, so a GL layer can hold it; past the hold, time keeps running for ambient motion
  const clock = useRef<ShotClock>({
    time: () => {
      if (!tl.current || !played.current) return -1
      if (doneAt.current != null)
        return hold + (performance.now() - doneAt.current) / 1000
      return tl.current.time()
    },
    playing: () => !!tl.current?.isActive(),
  }).current
  const nBeats = Math.round(hold / B)

  // the frame: kicks, flash, ghost, invert, the readouts; a pure function of the timeline's time
  const paint = useCallback(
    (t: number, live: boolean) => {
      const k = live
        ? kick(impacts, t)
        : { x: 0, y: 0, r: 0, s: 0, fl: 0, gh: 0, inv: 0 }
      if (rig.current) {
        rig.current.style.transform =
          k.s || k.x || k.y
            ? `translate(${k.x.toFixed(2)}px, ${k.y.toFixed(2)}px) rotate(${k.r.toFixed(3)}deg) scale(${(1 + k.s).toFixed(4)})`
            : ''
        const g = clamp(k.gh)
        if (g > 0.02) {
          // the reel's chromatic ghost: a burgundy copy of the frame, offset; drawn as a GPU drop-shadow
          rig.current.style.filter = `drop-shadow(${(-26 * g).toFixed(1)}px ${(6 * g).toFixed(1)}px 0 rgba(201, 104, 106, ${(0.6 * g).toFixed(3)}))`
        } else rig.current.style.filter = ''
      }
      if (flash.current)
        flash.current.style.opacity = clamp(k.fl * 0.55).toFixed(3)
      if (invert.current) invert.current.style.opacity = String(k.inv)
      if (tc.current) tc.current.textContent = timecode(Math.max(0, t))
      if (ticks.current) {
        const nb = Math.min(nBeats - 1, Math.floor(t / B + 1e-6))
        Array.from(ticks.current.children).forEach((c, i) => {
          ;(c as HTMLElement).dataset.on =
            i < nb ? 'past' : i === nb ? 'now' : ''
        })
      }
    },
    [impacts, nBeats]
  )

  useEffect(() => {
    const root = rig.current
    if (!root) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let undo: void | (() => void)
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true })
      undo = build(root, t)
      // hold on the last frame: the reel's exits are cut, the shot stays
      t.set({}, {}, hold)
      t.eventCallback('onUpdate', () => paint(t.time(), !reduce))
      t.eventCallback('onComplete', () => {
        if (!reduce) doneAt.current = performance.now()
        paint(t.time(), false)
        setState('held')
      })
      tl.current = t
    }, root)
    // nothing has played yet: the stage holds the scene's first frame, hidden until it rolls
    tl.current?.progress(0)
    if (!reduce && host.current) host.current.dataset.armed = ''
    if (reduce) {
      played.current = true
      tl.current?.progress(1)
      paint(hold, false)
      setState('held')
    }
    return () => {
      ctx.revert()
      if (typeof undo === 'function') undo()
      tl.current = null
    }
  }, [build, hold, paint])

  const play = useCallback(() => {
    const t = tl.current
    if (!t) return
    played.current = true
    doneAt.current = null
    setState('playing')
    t.restart()
  }, [])

  // decode the scene's pictures before it rolls, so the first frame never waits on them
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        el.querySelectorAll('img').forEach(
          (i) => void i.decode?.().catch(() => {})
        )
        // and the ones painted as backgrounds (the panorama strip, the strobe frames)
        el.querySelectorAll<HTMLElement>(
          '.s05-card:first-child, .s12-f'
        ).forEach((n) => {
          const m = /url\(["']?([^"')]+)/.exec(
            getComputedStyle(n).backgroundImage
          )
          if (!m) return
          const img = new Image()
          img.src = m[1]
          void img.decode?.().catch(() => {})
        })
      },
      { rootMargin: '150% 0px' }
    )
    io.observe(frame.current ?? el)
    return () => io.disconnect()
  }, [])

  // the cue: the shot rolls when most of it is on screen
  useEffect(() => {
    const el = frame.current
    if (!el || !armed) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.5 && !played.current) play()
      },
      { threshold: [0, 0.5, 1] }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [armed, play])

  const style = crop
    ? ({
        '--cx': `${crop[0]}px`,
        '--cy': `${crop[1]}px`,
        '--cw': `${crop[2]}px`,
        '--ch': `${crop[3]}`,
        '--chp': `${crop[3]}px`,
        '--crop-ar': `${crop[2]} / ${crop[3]}`,
      } as React.CSSProperties)
    : undefined

  return (
    <div
      ref={host}
      className={`v6-shot ${className ?? ''}`}
      data-scene={scene}
      data-state={state}
      data-crop={crop ? '' : undefined}
    >
      <div
        ref={frame}
        className="v6-frame"
        style={style}
        role="img"
        aria-label={label}
      >
        <div ref={stage} className="v6-stage" aria-hidden="true">
          <div ref={rig} className="v6-rig">
            {gl ? <div className="v6-gl">{gl(clock)}</div> : null}
            <div className={`v6-scene ${scene}`}>{children}</div>
          </div>
          <div ref={flash} className="v6-flash" />
          <div ref={invert} className="v6-invert" />
        </div>
        <div className="v6-vignette" aria-hidden="true" />
        <div className="v6-hud" aria-hidden="true">
          <span className="v6-rec">
            <i />
            <span ref={tc}>00:00:00:00</span>
          </span>
          <span ref={ticks} className="v6-ticks">
            {Array.from({ length: nBeats }, (_, i) => (
              <i key={i} />
            ))}
          </span>
        </div>
      </div>
      <button
        type="button"
        className="v6-replay"
        onClick={play}
        disabled={state === 'playing'}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {replay}
      </button>
    </div>
  )
}
