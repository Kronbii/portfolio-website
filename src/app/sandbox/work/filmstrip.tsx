'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'

import type { MomentItem } from './data'
import { EvidenceLinks } from './shared'
import styles from './work.module.css'

/**
 * Film strip. A horizontal snap track of dated frames; the first frame is
 * partly cut by the viewport so the direction of travel is obvious. Buttons
 * exist for mouse and keyboard users; touch and trackpad scroll natively.
 */
export function FilmStrip({ moments, heading }: { moments: MomentItem[]; heading: string }) {
  const track = useRef<HTMLDivElement>(null)
  const step = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const frame = el.querySelector<HTMLElement>(`.${styles.frame}`)
    const w = frame ? frame.getBoundingClientRect().width + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * w, behavior: 'smooth' })
  }
  return (
    <section id="community" aria-label={heading} className={styles.strip}>
      <div className={styles.stripHead}>
        <h2 className={styles.stripTitle}>{heading}</h2>
        <div className={styles.stripNav}>
          <button type="button" className={styles.stripBtn} onClick={() => step(-1)} aria-label="Previous">
            <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
          </button>
          <button type="button" className={styles.stripBtn} onClick={() => step(1)} aria-label="Next">
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>
      <div className={styles.track} ref={track} tabIndex={0} aria-label="Community moments, scroll horizontally">
        {moments.map((m, i) => (
          <article key={m.id} className={styles.frame}>
            <p className={styles.frameWhen}>
              {m.when} · {m.where}
            </p>
            <div className={styles.frameMedia}>
              <Image src={m.media.src} alt={m.media.alt} fill sizes="(min-width: 640px) 26rem, 78vw" quality={85} priority={i < 3} />
            </div>
            <div>
              <h3 className={styles.frameTitle}>{m.title}</h3>
              <p className={styles.frameRole}>{m.role}</p>
              <p className={styles.frameDek}>{m.dek}</p>
              <EvidenceLinks canonical={m.canonical} external={m.external} muted />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
