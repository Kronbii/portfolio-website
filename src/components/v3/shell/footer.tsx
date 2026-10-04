import { v3Chrome } from '@/content/v3/home'
import { siteConfig } from '@/lib/site'

import { Mark } from './chrome'
import styles from './shell.module.css'

export function Footer() {
  const f = v3Chrome.footer
  return (
    <footer className={styles.footer}>
      <div className={styles.footInner}>
        <div>
          <div className={styles.footBrand}>
            <Mark />
            {siteConfig.name}
          </div>
          <p className={styles.footNote}>{f.note}</p>
        </div>
        <ul className={styles.footLinks} aria-label="Profiles">
          {v3Chrome.profiles.map((p) => (
            <li key={p.href}>
              <a href={p.href} target="_blank" rel="noopener noreferrer me">
                {p.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.footSide}>
          <a href="/">{f.live}</a>
          <a href="#v3-main">{f.top}</a>
          <span className={styles.copy}>{f.copyright}</span>
        </div>
      </div>
    </footer>
  )
}
