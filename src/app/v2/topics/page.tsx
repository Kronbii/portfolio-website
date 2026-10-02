import type { Metadata } from 'next'

import { Emph } from '@/components/v2/emph'
import { TopicTray } from '@/components/v2/home/topic-tray'
import { JsonLd } from '@/components/v2/json-ld'
import { CrossRefs, Crumbs, Section, recordStyles as styles } from '@/components/v2/record/blocks'
import { collectionJsonLd, liveCrumbs, v2Meta } from '@/components/v2/schema'
import { v2Home } from '@/content/v2/home'
import { v2Index, v2Record } from '@/content/v2/pages'
import { liveTopics, topicCounts, topicHref, topicTitle } from '@/content/v2/record'

const copy = v2Index.topics

export const metadata: Metadata = v2Meta('/topics', copy.metaTitle, copy.metaDescription)

export default function V2Topics() {
  const crumbs = [
    { label: v2Record.crumbs.home, href: '/v2' },
    { label: v2Record.crumbs.topics, href: '/v2/topics' },
  ]

  const tray = liveTopics.map((t) => {
    const c = topicCounts(t.slug)
    return { slug: t.slug, label: t.title, count: c.projects + c.notes, href: topicHref(t.slug) }
  })

  const rows = liveTopics.map((t) => {
    const c = topicCounts(t.slug)
    return {
      kind: v2Record.related.topicKind,
      title: topicTitle(t.slug),
      href: topicHref(t.slug),
      note: t.definition,
      end: copy.counts(c.projects, c.notes),
    }
  })

  return (
    <>
      <JsonLd
        data={[
          collectionJsonLd({
            path: '/topics',
            name: 'Topics — Rami Kronbi',
            description: copy.metaDescription,
            topics: liveTopics,
          }),
          liveCrumbs(crumbs),
        ]}
      />
      <div className={styles.wrap}>
        <Crumbs items={crumbs} />
        <header className={styles.head}>
          <div className={styles.headMargin}>
            <span className={styles.entryNo}>{String(liveTopics.length).padStart(2, '0')} methods</span>
          </div>
          <div className={styles.headMain}>
            <h1 className={styles.title}>
              <Emph {...copy.title} />
            </h1>
            <p className={styles.lede}>{copy.lede}</p>
          </div>
        </header>
        <div style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <TopicTray topics={tray} states={v2Home.methods.states} dropLabel={v2Home.methods.dropAction} size="large" />
        </div>
      </div>

      <Section id="all" title={copy.listHeading}>
        <CrossRefs items={rows} />
      </Section>
    </>
  )
}
