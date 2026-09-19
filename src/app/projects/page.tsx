import type { Metadata } from 'next'
import Link from 'next/link'

import { TopicPills } from '@/components/authority/blocks'
import { Breadcrumbs, breadcrumbsJsonLd } from '@/components/authority/breadcrumbs'
import { AuthorityShell } from '@/components/authority/shell'
import { JsonLd } from '@/components/authority/structured-data'
import styles from '@/components/authority/authority.module.css'
import { readyProjects } from '@/content/authority/projects'
import { siteConfig } from '@/lib/site'

const CANONICAL_PATH = '/projects'

export const metadata: Metadata = {
  title: 'Projects — Rami Kronbi',
  description:
    'Annotated engineering records of projects built by Rami Kronbi: computer vision, robotics, embedded control, applied AI, and civic technology.',
  alternates: { canonical: CANONICAL_PATH },
  openGraph: {
    title: 'Projects — Rami Kronbi',
    description:
      'Annotated engineering records of projects built by Rami Kronbi.',
    url: `${siteConfig.url}${CANONICAL_PATH}`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects — Rami Kronbi',
    description:
      'Annotated engineering records of projects built by Rami Kronbi.',
  },
}

export default function ProjectsIndexPage() {
  const items = readyProjects
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: CANONICAL_PATH },
  ]

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteConfig.url}${CANONICAL_PATH}`,
    url: `${siteConfig.url}${CANONICAL_PATH}`,
    name: 'Projects — Rami Kronbi',
    description:
      'Annotated engineering records of projects built by Rami Kronbi.',
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    about: { '@id': `${siteConfig.url}/#person` },
    hasPart: items.map((project) => ({
      '@type': project.schemaType,
      name: project.title,
      url: `${siteConfig.url}/projects/${project.slug}`,
      description: project.summary,
    })),
  }

  return (
    <AuthorityShell>
      <JsonLd id="projects-index" data={[collectionSchema, breadcrumbsJsonLd({ items: breadcrumbs, siteUrl: siteConfig.url })]} />
      <Breadcrumbs items={breadcrumbs} />
      <header className={styles.indexIntro}>
        <h1 className={styles.indexTitle}>Projects</h1>
        <p className={styles.indexDek}>
          Each entry is an annotated engineering record: what it is, what problem it addresses, how it works,
          what was measured, where it fails, and where the underlying evidence can be inspected. The list is
          ordered by depth of documentation, not by chronology.
        </p>
      </header>

      <ul className={styles.projectList}>
        {items.map((project) => (
          <li key={project.slug} className={styles.projectListItem}>
            <div className={styles.projectListHead}>
              <h2 className={styles.projectListTitle}>
                <Link href={`/projects/${project.slug}`}>{project.title}</Link>
              </h2>
              <p className={styles.projectListRole}>{project.role}</p>
              <TopicPills topics={project.topics} />
            </div>
            <p className={styles.projectListSummary}>{project.summary}</p>
          </li>
        ))}
      </ul>
    </AuthorityShell>
  )
}
