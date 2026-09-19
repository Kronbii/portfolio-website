import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import styles from '@/components/authority/authority.module.css'
import { Breadcrumbs, breadcrumbsJsonLd } from '@/components/authority/breadcrumbs'
import {
  ArticleBodyContent,
  CrossLinkCard,
  MediaFigure,
  ReviewNotice,
  SourceList,
  TopicPills,
} from '@/components/authority/blocks'
import { AuthorityShell, AuthoritySection } from '@/components/authority/shell'
import { JsonLd } from '@/components/authority/structured-data'
import { articles, getArticle } from '@/content/authority/articles'
import { getProject } from '@/content/authority/projects'
import { getTopic } from '@/content/authority/topics'
import { siteConfig } from '@/lib/site'

interface WritingPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) {
    return { title: 'Article not found', robots: { index: false, follow: false } }
  }
  const canonical = `/writing/${article.slug}`
  const heroImage = article.heroMedia?.src

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical },
    robots:
      article.state === 'ready'
        ? undefined
        : { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `${siteConfig.url}${canonical}`,
      type: 'article',
      ...(heroImage ? { images: [{ url: heroImage, alt: article.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle,
      description: article.metaDescription,
      ...(heroImage ? { images: [heroImage] } : {}),
    },
    keywords: article.keywords,
  }
}

export default async function WritingArticlePage({ params }: WritingPageProps) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const project = article.projectSlug ? getProject(article.projectSlug) : undefined
  const canonical = `/writing/${article.slug}`
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Writing', href: '/writing' },
    { label: article.title, href: canonical },
  ]

  const articleSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${siteConfig.url}${canonical}#article`,
    headline: article.title,
    description: article.metaDescription,
    url: `${siteConfig.url}${canonical}`,
    inLanguage: 'en',
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    author: { '@id': `${siteConfig.url}/#person` },
    keywords: article.keywords.join(', '),
    about: article.topics.map((slug) => {
      const topic = getTopic(slug)
      return topic ? topic.title : slug
    }),
  }

  if (article.heroMedia) {
    articleSchema.image = `${siteConfig.url}${article.heroMedia.src}`
  }

  if (project) {
    articleSchema.mentions = {
      '@type': project.schemaType,
      name: project.title,
      url: `${siteConfig.url}/projects/${project.slug}`,
    }
  }

  return (
    <AuthorityShell>
      <JsonLd
        id={`article-${article.slug}`}
        data={[articleSchema, breadcrumbsJsonLd({ items: breadcrumbs, siteUrl: siteConfig.url })]}
      />
      <Breadcrumbs items={breadcrumbs} />
      {article.state === 'review' ? <ReviewNotice /> : null}

      <header className={styles.articleHeader}>
        <div className={styles.articleHeaderCopy}>
          <h1 className={styles.articleTitle}>{article.title}</h1>
          <p className={styles.articleDek}>{article.dek}</p>
          <TopicPills topics={article.topics} />
        </div>
        {article.heroMedia ? (
          <div className={styles.articleHeroMedia}>
            <MediaFigure media={article.heroMedia} priority sizes="(min-width: 960px) 45vw, 100vw" />
          </div>
        ) : null}
      </header>

      <ArticleBodyContent blocks={article.body} />

      <AuthoritySection id="evidence" title="Evidence and links">
        <SourceList sources={article.sources} />
      </AuthoritySection>

      <AuthoritySection id="related" title="Companion project and topics">
        <div className={styles.crossLinks}>
          {project && project.state === 'ready' ? (
            <CrossLinkCard
              kind="Project"
              title={project.title}
              href={`/projects/${project.slug}`}
              summary={project.summary}
            />
          ) : null}
          {article.topics.map((slug) => {
            const topic = getTopic(slug)
            if (!topic) return null
            return (
              <CrossLinkCard
                key={slug}
                kind="Topic"
                title={topic.title}
                href={`/topics/${slug}`}
                summary={topic.definition}
              />
            )
          })}
        </div>
      </AuthoritySection>
    </AuthorityShell>
  )
}
