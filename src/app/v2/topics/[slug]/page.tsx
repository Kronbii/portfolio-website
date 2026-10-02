import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Emph } from '@/components/v2/emph'
import { JsonLd } from '@/components/v2/json-ld'
import { Crumbs, Section, recordStyles as styles } from '@/components/v2/record/blocks'
import { IndexList } from '@/components/v2/record/index-list'
import { collectionJsonLd, liveCrumbs, v2Meta } from '@/components/v2/schema'
import { getTopic, readyArticles, readyProjects } from '@/content/authority'
import { v2Index, v2Record, v2Topic } from '@/content/v2/pages'
import {
  companionProject,
  filedTopics,
  liveTopics,
  noteHref,
  noteNumber,
  noteTitle,
  projectHref,
  projectNumber,
  projectPlate,
  projectTitle,
  topicHref,
  topicTitle,
} from '@/content/v2/record'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return liveTopics.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic) return { title: 'Not found', robots: { index: false, follow: false } }
  return v2Meta(`/topics/${topic.slug}`, `${topic.metaTitle} (v2 preview)`, topic.metaDescription)
}

export default async function V2Topic({ params }: Props) {
  const { slug } = await params
  const topic = getTopic(slug)
  if (!topic || !liveTopics.some((t) => t.slug === slug)) notFound()

  const projects = readyProjects.filter((p) => p.topics.includes(topic.slug))
  const notes = readyArticles.filter((a) => a.topics.includes(topic.slug))
  const crumbs = [
    { label: v2Record.crumbs.home, href: '/v2' },
    { label: v2Record.crumbs.topics, href: '/v2/topics' },
    { label: topic.title, href: topicHref(topic.slug) },
  ]
  const others = (slugs: string[]) =>
    filedTopics(slugs)
      .filter((s) => s !== topic.slug)
      .map((s) => topicTitle(s).text)
      .join(' · ')

  const projectRows = projects.map((p) => {
    const plate = projectPlate(p)
    return {
      id: p.slug,
      no: projectNumber(p.slug),
      title: projectTitle(p),
      summary: p.summary,
      meta: others(p.topics),
      topics: p.topics,
      href: projectHref(p.slug),
      plate: plate ? { src: plate.src, alt: plate.alt } : undefined,
    }
  })
  const noteRows = notes.map((a) => {
    const project = companionProject(a)
    const plate = project ? projectPlate(project) : a.heroMedia
    return {
      id: a.slug,
      no: noteNumber(a.slug),
      title: noteTitle(a),
      summary: a.dek,
      meta: project ? `${projectNumber(project.slug)} · ${project.title}` : others(a.topics),
      topics: a.topics,
      href: noteHref(a.slug),
      plate: plate ? { src: plate.src, alt: plate.alt } : undefined,
    }
  })

  return (
    <>
      <JsonLd
        data={[
          collectionJsonLd({
            path: `/topics/${topic.slug}`,
            name: topic.metaTitle,
            description: topic.metaDescription,
            projects,
            articles: notes,
          }),
          liveCrumbs(crumbs),
        ]}
      />
      <div className={styles.wrap}>
        <Crumbs items={crumbs} />
        <header className={styles.head}>
          <div className={styles.headMargin}>
            <span className={styles.entryNo}>{v2Index.topics.counts(projects.length, notes.length)}</span>
          </div>
          <div className={styles.headMain}>
            <h1 className={styles.title}>
              <Emph {...topicTitle(topic.slug)} />
            </h1>
            <p className={styles.lede}>{topic.definition}</p>
          </div>
        </header>
      </div>

      <Section id="questions" title={v2Topic.questions.heading}>
        <ol className={styles.rows}>
          {topic.questions.map((q, k) => (
            <li key={q} className={`${styles.row} ${styles.qRow}`}>
              <span className={styles.rowKind}>
                {v2Topic.questionLabel}
                {String(k + 1).padStart(2, '0')}
              </span>
              <span className={styles.rowTitle}>{q}</span>
            </li>
          ))}
        </ol>
      </Section>

      {projectRows.length > 0 ? (
        <Section id="projects" title={v2Topic.projects.heading}>
          <IndexList rows={projectRows} topics={[]} />
        </Section>
      ) : null}

      {noteRows.length > 0 ? (
        <Section id="notes" title={v2Topic.notes.heading}>
          <IndexList rows={noteRows} topics={[]} />
        </Section>
      ) : null}
    </>
  )
}
