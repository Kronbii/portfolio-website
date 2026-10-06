'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { MomentItem } from './data'
import { EvidenceLinks } from './shared'
import styles from './work.module.css'

/**
 * Ledger. A dated list of roles; the active row opens its detail and swaps
 * the single sticky plate on the right. Below the desktop breakpoint each
 * open row carries its own image instead.
 */
export function Ledger({ moments, heading }: { moments: MomentItem[]; heading: string }) {
  const [active, setActive] = useState(0)
  return (
    <section id="community" aria-label={heading} className={styles.ledger}>
      <div>
        <h2 className={styles.ledgerHead}>{heading}</h2>
        <ul className={styles.ledgerList}>
          {moments.map((m, i) => {
            const open = i === active
            return (
              <li key={m.id} className={`${styles.ledgerRow} ${open ? styles.ledgerRowActive : ''}`}>
                <button
                  type="button"
                  className={styles.ledgerBtn}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={open}
                  aria-controls={`ledger-${m.id}`}
                >
                  <span className={styles.ledgerWhen}>{m.when}</span>
                  <span>
                    <span className={styles.ledgerTitle}>{m.title}</span>
                    <span className={styles.ledgerRole}>{m.role}</span>
                  </span>
                </button>
                <div id={`ledger-${m.id}`} className={styles.ledgerDetail} aria-hidden={!open}>
                  <div className={styles.ledgerDetailInner}>
                    <div className={styles.ledgerMobileMedia}>
                      <Image src={m.media.src} alt={m.media.alt} fill sizes="100vw" quality={80} />
                    </div>
                    <p style={{ margin: '0 0 0.75rem' }}>{m.dek}</p>
                    <EvidenceLinks canonical={m.canonical} external={m.external} />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <div className={styles.ledgerPlate} aria-hidden>
        {moments.map((m, i) => (
          <Image
            key={m.id}
            src={m.media.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 0px"
            quality={85}
            className={i === active ? '' : styles.ledgerPlateHidden}
          />
        ))}
      </div>
    </section>
  )
}
