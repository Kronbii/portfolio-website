'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { WorkItem } from './data'
import { EvidenceLinks } from './shared'
import styles from './work.module.css'

const shape: Record<number, string> = { 0: styles.tileWide, 1: styles.tileTall, 3: styles.tileWide }

/**
 * Evidence wall. Mixed-size tiles of real media with a hairline gap; the
 * selected tile expands in place to carry the dek and links.
 */
export function Wall({ work, heading, note }: { work: WorkItem[]; heading: string; note: string }) {
  const [open, setOpen] = useState<string | null>(work[0]?.slug ?? null)
  return (
    <section id="selected-work" aria-label={heading}>
      <div className={styles.wallHead}>
        <h2 className={styles.wallTitle}>{heading}</h2>
        <p className={styles.wallNote}>{note}</p>
      </div>
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
              />
              <span className={styles.tileCopy}>
                <span className={styles.tileField}>{w.field}</span>
                <span className={styles.tileTitle}>{w.title}</span>
                {isOpen ? (
                  <>
                    <span className={styles.tileDek}>{w.dek}</span>
                    <span className={styles.tileField}>{w.role}</span>
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
