'use client'

import Image from 'next/image'
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

import styles from './record.module.css'

/*
 * The thermal plate is one file holding two panels side by side: the input on
 * the left, the upscaled frame on the right. Each layer crops one panel out of
 * the same image, and the divider wipes between them.
 */
const SHEET = { w: 1424, h: 536 }
const PANEL = { w: 687, h: 523, beforeX: 15, afterX: 723 }

interface WipeCompareProps {
  src: string
  alt: string
  before: string
  after: string
  hint: string
  label?: string
  caption?: string
}

export function WipeCompare({ src, alt, before, after, hint, label, caption }: WipeCompareProps) {
  const [pos, setPos] = useState(50)
  const frame = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const fromPointer = useCallback((clientX: number) => {
    const rect = frame.current?.getBoundingClientRect()
    if (!rect) return
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
  }, [])

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    fromPointer(e.clientX)
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) fromPointer(e.clientX)
  }
  const onUp = () => {
    dragging.current = false
  }
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - step))
    else if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + step))
    else if (e.key === 'Home') setPos(0)
    else if (e.key === 'End') setPos(100)
    else return
    e.preventDefault()
  }

  const layer = (x: number) => ({
    width: `${(SHEET.w / PANEL.w) * 100}%`,
    height: `${(SHEET.h / PANEL.h) * 100}%`,
    left: `${(-x / PANEL.w) * 100}%`,
  })

  return (
    <figure className={styles.wipe}>
      <div
        ref={frame}
        className={styles.wipeFrame}
        style={{ aspectRatio: `${PANEL.w} / ${PANEL.h}` }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        data-cursor="drag"
      >
        <Image
          className={styles.wipeLayer}
          src={src}
          alt={alt}
          width={SHEET.w}
          height={SHEET.h}
          sizes="(min-width: 1100px) 120vw, 220vw"
          style={layer(PANEL.beforeX)}
          draggable={false}
        />
        <div className={styles.wipeAfter} style={{ clipPath: `inset(0 0 0 ${pos}%)` }} aria-hidden="true">
          <Image
            className={styles.wipeLayer}
            src={src}
            alt=""
            width={SHEET.w}
            height={SHEET.h}
            sizes="(min-width: 1100px) 120vw, 220vw"
            style={layer(PANEL.afterX)}
            draggable={false}
          />
        </div>
        <span className={`${styles.wipeTag} ${styles.wipeTagBefore}`}>{before}</span>
        <span className={`${styles.wipeTag} ${styles.wipeTagAfter}`}>{after}</span>
        <div
          className={styles.wipeHandle}
          style={{ left: `${pos}%` }}
          role="slider"
          tabIndex={0}
          aria-label={hint}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% ${before}`}
          onKeyDown={onKey}
        >
          <span className={styles.wipeKnob} aria-hidden="true" />
        </div>
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
