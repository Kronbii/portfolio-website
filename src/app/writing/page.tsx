import type { Metadata } from 'next'
import Link from 'next/link'

import styles from '@/components/authority/authority.module.css'
import { Breadcrumbs, breadcrumbsJsonLd } from '@/components/authority/breadcrumbs'
import { AuthorityShell } from '@/components/authority/shell'
import { JsonLd } from '@/components/authority/structured-data'
import { readyArticles } from '@/content/authority/articles'
import { siteConfig } from '@/lib/site'

const CANONICAL_PATH = '/writing'

export const metadata: Metadata = {
  title: 'Writing — Rami Kronbi',
  description:
    'Engineering essays by Rami Kronbi about the projects, decisions, and constraints behind embedded perception, robotics, and applied AI.',
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    title: 'Writing — Rami Kronbi',
    description:
      'Engineering essays by Rami Kronbi about the projects, decisions, and constraints behind embedded perception, robotics, and applied AI.',
    url: `${siteConfig.url}${CANONICAL_PATH}`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writing — Rami Kronbi',
    description:
      'Engineering essays by Rami Kronbi about the projects, decisions, and constraints behind embedded perception, robotics, and applied AI.',
  },
}

export default function WritingIndexPage() {
  const items = readyArticles
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Writing', href: CANONICAL_PATH },
  ]

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteConfig.url}${CANONICAL_PATH}`,
    url: `${siteConfig.url}${CANONICAL_PATH}`,
    name: 'Writing — Rami Kronbi',
    description:
      'Engineering essays by Rami Kronbi about the projects, decisions, and constraints behind embedded perception, robotics, and applied AI.',
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    about: { '@id': `${siteConfig.url}/#person` },
    hasPart: items.map((article) => ({
      '@type': 'TechArticle',
      name: article.title,
      url: `${siteConfig.url}/writing/${article.slug}`,
      description: article.metaDescription,
    })),
  }

  return (
    <AuthorityShell>
      <JsonLd id="writing-index" data={[collectionSchema, breadcrumbsJsonLd({ items: breadcrumbs, siteUrl: siteConfig.url })]} />
      <Breadcrumbs items={breadcrumbs} />
      <header className={styles.indexIntro}>
        <h1 className={styles.indexTitle}>Writing</h1>
        <p className={styles.indexDek}>
          Each essay explains the decisions behind one project — how a system was built, what was actually
          measured, and where it fails. Every essay links to the project record and to the topics it belongs
          to.
        </p>
      </header>

      <ol className={styles.writingList}>
        {items.map((article) => (
          <li key={article.slug} className={styles.writingItem}>
            <h2 className={styles.writingItemTitle}>
              <Link href={`/writing/${article.slug}`}>{article.title}</Link>
            </h2>
            <p className={styles.writingItemDek}>{article.dek}</p>
          </li>
        ))}
      </ol>
    </AuthorityShell>
  )
}
