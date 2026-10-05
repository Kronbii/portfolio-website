import type { Metadata } from 'next'

import { LightField } from '@/components/v2/home/light-field'
import { SignOff } from '@/components/v2/home/sign-off'
import { v2Meta } from '@/components/v2/schema'
import { FlightLog } from '@/components/v3/home/flight-log'
import { Notes } from '@/components/v3/home/notes'
import { Hero } from '@/components/v4/home/hero'
import { LoopScene } from '@/components/v4/home/loop-scene'
import { Numbers } from '@/components/v4/home/numbers'
import { SceneMark } from '@/components/v4/home/scene-mark'
import { Timeline } from '@/components/v4/shell/timeline'
import { WorkReel, type WorkEntry } from '@/components/v4/work/work-reel'
import { workBySlug, workHref, works } from '@/content/v3/work'
import { V4, v4Chrome, v4Home } from '@/content/v4/home'

export const metadata: Metadata = v2Meta('/', v4Home.meta.title, v4Home.meta.description)

export default function V4Home() {
  const { work, log, notes } = v4Home
  const entries: WorkEntry[] = work.items.flatMap((item) => {
    const w = workBySlug(item.slug)
    if (!w) return []
    return [
      {
        slug: item.slug,
        title: w.project.title,
        kind: w.plain.kind,
        line: w.plain.line,
        shows: item.shows,
        proof: w.plain.proof,
        part: w.plain.part,
        href: workHref(item.slug, V4),
      },
    ]
  })

  return (
    <>
      <Hero />
      <LoopScene />
      <Numbers />
      <WorkReel slate={work.slate} title={work.title} lede={work.lede(works.length)} all={work.all} read={work.read} entries={entries} />

      <div id="trackers">
        <SceneMark scene={5} label="Trackers" />
        <LightField copy={v4Home.lightField} />
      </div>

      <SceneMark scene={6} label={log.title} />
      <FlightLog title={log.title} lede={log.lede} points={log.points} />

      <SceneMark scene={7} label={notes.title} />
      <Notes title={notes.title} lede={notes.lede} all={notes.all} slugs={notes.slugs} />

      <div id="contact">
        <SceneMark scene={8} label="Contact" />
        <SignOff copy={v4Home.signOff} />
      </div>

      <Timeline chapters={v4Home.chapters} label={v4Chrome.timeline} />
    </>
  )
}
