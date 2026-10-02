import type { Metadata } from 'next'

import { Emph } from '@/components/v2/emph'
import { JsonLd } from '@/components/v2/json-ld'
import { Crumbs, recordStyles as styles } from '@/components/v2/record/blocks'
import { IndexList } from '@/components/v2/record/index-list'
import { collectionJsonLd, liveCrumbs, v2Meta } from '@/components/v2/schema'
import { readyArticles } from '@/content/authority'
import { v2Index, v2Record } from '@/content/v2/pages'
import {
  companionProject,
  filedTopics,
  liveTopics,
  noteHref,
  noteNumber,
  noteTitle,
  projectNumber,
  projectPlate,
  topicTitle,
} from '@/content/v2/record'

const copy = v2Index.writing

export const metadata: Metadata = v2Meta('/writing', copy.metaTitle, copy.metaDescription)

export default function V2Writing() {
  const crumbs = [
    { label: v2Record.crumbs.home, href: '/v2' },
    { label: v2Record.crumbs.writing, href: '/v2/writing' },
  ]

  const rows = readyArticles.map((a) => {
    const project = companionProject(a)
    const plate = project ? projectPlate(project) : a.heroMedia
    const filed = filedTopics(a.topics)
    return {
      id: a.slug,
      no: noteNumber(a.slug),
      title: noteTitle(a),
      summary: a.dek,
      meta: project
        ? `${projectNumber(project.slug)} · ${project.title}`
        : filed.map((t) => topicTitle(t).text).join(' · '),
      topics: filed,
      href: noteHref(a.slug),
      plate: plate ? { src: plate.src, alt: plate.alt } : undefined,
    }
  })

  const topics = liveTopics
    .map((t) => ({
      slug: t.slug,
      label: t.title,
      count: readyArticles.filter((a) => a.topics.includes(t.slug)).length,
    }))
    .filter((t) => t.count > 0)

  return (
    <>
      <JsonLd
        data={[
          collectionJsonLd({
            path: '/writing',
            name: 'Writing — Rami Kronbi',
            description: copy.metaDescription,
            articles: readyArticles,
          }),
          liveCrumbs(crumbs),
        ]}
      />
      <div className={styles.wrap}>
        <Crumbs items={crumbs} />
        <header className={styles.head}>
          <div className={styles.headMargin}>
            <span className={styles.entryNo}>
              {String(readyArticles.length).padStart(2, '0')} {copy.countLabel}
            </span>
          </div>
          <div className={styles.headMain}>
            <h1 className={styles.title}>
              <Emph {...copy.title} />
            </h1>
            <p className={styles.lede}>{copy.lede}</p>
          </div>
        </header>
        <div style={{ paddingBottom: 'clamp(4rem, 8vw, 7rem)' }}>
          <IndexList rows={rows} topics={topics} />
        </div>
      </div>
    </>
  )
}
