import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/v2/json-ld'
import { liveCrumbs, projectJsonLd } from '@/components/v2/schema'
import { projectImages, sourceKindLabel } from '@/content/v2/record'
import { noteHref, workBySlug, works } from '@/content/v3/work'
import { getArticle } from '@/content/authority'
import { V7, chapterOf, v7Copy, workHref } from '@/content/v7/home'

import { SceneFor } from './chapter'
import { Plate } from './plate'

/*
 * A project, told the same calm way: who it is for and what it does first,
 * its scene (or its photograph coming into focus), then the short answer,
 * the steps, the results, the limits, and the evidence, always visible.
 */

export const v7Case = {
  home: 'Home',
  projects: 'Projects',
  short: 'In short',
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
  next: 'Next project',
}

/** Imagen's photographs belong to its client; that page shows no media. */
const PRIVATE_MEDIA = new Set(['imagen-raw-to-edit-dataset-pipeline'])

export function Case({ slug }: { slug: string }) {
  const w = workBySlug(slug)
  if (!w) notFound()
  const { project: p, plain } = w
  const c = v7Case
  const chapter = chapterOf(slug)
  const at = works.findIndex((x) => x.project.slug === slug)
  const next = works[(at + 1) % works.length]
  const images = PRIVATE_MEDIA.has(slug) ? [] : projectImages(p)
  const lead = PRIVATE_MEDIA.has(slug) ? undefined : (plain.image ?? images[0])
  const article = getArticle(p.articleSlug)
  const note =
    article && article.state === 'ready' ? noteHref(article.slug) : undefined
  const src =
    p.sources.find((s) => s.kind === 'demo') ??
    p.sources.find((s) => s.kind === 'repository') ??
    p.sources[0]

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
      <article className="v7-case">
        <nav className="v7-crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href={V7}>{c.home}</Link>
            </li>
            <li>
              <Link href={`${V7}/projects`}>{c.projects}</Link>
            </li>
            <li aria-current="page">{p.title.split(' — ')[0]}</li>
          </ol>
        </nav>
        <header className="v7-ch v7-case-head">
          <div className="v7-ch-text">
            <span className="v7-label">
              <i aria-hidden="true" />
              {chapter ? chapter.label : plain.kind}
            </span>
            <h1 className="v7-case-title" data-lens="">
              {p.title}
            </h1>
            <p className="v7-ch-line">{plain.line}</p>
            <p className="v7-part">
              <span>{c.role}</span>
              {plain.part}
            </p>
            <p className="v7-ch-links">
              {src ? (
                <a
                  className="v7-go"
                  href={src.href}
                  rel="noopener"
                  target="_blank"
                >
                  {src.label} ↗
                </a>
              ) : null}
              {note ? (
                <Link className="v7-go quiet" href={note}>
                  {c.note} →
                </Link>
              ) : null}
            </p>
          </div>
          {chapter ? (
            <SceneFor chapter={chapter} />
          ) : lead ? (
            <Plate src={lead.src} alt={lead.alt} />
          ) : (
            <Plate text={p.title.split(' — ')[0]} />
          )}
        </header>

        <section className="v7-case-sec" aria-labelledby="short-h">
          <h2 id="short-h" className="v7-case-h" data-lens="">
            {c.short}
          </h2>
          <p className="v7-case-summary">{p.summary}</p>
          <dl className="v7-answer">
            {(
              [
                [c.what, p.answer.what],
                [c.why, p.answer.problem],
                [c.how, p.answer.how],
                [c.role, p.answer.role],
              ] as const
            ).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="v7-case-sec" aria-labelledby="steps-h">
          <h2 id="steps-h" className="v7-case-h" data-lens="">
            {c.steps}
          </h2>
          <ol className="v7-steps">
            {p.stages.map((s, i) => (
              <li key={s.step}>
                <span className="v7-step-no">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {p.measurements?.length ? (
          <section className="v7-case-sec" aria-labelledby="results-h">
            <h2 id="results-h" className="v7-case-h" data-lens="">
              {c.results}
            </h2>
            <dl className="v7-results">
              {p.measurements.map((m) => (
                <div key={m.label}>
                  <dd className="v7-result-v">{m.value}</dd>
                  <dt>{m.label}</dt>
                  {m.context ? (
                    <dd className="v7-result-c">{m.context}</dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {images.length > 1 ? (
          <section className="v7-case-sec" aria-labelledby="media-h">
            <h2 id="media-h" className="v7-case-h" data-lens="">
              {c.media}
            </h2>
            <div className="v7-media">
              {images.slice(0, 6).map((m) => (
                <figure key={m.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.src} alt={m.alt} loading="lazy" />
                  {m.caption ? <figcaption>{m.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {p.limits.length ? (
          <section className="v7-case-sec" aria-labelledby="limits-h">
            <h2 id="limits-h" className="v7-case-h" data-lens="">
              {c.limits}
            </h2>
            <ul className="v7-limits">
              {p.limits.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="v7-case-sec" aria-labelledby="evidence-h">
          <h2 id="evidence-h" className="v7-case-h" data-lens="">
            {c.evidence}
          </h2>
          <ul className="v7-sources">
            {p.sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} rel="noopener" target="_blank">
                  <span className="v7-source-k">{sourceKindLabel[s.kind]}</span>
                  <span className="v7-source-l">{s.label} ↗</span>
                  {s.note ? (
                    <span className="v7-source-n">{s.note}</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <nav className="v7-next" aria-label={c.next}>
          <Link href={workHref(next.project.slug, V7)}>
            <span>{c.next}</span>
            <b>{next.project.title} →</b>
          </Link>
        </nav>
      </article>
    </>
  )
}

export { v7Copy }
