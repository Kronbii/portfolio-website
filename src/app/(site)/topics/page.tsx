import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/v2/json-ld'
import { collectionJsonLd, liveCrumbs } from '@/components/v2/schema'
import { BackButton } from '@/components/vneo/back'
import { pageMeta } from '@/components/vneo/meta'
import { HOME } from '@/content/vneo/site'
import {
  hubArticles,
  hubProjects,
  hubs,
  topicHref,
} from '@/content/vneo/topics'

const copy = {
  title: 'Topics',
  description:
    'Topic hubs connecting the projects and essays Rami Kronbi has published across computer vision, robotics, embedded control, applied AI, and civic technology.',
  lede: 'The fields the work sits in, each with the projects and the notes behind it.',
}

const count = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`

export const metadata: Metadata = pageMeta({
  path: '/topics',
  title: 'Topics — Rami Kronbi',
  description: copy.description,
})

export default function Topics() {
  return (
    <>
      <JsonLd
        data={[
          collectionJsonLd({
            path: '/topics',
            name: 'Topics — Rami Kronbi',
            description: copy.description,
            topics: hubs,
          }),
          liveCrumbs([
            { label: 'Home', href: '/' },
            { label: 'Topics', href: '/topics' },
          ]),
        ]}
      />
      <section className="v7-index vn-index">
        <div className="vn-backbar">
          <BackButton fallback={HOME} label="Back" />
          <nav className="v7-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href={HOME}>Home</Link>
              </li>
              <li aria-current="page">{copy.title}</li>
            </ol>
          </nav>
        </div>
        <h1 className="v7-index-title" data-lens="">
          {copy.title}
        </h1>
        <p className="v7-more-lede">{copy.lede}</p>
        <ul className="vn-notes-list">
          {hubs.map((t) => (
            <li key={t.slug}>
              <Link href={topicHref(t.slug)}>
                <b>{t.title}</b>
                <span>{t.definition}</span>
                <small className="vn-topic-count">
                  {count(hubProjects(t.slug).length, 'project', 'projects')} ·{' '}
                  {count(hubArticles(t.slug).length, 'note', 'notes')}
                </small>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
