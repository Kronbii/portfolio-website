'use client'

import { useEffect, useRef, useState } from 'react'

import { vneoChrome } from '@/content/vneo/site'

/*
 * The chapter rail (v4's timeline nav, made quiet): a column of short marks
 * at the right edge that appears once you are past the first screen. The
 * mark for the section you are reading grows and names itself; any mark
 * jumps there. Wide screens only; it never covers the page's own content.
 */

export function Rail() {
  const [at, setAt] = useState(0)
  const [shown, setShown] = useState(false)
  const els = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    els.current = vneoChrome.rail.map((r) => document.getElementById(r.id))
    let raf = 0
    const pick = () => {
      raf = 0
      const line = innerHeight * 0.4
      let i = 0
      els.current.forEach((el, k) => {
        if (el && el.getBoundingClientRect().top <= line) i = k
      })
      setAt(i)
      setShown(scrollY > innerHeight * 0.7)
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(pick)
    }
    pick()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => {
      removeEventListener('scroll', on)
      removeEventListener('resize', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <nav
      className="vn-rail"
      data-shown={shown ? '' : undefined}
      aria-label="On this page"
    >
      <ol>
        {vneoChrome.rail.map((r, i) => (
          <li key={r.id} data-on={i === at ? '' : undefined}>
            <a href={`#${r.id}`} aria-current={i === at ? 'true' : undefined}>
              <span>{r.label}</span>
              <i aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
