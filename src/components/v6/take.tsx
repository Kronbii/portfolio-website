import Link from 'next/link'
import type { ReactNode } from 'react'

import { v6Copy, type shots } from '@/content/v6/reel'

/*
 * A take: the shot, then its slate, the readable half. The slate says what
 * the work is in a sentence anyone can follow, the one fact to check, and
 * my part with collaborators named; then where to read more.
 */

type ShotEntry = (typeof shots)[number]

export function Take({
  entry,
  children,
}: {
  entry: ShotEntry
  children: ReactNode
}) {
  const { section, work, href, source, note } = entry
  const s = v6Copy.slate
  return (
    <section
      id={entry.id}
      className="v6-sec v6-take"
      data-sec-no={section.no}
      data-sec-label={section.label}
      aria-labelledby={`${entry.id}-h`}
    >
      {children}
      <div className="v6-slate">
        <div>
          <span className="v6-kicker v6-mono">
            {section.no} · {section.label} · {work.plain.kind}
          </span>
          <h2 id={`${entry.id}-h`} className="v6-slate-title">
            <Link href={href}>{work.project.title}</Link>
          </h2>
          <p className="v6-slate-line">{work.plain.line}</p>
        </div>
        <div>
          <dl className="v6-facts">
            <div>
              <dt className="v6-mono">{s.proof}</dt>
              <dd>{work.plain.proof}</dd>
            </div>
            <div>
              <dt className="v6-mono">{s.part}</dt>
              <dd>{work.plain.part}</dd>
            </div>
          </dl>
          <p className="v6-links v6-mono">
            <Link className="v6-link is-primary" href={href}>
              {s.open} →
            </Link>
            {source ? (
              <a
                className="v6-link"
                href={source.href}
                rel="noopener"
                target="_blank"
              >
                {s.source}: {source.label} ↗
              </a>
            ) : null}
            {note ? (
              <Link className="v6-link" href={note.href}>
                {s.note}
              </Link>
            ) : null}
          </p>
        </div>
      </div>
    </section>
  )
}
