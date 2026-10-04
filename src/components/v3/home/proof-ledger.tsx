'use client'

import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import styles from './proof-ledger.module.css'

export interface ProofRow {
  figure: string
  text: string
  source: string
  href: string
  image?: { src: string; alt: string }
}

/*
 * The achievements, as a ledger anyone can read: one large figure, one plain
 * sentence, and the source it rests on. Rows with a photograph show it beside
 * the cursor; it arrives the way a camera acquires it, as heat first, then in
 * colour.
 */
export function ProofLedger({ title, lede, rows }: { title: string; lede: string; rows: ProofRow[] }) {
  const section = useRef<HTMLElement>(null)
  const peek = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState<number | null>(null)

  useEffect(() => {
    const el = section.current
    const p = peek.current
    if (!el || !p) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    let x = 0
    let y = 0
    let tx = 0
    let ty = 0
    let raf = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tick = () => {
      const k = reduced ? 1 : 0.2
      x += (tx - x) * k
      y += (ty - y) * k
      p.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e: PointerEvent) => {
      tx = e.clientX + 28
      ty = e.clientY - 120
      if (tx + 300 > window.innerWidth) tx = e.clientX - 328
      if (!raf) raf = requestAnimationFrame(tick)
    }
    el.addEventListener('pointermove', onMove)
    return () => {
      el.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  const img = shown !== null ? rows[shown]?.image : undefined

  return (
    <section ref={section} className={styles.section} id="proof" aria-labelledby="proof-h">
      <div className={styles.wrap}>
        <header className={styles.head}>
          <h2 className={styles.h2} id="proof-h">
            {title}
          </h2>
          <p className={styles.lede}>{lede}</p>
        </header>

        <ol className={styles.rows}>
          {rows.map((r, i) => {
            const external = r.href.startsWith('http')
            return (
              <li key={r.text}>
                <a
                  className={styles.row}
                  href={r.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  onPointerEnter={() => setShown(r.image ? i : null)}
                  onPointerLeave={() => setShown(null)}
                  data-lock="Source"
                >
                  <span className={styles.figure} data-lens="0.9">
                    {r.figure}
                  </span>
                  <span className={styles.text}>{r.text}</span>
                  <span className={styles.source}>
                    {r.source}
                    {external ? (
                      <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                    ) : (
                      <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                    )}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </div>

      <div ref={peek} className={styles.peek} data-on={img ? 'on' : 'off'} aria-hidden="true">
        {img ? (
          <div className={styles.peekFrame} key={img.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt="" className={styles.peekColour} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt="" className={styles.peekHeat} />
            <i data-c="tl" />
            <i data-c="tr" />
            <i data-c="bl" />
            <i data-c="br" />
          </div>
        ) : null}
      </div>
    </section>
  )
}
