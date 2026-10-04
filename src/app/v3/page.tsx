import type { Metadata } from 'next'

import { LightField } from '@/components/v2/home/light-field'
import { SignOff } from '@/components/v2/home/sign-off'
import { v2Meta } from '@/components/v2/schema'
import { BuildSentence, type BuildGroup } from '@/components/v3/home/build-sentence'
import { FlightLog } from '@/components/v3/home/flight-log'
import { Hero } from '@/components/v3/home/hero'
import { Notes } from '@/components/v3/home/notes'
import { ProofLedger } from '@/components/v3/home/proof-ledger'
import { WorkBento } from '@/components/v3/home/work-bento'
import { v3Home } from '@/content/v3/home'
import { workBySlug, workHref, works } from '@/content/v3/work'

export const metadata: Metadata = v2Meta('/', v3Home.meta.title, v3Home.meta.description)

export default function V3Home() {
  const { build, proof, work, log, notes } = v3Home

  const groups: BuildGroup[] = build.groups.map((g) => ({
    id: g.id,
    phrase: g.phrase,
    joiner: g.joiner,
    items: g.slugs
      .map((slug) => workBySlug(slug))
      .filter((w) => w !== undefined)
      .map(({ project, plain }) => ({
        slug: project.slug,
        title: project.title,
        kind: plain.kind,
        line: plain.line,
        href: workHref(project.slug),
        image: plain.image,
      })),
  }))

  return (
    <>
      <Hero />

      <BuildSentence title={build.title} lead={build.lead} groups={groups} hint={build.hint} />

      <ProofLedger title={proof.title} lede={proof.lede} rows={proof.rows} />

      <WorkBento title={work.title} lede={work.lede(works.length)} all={work.all} read={work.read} tiles={work.tiles} />

      <LightField copy={v3Home.lightField} />

      <FlightLog title={log.title} lede={log.lede} points={log.points} />

      <Notes title={notes.title} lede={notes.lede} all={notes.all} slugs={notes.slugs} />

      <div id="contact">
        <SignOff copy={v3Home.signOff} />
      </div>
    </>
  )
}
