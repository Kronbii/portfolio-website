import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { JsonLd } from '@/components/v2/json-ld'
import { liveCrumbs, projectJsonLd } from '@/components/v2/schema'
import { LensImage } from '@/components/v3/lens-image'
import { companionNote, projectImages, sourceKindLabel } from '@/content/v2/record'
import { v3Case } from '@/content/v3/pages'
import { V3, noteHref, workBySlug, workHref, works } from '@/content/v3/work'

import styles from './case.module.css'
import { Crumbs } from './crumbs'
import { StageFigure } from './stage-figure'

const external = (href: string) => href.startsWith('http')

/**
 * A project told for skimmers: the thing itself, what it does, and Rami's part
 * first; the story, steps, and results next; the engineering folded under "For
 * engineers"; evidence always visible. Shared by the versions built on /v3:
 * `base` keeps links inside the version, and `motion` replaces the first
 * screen's figure with a motion explainer (the photograph then leads the
 * project's own media).
 */
export function CaseStudy({ slug, base = V3, motion }: { slug: string; base?: string; motion?: ReactNode }) {
  const w = workBySlug(slug)
  if (!w) notFound()
  const { project: p, plain } = w

  // the hero is the photograph the plain layer chose (a verified photo, not a render),
  // else the record's own first image; below it, the record's other media
  const images = projectImages(p)
  const hero = plain.image
    ? (images.find((m) => m.src === plain.image!.src) ?? { ...plain.image, caption: undefined })
    : images[0]
  const own = (p.media ?? []).filter((m, i, all) => m.src !== hero?.src && all.findIndex((x) => x.src === m.src) === i)
  const rest = motion && hero ? [hero, ...own] : own
  const note = companionNote(p)
  const at = works.findIndex((x) => x.project.slug === slug)
  const next = works[(at + 1) % works.length]
  // what a visitor can open: live demos first, then code, at most two
  const see = [...p.sources]
    .sort((a, b) => Number(b.kind === 'demo') - Number(a.kind === 'demo'))
    .filter((s) => s.kind === 'demo' || s.kind === 'repository' || s.kind === 'video' || s.kind === 'listing')
    .slice(0, 2)

  const crumbs = [
    { label: v3Case.crumbs.home, href: base },
    { label: v3Case.crumbs.projects, href: `${base}/projects` },
    { label: p.title, href: workHref(p.slug, base) },
  ]

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

      <article className={styles.page}>
        <Crumbs items={crumbs} />

        {/* the first screen: the thing itself, what it does, and Rami's part */}
        <header className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.kind}>{plain.kind}</p>
            <h1 className={styles.title}>{p.title}</h1>
            <p className={styles.line}>{plain.line}</p>

            <dl className={styles.glance}>
              <div>
                <dt>{v3Case.glance.part}</dt>
                <dd>{plain.part}</dd>
              </div>
              <div>
                <dt>{v3Case.glance.proof}</dt>
                <dd className={styles.proof}>{plain.proof}</dd>
              </div>
              {see.length ? (
                <div>
                  <dt>{v3Case.glance.links}</dt>
                  <dd className={styles.seeLinks}>
                    {see.map((s) => (
                      <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                        {s.label}
                        <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                      </a>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className={styles.heroMedia}>
            {motion ? (
              motion
            ) : hero ? (
              <figure className={styles.plate}>
                <LensImage src={hero.src} alt={hero.alt} className={styles.plateLens} weight={1.2} />
                {hero.caption ? <figcaption>{hero.caption}</figcaption> : null}
              </figure>
            ) : (
              <StageFigure stages={p.stages} label={v3Case.steps} alt={`How ${p.title} works, step by step.`} />
            )}
          </div>
        </header>

        <section className={styles.short} aria-labelledby="short-h">
          <h2 className={styles.h2} id="short-h">
            {v3Case.short.title}
          </h2>
          <div className={styles.shortGrid}>
            <div>
              <h3>{v3Case.short.what}</h3>
              <p>{p.answer.what}</p>
            </div>
            <div>
              <h3>{v3Case.short.why}</h3>
              <p>{p.answer.problem}</p>
            </div>
            <div>
              <h3>{v3Case.short.did}</h3>
              <p>{p.answer.role}</p>
            </div>
          </div>
        </section>

        {p.stages.length ? (
          <section className={styles.block} aria-labelledby="steps-h">
            <h2 className={styles.h2} id="steps-h">
              {v3Case.steps}
            </h2>
            <ol className={styles.steps}>
              {p.stages.map((s) => (
                <li key={s.step}>
                  <span className={styles.stepNo}>{s.step}</span>
                  <span className={styles.stepTitle}>{s.title}</span>
                  <span className={styles.stepDetail}>{s.detail}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {p.measurements?.length ? (
          <section className={styles.block} aria-labelledby="results-h">
            <h2 className={styles.h2} id="results-h">
              {v3Case.results}
            </h2>
            <dl className={styles.results}>
              {p.measurements.map((m) => (
                <div key={m.label}>
                  <dd className={styles.value}>{m.value}</dd>
                  <dt className={styles.metric}>{m.label}</dt>
                  {m.context ? <dd className={styles.context}>{m.context}</dd> : null}
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {rest.length ? (
          <section className={styles.block} aria-labelledby="gallery-h">
            <h2 className={styles.h2} id="gallery-h">
              {v3Case.gallery}
            </h2>
            <div className={styles.gallery}>
              {rest.map((m) => (
                <figure key={m.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.src} alt={m.alt} loading="lazy" />
                  {m.caption ? <figcaption>{m.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <details className={styles.engineers}>
          <summary>
            <span className={styles.engTitle}>{v3Case.engineers.title}</span>
            <span className={styles.engSummary}>{v3Case.engineers.summary}</span>
          </summary>
          <div className={styles.engBody}>
            <div>
              <h3>{v3Case.engineers.how}</h3>
              <p>{p.answer.how}</p>
            </div>
            <div>
              <h3>{v3Case.engineers.limits}</h3>
              <ul>
                {p.limits.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>{v3Case.engineers.keywords}</h3>
              <ul className={styles.keywords}>
                {p.keywords.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </div>
          </div>
        </details>

        <section className={styles.block} aria-labelledby="evidence-h">
          <h2 className={styles.h2} id="evidence-h">
            {v3Case.evidence}
          </h2>
          <ul className={styles.evidence}>
            {p.sources.map((s) => (
              <li key={s.href + s.label}>
                <a href={s.href} target={external(s.href) ? '_blank' : undefined} rel="noopener noreferrer">
                  <span className={styles.evKind}>{sourceKindLabel[s.kind]}</span>
                  <span className={styles.evLabel}>{s.label}</span>
                  {s.note ? <span className={styles.evNote}>{s.note}</span> : null}
                  <ArrowUpRight className={styles.evGo} size={16} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          {note ? (
            <a href={noteHref(note.slug)} className={styles.story}>
              <span>{v3Case.story}</span>
              <span className={styles.storyTitle}>{note.title}</span>
              <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" />
            </a>
          ) : null}
        </section>

        <nav className={styles.after} aria-label="More projects">
          <Link href={workHref(next.project.slug, base)} className={styles.next}>
            <span className={styles.nextLabel}>{v3Case.next}</span>
            <span className={styles.nextTitle}>{next.project.title}</span>
            <span className={styles.nextLine}>{next.plain.line}</span>
            <ArrowRight className={styles.nextGo} size={22} strokeWidth={1.75} aria-hidden="true" />
          </Link>
          <Link href={`${base}/projects`} className={styles.back}>
            {v3Case.back}
          </Link>
        </nav>
      </article>
    </>
  )
}
