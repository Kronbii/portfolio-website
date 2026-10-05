'use client'

import { useRef } from 'react'

import { useMotion } from '../motion/use-motion'
import { EXPLAINERS, ExplainerSvg } from './explainers'
import styles from './work-reel.module.css'

/** A project's motion explainer as the first screen of its page, looping while in view. */
export function CaseExplainer({ slug, shows }: { slug: string; shows: string }) {
  const box = useRef<HTMLDivElement>(null)
  useMotion(box, (el) => EXPLAINERS[slug].build(el.querySelector('svg')!), { loop: true, poster: 0.62 })
  return (
    <figure className={styles.player} style={{ margin: 0 }}>
      <div ref={box} className={styles.screen}>
        <ExplainerSvg slug={slug} />
      </div>
      <figcaption className={styles.shows}>{shows}</figcaption>
    </figure>
  )
}
