import Link from 'next/link'

import styles from './case.module.css'

/** Visible breadcrumbs; the same trail goes out as BreadcrumbList JSON-LD. */
export function Crumbs({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.crumbs}>
      <ol>
        {items.map((c, i) => (
          <li key={c.href}>
            {i < items.length - 1 ? (
              <Link href={c.href}>{c.label}</Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
