'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { WorkItem } from './data'
import { EvidenceLinks } from './shared'
import styles from './work.module.css'

const shape: Record<number, string> = { 0: styles.tileWide, 1: styles.tileTall, 3: styles.tileWide, 5: styles.tileWide }

/**
 * Evidence wall. Mixed-size tiles of real media with a hairline gap; the
 * selected tile expands in place to carry the dek and links.
 */
export function Wall({ work, heading }: { work: WorkItem[]; heading: string }) {
  const [open, setOpen] = useState<string | null>(work[0]?.slug ?? null)
  return (
    <section id="selected-work" aria-label={heading} className={styles.wallSection}>
      <h2 className="sr-only">{heading}</h2>
      <div className={styles.wall}>
        {work.map((w, i) => {
          const isOpen = open === w.slug
          return (
            <button
              key={w.slug}
              type="button"
              className={`${styles.tile} ${isOpen ? styles.tileOpen : shape[i] ?? ''}`}
              onClick={() => setOpen(isOpen ? null : w.slug)}
              aria-expanded={isOpen}
            >
              <Image
                src={w.media.src}
                alt={w.media.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={85}
                priority={i === 0}
                className={w.tone === 'light' ? styles.lightPlate : undefined}
                style={w.focus && !isOpen ? { objectPosition: w.focus } : undefined}
              />
              <span className={styles.tileCopy}>
                <span className={styles.tileTitle}>{w.title}</span>
                {isOpen ? (
                  <>
                    <span className={styles.tileDek}>{w.dek}</span>
                    <span className={styles.tileField}>
                      {w.field} · {w.role}
                    </span>
                    <EvidenceLinks canonical={w.canonical} external={w.external} />
                  </>
                ) : null}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
