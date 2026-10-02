import { Fragment } from 'react'

import styles from './bands.module.css'

/** Lazpress's mono strip under the bar, its dots in the one accent. */
export function Ticker({ items }: { items: string[] }) {
  const run = [...items, ...items]
  return (
    <div className={styles.ticker} aria-label={items.join(', ')} role="note">
      <div className={styles.tickerTrack} aria-hidden="true">
        {run.map((item, i) => (
          <span key={i} className={styles.tickerItem}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Two counter-running rows: the tools, and the loop every entry closes. */
export function Marquee({ tools, loop }: { tools: string[]; loop: string[] }) {
  const toolRun = [...tools, ...tools]
  const loopRun = Array.from({ length: 6 }, () => loop).flat()
  return (
    <div className={styles.marquee} role="note" aria-label={`Tools: ${tools.join(', ')}. Loop: ${loop.join(', ')}.`}>
      <div className={styles.row} aria-hidden="true">
        <div className={styles.track}>
          {toolRun.map((t, i) => (
            <Fragment key={i}>
              <span className={styles.word}>{t}</span>
              <span className={styles.sep} />
            </Fragment>
          ))}
        </div>
      </div>
      <div className={`${styles.row} ${styles.rowReverse}`} aria-hidden="true">
        <div className={styles.track}>
          {loopRun.map((t, i) => (
            <Fragment key={i}>
              <span className={styles.loopWord}>{t}</span>
              <svg className={styles.arrow} viewBox="0 0 40 12" aria-hidden="true">
                <path d="M0 6h37M32 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
