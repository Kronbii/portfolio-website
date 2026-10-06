'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

/*
 * A proper back button. If you got here by moving around the site, it takes
 * you back exactly where you were (scroll position and all); if you landed
 * on this page directly, it takes you to the page it belongs to.
 */

declare global {
  interface Window {
    __vnSteps?: number
  }
}

/** Counts moves inside the site, so Back knows whether there is somewhere to go back to. */
export function NavTrail() {
  const path = usePathname()
  useEffect(() => {
    if (window.__vnSteps === undefined) window.__vnSteps = 0
    else window.__vnSteps += 1
  }, [path])
  return null
}

export function BackButton({
  fallback,
  label = 'Back',
  className,
}: {
  fallback: string
  label?: string
  className?: string
}) {
  const router = useRouter()
  return (
    <a
      href={fallback}
      className={`vn-back ${className ?? ''}`}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        if ((window.__vnSteps ?? 0) > 0) router.back()
        else router.push(fallback)
      }}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M10 3.5 5.5 8l4.5 4.5" />
      </svg>
      {label}
    </a>
  )
}
