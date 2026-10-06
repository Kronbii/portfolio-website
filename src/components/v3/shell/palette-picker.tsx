'use client'

import { Palette as PaletteIcon, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { DEFAULT_PALETTE, palettes, paletteById } from '@/content/v3/palettes'

import styles from './palette-picker.module.css'

const STRENGTHS = [
  { id: 'off', label: 'Off' },
  { id: 'subtle', label: 'Subtle' },
  { id: 'strong', label: 'Strong' },
  { id: 'wild', label: 'Wild' },
] as const

/*
 * A preview tool, not part of the design: pick a colourway and the whole page,
 * the intro, and the hero camera switch to it. The choice is remembered on this
 * device, and ?palette=<id> opens a page in a given one, so a link can be shared.
 */
export function PalettePicker() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(DEFAULT_PALETTE)
  const [strength, setStrength] = useState('strong')
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-v3]')
    setCurrent(paletteById(root?.dataset.palette).id)
    setStrength(root?.dataset.aberration ?? 'strong')
  }, [])

  const aberrate = (id: string) => {
    const root = document.querySelector<HTMLElement>('[data-v3]')
    if (!root) return
    root.dataset.aberration = id
    setStrength(id)
    try {
      window.localStorage.setItem('v3-aberration', id)
    } catch {}
    window.dispatchEvent(new CustomEvent('v3-aberration', { detail: id }))
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (!panel.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const choose = (id: string) => {
    const root = document.querySelector<HTMLElement>('[data-v3]')
    if (!root) return
    root.dataset.palette = id
    setCurrent(id)
    try {
      window.localStorage.setItem('v3-palette', id)
    } catch {}
    window.dispatchEvent(new CustomEvent('v3-palette', { detail: id }))
    // components that read colours on a theme change read them on this one too
    window.dispatchEvent(new CustomEvent('v3-theme', { detail: root.dataset.theme }))
  }

  const now = paletteById(current)

  return (
    <div ref={panel} className={styles.root} data-open={open || undefined}>
      {open ? (
        <div className={styles.panel} role="dialog" aria-label="Colour options">
          <div className={styles.head}>
            <span className={styles.title}>Colour options</span>
            <span className={styles.sub}>Preview tool · remembered on this device</span>
          </div>
          <div className={styles.strength}>
            <span className={styles.strengthLabel}>Chromatic aberration</span>
            <div className={styles.segments} role="group" aria-label="Chromatic aberration strength">
              {STRENGTHS.map((s) => (
                <button key={s.id} type="button" aria-pressed={strength === s.id} onClick={() => aberrate(s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <ul className={styles.list}>
            {palettes.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={styles.option}
                  aria-pressed={p.id === current}
                  onClick={() => choose(p.id)}
                  data-lock={p.name}
                >
                  <span className={styles.swatch} aria-hidden="true">
                    <span style={{ background: p.dark.bg }} />
                    <span style={{ background: p.dark.brand }} />
                    <span style={{ background: p.light.bg }} />
                    <span style={{ background: p.light.brand }} />
                  </span>
                  <span className={styles.ramp} style={{ background: `linear-gradient(90deg, ${p.ramp.join(', ')})` }} aria-hidden="true" />
                  <span className={styles.name}>
                    {p.name}
                    {p.backlog ? <span className={styles.tag}>backlog</span> : null}
                  </span>
                  <span className={styles.family}>
                    {p.family} · camera: {p.camera}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close colour options' : `Colour options (now ${now.name})`}
        data-lock="Colours"
      >
        {open ? <X size={16} strokeWidth={2} /> : <PaletteIcon size={16} strokeWidth={2} />}
        <span className={styles.dot} style={{ background: now.dark.brand }} aria-hidden="true" />
        <span>{now.name}</span>
      </button>
    </div>
  )
}
