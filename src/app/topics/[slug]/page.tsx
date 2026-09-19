import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import styles from '@/components/authority/authority.module.css'
import { Breadcrumbs, breadcrumbsJsonLd } from '@/components/authority/breadcrumbs'
import { CrossLinkCard } from '@/components/authority/blocks'
import { AuthorityShell, AuthoritySection } from '@/components/authority/shell'
import { JsonLd } from '@/components/authority/structured-data'
import { readyArticles } from '@/content/authority/articles'
import { readyProjects } from '@/content/authority/projects'
import { getTopic, topics } from '@/content/authority/topics'
import { siteConfig } from '@/lib/site'

interface TopicPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }))
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) {
    return { title: 'Topic not found', robots: { index: false, follow: false } }
  }
  const canonical = `/topics/${topic.slug}`
  return {
    title: topic.metaTitle,
    description: topic.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: topic.metaTitle,
      description: topic.metaDescription,
      url: `${siteConfig.url}${canonical}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: topic.metaTitle,
      description: topic.metaDescription,
    },
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) notFound()

  const relatedProjects = readyProjects.filter((p) => p.topics.includes(topic.slug))
  const relatedArticles = readyArticles.filter((a) => a.topics.includes(topic.slug))

  if (relatedProjects.length + relatedArticles.length < 2) {
    // Editorial rule: a topic hub renders only with at least two ready items.
    notFound()
  }

  const canonical = `/topics/${topic.slug}`
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Topics', href: '/topics' },
    { label: topic.title, href: canonical },
  ]

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteConfig.url}${canonical}`,
    url: `${siteConfig.url}${canonical}`,
    name: topic.metaTitle,
    description: topic.metaDescription,
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    about: { '@id': `${siteConfig.url}/#person` },
    hasPart: [
      ...relatedProjects.map((project) => ({
        '@type': project.schemaType,
        name: project.title,
        url: `${siteConfig.url}/projects/${project.slug}`,
        description: project.summary,
      })),
      ...relatedArticles.map((article) => ({
        '@type': 'TechArticle',
        name: article.title,
        url: `${siteConfig.url}/writing/${article.slug}`,
        description: article.metaDescription,
      })),
    ],
  }

  return (
    <AuthorityShell>
      <JsonLd
        id={`topic-${topic.slug}`}
        data={[collectionSchema, breadcrumbsJsonLd({ items: breadcrumbs, siteUrl: siteConfig.url })]}
      />
      <Breadcrumbs items={breadcrumbs} />

      <header className={styles.indexIntro}>
        <h1 className={styles.indexTitle}>{topic.title}</h1>
        <p className={styles.indexDek}>{topic.definition}</p>
      </header>

      <AuthoritySection id="questions" title="What this hub connects">
        <ul className={styles.questionList}>
          {topic.questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </AuthoritySection>

      <AuthoritySection id="projects" title="Ready projects in this area">
        <div className={styles.crossLinks}>
          {relatedProjects.map((project) => (
            <CrossLinkCard
              key={project.slug}
              kind="Project"
              title={project.title}
              href={`/projects/${project.slug}`}
              summary={project.summary}
            />
          ))}
        </div>
      </AuthoritySection>

      {relatedArticles.length > 0 ? (
        <AuthoritySection id="writing" title="Essays in this area">
          <div className={styles.crossLinks}>
            {relatedArticles.map((article) => (
              <CrossLinkCard
                key={article.slug}
                kind="Article"
                title={article.title}
                href={`/writing/${article.slug}`}
                summary={article.dek}
              />
            ))}
          </div>
        </AuthoritySection>
      ) : null}

      {topic.reviewMentions && topic.reviewMentions.length > 0 ? (
        <AuthoritySection id="review" title="Also connected — pending publication">
          <ul className={styles.questionList}>
            {topic.reviewMentions.map((mention) => (
              <li key={mention} className={styles.topicReview}>
                {mention}
              </li>
            ))}
          </ul>
          <p className={styles.topicReview} style={{ marginTop: '1rem' }}>
            Draft routes for review items are not linked from public pages.
          </p>
        </AuthoritySection>
      ) : null}

      <AuthoritySection id="index" title="Other topic hubs">
        <div className={styles.crossLinks}>
          {topics
            .filter((t) => t.slug !== topic.slug)
            .map((other) => (
              <Link key={other.slug} className={styles.crossLink} href={`/topics/${other.slug}`}>
                <span className={styles.crossLinkTitle}>{other.title}</span>
                <span className={styles.crossLinkSummary}>{other.definition}</span>
              </Link>
            ))}
        </div>
      </AuthoritySection>
    </AuthorityShell>
  )
}
