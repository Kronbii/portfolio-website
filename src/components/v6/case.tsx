import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/v2/json-ld'
import { liveCrumbs, projectJsonLd } from '@/components/v2/schema'
import { projectImages, sourceKindLabel } from '@/content/v2/record'
import { workBySlug, works } from '@/content/v3/work'
import {
  V6,
  noteOf,
  primarySource,
  shotAlt,
  shotOfSlug,
  workHref,
  type ShotId,
} from '@/content/v6/reel'

import { CardShot } from './scenes/card'
import { HeatShot } from './scenes/heat'
import { MapShot } from './scenes/map'
import { SeeShot } from './scenes/see'
import { ShipShot } from './scenes/ship'
import { TraceShot } from './scenes/trace'
import { TuneShot } from './scenes/tune'

/*
 * A project as a take: its shot first (the reel's own scene where there is
 * one, a title card cut the same way where there is not), then the record,
 * told for reading: the short answer, the steps, the results, the media,
 * the limits, and the evidence, always visible.
 */

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

export const v6Case = {
  crumbs: { home: 'Flight reel', projects: 'Projects' },
  short: 'The short version',
  what: 'What it is',
  why: 'Why it matters',
  how: 'How it works',
  role: 'My part',
  steps: 'Step by step',
  results: 'Results',
  media: 'From the project',
  limits: 'Known limits',
  evidence: 'Evidence and links',
  note: 'Read the write-up',
  next: 'Next take',
  replay: 'Replay shot',
}

/** Imagen's photographs belong to its client; the plate stays a diagram. */
const PRIVATE_MEDIA = new Set(['imagen-raw-to-edit-dataset-pipeline'])

