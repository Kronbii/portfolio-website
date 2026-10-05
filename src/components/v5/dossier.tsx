import { ArrowUpRight } from 'lucide-react'

import { JsonLd } from '@/components/v2/json-ld'
import { liveCrumbs, projectJsonLd } from '@/components/v2/schema'
import { companionNote, projectImages, sourceKindLabel } from '@/content/v2/record'
import { noteHref, workBySlug } from '@/content/v3/work'

import styles from './dossier.module.css'

/**
 * A project's full record, set like a flight dossier over the chart: the plain
 * summary first, then the legs it flies (its stages), what was measured, the
 * limits it admits to, and every source. Read on the server, so the whole
 * record is in the page for readers and machines alike.
 */
export function Dossier({ slug }: { slug: string }) {
  const w = workBySlug(slug)
  if (!w) return null
  const { project: p, plain } = w
  const images = projectImages(p).filter((m, i, all) => all.findIndex((x) => x.src === m.src) === i && !m.src.endsWith('/demo.png'))
  const note = companionNote(p)
  const ext = (h: string) => h.startsWith('http')

  return (
    <article className={styles.dossier}>
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
      <p className={styles.kind}>{plain.kind}</p>
      <h2 className={styles.title}>{p.title}</h2>
      <p className={styles.line}>{plain.line}</p>
      <dl className={styles.facts}>
        <div>
          <dt>Part</dt>
          <dd>{plain.part}</dd>
        </div>
        <div>
          <dt>Checkable</dt>
          <dd className={styles.proof}>{plain.proof}</dd>
        </div>
      </dl>

      <section className={styles.block}>
        <h3>Briefing</h3>
        <dl className={styles.brief}>
          <dt>What it is</dt>
          <dd>{p.answer.what}</dd>
          <dt>Why it matters</dt>
          <dd>{p.answer.problem}</dd>
          <dt>What I did</dt>
          <dd>{p.answer.role}</dd>
        </dl>
      </section>

      {p.stages.length ? (
        <section className={styles.block}>
          <h3>Legs</h3>
          <ol className={styles.legs}>
            {p.stages.map((s) => (
              <li key={s.step}>
                <span className={styles.leg}>{s.step}</span>
                <div>
                  <b>{s.title}</b>
                  <p>{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {p.measurements?.length ? (
        <section className={styles.block}>
          <h3>Measured</h3>
          <dl className={styles.measured}>
            {p.measurements.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>
                  <b>{m.value}</b>
                  {m.context ? <small>{m.context}</small> : null}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {images.length ? (
        <section className={styles.block}>
          <h3>From the project</h3>
          <div className={styles.media}>
            {images.slice(0, 4).map((m) => (
              <figure key={m.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.src} alt={m.alt} loading="lazy" />
                {m.caption ? <figcaption>{m.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.block}>
        <h3>Limits</h3>
        <ul className={styles.limits}>
          {p.limits.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>

      <section className={styles.block}>
        <h3>Evidence and links</h3>
        <ul className={styles.sources}>
          {p.sources.map((s) => (
            <li key={s.href + s.label}>
              <a href={s.href} target={ext(s.href) ? '_blank' : undefined} rel="noopener noreferrer">
                <span>{sourceKindLabel[s.kind]}</span>
                {s.label}
                <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
              </a>
            </li>
          ))}
          {note ? (
            <li>
              <a href={noteHref(note.slug)}>
                <span>Write-up</span>
                {note.title}
                <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
              </a>
            </li>
          ) : null}
        </ul>
      </section>
    </article>
  )
}
