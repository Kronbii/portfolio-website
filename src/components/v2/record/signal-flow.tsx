'use client'

import { useEffect, useRef, useState } from 'react'

import type { ProjectStage } from '@/content/authority'

import styles from './record.module.css'

interface SignalFlowProps {
  stages: ProjectStage[]
  label?: string
  caption?: string
  /** Accessible summary of the figure. */
  alt?: string
  compact?: boolean
}

const DWELL = 3200

/**
 * A live figure drawn from a record's own stages: a pulse travels the track
 * and each stage it reaches reads out below. Hovering or focusing a stage
 * takes the controls; on phones every stage reads in full.
 */
export function SignalFlow({ stages, label, caption, alt, compact }: SignalFlowProps) {
  const [active, setActive] = useState(0)
  const [held, setHeld] = useState(false)
  const [running, setRunning] = useState(false)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!running || held) return
    const id = window.setInterval(() => setActive((i) => (i + 1) % stages.length), DWELL)
    return () => window.clearInterval(id)
  }, [running, held, stages.length])

  const n = stages.length
  const progress = n > 1 ? active / (n - 1) : 0

  return (
    <figure
      ref={root}
      className={`${styles.flow} ${compact ? styles.flowCompact : ''}`}
      aria-label={alt}
      data-running={running && !held ? 'true' : undefined}
      onPointerLeave={() => setHeld(false)}
    >
      <div className={styles.flowTrack} style={{ ['--n' as string]: n }}>
        <span className={styles.flowRail} aria-hidden="true">
          <span className={styles.flowFill} style={{ transform: `scaleX(${progress})` }} />
        </span>
        <ol className={styles.flowNodes}>
          {stages.map((stage, i) => (
            <li key={stage.step} className={styles.flowNode} data-on={i === active || undefined} data-past={i < active || undefined}>
              <button
                type="button"
                className={styles.flowButton}
                aria-pressed={i === active}
                onPointerEnter={() => {
                  setHeld(true)
                  setActive(i)
                }}
                onFocus={() => {
                  setHeld(true)
                  setActive(i)
                }}
                onClick={() => {
                  setHeld(true)
                  setActive(i)
                }}
              >
                <span className={styles.flowStep}>{stage.step}</span>
                <span className={styles.flowTitle}>{stage.title}</span>
              </button>
              <p className={styles.flowInline}>{stage.detail}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.flowReadout} aria-hidden="true">
        <span className={styles.flowReadoutStep}>
          {stages[active]?.step} / {String(n).padStart(2, '0')}
        </span>
        <p key={active} className={styles.flowReadoutText}>
          {stages[active]?.detail}
        </p>
      </div>
      {label || caption ? (
        <figcaption className={styles.caption}>
          {label ? <span className={styles.figLabel}>{label}</span> : null}
          {caption ? <span>{caption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
