import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Emph } from '@/components/v2/emph'
import { JsonLd } from '@/components/v2/json-ld'
import {
  AnswerPanel,
  Continue,
  CrossRefs,
  Crumbs,
  EvidenceRows,
  Procedure,
  Readings,
  ReviewNotice,
  Section,
  TopicTags,
  recordStyles as styles,
} from '@/components/v2/record/blocks'
import { Plate } from '@/components/v2/record/plate'
import { SignalFlow } from '@/components/v2/record/signal-flow'
import { liveCrumbs, projectJsonLd, v2Meta } from '@/components/v2/schema'
import { SheetLink } from '@/components/v2/sheet-link'
import { getProject, getTopic, readyProjects } from '@/content/authority'
import { isRenderable } from '@/content/authority/visibility'
import { v2Record } from '@/content/v2/pages'
import {
  companionNote,
  filedTopics,
  heroFrame,
  noteHref,
  noteNumber,
  noteTitle,
  primarySource,
  projectHref,
  projectImages,
  projectNumber,
  projectTitle,
  renderableProjects,
  topicHref,
  topicTitle,
} from '@/content/v2/record'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return renderableProjects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project || !isRenderable(project.state)) return { title: 'Not found', robots: { index: false, follow: false } }
  return v2Meta(`/projects/${project.slug}`, `${project.metaTitle} (v2 preview)`, project.metaDescription)
}

export default async function V2Project({ params }: Props) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project || !isRenderable(project.state)) notFound()

  const crumbs = [
    { label: v2Record.crumbs.home, href: '/v2' },
    { label: v2Record.crumbs.projects, href: '/v2/projects' },
    { label: project.title, href: projectHref(project.slug) },
  ]
  const no = projectNumber(project.slug)
  const n = no.replace(/^\D+\s*/, '')
  const note = companionNote(project)
  const source = primarySource(project)
  const images = projectImages(project)
  const heroMedia = project.hero.kind === 'diagram' ? undefined : images[0]
  const figures = heroMedia ? images.slice(1) : images
  const title = projectTitle(project)
  const long = project.title.length > 34

  const i = readyProjects.findIndex((p) => p.slug === project.slug)
  const prev = i > 0 ? readyProjects[i - 1] : undefined
  const next = i >= 0 && i < readyProjects.length - 1 ? readyProjects[i + 1] : undefined

  const refs = [
    ...(note
      ? [
          {
            kind: v2Record.related.noteKind,
            title: noteTitle(note),
            href: noteHref(note.slug),
            note: note.dek,
            end: noteNumber(note.slug),
          },
        ]
      : []),
    ...filedTopics(project.topics).map((t) => ({
      kind: v2Record.related.topicKind,
      title: topicTitle(t),
      href: topicHref(t),
      note: getTopic(t)?.definition,
    })),
  ]

  return (
    <article>
      <JsonLd data={[projectJsonLd(project), liveCrumbs(crumbs)]} />

      <div className={styles.wrap}>
        <Crumbs items={crumbs} />
        {project.state === 'review' ? <ReviewNotice /> : null}

        <header className={styles.head}>
          <div className={styles.headMargin}>
            <span className={styles.entryNo} data-hung="">
              {no}
            </span>
            <span className={styles.marginMeta}>{project.role}</span>
            <TopicTags slugs={project.topics} />
          </div>
          <div className={styles.headMain}>
            <div className={styles.titleRow}>
              <span className={styles.noInline}>{no}</span>
              <h1 className={`${styles.title} ${long ? styles.titleLong : ''}`}>
              <Emph {...title} />
            </h1>
            </div>
            <p className={styles.lede}>{project.summary}</p>
            <div className={styles.actions}>
              {source ? (
                <a className={`${styles.pill} ${styles.pillPrimary}`} href={source.href} target="_blank" rel="noopener noreferrer">
                  {source.label.split(' — ')[0]}
                  <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
                </a>
              ) : null}
              {note ? (
                <SheetLink className={styles.pill} href={noteHref(note.slug)}>
                  {v2Record.actions.note}
                  <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
                </SheetLink>
              ) : null}
              <a className={styles.pill} href="#evidence">
                {v2Record.actions.source}
              </a>
            </div>
          </div>
        </header>

        <div style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          {heroMedia ? (
            <Plate
              media={heroMedia}
              label={`${v2Record.figureLabel} ${n}.1`}
              priority
              sizes="(min-width: 1440px) 1380px, 100vw"
              {...heroFrame(heroMedia.src)}
            />
          ) : (
            <SignalFlow
              stages={project.stages}
              label={`${v2Record.figureLabel} ${n}.1`}
              caption={project.hero.kind === 'diagram' ? project.hero.caption : undefined}
              alt={project.hero.kind === 'diagram' ? project.hero.alt : undefined}
            />
          )}
        </div>
      </div>

      <Section id="answer" title={v2Record.answer.heading}>
        <AnswerPanel answer={project.answer} />
      </Section>

      <Section id="mechanism" title={v2Record.procedure.heading}>
        <Procedure stages={project.stages} limits={project.limits} />
      </Section>

      {project.measurements && project.measurements.length > 0 ? (
        <Section id="measurements" title={v2Record.readings.heading}>
          <Readings items={project.measurements} />
        </Section>
      ) : null}

      {figures.length > 0 ? (
        <Section id="figures" title={v2Record.figures.heading}>
          <div className={styles.figures}>
            {figures.map((m, k) => (
              <Plate
                key={m.src}
                media={m}
                label={`${v2Record.figureLabel} ${n}.${k + (heroMedia ? 2 : 1)}`}
                sizes="(min-width: 960px) 45vw, 100vw"
              />
            ))}
          </div>
        </Section>
      ) : null}

      <Section id="evidence" title={v2Record.evidence.heading} note={v2Record.evidence.note}>
        <EvidenceRows sources={project.sources} />
      </Section>

      {refs.length > 0 ? (
        <Section id="related" title={v2Record.related.heading} note={v2Record.related.note}>
          <CrossRefs items={refs} />
        </Section>
      ) : null}

      <div className={styles.wrap} style={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <Continue
          prev={prev ? { label: `${v2Record.continue.prev} · ${projectNumber(prev.slug)}`, title: projectTitle(prev), href: projectHref(prev.slug) } : undefined}
          next={next ? { label: `${v2Record.continue.next} · ${projectNumber(next.slug)}`, title: projectTitle(next), href: projectHref(next.slug) } : undefined}
        />
      </div>
    </article>
  )
}
