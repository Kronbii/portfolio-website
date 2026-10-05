import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/v2/json-ld'
import { collectionJsonLd, liveCrumbs } from '@/components/v2/schema'
import { BackButton } from '@/components/vneo/back'
import { readyArticles } from '@/content/authority'
import { VN, writingHref } from '@/content/vneo/site'

const copy = {
  title: 'Writing',
  description:
    'Notes by Rami Kronbi on how the work was done: the decisions, the failures, and what was measured, from race cars and drones to civic and health software.',
  lede: 'How the work was done: the decisions, the failures, and what was measured.',
}

export const metadata: Metadata = {
  title: { absolute: 'Writing — Rami Kronbi' },
  description: copy.description,
  alternates: { canonical: '/writing' },
  robots: { index: false, follow: false },
}

export default function VneoWriting() {
  return (
    <>
      <JsonLd
        data={[
          collectionJsonLd({
            path: '/writing',
            name: 'Writing',
            description: copy.description,
            articles: readyArticles,
          }),
          liveCrumbs([
            { label: 'Home', href: '/' },
            { label: 'Writing', href: '/writing' },
          ]),
        ]}
      />
      <section className="v7-index vn-index">
        <div className="vn-backbar">
          <BackButton fallback={VN} label="Back" />
          <nav className="v7-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href={VN}>Home</Link>
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
          {readyArticles.map((a) => (
            <li key={a.slug}>
              <Link href={writingHref(a.slug)}>
                <b>{a.title}</b>
                <span>{a.dek}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
