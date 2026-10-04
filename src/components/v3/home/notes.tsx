import { ArrowUpRight } from 'lucide-react'

import { getArticle } from '@/content/authority'
import { noteHref, workBySlug } from '@/content/v3/work'

import styles from './notes.module.css'

/** Three pieces of writing, each with the project it explains. Links go to the live record. */
export function Notes({ title, lede, all, slugs }: { title: string; lede: string; all: string; slugs: string[] }) {
  const notes = slugs.map((s) => getArticle(s)).filter((a) => a && a.state === 'ready')

  return (
    <section className={styles.section} id="writing" aria-labelledby="notes-h">
      <div className={styles.wrap}>
        <header className={styles.head}>
          <h2 className={styles.h2} id="notes-h">
            {title}
          </h2>
          <p className={styles.lede}>{lede}</p>
          <a href="/writing" className={styles.all}>
            {all}
            <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
          </a>
        </header>
        <ol className={styles.list}>
          {notes.map((a, i) => {
            const about = a!.projectSlug ? workBySlug(a!.projectSlug) : undefined
            return (
              <li key={a!.slug}>
                <a href={noteHref(a!.slug)} className={styles.note}>
                  <span className={styles.no}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.body}>
                    <span className={styles.title}>{a!.title}</span>
                    <span className={styles.dek}>{a!.dek}</span>
                    {about ? <span className={styles.about}>{about.project.title}</span> : null}
                  </span>
                  <ArrowUpRight className={styles.go} size={20} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
