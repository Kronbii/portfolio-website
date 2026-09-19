import type { Metadata } from 'next'
import Link from 'next/link'

import styles from '@/components/authority/authority.module.css'
import { Breadcrumbs, breadcrumbsJsonLd } from '@/components/authority/breadcrumbs'
import { AuthorityShell } from '@/components/authority/shell'
import { JsonLd } from '@/components/authority/structured-data'
import { readyArticles } from '@/content/authority/articles'
import { readyProjects } from '@/content/authority/projects'
import { topics } from '@/content/authority/topics'
import { siteConfig } from '@/lib/site'

const CANONICAL_PATH = '/topics'

export const metadata: Metadata = {
  title: 'Topics — Rami Kronbi',
  description:
    'Topic hubs connecting the projects and essays Rami Kronbi has published across computer vision, robotics, embedded control, applied AI, and civic technology.',
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    title: 'Topics — Rami Kronbi',
    description:
      'Topic hubs connecting the projects and essays Rami Kronbi has published.',
    url: `${siteConfig.url}${CANONICAL_PATH}`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Topics — Rami Kronbi',
    description:
      'Topic hubs connecting the projects and essays Rami Kronbi has published.',
  },
}

function countReadyItems(slug: string) {
  const projectCount = readyProjects.filter((p) => p.topics.includes(slug)).length
  const articleCount = readyArticles.filter((a) => a.topics.includes(slug)).length
  return projectCount + articleCount
}

export default function TopicsIndexPage() {
  const eligibleTopics = topics.filter((topic) => countReadyItems(topic.slug) >= 2)
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Topics', href: CANONICAL_PATH },
  ]

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteConfig.url}${CANONICAL_PATH}`,
    url: `${siteConfig.url}${CANONICAL_PATH}`,
    name: 'Topics — Rami Kronbi',
    description:
      'Topic hubs connecting the projects and essays Rami Kronbi has published.',
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    about: { '@id': `${siteConfig.url}/#person` },
    hasPart: eligibleTopics.map((topic) => ({
      '@type': 'CollectionPage',
      name: topic.title,
      url: `${siteConfig.url}/topics/${topic.slug}`,
      description: topic.definition,
    })),
  }

  return (
    <AuthorityShell>
      <JsonLd id="topics-index" data={[collectionSchema, breadcrumbsJsonLd({ items: breadcrumbs, siteUrl: siteConfig.url })]} />
      <Breadcrumbs items={breadcrumbs} />

      <header className={styles.indexIntro}>
        <h1 className={styles.indexTitle}>Topics</h1>
        <p className={styles.indexDek}>
          Each topic hub connects at least two ready pieces of evidence — projects and essays that share a
          field. Hubs exist to make Rami’s actual coverage visible, not to manufacture authority pages around
          isolated keywords.
        </p>
      </header>

      <div className={styles.crossLinks}>
        {eligibleTopics.map((topic) => (
          <Link key={topic.slug} className={styles.crossLink} href={`/topics/${topic.slug}`}>
            <span className={styles.crossLinkTitle}>{topic.title}</span>
            <span className={styles.crossLinkSummary}>{topic.definition}</span>
          </Link>
        ))}
      </div>
    </AuthorityShell>
  )
}
