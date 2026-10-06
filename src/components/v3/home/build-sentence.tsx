'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import styles from './build-sentence.module.css'

export interface BuildItem {
  slug: string
  title: string
  kind: string
  line: string
  href: string
  image?: { src: string; alt: string; position?: string }
}

export interface BuildGroup {
  id: string
  phrase: string
  joiner: string
  items: BuildItem[]
}

/*
 * What Rami builds, as one sentence a visitor can read in a breath. Each
 * phrase is a control: pointing at it (or focusing, or tapping it) brings up
 * the work behind it, so the sentence doubles as the index.
 */
export function BuildSentence({ title, lead, groups, hint }: { title: string; lead: string; groups: BuildGroup[]; hint: string }) {
  const [active, setActive] = useState(0)
  const group = groups[active]

  return (
    <section className={styles.section} aria-labelledby="build-h">
      <div className={styles.wrap}>
        <h2 className={styles.label} id="build-h">
          {title}
        </h2>
        <p className={styles.sentence} data-lens="0.5">
          {lead}{' '}
          {groups.map((g, i) => (
            <span key={g.id}>
              {/* a span, not a <button>: a phrase has to wrap with the sentence around it */}
              <span
                role="button"
                tabIndex={0}
                className={styles.phrase}
                aria-pressed={i === active}
                aria-controls="build-items"
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActive(i)
                  }
                }}
                data-lock="Show"
              >
                {g.phrase}
              </span>
              {g.joiner}{' '}
            </span>
          ))}
        </p>
        <p className={styles.hint}>{hint}</p>

        <ul className={styles.items} id="build-items" aria-live="polite" key={group.id}>
          {group.items.map((it, i) => (
            <li key={it.slug} style={{ ['--i' as string]: i }}>
              <Link href={it.href} className={styles.item}>
                <span className={styles.thumb} aria-hidden={!it.image}>
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.image.src}
                      alt={it.image.alt}
                      loading="lazy"
                      style={{ objectPosition: it.image.position ?? '50% 50%' }}
                    />
                  ) : (
                    <span className={styles.thumbKind}>{it.kind}</span>
                  )}
                </span>
                <span className={styles.itemKind}>{it.kind}</span>
                <span className={styles.itemTitle}>{it.title}</span>
                <span className={styles.itemLine}>{it.line}</span>
                <span className={styles.itemGo}>
                  <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
