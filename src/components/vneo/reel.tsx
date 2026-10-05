'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { HeatShot } from '@/components/v6/scenes/heat'
import { MapShot } from '@/components/v6/scenes/map'
import { SeeShot } from '@/components/v6/scenes/see'
import { ShipShot } from '@/components/v6/scenes/ship'
import { TraceShot } from '@/components/v6/scenes/trace'
import { TuneShot } from '@/components/v6/scenes/tune'
import { ShotModeContext, type ShotMode } from '@/components/v6/shot'
import { reel, vneo, type ReelId } from '@/content/vneo/site'

/*
 * Under the hood: the flight reel's own scenes, one at a time in a single
 * frame, played calm (96 BPM, no shake or flash, only the green and magenta
 * ghost on each hit). Each plays, holds, and hands over to the next while the
 * player is in view; picking one stops the hand-over. Only the scene on show
 * is mounted.
 */

const SCENES: Record<
  ReelId,
  (p: { label: string; replay?: string }) => React.ReactNode
> = {
  see: SeeShot,
  map: MapShot,
  heat: HeatShot,
  tune: TuneShot,
  trace: TraceShot,
  ship: ShipShot,
}
const NEXT_AFTER = 3800 // ms on the held frame before the next shot

export function Reel() {
  const [at, setAt] = useState(0)
  const [take, setTake] = useState(0)
  const [auto, setAuto] = useState(true)
  const autoRef = useRef(auto)
  autoRef.current = auto
  const timer = useRef<number | null>(null)
  const c = vneo.reel

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) setAuto(false)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const onDone = useCallback(() => {
    if (!autoRef.current) return
    if (timer.current) clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      if (!autoRef.current) return
      setAt((i) => (i + 1) % reel.length)
      setTake((k) => k + 1)
    }, NEXT_AFTER)
  }, [])

  const mode = useMemo<ShotMode>(
    () => ({ calm: true, speed: 0.75, onDone }),
    [onDone]
  )

  const pick = (i: number) => {
    if (timer.current) clearTimeout(timer.current)
    setAuto(false)
    setAt(i)
    setTake((k) => k + 1)
  }
  const toggle = () => {
    if (timer.current) clearTimeout(timer.current)
    setAuto((a) => {
      if (!a) {
        setAt((i) => (i + 1) % reel.length)
        setTake((k) => k + 1)
      }
      return !a
    })
  }

  const r = reel[at]
  const Scene = SCENES[r.id]

  return (
    <div className="vn-reel">
      <div className="vn-reel-bar">
        <div className="vn-tabs" role="tablist" aria-label="Shots">
          {reel.map((x, i) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              id={`reel-tab-${x.id}`}
              aria-selected={i === at}
              aria-controls="reel-panel"
              className="vn-tab"
              onClick={() => pick(i)}
            >
              <span className="vn-tab-n">{i + 1}</span>
              {x.tab}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="vn-reel-auto"
          onClick={toggle}
          aria-pressed={auto}
        >
          {auto ? (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 3v10M11 3v10" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 3l8 5-8 5z" />
            </svg>
          )}
          {auto ? c.pause : c.play}
        </button>
      </div>
      <div
        id="reel-panel"
        role="tabpanel"
        aria-labelledby={`reel-tab-${r.id}`}
        className="vn-reel-panel"
      >
        <ShotModeContext.Provider value={mode}>
          <Scene key={`${r.id}-${take}`} label={r.alt} />
        </ShotModeContext.Provider>
        <div className="vn-reel-cap" key={r.id}>
          <h3>{r.title}</h3>
          <p>{r.line}</p>
          <Link className="v7-go" href={r.href}>
            {c.open} →
          </Link>
        </div>
      </div>
    </div>
  )
}
