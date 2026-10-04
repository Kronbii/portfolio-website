'use client'

import { Menu, Moon, Sun, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { v3Chrome, v3Nav } from '@/content/v3/home'

import styles from './shell.module.css'

type Theme = 'dark' | 'light'

const rootEl = () => document.querySelector<HTMLElement>('[data-v3]')

function readTheme(): Theme {
  try {
    const stored = window.localStorage.getItem('v3-theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  const root = rootEl()
  if (root) root.dataset.theme = theme
  window.dispatchEvent(new CustomEvent('v3-theme', { detail: theme }))
}

/** The bracketed monogram: the cursor's lock-on box, around the initials. */
export function Mark({ className }: { className?: string }) {
  return (
    <span className={`${styles.mark} ${className ?? ''}`} aria-hidden="true">
      <i data-c="tl" />
      <i data-c="tr" />
      <i data-c="bl" />
      <i data-c="br" />
      RK
    </span>
  )
}

export function Chrome() {
  const pathname = usePathname()
  const [theme, setTheme] = useState<Theme>('dark')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const initial = readTheme()
    setTheme(initial)
    applyTheme(initial)
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const onSystem = () => {
      try {
        if (window.localStorage.getItem('v3-theme')) return
      } catch {}
      const next = media.matches ? 'light' : 'dark'
      setTheme(next)
      applyTheme(next)
    }
    media.addEventListener('change', onSystem)
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      media.removeEventListener('change', onSystem)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    applyTheme(next)
    try {
      window.localStorage.setItem('v3-theme', next)
    } catch {}
  }, [theme])

  const themeLabel = theme === 'dark' ? v3Chrome.themeToLight : v3Chrome.themeToDark

  return (
    <>
      <a className={styles.skip} href="#v3-main">
        {v3Chrome.skip}
      </a>
      <header className={styles.bar} data-scrolled={scrolled || open || undefined}>
        <div className={styles.barInner}>
          <Link href="/v3" className={styles.brand} aria-label={`${v3Chrome.brand}, home`} data-lock="Home">
            <Mark />
            <span className={styles.brandName}>{v3Chrome.brand}</span>
            <span className={styles.brandTag}>{v3Chrome.preview}</span>
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            {v3Nav.map((item) => {
              const active = item.href === '/v3/projects' && pathname.startsWith('/v3/projects')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.navLink}
                  data-active={active || undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className={styles.actions}>
            <button type="button" className={styles.iconButton} onClick={toggle} aria-label={themeLabel} title={themeLabel}>
              {theme === 'dark' ? <Sun size={17} strokeWidth={1.75} /> : <Moon size={17} strokeWidth={1.75} />}
            </button>
            <Link href="/v3#contact" className={styles.cta} data-lock="Contact">
              {v3Chrome.contact}
            </Link>
            <button
              type="button"
              className={`${styles.iconButton} ${styles.menuButton}`}
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="v3-menu"
              aria-label={open ? v3Chrome.close : v3Chrome.menu}
            >
              {open ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
            </button>
          </div>
        </div>

        <nav id="v3-menu" className={styles.sheet} data-open={open || undefined} aria-label="Menu" hidden={!open}>
          {v3Nav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.sheetLink} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/v3#contact" className={styles.sheetLink} onClick={() => setOpen(false)}>
            {v3Chrome.contact}
          </Link>
        </nav>
      </header>
    </>
  )
}
