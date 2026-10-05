'use client'

import { useEffect, type RefObject } from 'react'

import { gsap, reducedMotion } from './gsap'

export interface MotionOptions {
  /** Repeat forever while on screen (a loop), or play once on first sight. */
  loop?: boolean
  /** Where a reduced-motion visitor sees it: a progress 0–1 to hold (default: the end). */
  poster?: number
  /** Start playing a little before it is fully in view. */
  rootMargin?: string
  /** Replay key: when it changes, the timeline is rebuilt and played again. */
  key?: unknown
}

/**
 * Builds a GSAP timeline for a motion graphic and plays it only while it is on
 * screen: loops pause off screen and resume where they were; one-shots play
 * on first sight and hold their last frame. Under reduced motion nothing
 * plays: the graphic holds its poster frame. Everything the builder creates is
 * reverted when the component goes away.
 */
export function useMotion<T extends Element>(
  ref: RefObject<T | null>,
  build: (root: T) => gsap.core.Timeline,
  { loop = false, poster = 1, rootMargin = '0px 0px -8% 0px', key }: MotionOptions = {},
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let tl: gsap.core.Timeline | null = null
    let io: IntersectionObserver | null = null
    const ctx = gsap.context(() => {
      tl = build(el)
      if (loop) tl.repeat(-1)
      if (reducedMotion()) {
        tl.progress(poster).pause()
        return
      }
      tl.pause(0)
      let seen = false
      io = new IntersectionObserver(
        ([entry]) => {
          if (!tl) return
          if (entry.isIntersecting) {
            if (loop || !seen) tl.play()
            seen = true
          } else if (loop) tl.pause()
        },
        { rootMargin },
      )
      io.observe(el)
    }, el)
    return () => {
      io?.disconnect()
      ctx.revert()
    }
    // build is recreated each render; the graphic rebuilds only when its key changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, loop, poster, rootMargin, key])
}
