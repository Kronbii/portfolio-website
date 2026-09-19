import type { ReactNode } from 'react'

import { AuthorityNavBridge } from './nav-bridge'
import styles from './authority.module.css'

interface AuthorityShellProps {
  children: ReactNode
}

export function AuthorityShell({ children }: AuthorityShellProps) {
  return (
    <main className={styles.authority} data-authority-root="true">
      <AuthorityNavBridge />
      <div className={styles.container}>{children}</div>
    </main>
  )
}

interface SectionProps {
  title?: string
  id?: string
  children: ReactNode
  /** Deprecated: eyebrow labels are no longer rendered (banned decorative kicker). */
  label?: string
}

export function AuthoritySection({ title, id, children }: SectionProps) {
  return (
    <section className={styles.section} id={id} aria-labelledby={id ? `${id}-title` : undefined}>
      {title ? (
        <h2 className={styles.sectionHead} id={id ? `${id}-title` : undefined}>
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  )
}
