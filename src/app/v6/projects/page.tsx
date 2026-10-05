import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/v2/json-ld'
import { collectionJsonLd, liveCrumbs } from '@/components/v2/schema'
import { HeatShot } from '@/components/v6/scenes/heat'
import { MapShot } from '@/components/v6/scenes/map'
import { SeeShot } from '@/components/v6/scenes/see'
import { ShipShot } from '@/components/v6/scenes/ship'
import { TraceShot } from '@/components/v6/scenes/trace'
import { TuneShot } from '@/components/v6/scenes/tune'
import { fields, works } from '@/content/v3/work'
import { V6, shotAlt, shots, workHref, type ShotId } from '@/content/v6/reel'

const copy = {
  title: 'Projects',
  description:
    'Every project Rami Kronbi has published, as a reel: six shots from the flight reel, then the full credits, sorted by what each piece of work is for.',
  lede: (n: number) =>
    `${n} projects. Six have a shot of their own in the reel; every one is in the credits below, with my part and the people I built it with.`,
  sheet: 'Contact sheet',
  credits: 'Full credits',
}

export const metadata: Metadata = {
  title: { absolute: 'Projects — Rami Kronbi (v6 preview)' },
  description: copy.description,
  alternates: { canonical: '/projects' },
  robots: { index: false, follow: false },
}

const SCENES: Record<
  ShotId,
  (p: { label: string; replay?: string }) => React.ReactNode
> = {
  see: SeeShot,
  map: MapShot,
  heat: HeatShot,
  tune: TuneShot,
  trace: TraceShot,
  ship: ShipShot,
}

export default function V6Projects() {
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
      <section
        className="v6-sec v6-index-head v6-wrap"
        data-sec-no="01"
        data-sec-label="Projects"
        aria-labelledby="projects-h"
      >
        <nav className="v6-crumbs v6-mono" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href={V6}>Flight reel</Link>
            </li>
            <li aria-current="page">{copy.title}</li>
          </ol>
        </nav>
        <h1 id="projects-h" className="v6-h2">
          {copy.title}
        </h1>
        <p className="v6-lede">{copy.lede(works.length)}</p>
      </section>

      <section
        className="v6-sec v6-wrap"
        data-sec-no="02"
        data-sec-label="Sheet"
        aria-labelledby="sheet-h"
      >
        <span className="v6-kicker v6-mono">02 · {copy.sheet}</span>
        <h2 id="sheet-h" className="v6-vh">
          {copy.sheet}
        </h2>
        <ol className="v6-sheet">
          {shots.map((s) => {
            const Scene = SCENES[s.id]
            return (
              <li key={s.id}>
                <Scene label={shotAlt[s.id]} replay="Replay" />
                <Link className="v6-sheet-cap" href={s.href}>
                  <span className="v6-mono">
                    {s.section.no} · {s.section.label}
                  </span>
                  <span className="v6-sheet-title">
                    {s.work.project.title} →
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      <section
        className="v6-sec v6-wrap"
        data-sec-no="03"
        data-sec-label="Credits"
        aria-labelledby="all-h"
      >
        <span className="v6-kicker v6-mono">03 · {copy.credits}</span>
        <h2 id="all-h" className="v6-vh">
          {copy.credits}
        </h2>
        {fields.map((f) => {
          const list = works.filter((w) => w.plain.field === f.id)
          if (!list.length) return null
          return (
            <div key={f.id} className="v6-field">
              <h3 className="v6-field-title">
                {f.label} <span className="v6-mono">{list.length}</span>
              </h3>
              <ul className="v6-credits v6-credits-flush">
                {list.map((w) => (
                  <li key={w.project.slug} className="v6-credit">
                    <span className="v6-credit-role v6-mono">
                      {w.plain.kind}
                    </span>
                    <div className="v6-credit-body">
                      <Link href={workHref(w.project.slug, V6)}>
                        <span className="v6-credit-name">
                          {w.project.title}
                        </span>
                      </Link>
                      <p className="v6-credit-line">{w.plain.line}</p>
                      <p className="v6-credit-part v6-mono">{w.plain.part}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </section>
    </>
  )
}
