import Link from 'next/link'

import type { AuthorityBreadcrumb } from '@/content/authority/types'

import styles from './authority.module.css'

interface BreadcrumbsProps {
  items: AuthorityBreadcrumb[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={`${item.href}-${item.label}`} className={isLast ? styles.current : undefined}>
            {isLast ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <>
                <Link href={item.href}>{item.label}</Link>
                <span className={styles.breadcrumbSep} aria-hidden="true">
                  {' / '}
                </span>
              </>
            )}
          </span>
        )
      })}
    </nav>
  )
}

interface BreadcrumbsJsonLdProps {
  items: AuthorityBreadcrumb[]
  siteUrl: string
}

export function breadcrumbsJsonLd({ items, siteUrl }: BreadcrumbsJsonLdProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href.startsWith('http') ? item.href : `${siteUrl}${item.href}`,
    })),
  }
}
