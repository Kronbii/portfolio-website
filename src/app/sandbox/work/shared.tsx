import Link from 'next/link'

import styles from './work.module.css'

export function EvidenceLinks({
  canonical,
  external,
  muted = false,
}: {
  canonical?: string
  external?: { label: string; href: string }
  muted?: boolean
}) {
  return (
    <p className={`${styles.links} ${muted ? styles.linksMuted : ''}`}>
      {canonical ? <Link href={canonical}>Project record</Link> : null}
      {external ? (
        <a href={external.href} target="_blank" rel="noopener noreferrer">
          {external.label}
        </a>
      ) : null}
    </p>
  )
}

const pairings = [
  { href: '/sandbox/work/a', label: 'A — Chapters and film strip' },
  { href: '/sandbox/work/b', label: 'B — Spreads and ledger' },
  { href: '/sandbox/work/c', label: 'C — Evidence wall and chapters' },
]

export function PairingSwitcher({ current }: { current: 'a' | 'b' | 'c' }) {
  return (
    <nav className={styles.switcher} aria-label="Sandbox pairings">
      {pairings.map((p) => (
        <Link key={p.href} href={p.href} aria-current={p.href.endsWith(current) ? 'page' : undefined}>
          {p.label}
        </Link>
      ))}
    </nav>
  )
}

export function PairingIntro({ title, note }: { title: string; note: string }) {
  return (
    <header className={styles.intro}>
      <h1 className={styles.introTitle}>{title}</h1>
      <p className={styles.introNote}>{note}</p>
    </header>
  )
}
