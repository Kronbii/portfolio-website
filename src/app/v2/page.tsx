import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Metadata } from 'next'

import { Emph } from '@/components/v2/emph'
import { Marquee, Ticker } from '@/components/v2/home/bands'
import { Entries } from '@/components/v2/home/entries'
import styles from '@/components/v2/home/home.module.css'
import { LightField } from '@/components/v2/home/light-field'
import { SignOff } from '@/components/v2/home/sign-off'
import { Specimen } from '@/components/v2/home/specimen'
import { TopicTray } from '@/components/v2/home/topic-tray'
import { IndexList } from '@/components/v2/record/index-list'
import { v2Meta } from '@/components/v2/schema'
import { SheetLink } from '@/components/v2/sheet-link'
import { getProject, readyArticles } from '@/content/authority'
import { v2Home } from '@/content/v2/home'
import {
  companionProject,
  filedTopics,
  liveTopics,
  noteHref,
  noteNumber,
  noteTitle,
  projectNumber,
  projectPlate,
  topicCounts,
  topicHref,
  topicTitle,
} from '@/content/v2/record'

export const metadata: Metadata = v2Meta('/', v2Home.meta.title, v2Home.meta.description)

export default function V2Home() {
  const { hero, entries, notes, roles, methods, marquee } = v2Home

  const contents = entries.items
    .map((e) => getProject(e.slug))
    .filter((p) => p && p.state === 'ready')
    .map((p) => p!)

  const noteRows = readyArticles.slice(0, notes.shown).map((a) => {
    const project = companionProject(a)
    const plate = project ? projectPlate(project) : a.heroMedia
    return {
      id: a.slug,
      no: noteNumber(a.slug),
      title: noteTitle(a),
      summary: a.dek,
      meta: project
        ? `${projectNumber(project.slug)} · ${project.title}`
        : topicTitle(filedTopics(a.topics)[0] ?? a.topics[0] ?? '').text,
      topics: a.topics,
      href: noteHref(a.slug),
      plate: plate ? { src: plate.src, alt: plate.alt } : undefined,
    }
  })

  const trayTopics = liveTopics.map((t) => {
    const c = topicCounts(t.slug)
    return { slug: t.slug, label: t.title, count: c.projects + c.notes, href: topicHref(t.slug) }
  })

  return (
    <>
      <Ticker items={v2Home.ticker} />

      <section className={styles.hero} aria-labelledby="v2-name">
        <div className={`${styles.wrap} ${styles.spread}`}>
          <div className={styles.specimenSlot}>
            <Specimen />
          </div>

          <div className={styles.spreadText}>
            <h1 className={styles.name} id="v2-name">
              {hero.name.split(' ').map((part, i, all) => (
                <span key={part} style={{ display: 'block' }}>
                  {part}
                  {i === all.length - 1 ? <span className={styles.nameDot}>.</span> : null}
                </span>
              ))}
            </h1>
            <p className={styles.claim}>
              <Emph {...hero.claim} />
            </p>
            <p className={styles.descriptor}>
              {hero.descriptor} · {hero.location}
            </p>

            <nav className={styles.contents} aria-labelledby="contents-h">
              <h2 className={styles.contentsHead} id="contents-h">
                <span>{hero.contentsLabel}</span>
                <span>{String(contents.length).padStart(2, '0')}</span>
              </h2>
              <ol className={styles.contentsList}>
                {contents.map((p) => (
                  <li key={p.slug}>
                    <a href={`#entry-${p.slug}`}>
                      <span className={styles.contentsNo}>{projectNumber(p.slug)}</span>
                      <span className={styles.contentsTitle}>{p.title}</span>
                      <span className={styles.contentsLeader} aria-hidden="true" />
                      <span className={styles.contentsField}>{topicTitle(filedTopics(p.topics)[0] ?? p.topics[0]).text}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className={styles.spreadActions}>
              <a href="#entries" className={`${styles.pill} ${styles.pillPrimary}`}>
                {hero.readAction}
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
              </a>
              <a href="#sign-off" className={styles.pill}>
                {hero.contactAction}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Entries />

      <LightField />

      <section className={styles.block} id="notes" aria-labelledby="notes-h">
        <div className={styles.wrap}>
          <header className={styles.sectionHead}>
            <h2 className={styles.h2} id="notes-h">
              <Emph {...notes.heading} />
            </h2>
            <div className={styles.sectionAside}>
              <p className={styles.sectionLede}>{notes.lede}</p>
              <SheetLink href="/v2/writing" className={styles.pill}>
                {notes.allAction}
                <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
              </SheetLink>
            </div>
          </header>
          <IndexList rows={noteRows} topics={[]} />
        </div>
      </section>

      <Marquee tools={marquee.tools} loop={marquee.loop} />

      <section className={styles.block} id="roles" aria-labelledby="roles-h">
        <div className={styles.wrap}>
          <header className={styles.sectionHead}>
            <h2 className={styles.h2} id="roles-h">
              <Emph {...roles.heading} />
            </h2>
            <div className={styles.sectionAside}>
              <p className={styles.sectionLede}>{roles.lede}</p>
            </div>
          </header>
          <div className={styles.rolesHead} aria-hidden="true">
            <span>{roles.columns.period}</span>
            <span>{roles.columns.role}</span>
            <span>{roles.columns.org}</span>
            <span>{roles.columns.note}</span>
          </div>
          <ul className={styles.roles}>
            {roles.items.map((r) => {
              const internal = r.href.startsWith('/')
              const inner = (
                <>
                  <span className={styles.rolePeriod}>{r.period}</span>
                  <span className={styles.roleName}>{r.role}</span>
                  <span className={styles.roleOrg}>{r.org}</span>
                  <span className={styles.roleNote}>{r.note}</span>
                  {internal ? (
                    <ArrowRight className={styles.roleArrow} size={17} strokeWidth={1.75} aria-hidden="true" />
                  ) : (
                    <ArrowUpRight className={styles.roleArrow} size={17} strokeWidth={1.75} aria-hidden="true" />
                  )}
                </>
              )
              return (
                <li key={r.role + r.org}>
                  {internal ? (
                    <SheetLink href={r.href} className={styles.roleRow}>
                      {inner}
                    </SheetLink>
                  ) : (
                    <a href={r.href} className={styles.roleRow} target="_blank" rel="noopener noreferrer">
                      {inner}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className={styles.block} id="methods" aria-labelledby="methods-h">
        <div className={styles.wrap}>
          <header className={styles.sectionHead}>
            <h2 className={styles.h2} id="methods-h">
              <Emph {...methods.heading} />
            </h2>
            <div className={styles.sectionAside}>
              <p className={styles.sectionLede}>{methods.lede}</p>
            </div>
          </header>
          <TopicTray topics={trayTopics} states={methods.states} dropLabel={methods.dropAction} />
        </div>
      </section>

      <SignOff />
    </>
  )
}
