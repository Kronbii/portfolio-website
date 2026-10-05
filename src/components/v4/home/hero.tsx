import { ArrowDown, ArrowUpRight } from 'lucide-react'

import { Hot } from '@/components/v3/hot'
import styles from '@/components/v3/home/hero.module.css'
import { v4Home } from '@/content/v4/home'

import { Reel } from './reel'

/** v3's hero, with the reel where the thermal camera was. */
export function Hero() {
  const { hero, creds } = v4Home
  const [first, last] = hero.name.split(' ')

  return (
    <section className={styles.hero} id="top" aria-labelledby="v4-name">
      <div className={styles.grid}>
        <div className={styles.text}>
          {/* the intro's name lands on these two lines */}
          <h1 className={styles.name} id="v4-name" data-lens="1.2">
            <span>{first}</span>
            <span>
              {last}
              <span className={styles.dot}>.</span>
            </span>
          </h1>

          <p className={styles.claim} data-lens="0.5">
            <Hot text={hero.claim} hot={hero.hot} />
          </p>

          <a className={styles.now} href={hero.now.href} target="_blank" rel="noopener noreferrer" data-lock="Employer">
            <span className={styles.nowLabel}>
              <span className={styles.pulse} aria-hidden="true" />
              {hero.now.label}
            </span>
            <span className={styles.nowText}>{hero.now.text}</span>
          </a>

          <div className={styles.actions}>
            <a href="#work" className={styles.primary}>
              {hero.work}
              <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
            </a>
            <a href="#contact" className={styles.secondary}>
              {hero.contact}
            </a>
            <span className={styles.where}>{hero.where}</span>
            <span className={styles.hold}>{hero.hold}</span>
          </div>
        </div>

        <div className={styles.feed}>
          <Reel />
        </div>
      </div>

      <ul className={styles.creds} aria-label="Highlights">
        {creds.map((c) => {
          const external = c.href.startsWith('http')
          return (
            <li key={c.label}>
              <a
                className={styles.cred}
                href={c.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                data-lock="Source"
              >
                <span className={styles.credBig} data-lens="0.8">
                  {c.big}
                </span>
                <span className={styles.credLabel}>{c.label}</span>
                <span className={styles.credNote}>
                  {c.note}
                  {external ? <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" /> : null}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
