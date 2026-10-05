import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/v2/json-ld'
import { collectionJsonLd, liveCrumbs } from '@/components/v2/schema'
import { V7, chapters, groups, works } from '@/content/v7/home'

const copy = {
  title: 'Projects',
  description:
    'Every project Rami Kronbi has published, by who it serves: voters, families in a crisis, clinics, people who sign, students, learners, and engineers.',
  lede: (n: number) =>
    `${n} projects, by who they serve. Each one in a sentence; the whole story is a click away.`,
  first: 'Told on the home page',
}

export const metadata: Metadata = {
  title: { absolute: 'Projects — Rami Kronbi (v7 preview)' },
  description: copy.description,
  alternates: { canonical: '/projects' },
  robots: { index: false, follow: false },
}

export default function V7Projects() {
  return (
    <>
      <JsonLd
        data={[
          collectionJsonLd({
            path: '/projects',
            name: 'Projects',
            description: copy.description,
            projects: works.map((w) => w.project),
          }),
          liveCrumbs([
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
          ]),
        ]}
      />
      <section className="v7-index">
        <nav className="v7-crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href={V7}>Home</Link>
            </li>
            <li aria-current="page">{copy.title}</li>
          </ol>
        </nav>
        <h1 className="v7-index-title" data-lens="">
          {copy.title}
        </h1>
        <p className="v7-more-lede">{copy.lede(works.length)}</p>

        <div className="v7-groups">
          <div className="v7-group">
            <h2 className="v7-group-h">{copy.first}</h2>
            <ul>
              {chapters.map((c) => (
                <li key={c.id}>
                  <Link href={c.link.href}>
                    <b>{c.name}</b>
                    <span>
                      {c.label}: {c.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {groups.map((g) => (
            <div key={g.label} className="v7-group">
              <h2 className="v7-group-h">{g.label}</h2>
              <ul>
                {g.items.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href}>
                      <b>{it.title}</b>
                      <span>{it.line}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