export function Case({ slug }: { slug: string }) {
  const w = workBySlug(slug)
  if (!w) notFound()
  const { project: p, plain } = w
  const at = works.findIndex((x) => x.project.slug === slug)
  const next = works[(at + 1) % works.length]
  const shot = shotOfSlug(slug)
  const note = noteOf(w)
  const src = primarySource(w)
  const images = PRIVATE_MEDIA.has(slug) ? [] : projectImages(p)
  const plate = PRIVATE_MEDIA.has(slug) ? undefined : (plain.image ?? images[0])
  const no = `P.${String(at + 1).padStart(2, '0')}`
  const c = v6Case
  const Scene = shot ? SCENES[shot] : null
  const sections: { id: string; label: string }[] = [
    { id: 'take', label: 'Take' },
    { id: 'short', label: 'Short' },
    { id: 'steps', label: 'Steps' },
    ...(p.measurements?.length ? [{ id: 'results', label: 'Results' }] : []),
    ...(images.length ? [{ id: 'media', label: 'Media' }] : []),
    ...(p.limits.length ? [{ id: 'limits', label: 'Limits' }] : []),
    { id: 'evidence', label: 'Evidence' },
  ]
  const sec = (id: string) => {
    const i = sections.findIndex((s) => s.id === id)
    return {
      'data-sec-no': String(i + 1).padStart(2, '0'),
      'data-sec-label': sections[i].label,
    }
  }

  return (
    <>
      <JsonLd
        data={[
          projectJsonLd(p),
          liveCrumbs([
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: p.title, href: `/projects/${p.slug}` },
          ]),
        ]}
      />
      <article className="v6-case">
        <section
          id="take"
          className="v6-case-take"
          {...sec('take')}
          aria-labelledby="case-h"
        >
          <nav className="v6-crumbs v6-mono" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href={V6}>{c.crumbs.home}</Link>
              </li>
              <li>
                <Link href={`${V6}/projects`}>{c.crumbs.projects}</Link>
              </li>
              <li aria-current="page">{p.title}</li>
            </ol>
          </nav>
          {Scene ? (
            <Scene label={shotAlt[shot!]} replay={c.replay} />
          ) : (
            <CardShot
              label={`${p.title}: ${plain.line}`}
              no={no}
              kind={plain.kind}
              title={p.title}
              proof={plain.proof}
              part={plain.part}
              stages={p.stages.map((s) => s.title)}
              image={
                plate
                  ? { src: plate.src, position: plain.image?.position }
                  : undefined
              }
              replay={c.replay}
            />
          )}
          <header className="v6-slate v6-case-head">
            <div>
              <span className="v6-kicker v6-mono">
                {no} · {plain.kind}
              </span>
              <h1 id="case-h" className="v6-case-title">
                {p.title}
              </h1>
              <p className="v6-slate-line">{plain.line}</p>
            </div>
            <div>
              <dl className="v6-facts">
                <div>
                  <dt className="v6-mono">Proof</dt>
                  <dd>{plain.proof}</dd>
                </div>
                <div>
                  <dt className="v6-mono">{c.role}</dt>
                  <dd>{plain.part}</dd>
                </div>
              </dl>
              <p className="v6-links v6-mono">
                {src ? (
                  <a
                    className="v6-link is-primary"
                    href={src.href}
                    rel="noopener"
                    target="_blank"
                  >
                    {src.label} ↗
                  </a>
                ) : null}
                {note ? (
                  <Link className="v6-link" href={note.href}>
                    {c.note} →
                  </Link>
                ) : null}
              </p>
            </div>
          </header>
        </section>

        <section
          id="short"
          className="v6-sec v6-wrap"
          {...sec('short')}
          aria-labelledby="short-h"
        >
          <span className="v6-kicker v6-mono">
            {sec('short')['data-sec-no']} · {c.short}
          </span>
          <h2 id="short-h" className="v6-h3">
            {p.summary}
          </h2>
          <dl className="v6-answer">
            {(
              [
                [c.what, p.answer.what],
                [c.why, p.answer.problem],
                [c.how, p.answer.how],
                [c.role, p.answer.role],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt className="v6-mono">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          id="steps"
          className="v6-sec v6-wrap"
          {...sec('steps')}
          aria-labelledby="steps-h"
        >
          <span className="v6-kicker v6-mono">
            {sec('steps')['data-sec-no']} · {c.steps}
          </span>
          <h2 id="steps-h" className="v6-vh">
            {c.steps}
          </h2>
          <ol className="v6-steps">
            {p.stages.map((s) => (
              <li key={s.step}>
                <span className="v6-step-no v6-mono">{s.step}</span>
                <h3 className="v6-step-title">{s.title}</h3>
                <p className="v6-step-detail">{s.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        {p.measurements?.length ? (
          <section
            id="results"
            className="v6-sec v6-wrap"
            {...sec('results')}
            aria-labelledby="results-h"
          >
            <span className="v6-kicker v6-mono">
              {sec('results')['data-sec-no']} · {c.results}
            </span>
            <h2 id="results-h" className="v6-vh">
              {c.results}
            </h2>
            <dl className="v6-results">
              {p.measurements.map((m) => (
                <div key={m.label}>
                  <dd className="v6-result-value">{m.value}</dd>
                  <dt className="v6-result-label">{m.label}</dt>
                  {m.context ? (
                    <dd className="v6-result-context">{m.context}</dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {images.length ? (
          <section
            id="media"
            className="v6-sec v6-wrap"
            {...sec('media')}
            aria-labelledby="media-h"
          >
            <span className="v6-kicker v6-mono">
              {sec('media')['data-sec-no']} · {c.media}
            </span>
            <h2 id="media-h" className="v6-vh">
              {c.media}
            </h2>
            <div className="v6-media">
              {images.slice(0, 6).map((m, i) => (
                <figure key={m.src} className={i === 0 ? 'is-lead' : undefined}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.src} alt={m.alt} loading="lazy" />
                  {m.caption ? (
                    <figcaption className="v6-mono">{m.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {p.limits.length ? (
          <section
            id="limits"
            className="v6-sec v6-wrap"
            {...sec('limits')}
            aria-labelledby="limits-h"
          >
            <span className="v6-kicker v6-mono">
              {sec('limits')['data-sec-no']} · {c.limits}
            </span>
            <h2 id="limits-h" className="v6-vh">
              {c.limits}
            </h2>
            <ul className="v6-limits">
              {p.limits.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section
          id="evidence"
          className="v6-sec v6-wrap"
          {...sec('evidence')}
          aria-labelledby="evidence-h"
        >
          <span className="v6-kicker v6-mono">
            {sec('evidence')['data-sec-no']} · Evidence
          </span>
          <h2 id="evidence-h" className="v6-h3">
            {c.evidence}
          </h2>
          <ul className="v6-sources">
            {p.sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} rel="noopener" target="_blank">
                  <span className="v6-source-kind v6-mono">
                    {sourceKindLabel[s.kind]}
                  </span>
                  <span className="v6-source-label">{s.label} ↗</span>
                  {s.note ? (
                    <span className="v6-source-note">{s.note}</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <nav className="v6-next v6-wrap" aria-label={c.next}>
          <Link href={workHref(next.project.slug, V6)}>
            <span className="v6-kicker v6-mono">
              {c.next} · {next.plain.kind}
            </span>
            <span className="v6-next-title">{next.project.title} →</span>
          </Link>
        </nav>
      </article>
    </>
  )
}
