'use client'

import { useRef } from 'react'

import { gsap } from '../motion/gsap'
import { useMotion } from '../motion/use-motion'
import styles from './slate.module.css'

/** The slate's scene line on its own, for sections that bring their own title. */
export function SceneMark({ scene, label }: { scene: number; label: string }) {
  const root = useRef<HTMLDivElement>(null)
  useMotion(root, (el) =>
    gsap
      .timeline()
      .fromTo(el.querySelector('[data-rule]'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'glide' }, 0)
      .fromTo(
        el.querySelector('[data-scene]'),
        { opacity: 0 },
        { opacity: 1, duration: 0.5, scrambleText: { text: `SC ${String(scene).padStart(2, '0')}`, chars: '0123456789', speed: 0.6 } },
        0,
      ),
  )
  return (
    <div ref={root} className={styles.markWrap} aria-hidden="true">
      <div className={styles.meta}>
        <span data-scene="" className={styles.scene}>
          SC {String(scene).padStart(2, '0')}
        </span>
        <span className={styles.label}>{label}</span>
        <span data-rule="" className={styles.rule} />
      </div>
    </div>
  )
}
