'use client'

import { useRef, type ReactNode } from 'react'

import { gsap, SplitText } from '../motion/gsap'
import { useMotion } from '../motion/use-motion'
import styles from './slate.module.css'

/**
 * A section opens like a shot: its scene number and timecode, a rule that
 * draws across, and the title set in kinetic type, word by word out of a mask.
 * Plays once on first sight; under reduced motion the slate is simply there.
 */
export function Slate({
  scene,
  label,
  title,
  lede,
  id,
  children,
}: {
  scene: number
  label: string
  title: string
  lede?: string
  id: string
  children?: ReactNode
}) {
  const root = useRef<HTMLElement>(null)
  useMotion(
    root,
    (el) => {
      const tl = gsap.timeline()
      const title = el.querySelector<HTMLElement>('[data-title]')!
      const split = SplitText.create(title, { type: 'words', mask: 'words' })
      tl.fromTo(el.querySelector('[data-rule]'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'glide' }, 0)
      tl.fromTo(
        el.querySelector('[data-scene]'),
        { opacity: 0 },
        { opacity: 1, duration: 0.5, scrambleText: { text: `SC ${String(scene).padStart(2, '0')}`, chars: '0123456789', speed: 0.6 } },
        0,
      )
      tl.fromTo(split.words, { yPercent: 105 }, { yPercent: 0, duration: 0.75, stagger: 0.06, ease: 'cut' }, 0.1)
      const lede = el.querySelector('[data-lede]')
      if (lede) tl.fromTo(lede, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'glide' }, 0.45)
      const extra = el.querySelector('[data-extra]')
      if (extra) tl.fromTo(extra, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'glide' }, 0.55)
      return tl
    },
    { rootMargin: '0px 0px -15% 0px' },
  )

  return (
    <header ref={root} className={styles.slate}>
      <div className={styles.meta} aria-hidden="true">
        <span data-scene="" className={styles.scene}>
          SC {String(scene).padStart(2, '0')}
        </span>
        <span className={styles.label}>{label}</span>
        <span data-rule="" className={styles.rule} />
      </div>
      <div className={styles.row}>
        <h2 className={styles.title} id={id} data-title="">
          {title}
        </h2>
        {lede || children ? (
          <div className={styles.aside}>
            {lede ? (
              <p className={styles.lede} data-lede="">
                {lede}
              </p>
            ) : null}
            {children ? <div data-extra="">{children}</div> : null}
          </div>
        ) : null}
      </div>
    </header>
  )
}
