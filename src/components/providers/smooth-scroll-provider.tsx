'use client'

import { type ReactNode, useEffect } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProviderProps {
  children: ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const isTouchDevice =
      window.matchMedia('(pointer: coarse) and (hover: none)').matches

    // Touch devices are prone to viewport-resize + smooth-scroll conflicts.
    // Keep native scrolling on mobile/tablet for stable behavior.
    if (reduceMotion || isTouchDevice) {
      return
    }

    const lenis = new Lenis({
      duration: 2,
      lerp: 0.03,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      syncTouch: false,
      anchors: true,
    })

    let rafId = 0

    const raf = (time: number) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }

    rafId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
