'use client'

import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

import { Optic } from './optic'
import { B, focusIn } from './tempo'

/*
 * A project's own photograph (or its name, when it has none) as a plain
 * plate that comes into focus out of its colour fringe when it is reached.
 */

export function Plate({
  src,
  alt,
  text,
}: {
  src?: string
  alt?: string
  text?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = root.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true })
      focusIn(tl, el.firstElementChild!, 0, {
        dur: 2 * B,
        blur: 18,
        ca: 20,
        scale: 1.04,
      })
      tl.progress(0)
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.intersectionRatio >= 0.4) {
            io.disconnect()
            tl.play(0)
          }
        },
        { threshold: [0, 0.4] }
      )
      io.observe(el)
      return () => io.disconnect()
    }, el)
    return () => ctx.revert()
  }, [])
  return (
    <div
      ref={root}
      className="v7-plate"
      role={alt ? 'img' : undefined}
      aria-label={alt}
    >
      {src ? <Optic src={src} /> : <div className="v7-type fx">{text}</div>}
    </div>
  )
}
