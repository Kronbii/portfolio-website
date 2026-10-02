import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Emph } from '@/components/v2/emph'
import { JsonLd } from '@/components/v2/json-ld'
import articleStyles from '@/components/v2/record/article.module.css'
import {
  Continue,
  CrossRefs,
  Crumbs,
  EvidenceRows,
  ReviewNotice,
  Section,
  TopicTags,
  recordStyles as styles,
} from '@/components/v2/record/blocks'
import { MarginToc } from '@/components/v2/record/margin-toc'
import { Plate } from '@/components/v2/record/plate'
import { articleJsonLd, liveCrumbs, v2Meta } from '@/components/v2/schema'
import { SheetLink } from '@/components/v2/sheet-link'
import { getArticle, getTopic, readyArticles } from '@/content/authority'
import { isRenderable } from '@/content/authority/visibility'
import { v2Article, v2Record } from '@/content/v2/pages'
import {
  companionProject,
  filedTopics,
  heroFrame,
  noteHref,
  noteNumber,
  noteTitle,
  projectHref,
  projectNumber,
  projectTitle,
  renderableArticles,
  topicHref,
  topicTitle,
} from '@/content/v2/record'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return renderableArticles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article || !isRenderable(article.state)) return { title: 'Not found', robots: { index: false, follow: false } }
  return v2Meta(`/writing/${article.slug}`, `${article.metaTitle} (v2 preview)`, article.metaDescription)
}

const anchor = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export default async function V2Article({ params }: Props) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article || !isRenderable(article.state)) notFound()

  const project = companionProject(article)
  const crumbs = [
    { label: v2Record.crumbs.home, href: '/v2' },
    { label: v2Record.crumbs.writing, href: '/v2/writing' },
    { label: article.title, href: noteHref(article.slug) },
  ]
  const no = noteNumber(article.slug)
  const long = article.title.length > 44

  const seen = new Map<string, number>()
  const blocks = article.body.map((b) => {
    if (b.kind === 'p') return { ...b, id: undefined }
    const base = anchor(b.text) || 'section'
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return { ...b, id: count ? `${base}-${count + 1}` : base }
  })
  const level = blocks.some((b) => b.kind === 'h2') ? 'h2' : 'h3'
  const toc = blocks.filter((b) => b.kind === level).map((b) => ({ id: b.id!, text: b.text }))

  const i = readyArticles.findIndex((a) => a.slug === article.slug)
  const prev = i > 0 ? readyArticles[i - 1] : undefined
  const next = i >= 0 && i < readyArticles.length - 1 ? readyArticles[i + 1] : undefined

  const refs = [
    ...(project
      ? [
          {
            kind: v2Record.related.projectKind,
            title: projectTitle(project),
            href: projectHref(project.slug),
            note: project.summary,
            end: projectNumber(project.slug),
          },
        ]
      : []),
    ...filedTopics(article.topics).map((t) => ({
      kind: v2Record.related.topicKind,
      title: topicTitle(t),
      href: topicHref(t),
      note: getTopic(t)?.definition,
    })),
  ]

  return (
    <article>
      <JsonLd data={[articleJsonLd(article), liveCrumbs(crumbs)]} />

      <div className={styles.wrap}>
        <Crumbs items={crumbs} />
        {article.state === 'review' ? <ReviewNotice /> : null}

        <header className={styles.head}>
          <div className={styles.headMargin}>
            <span className={styles.entryNo} data-hung="">
              {no}
            </span>
            <TopicTags slugs={article.topics} />
          </div>
          <div className={styles.headMain}>
            <div className={styles.titleRow}>
              <span className={styles.noInline}>{no}</span>
              <h1 className={`${styles.title} ${long ? styles.titleLong : ''}`}>
              <Emph {...noteTitle(article)} />
            </h1>
            </div>
            <p className={styles.lede}>{article.dek}</p>
            <div className={styles.actions}>
              {project ? (
                <SheetLink className={`${styles.pill} ${styles.pillPrimary}`} href={projectHref(project.slug)}>
                  {projectNumber(project.slug)} · {project.title}
                  <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                </SheetLink>
              ) : null}
              <a className={styles.pill} href="#evidence">
                {v2Article.margin.evidence}
              </a>
            </div>
          </div>
        </header>

        {article.heroMedia ? (
          <div className={articleStyles.hero}>
            <Plate
              media={article.heroMedia}
              label={`${v2Record.figureLabel} ${no.replace(/^\D+\s*/, '')}.1`}
              priority
              sizes="100vw"
              {...heroFrame(article.heroMedia.src)}
            />
          </div>
        ) : null}

        <div className={articleStyles.layout}>
          <aside className={articleStyles.margin}>
            <div className={articleStyles.meta}>
              <span className={articleStyles.metaLabel}>{v2Article.evidenceSummary}</span>
              <p className={articleStyles.metaText}>{article.evidence}</p>
            </div>
            {project ? (
              <div className={articleStyles.meta}>
                <span className={articleStyles.metaLabel}>{v2Article.margin.project}</span>
                <SheetLink className={articleStyles.metaLink} href={projectHref(project.slug)}>
                  {project.title}
                </SheetLink>
              </div>
            ) : null}
            <MarginToc label={v2Article.margin.contents} items={toc} />
          </aside>

          <div className={articleStyles.body}>
            {blocks.map((b, k) =>
              b.kind === 'p' ? (
                <p key={k}>{b.text}</p>
              ) : b.kind === 'h2' ? (
                <h2 key={k} id={b.id}>
                  {b.text}
                </h2>
              ) : (
                <h3 key={k} id={b.id}>
                  {b.text}
                </h3>
              ),
            )}
          </div>
        </div>
      </div>

      <Section id="evidence" title={v2Record.evidence.heading} note={v2Record.evidence.note}>
        <EvidenceRows sources={article.sources} />
      </Section>

      {refs.length > 0 ? (
        <Section id="related" title={v2Article.related.heading} note={v2Article.related.note}>
          <CrossRefs items={refs} />
        </Section>
      ) : null}

      <div className={styles.wrap} style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <Continue
          prev={prev ? { label: `${v2Record.continue.prevNote} · ${noteNumber(prev.slug)}`, title: noteTitle(prev), href: noteHref(prev.slug) } : undefined}
          next={next ? { label: `${v2Record.continue.nextNote} · ${noteNumber(next.slug)}`, title: noteTitle(next), href: noteHref(next.slug) } : undefined}
        />
      </div>
    </article>
  )
}
