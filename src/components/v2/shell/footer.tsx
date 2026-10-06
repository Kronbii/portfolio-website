import { v2Chrome, v2Nav } from '@/content/v2/home'

import { SheetLink } from '../sheet-link'
import { LiveLink } from './live-link'
import styles from './footer.module.css'

export function Footer() {
  const { footer, profiles, brand } = v2Chrome
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.word} aria-hidden="true">
          {brand}
          <span className={styles.dot}>.</span>
        </p>

        <div className={styles.cols}>
          <div className={styles.about}>
            <p>{footer.preview}</p>
            <LiveLink className={styles.live} label={footer.liveAction} />
          </div>
          <div>
            <h2 className={styles.colHead}>{footer.record}</h2>
            <ul className={styles.list}>
              {v2Nav.map((item) => (
                <li key={item.href}>
                  <SheetLink href={item.href} direction={item.href === '/v2' ? 'back' : 'forward'}>
                    {item.label}
                  </SheetLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={styles.colHead}>{footer.elsewhere}</h2>
            <ul className={styles.list}>
              {profiles.map((p) => (
                <li key={p.href}>
                  <a href={p.href} target="_blank" rel="noopener noreferrer me">
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>{footer.copyright}</span>
          <a href="#v2-main">{footer.top}</a>
        </div>
      </div>
    </footer>
  )
}
