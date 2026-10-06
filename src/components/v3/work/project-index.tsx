'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import styles from './project-index.module.css'

export interface IndexRow {
  slug: string
  title: string
  kind: string
  line: string
  proof: string
  part: string
  field: string
  href: string
  image?: { src: string; alt: string; position?: string }
}

/*
 * Every project on one page, filterable by what it is for. Rows, not cards:
 * a skimmer reads down one column of titles and one column of sentences.
 * The filter is progressive: without script every row is listed.
 */
export function ProjectIndex({
  rows,
  fields,
  allLabel,
  empty,
}: {
  rows: IndexRow[]
  fields: { id: string; label: string }[]
  allLabel: string
  empty: string
}) {
  const [field, setField] = useState<string>('all')
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const r of rows) c[r.field] = (c[r.field] ?? 0) + 1
    return c
  }, [rows])
  const shown = field === 'all' ? rows : rows.filter((r) => r.field === field)

  return (
    <div className={styles.root}>
      <div className={styles.filters} role="toolbar" aria-label="Filter projects">
        <button type="button" className={styles.chip} aria-pressed={field === 'all'} onClick={() => setField('all')}>
          {allLabel}
          <span className={styles.count}>{rows.length}</span>
        </button>
        {fields
          .filter((f) => counts[f.id])
          .map((f) => (
            <button
              key={f.id}
              type="button"
              className={styles.chip}
              aria-pressed={field === f.id}
              onClick={() => setField(f.id)}
            >
              {f.label}
              <span className={styles.count}>{counts[f.id]}</span>
            </button>
          ))}
      </div>

      {shown.length ? (
        <ol className={styles.list} key={field}>
          {shown.map((r, i) => (
            <li key={r.slug} style={{ ['--i' as string]: Math.min(i, 10) }}>
              <Link href={r.href} className={styles.row}>
                <span className={styles.thumb} aria-hidden="true">
                  {r.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.image.src} alt="" loading="lazy" style={{ objectPosition: r.image.position ?? '50% 50%' }} />
                  ) : (
                    <span className={styles.thumbKind}>{r.kind}</span>
                  )}
                </span>
                <span className={styles.main}>
                  <span className={styles.kind}>{r.kind}</span>
                  <span className={styles.title}>{r.title}</span>
                  <span className={styles.line}>{r.line}</span>
                </span>
                <span className={styles.side}>
                  <span className={styles.proof}>{r.proof}</span>
                  <span className={styles.part}>{r.part}</span>
                </span>
                <ArrowRight className={styles.go} size={18} strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles.empty}>{empty}</p>
      )}
    </div>
  )
}
