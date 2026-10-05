import type { Metadata } from 'next'
import Link from 'next/link'

import { ChapterSection } from '@/components/v7/chapter'
import { Hero } from '@/components/v7/hero'
import { V7, chapters, groups, v7Chrome, v7Copy } from '@/content/v7/home'

export const metadata: Metadata = {
  title: { absolute: v7Copy.meta.title },
  description: v7Copy.meta.description,
  alternates: { canonical: '/' },
  robots: { index: false, follow: false },
}

export default function V7Home() {
  const c = v7Copy
  const more = groups.reduce((n, g) => n + g.items.length, 0)
  return (
    <>
      <Hero />

      <section className="v7-glance" aria-label={c.proofLabel}>
        <ul>
          {c.proof.map((p) => (
            <li key={p.label}>
              <a href={p.href}>
                <b>{p.big}</b>
                <span>{p.label}</span>
                <small>{p.note}</small>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {chapters.map((ch, i) => (
        <ChapterSection key={ch.id} chapter={ch} flip={i % 2 === 1} />
      ))}

      <section className="v7-more" aria-labelledby="more-h">
        <h2 id="more-h" data-lens="">
          {c.more.title}
        </h2>
        <p className="v7-more-lede">{c.more.lede(more)}</p>
        <div className="v7-groups">
          {groups.map((g) => (
            <div key={g.label} className="v7-group">
              <h3>{g.label}</h3>
              <ul>
                {g.items.map((it) => (
                  <li key={it.href}>
                    <Link href={it.href}>
                      <b>{it.title}</b>
                      <span>{it.line}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="v7-more-all">
          <Link className="v7-go" href={`${V7}/projects`}>
            {c.more.all} →
          </Link>
        </p>
      </section>

      <section id="contact" className="v7-contact" aria-labelledby="contact-h">
        <h2 id="contact-h" data-lens="">
          {c.contact.line.replace(/ work\.$/, ' ')}
          <em>work.</em>
        </h2>
        <p>{c.contact.body}</p>
        <a className="v7-mail" href={`mailto:${c.contact.email}`}>
          {c.contact.label}: {c.contact.email}
        </a>
        <nav className="v7-profiles" aria-label="Profiles">
          {v7Chrome.profiles.map((p) => (
            <a key={p.href} href={p.href} rel="me noopener" target="_blank">
              {p.label} ↗
            </a>
          ))}
        </nav>
      </section>
    </>
  )
}
