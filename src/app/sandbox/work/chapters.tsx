import Image from 'next/image'

import type { MomentItem, WorkItem } from './data'
import { EvidenceLinks } from './shared'
import styles from './work.module.css'

type Chapter = {
  key: string
  title: string
  dek: string
  meta: { label: string; value: string }[]
  media: WorkItem['media']
  tone?: 'light'
  focus?: string
  canonical?: string
  external?: { label: string; href: string }
}

export function workToChapters(items: WorkItem[]): Chapter[] {
  return items.map((w) => ({
    key: w.slug,
    title: w.title,
    dek: w.dek,
    meta: [
      { label: 'Field', value: w.field },
      { label: 'Role', value: w.role },
    ],
    media: w.media,
    tone: w.tone,
    focus: w.focus,
    canonical: w.canonical,
    external: w.external,
  }))
}

export function momentsToChapters(items: MomentItem[]): Chapter[] {
  return items.map((m) => ({
    key: m.id,
    title: m.title,
    dek: m.dek,
    meta: [
      { label: 'Role', value: m.role },
      { label: 'When', value: m.when },
      { label: 'Where', value: m.where },
    ],
    media: m.media,
    canonical: m.canonical,
    external: m.external,
  }))
}

/**
 * Full-bleed chapters. Each plate is one viewport tall and sticky at the top,
 * so the next plate scrolls up and covers it. The title lives inside the
 * plate, so it is covered too; there is no separate copy column and no
 * header block before the first image.
 */
export function Chapters({ chapters, id, heading }: { chapters: Chapter[]; id: string; heading: string }) {
  return (
    <section id={id} aria-label={heading} className={styles.chapters}>
      {chapters.map((c, i) => (
        <figure key={c.key} className={styles.chapter}>
          <Image
            src={c.media.src}
            alt={c.media.alt}
            fill
            sizes="100vw"
            quality={88}
            priority={i === 0}
            className={styles.chapterImg}
            style={c.focus ? { objectPosition: c.focus } : c.media.h > c.media.w ? { objectPosition: 'center 18%' } : undefined}
          />
          <div className={`${styles.chapterVeil} ${c.tone === 'light' ? styles.chapterVeilDeep : ''}`} aria-hidden />
          <figcaption className={styles.chapterCopy}>
            <div>
              <h2 className={styles.chapterTitle}>{c.title}</h2>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <span className={styles.chapterRule} aria-hidden />
              <p className={styles.chapterDek}>{c.dek}</p>
              <p className={styles.chapterMeta}>
                {c.meta.map((m) => (
                  <span key={m.label}>
                    {m.label} <b>{m.value}</b>
                  </span>
                ))}
              </p>
              <EvidenceLinks canonical={c.canonical} external={c.external} />
            </div>
          </figcaption>
        </figure>
      ))}
    </section>
  )
}
