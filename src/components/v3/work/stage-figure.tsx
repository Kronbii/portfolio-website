import type { ProjectStage } from '@/content/authority'

import styles from './stage-figure.module.css'

/**
 * The first screen for work without photographs: its own steps as a track,
 * titles only, so the mechanism reads at a glance. The detail sits further
 * down the page, step by step.
 */
export function StageFigure({ stages, label, alt }: { stages: ProjectStage[]; label: string; alt: string }) {
  return (
    <figure className={styles.figure} aria-label={alt}>
      <span className={styles.label}>{label}</span>
      <ol className={styles.track}>
        {stages.map((s, i) => (
          <li key={s.step} style={{ ['--i' as string]: i }}>
            <span className={styles.node} aria-hidden="true" />
            <span className={styles.step}>{s.step}</span>
            <span className={styles.title}>{s.title}</span>
          </li>
        ))}
      </ol>
      <i className={styles.c} data-c="tl" aria-hidden="true" />
      <i className={styles.c} data-c="tr" aria-hidden="true" />
      <i className={styles.c} data-c="bl" aria-hidden="true" />
      <i className={styles.c} data-c="br" aria-hidden="true" />
    </figure>
  )
}
