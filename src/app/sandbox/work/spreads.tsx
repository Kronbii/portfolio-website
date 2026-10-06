import Image from 'next/image'

import type { WorkItem } from './data'
import { EvidenceLinks } from './shared'
import styles from './work.module.css'

/**
 * Magazine spreads. Image and copy split the width unevenly and swap sides
 * each spread; every third spread is shorter so the rhythm is not a march.
 */
export function Spreads({ work, heading }: { work: WorkItem[]; heading: string }) {
  return (
    <section id="selected-work" aria-label={heading} className={styles.spreads}>
      {work.map((w, i) => (
        <article key={w.slug} className={styles.spread}>
          <div className={styles.spreadMedia}>
            <Image
              src={w.media.src}
              alt={w.media.alt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              quality={88}
              priority={i === 0}
              className={w.tone === 'light' ? styles.lightPlate : undefined}
              style={w.focus ? { objectPosition: w.focus } : undefined}
            />
          </div>
          <div className={styles.spreadCopy}>
            <div>
              <h2 className={styles.spreadTitle}>{w.title}</h2>
              <p className={styles.spreadDek}>{w.dek}</p>
            </div>
            <div>
              <p className={styles.spreadRole}>
                {w.field} · {w.role}
              </p>
              <EvidenceLinks canonical={w.canonical} external={w.external} />
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
