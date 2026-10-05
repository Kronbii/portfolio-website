'use client'

import { useEffect, useRef, useState } from 'react'

import { ScrollTrigger } from '../motion/gsap'
import styles from './timeline.module.css'

/*
 * The page as a video timeline. A scrubber at the foot of the window marks
 * each chapter where it falls in the page; the playhead is your scroll, the
 * timecode runs with it, and a chapter mark is a jump to it. It is navigation
 * first: on phones, where it would crowd the page, it is not shown.
 */
const RUNTIME = 150
const FPS = 24
const tc = (s: number) => {
  const p = (n: number) => String(n).padStart(2, '0')
  const whole = Math.floor(s)
  return `00:${p(Math.floor(whole / 60))}:${p(whole % 60)}:${p(Math.floor((s - whole) * FPS))}`
}

export function Timeline({ chapters, label }: { chapters: { id: string; label: string }[]; label: string }) {
  const [marks, setMarks] = useState<number[]>([])
  const [current, setCurrent] = useState(0)
  const [shown, setShown] = useState(false)
  const head = useRef<HTMLSpanElement>(null)
  const played = useRef<HTMLSpanElement>(null)
  const time = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    let at: number[] = []
    const span = () => Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const measure = () => {
      at = chapters.map((c) => {
        const el = document.getElementById(c.id)
        if (!el) return 0
        return Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY) / span()))
      })
      setMarks(at)
      update()
    }
    const update = () => {
      raf = 0
      const p = Math.min(1, Math.max(0, window.scrollY / span()))
      head.current?.style.setProperty('--p', p.toFixed(4))
      played.current?.style.setProperty('--p', p.toFixed(4))
      if (time.current) time.current.textContent = tc(p * RUNTIME)
      // the chapter whose mark the playhead has passed (with a little lead, as a reader sees it)
      const lead = p + 0.5 * (window.innerHeight / span())
      let k = 0
      at.forEach((m, i) => {
        if (lead >= m) k = i
      })
      setCurrent((c) => (c === k ? c : k))
      // it waits until the reader is past the opening screen, so it never sits on the hero
      const past = window.scrollY > window.innerHeight * 0.7
      setShown((s) => (s === past ? s : past))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    measure()
    // pinned scenes change the page's length once they are laid out
    ScrollTrigger.addEventListener('refresh', measure)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    const t = window.setTimeout(measure, 1200)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
      ScrollTrigger.removeEventListener('refresh', measure)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
    }
  }, [chapters])

  return (
    <nav className={styles.timeline} aria-label={label} data-shown={shown || undefined}>
      <span ref={time} className={styles.tc} aria-hidden="true">
        00:00:00:00
      </span>
      <div className={styles.track}>
        <span ref={played} className={styles.played} aria-hidden="true" />
        {chapters.map((c, i) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={styles.mark}
            style={{ left: `${(marks[i] ?? i / chapters.length) * 100}%` }}
            data-active={i === current || undefined}
            aria-current={i === current ? 'location' : undefined}
            data-lock={c.label}
          >
            <span className={styles.tip}>{c.label}</span>
          </a>
        ))}
        <span ref={head} className={styles.head} aria-hidden="true" />
      </div>
      <span className={styles.chapter} aria-hidden="true">
        {chapters[current]?.label}
      </span>
    </nav>
  )
}
