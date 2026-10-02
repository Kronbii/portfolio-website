import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { getProject, type ProjectRecord } from '@/content/authority'
import { v2Home, type FeaturedEntry } from '@/content/v2/home'
import {
  companionNote,
  noteHref,
  primarySource,
  projectHref,
  projectNumber,
  projectPlate,
  projectTitle,
  filedTopics,
  topicHref,
  topicTitle,
} from '@/content/v2/record'

import { Emph } from '../emph'
import { boxLength, FigureValue, isFigure } from '../record/figure-value'
import { Plate } from '../record/plate'
import { SignalFlow } from '../record/signal-flow'
import { WipeCompare } from '../record/wipe-compare'
import { SheetLink } from '../sheet-link'
import styles from './home.module.css'

/** Up to three measured figures; an entry with fewer than two shows none. */
function readingsFor(project: ProjectRecord, labels?: string[]) {
  const all = (project.measurements ?? []).filter((m) => isFigure(m.value))
  const picked = labels
    ? (labels.map((l) => all.find((m) => m.label === l)).filter(Boolean) as typeof all)
    : all.slice(0, 3)
  return picked.length >= 2 ? picked : []
}

function Entry({ entry, index }: { entry: FeaturedEntry; index: number }) {
  const project = getProject(entry.slug)
  if (!project || project.state !== 'ready') return null
  const copy = v2Home.entries
  const no = projectNumber(project.slug)
  const fig = `Fig. ${no.replace('No. ', '')}.1`
  const note = companionNote(project)
  const source = primarySource(project)
  const readings = readingsFor(project, entry.readings)
  const readingLen = boxLength(readings.map((m) => m.value))
  const limit = project.limits[0]
  const plate = projectPlate(project, entry.plateSrc)

  const figure =
    entry.layout === 'compare' && entry.plateSrc ? (
      <WipeCompare
        src={entry.plateSrc}
        alt={v2Home.compare.alt}
        before={v2Home.compare.before}
        after={v2Home.compare.after}
        hint={v2Home.compare.hint}
        label={fig}
        caption={v2Home.compare.alt}
      />
    ) : entry.layout === 'figure' ? (
      <SignalFlow
        stages={project.stages}
        label={fig}
        caption={project.hero.kind === 'diagram' ? project.hero.caption : undefined}
        alt={project.hero.kind === 'diagram' ? project.hero.alt : undefined}
      />
    ) : plate ? (
      <Plate
        media={plate}
        label={fig}
        ratio={entry.layout === 'wide' ? '2 / 1' : undefined}
        sizes={entry.layout === 'wide' ? '100vw' : '(min-width: 1100px) 55vw, 100vw'}
      />
    ) : null

  return (
    <article className={styles.entry} data-layout={entry.layout} id={`entry-${project.slug}`} aria-labelledby={`entry-${index}-h`}>
      <div className={styles.entryFigure}>{figure}</div>

      <div className={styles.entryMargin}>
        <span className={styles.entryNo}>{no}</span>
        <ul className={styles.entryTopics}>
          {filedTopics(project.topics).map((slug) => (
            <li key={slug}>
              <SheetLink href={topicHref(slug)}>{topicTitle(slug).text}</SheetLink>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.entryText}>
        <div className={styles.titleRow}>
          <span className={styles.entryNoInline}>{no}</span>
          <h3 className={styles.entryTitle} id={`entry-${index}-h`}>
            <SheetLink href={projectHref(project.slug)}>
              <Emph {...projectTitle(project)} />
            </SheetLink>
          </h3>
        </div>
        <p className={styles.entrySummary}>{project.summary}</p>
        <ul className={`${styles.entryTopics} ${styles.entryTopicsInline}`}>
          {filedTopics(project.topics).map((slug) => (
            <li key={slug}>
              <SheetLink href={topicHref(slug)}>{topicTitle(slug).text}</SheetLink>
            </li>
          ))}
        </ul>

        {readings.length > 0 ? (
          <dl className={styles.entryReadings} style={{ gridTemplateColumns: `repeat(${readings.length}, minmax(0, 1fr))` }}>
            {readings.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>
                  <FigureValue value={m.value} len={readingLen} />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className={styles.entryActions}>
          <SheetLink href={projectHref(project.slug)} className={`${styles.pill} ${styles.pillPrimary}`}>
            {copy.recordAction}
            <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
          </SheetLink>
          {note ? (
            <SheetLink href={noteHref(note.slug)} className={styles.pill}>
              {copy.noteAction}
              <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </SheetLink>
          ) : null}
          {source ? (
            <a href={source.href} className={styles.pill} target="_blank" rel="noopener noreferrer">
              {source.label.split(' — ')[0]}
              <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </div>

      {limit ? (
        <aside className={styles.entryNote}>
          <span className={styles.noteLabel}>{copy.limitLabel}</span>
          <p>{limit}</p>
        </aside>
      ) : null}
    </article>
  )
}

export function Entries() {
  const copy = v2Home.entries
  return (
    <section className={styles.entries} id="entries" aria-labelledby="entries-h">
      <div className={styles.wrap}>
        <header className={styles.sectionHead}>
          <h2 className={styles.h2} id="entries-h">
            <Emph {...copy.heading} />
          </h2>
          <div className={styles.sectionAside}>
            <p className={styles.sectionLede}>{copy.lede}</p>
            <SheetLink href="/v2/projects" className={styles.pill}>
              {copy.allAction}
              <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </SheetLink>
          </div>
        </header>
        <div className={styles.entryList}>
          {copy.items.map((entry, i) => (
            <Entry key={entry.slug} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
