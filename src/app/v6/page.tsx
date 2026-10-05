import type { Metadata } from 'next'
import Link from 'next/link'

import { Hero } from '@/components/v6/hero'
import { Land } from '@/components/v6/land'
import { Path } from '@/components/v6/path'
import { Proof } from '@/components/v6/proof'
import { FlyShot } from '@/components/v6/scenes/fly'
import { GlideShot } from '@/components/v6/scenes/glide'
import { HeatShot } from '@/components/v6/scenes/heat'
import { MapShot } from '@/components/v6/scenes/map'
import { SeeShot } from '@/components/v6/scenes/see'
import { ShipShot } from '@/components/v6/scenes/ship'
import { TraceShot } from '@/components/v6/scenes/trace'
import { TuneShot } from '@/components/v6/scenes/tune'
import { Take } from '@/components/v6/take'
import {
  V6,
  creditWorks,
  sectionOf,
  shotAlt,
  shots,
  v6Copy,
  workHref,
  type ShotId,
} from '@/content/v6/reel'

export const metadata: Metadata = {
  title: { absolute: v6Copy.meta.title },
  description: v6Copy.meta.description,
  alternates: { canonical: '/' },
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

function Head({
  id,
  title,
  lede,
  center,
}: {
  id: Parameters<typeof sectionOf>[0]
  title: React.ReactNode
  lede?: string
  center?: boolean
}) {
  const s = sectionOf(id)
  return (
    <div
      className="v6-wrap"
      style={center ? { textAlign: 'center' } : undefined}
    >
      <span className="v6-kicker v6-mono">
        {s.no} · {s.label}
      </span>
      <h2 id={`${id}-h`} className="v6-h2">
        {title}
      </h2>
      {lede ? (
        <p
          className="v6-lede"
          style={center ? { marginInline: 'auto' } : undefined}
        >
          {lede}
        </p>
      ) : null}
    </div>
  )
}

export default function V6Home() {
  const c = v6Copy
  const replay = c.slate.replay
  return (
    <>
      <Hero />

      <section
        id="proof"
        className="v6-sec"
        data-sec-no="02"
        data-sec-label="Proof"
        aria-labelledby="proof-h"
      >
        <Head id="proof" title={c.proof.title} />
        <div className="v6-wrap">
          <Proof creds={c.proof.creds} />
        </div>
      </section>

      <section
        id="glide"
        className="v6-sec"
        data-sec-no="03"
        data-sec-label="Claim"
        aria-labelledby="glide-h"
      >
        <h2 id="glide-h" className="v6-vh">
          {c.glide.claim.flat().join(' ')}
        </h2>
        <GlideShot
          label={`${c.glide.claim.flat().join(' ')} A drone flies low over a contour field, then eight real frames from the work flash past.`}
          replay={replay}
        />
        <div className="v6-glide-lede">
          <p>{c.glide.lede}</p>
        </div>
      </section>

      {shots.map((entry) => {
        const Scene = SCENES[entry.id]
        return (
          <Take key={entry.id} entry={entry}>
            <Scene label={shotAlt[entry.id]} replay={replay} />
          </Take>
        )
      })}

      <section
        id="credits"
        className="v6-sec"
        data-sec-no="10"
        data-sec-label="Credits"
        aria-labelledby="credits-h"
      >
        <Head
          id="credits"
          title={c.credits.title}
          lede={c.credits.lede(creditWorks.length)}
          center
        />
        <ul className="v6-credits">
          {creditWorks.map((w) => (
            <li key={w.project.slug} className="v6-credit">
              <span className="v6-credit-role v6-mono">{w.plain.kind}</span>
              <div className="v6-credit-body">
                <Link href={workHref(w.project.slug, V6)}>
                  <h3 className="v6-credit-name">{w.project.title}</h3>
                </Link>
                <p className="v6-credit-line">{w.plain.line}</p>
                <p className="v6-credit-part v6-mono">{w.plain.part}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="v6-credits-all v6-mono">
          <Link className="v6-link is-primary" href={`${V6}/projects`}>
            {c.credits.all} →
          </Link>
        </div>
      </section>

      <section
        id="path"
        className="v6-sec"
        data-sec-no="11"
        data-sec-label="Path"
        aria-labelledby="path-h"
      >
        <Head id="path" title={c.path.title} lede={c.path.lede} />
        <div className="v6-wrap">
          <Path points={c.path.points} />
        </div>
      </section>

      <section
        id="fly"
        className="v6-sec"
        data-sec-no="12"
        data-sec-label="Fly"
        aria-labelledby="fly-h"
      >
        <h2 id="fly-h" className="v6-vh">
          {c.fly.words.join(', ')}. {c.fly.focus.join(', ')}.
        </h2>
        <FlyShot replay={replay} />
      </section>

      <section
        id="notes"
        className="v6-sec"
        data-sec-no="13"
        data-sec-label="Notes"
        aria-labelledby="notes-h"
      >
        <Head id="notes" title={c.notes.title} lede={c.notes.lede} />
        <div className="v6-wrap">
          <ol className="v6-notes">
            {c.notes.items.map((n, i) => (
              <li key={n.href}>
                <Link className="v6-note" href={n.href}>
                  <span className="v6-note-no v6-mono">
                    N{String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="v6-note-title">{n.title}</span>
                  <span className="v6-note-dek">{n.dek}</span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="v6-links v6-mono">
            <Link className="v6-link" href={c.notes.all.href}>
              {c.notes.all.label} →
            </Link>
          </p>
        </div>
      </section>

      <Land />
    </>
  )
}
