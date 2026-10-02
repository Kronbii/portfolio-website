import type { Metadata } from 'next'

import { Emph } from '@/components/v2/emph'
import { JsonLd } from '@/components/v2/json-ld'
import { Crumbs, recordStyles as styles } from '@/components/v2/record/blocks'
import { IndexList } from '@/components/v2/record/index-list'
import { collectionJsonLd, liveCrumbs, v2Meta } from '@/components/v2/schema'
import { readyProjects } from '@/content/authority'
import { v2Index, v2Record } from '@/content/v2/pages'
import {
  filedTopics,
  liveTopics,
  projectHref,
  projectNumber,
  projectPlate,
  projectTitle,
  topicTitle,
} from '@/content/v2/record'

const copy = v2Index.projects

export const metadata: Metadata = v2Meta('/projects', copy.metaTitle, copy.metaDescription)

export default function V2Projects() {
  const crumbs = [
    { label: v2Record.crumbs.home, href: '/v2' },
    { label: v2Record.crumbs.projects, href: '/v2/projects' },
  ]

  const rows = readyProjects.map((p) => {
    const plate = projectPlate(p)
    const filed = filedTopics(p.topics)
    return {
      id: p.slug,
      no: projectNumber(p.slug),
      title: projectTitle(p),
      summary: p.summary,
      meta: filed.map((t) => topicTitle(t).text).join(' · '),
      topics: filed,
      href: projectHref(p.slug),
      plate: plate ? { src: plate.src, alt: plate.alt } : undefined,
    }
  })

  const topics = liveTopics
    .map((t) => ({
      slug: t.slug,
      label: t.title,
      count: readyProjects.filter((p) => p.topics.includes(t.slug)).length,
    }))
    .filter((t) => t.count > 0)

  return (
    <>
      <JsonLd
        data={[
          collectionJsonLd({
            path: '/projects',
            name: 'Projects — Rami Kronbi',
            description: copy.metaDescription,
            projects: readyProjects,
          }),
          liveCrumbs(crumbs),
        ]}
      />
      <div className={styles.wrap}>
        <Crumbs items={crumbs} />
        <header className={styles.head}>
          <div className={styles.headMargin}>
            <span className={styles.entryNo}>
              {String(readyProjects.length).padStart(2, '0')} {copy.countLabel}
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
