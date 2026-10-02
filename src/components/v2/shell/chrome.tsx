'use client'

import { Hash, Moon, NotebookText, PenLine, Sun, Waypoints } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { v2Chrome, v2Nav } from '@/content/v2/home'

import { SheetLink, SheetWatcher } from '../sheet-link'
import styles from './shell.module.css'

const ICONS = {
  notebook: NotebookText,
  projects: Waypoints,
  writing: PenLine,
  topics: Hash,
} as const

type Theme = 'dark' | 'light'

function rootEl() {
  return document.querySelector<HTMLElement>('[data-v2]')
}

function readTheme(): Theme {
  try {
    const stored = window.localStorage.getItem('v2-theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  const root = rootEl()
  if (root) root.dataset.theme = theme
  window.dispatchEvent(new CustomEvent('v2-theme', { detail: theme }))
}

interface ChromeProps {
  counts: Record<string, number>
}

export function Chrome({ counts }: ChromeProps) {
  const pathname = usePathname()
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const initial = readTheme()
    setTheme(initial)
    applyTheme(initial)
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const onSystem = () => {
      try {
        if (window.localStorage.getItem('v2-theme')) return
      } catch {}
      const next = media.matches ? 'light' : 'dark'
      setTheme(next)
      applyTheme(next)
    }
    media.addEventListener('change', onSystem)
    return () => media.removeEventListener('change', onSystem)
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
    try {
      window.localStorage.setItem('v2-theme', next)
    } catch {}
  }, [theme])

  const isActive = (href: string) => (href === '/v2' ? pathname === '/v2' : pathname.startsWith(href))

  return (
    <>
      <SheetWatcher />
      <a className={styles.skip} href="#v2-main">
        {v2Chrome.skip}
      </a>
      <ScrollProgress />
      <header className={styles.bar}>
        <div className={styles.barInner}>
          <SheetLink href="/v2" direction="back" className={styles.brand} aria-label={`${v2Chrome.brand}, record home`}>
            <span>
              {v2Chrome.brand}
              <span className={styles.brandDot}>.</span>
            </span>
            <span className={styles.brandTag}>{v2Chrome.preview}</span>
          </SheetLink>

          <nav className={styles.nav} aria-label="Primary">
            {v2Nav.map((item) => {
              const active = isActive(item.href)
              return (
                <SheetLink
                  key={item.href}
                  href={item.href}
                  direction={item.href === '/v2' ? 'back' : 'forward'}
                  className={styles.navLink}
                  data-active={active || undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                  {counts[item.href] ? <span className={styles.navCount}>{counts[item.href]}</span> : null}
                </SheetLink>
              )
            })}
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={toggle}
              aria-label={theme === 'dark' ? v2Chrome.themeToLight : v2Chrome.themeToDark}
              title={theme === 'dark' ? v2Chrome.themeToLight : v2Chrome.themeToDark}
            >
              {theme === 'dark' ? <Sun size={17} strokeWidth={1.75} /> : <Moon size={17} strokeWidth={1.75} />}
            </button>
            <a className={styles.contact} href="/v2#sign-off">
              {v2Chrome.contact}
            </a>
          </div>
        </div>
      </header>

      <nav className={styles.dock} aria-label="Primary, compact">
        {v2Nav.map((item) => {
          const Icon = ICONS[item.icon]
          const active = isActive(item.href)
          return (
            <SheetLink
              key={item.href}
              href={item.href}
              direction={item.href === '/v2' ? 'back' : 'forward'}
              className={styles.dockItem}
              data-active={active || undefined}
              aria-current={active ? 'page' : undefined}
              aria-label={item.label}
            >
              <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
              <span className={styles.dockLabel}>{item.label}</span>
            </SheetLink>
          )
        })}
      </nav>

      <CursorCompanion />
    </>
  )
}

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])
  return <div ref={ref} className={styles.progress} aria-hidden="true" />
}

/**
 * A trailing ring that follows the pointer and opens over anything you can
 * press. The native cursor stays; this only adds weight to it.
 */
function CursorCompanion() {
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ring.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let x = -100
    let y = -100
    let tx = -100
    let ty = -100
    let raf = 0
    let visible = false

    const tick = () => {
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? window.requestAnimationFrame(tick) : 0
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      tx = e.clientX
      ty = e.clientY
      if (!visible) {
        visible = true
        x = tx
        y = ty
        el.dataset.on = 'true'
      }
      if (!raf) raf = window.requestAnimationFrame(tick)
    }
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null
      const hit = target?.closest<HTMLElement>('[data-cursor], a, button, [role="slider"]')
      const mode = hit?.dataset.cursor ?? (hit ? 'press' : '')
      el.dataset.mode = mode
      if (label.current) label.current.textContent = mode === 'drag' ? 'Drag' : ''
    }
    const onLeave = () => {
      visible = false
      delete el.dataset.on
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ring} className={styles.cursor} aria-hidden="true">
      <span ref={label} className={styles.cursorLabel} />
    </div>
  )
}
