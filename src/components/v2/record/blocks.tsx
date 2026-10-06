import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

import type { AuthoritySource, ProjectAnswer, ProjectMeasurement, ProjectStage } from '@/content/authority'
import { v2Record } from '@/content/v2/pages'
import { filedTopics, hostOf, sourceKindLabel, topicHref, topicTitle } from '@/content/v2/record'

import { Emph } from '../emph'
import { SheetLink } from '../sheet-link'
import { boxLength, FigureValue } from './figure-value'
import styles from './record.module.css'

export { styles as recordStyles }

export interface Crumb {
  label: string
  href: string
}

export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={styles.crumbs}>
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.href} style={{ display: 'contents' }}>
              {last ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <>
                  <SheetLink href={item.href} direction="back">
                    {item.label}
                  </SheetLink>
                  <span className={styles.crumbSep} aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function ReviewNotice() {
  return (
    <p className={styles.review} role="note">
      <strong>{v2Record.review.label}</strong>
      <span>{v2Record.review.text}</span>
    </p>
  )
}

interface SectionProps {
  id: string
  title: { text: string; emphasis?: string }
  note?: string
  children: ReactNode
}

/** A section with its heading in the notebook's margin column. */
export function Section({ id, title, note, children }: SectionProps) {
  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-h`}>
      <div className={`${styles.wrap} ${styles.sectionGrid}`}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2} id={`${id}-h`}>
            <Emph {...title} />
          </h2>
          {note ? <p className={styles.sectionNote}>{note}</p> : null}
        </div>
        <div className={styles.sectionBody}>{children}</div>
      </div>
    </section>
  )
}

export function TopicTags({ slugs }: { slugs: string[] }) {
  return (
    <div className={styles.marginTopics}>
      {filedTopics(slugs).map((slug) => (
        <SheetLink key={slug} href={topicHref(slug)} className={styles.tag}>
          {topicTitle(slug).text}
        </SheetLink>
      ))}
    </div>
  )
}

export function AnswerPanel({ answer }: { answer: ProjectAnswer }) {
  const { labels } = v2Record.answer
  const cells: [string, string][] = [
    [labels.what, answer.what],
    [labels.problem, answer.problem],
    [labels.how, answer.how],
    [labels.role, answer.role],
  ]
  return (
    <div className={styles.answer}>
      {cells.map(([label, text]) => (
        <div key={label} className={styles.answerCell}>
          <span className={`${styles.label} ${styles.tick}`}>{label}</span>
          <p>{text}</p>
        </div>
      ))}
    </div>
  )
}

export function Procedure({ stages, limits }: { stages: ProjectStage[]; limits: string[] }) {
  return (
    <div className={styles.procedure}>
      <ol className={styles.steps}>
        {stages.map((stage) => (
          <li key={stage.step} className={styles.step}>
            <span className={styles.stepNo} aria-hidden="true">
              {stage.step}
            </span>
            <div>
              <h3 className={styles.stepTitle}>
                <span className="v2-sr">Step {stage.step}: </span>
                {stage.title}
              </h3>
              <p className={styles.stepDetail}>{stage.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      {limits.length > 0 ? (
        <aside className={styles.notes} aria-labelledby="limits-h">
          <h3 className={`${styles.label} ${styles.tick}`} id="limits-h">
            {v2Record.limits.heading}
          </h3>
          {limits.map((limit, i) => (
            <div key={limit} className={styles.note}>
              <span className={styles.label}>
                {v2Record.limits.item} {String(i + 1).padStart(2, '0')}
              </span>
              <p className={styles.noteText}>{limit}</p>
            </div>
          ))}
        </aside>
      ) : null}
    </div>
  )
}

export function Readings({ items }: { items: ProjectMeasurement[] }) {
  const len = boxLength(items.map((m) => m.value))
  return (
    <dl className={styles.readings}>
      {items.map((m) => (
        <div key={m.label} className={styles.reading}>
          <dt className={styles.label}>{m.label}</dt>
          <dd className={styles.readingValue} style={{ margin: 0 }}>
            <FigureValue value={m.value} len={len} />
          </dd>
          {m.context ? <dd className={styles.readingContext} style={{ margin: 0 }}>{m.context}</dd> : null}
        </div>
      ))}
    </dl>
  )
}

export function EvidenceRows({ sources }: { sources: AuthoritySource[] }) {
  return (
    <ul className={styles.rows}>
      {sources.map((source) => (
        <li key={source.href + source.label}>
          <a className={styles.row} href={source.href} target="_blank" rel="noopener noreferrer">
            <span className={styles.rowKind}>{sourceKindLabel[source.kind]}</span>
            <span className={styles.rowMain}>
              <span className={styles.rowTitle}>{source.label}</span>
              {source.note ? <span className={styles.rowNote}>{source.note}</span> : null}
            </span>
            <span className={styles.rowEnd}>
              {hostOf(source.href)}
              <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export interface CrossRef {
  kind: string
  title: { text: string; emphasis?: string }
  href: string
  note?: string
  end?: string
}

export function CrossRefs({ items }: { items: CrossRef[] }) {
  return (
    <ul className={styles.rows}>
      {items.map((item) => (
        <li key={item.href}>
          <SheetLink className={styles.row} href={item.href}>
            <span className={styles.rowKind}>{item.kind}</span>
            <span className={styles.rowMain}>
              <span className={styles.rowTitle}>{item.title.text}</span>
              {item.note ? <span className={styles.rowNote}>{item.note}</span> : null}
            </span>
            <span className={styles.rowEnd}>
              {item.end}
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </span>
          </SheetLink>
        </li>
      ))}
    </ul>
  )
}

interface ContinueItem {
  label: string
  title: { text: string; emphasis?: string }
  href: string
}

export function Continue({ prev, next }: { prev?: ContinueItem; next?: ContinueItem }) {
  if (!prev && !next) return null
  const arrow = { display: 'inline', verticalAlign: '-2px' } as const
  return (
    <nav className={styles.continue} aria-label={v2Record.continue.aria}>
      {prev ? (
        <SheetLink className={styles.continueLink} href={prev.href} direction="back" data-dir="prev">
          <span className={styles.continueTitle}>{prev.title.text}</span>
          <span className={styles.label}>
            <ArrowLeft size={13} strokeWidth={1.75} aria-hidden="true" style={arrow} /> {prev.label}
          </span>
        </SheetLink>
      ) : null}
      {next ? (
        <SheetLink className={styles.continueLink} href={next.href} data-dir="next">
          <span className={styles.continueTitle}>{next.title.text}</span>
          <span className={styles.label}>
            {next.label} <ArrowRight size={13} strokeWidth={1.75} aria-hidden="true" style={arrow} />
          </span>
        </SheetLink>
      ) : null}
    </nav>
  )
}
