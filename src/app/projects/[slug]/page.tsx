import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import styles from '@/components/authority/authority.module.css'
import { Breadcrumbs, breadcrumbsJsonLd } from '@/components/authority/breadcrumbs'
import {
  AnswerBlock,
  CrossLinkCard,
  LimitList,
  MeasurementGrid,
  MediaFigure,
  MediaGallery,
  ReviewNotice,
  SourceList,
  StageList,
  TopicPills,
} from '@/components/authority/blocks'
import { Diagram } from '@/components/authority/diagrams'
import { AuthorityShell, AuthoritySection } from '@/components/authority/shell'
import { JsonLd } from '@/components/authority/structured-data'
import { getArticle } from '@/content/authority/articles'
import { getProject, projects } from '@/content/authority/projects'
import { getTopic } from '@/content/authority/topics'
import { siteConfig } from '@/lib/site'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) {
    return { title: 'Project not found', robots: { index: false, follow: false } }
  }
  const canonical = `/projects/${project.slug}`
  const heroImage =
    project.hero.kind === 'image'
      ? project.hero.media.src
      : project.hero.kind === 'gallery'
        ? project.hero.items[0]?.src
        : undefined

  const openGraph = {
    title: project.metaTitle,
    description: project.metaDescription,
    url: `${siteConfig.url}${canonical}`,
    type: 'article' as const,
    ...(heroImage
      ? {
          images: [
            {
              url: heroImage,
              alt: project.title,
            },
          ],
        }
      : {}),
  }

  const twitter = {
    card: 'summary_large_image' as const,
    title: project.metaTitle,
    description: project.metaDescription,
    ...(heroImage ? { images: [heroImage] } : {}),
  }

  return {
    title: project.metaTitle,
    description: project.metaDescription,
    alternates: { canonical },
    robots:
      project.state === 'ready'
        ? undefined
        : { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph,
    twitter,
    keywords: project.keywords,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const article = getArticle(project.articleSlug)
  const canonical = `/projects/${project.slug}`
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: project.title, href: canonical },
  ]

  const heroImage =
    project.hero.kind === 'image'
      ? project.hero.media.src
      : project.hero.kind === 'gallery'
        ? project.hero.items[0]?.src
        : undefined

  const workSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': project.schemaType,
    '@id': `${siteConfig.url}${canonical}#work`,
    name: project.title,
    headline: project.title,
    description: project.metaDescription,
    url: `${siteConfig.url}${canonical}`,
    inLanguage: 'en',
    isPartOf: { '@id': `${siteConfig.url}/#website` },
    author: { '@id': `${siteConfig.url}/#person` },
    creator: { '@id': `${siteConfig.url}/#person` },
    keywords: project.keywords.join(', '),
    about: project.topics.map((slug) => {
      const topic = getTopic(slug)
      return topic ? topic.title : slug
    }),
  }

  if (project.schemaType === 'SoftwareSourceCode') {
    const repo = project.sources.find((s) => s.kind === 'repository')
    if (repo) {
      workSchema.codeRepository = repo.href
    }
    workSchema.programmingLanguage = project.keywords.filter((k) =>
      /python|typescript|flutter|c\+\+|arduino|react|fastapi/i.test(k),
    )
  }

  if (heroImage) {
    workSchema.image = `${siteConfig.url}${heroImage}`
  }

  const primarySource = project.sources.find((s) => s.kind === 'repository') ?? project.sources[0]

  return (
    <AuthorityShell>
      <JsonLd
        id={`project-${project.slug}`}
        data={[workSchema, breadcrumbsJsonLd({ items: breadcrumbs, siteUrl: siteConfig.url })]}
      />
      <Breadcrumbs items={breadcrumbs} />
      {project.state === 'review' ? <ReviewNotice /> : null}

      <header className={styles.projectHero}>
        <div>
          {project.hero.kind === 'image' ? (
            <MediaFigure media={project.hero.media} priority />
          ) : project.hero.kind === 'gallery' ? (
            <MediaGallery items={project.hero.items} />
          ) : (
            <Diagram id={project.hero.diagramId} caption={project.hero.caption} alt={project.hero.alt} />
          )}
        </div>
        <div className={styles.projectMeta}>
          <h1 className={styles.projectTitle}>{project.title}</h1>
          <p className={styles.projectSummary}>{project.summary}</p>
          <p className={styles.projectRole}>{project.role}</p>
          {primarySource ? (
            <a
              className={styles.sourceLink}
              href={primarySource.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {primarySource.label}
            </a>
          ) : null}
          <TopicPills topics={project.topics} />
        </div>
      </header>

      <AuthoritySection id="answer" title="What this project is">
        <AnswerBlock answer={project.answer} />
      </AuthoritySection>

      <AuthoritySection id="mechanism" title="How the system works">
        <StageList stages={project.stages} />
      </AuthoritySection>

      {project.measurements && project.measurements.length > 0 ? (
        <AuthoritySection id="measurements" title="What was actually measured">
          <MeasurementGrid measurements={project.measurements} />
        </AuthoritySection>
      ) : null}

      {project.media && project.media.length > 0 ? (
        <AuthoritySection id="media" title="Real project media">
          <MediaGallery items={project.media} />
        </AuthoritySection>
      ) : null}

      <AuthoritySection id="limits" title="What this project does not do">
        <LimitList limits={project.limits} />
      </AuthoritySection>

      <AuthoritySection id="evidence" title="Evidence and links">
        <SourceList sources={project.sources} />
      </AuthoritySection>

      <AuthoritySection id="related" title="Companion article and related topics">
        <div className={styles.crossLinks}>
          {article && article.state === 'ready' ? (
            <CrossLinkCard
              kind="Article"
              title={article.title}
              href={`/writing/${article.slug}`}
              summary={article.dek}
            />
          ) : null}
          {project.topics.map((slug) => {
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
