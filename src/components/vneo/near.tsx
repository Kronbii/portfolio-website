'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * A wrapper that gains data-near when it comes within a screen and a half of
 * the viewport: CSS can hold back the pictures it paints (a mask, a
 * background) until then, so the first screen's downloads go first.
 */
export function Near({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        el.dataset.near = ''
      },
      { rootMargin: '150% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
