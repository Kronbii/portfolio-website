import type { Metadata } from 'next'
import Link from 'next/link'

import { SignOff } from '@/components/v2/home/sign-off'
import { ChapterSection } from '@/components/v7/chapter'
import { Hero } from '@/components/v7/hero'
import { Glance } from '@/components/vneo/glance'
import { Path } from '@/components/vneo/path'
import { Reel } from '@/components/vneo/reel'
import { Tracker } from '@/components/vneo/tracker'
import { VN, chapters, groups, vneo } from '@/content/vneo/site'

export const metadata: Metadata = {
  title: { absolute: vneo.meta.title },
  description: vneo.meta.description,
  alternates: { canonical: '/' },
  robots: { index: false, follow: false },
}

function Head({
  id,
  label,
  title,
  hot,
  lede,
}: {
  id: string
  label: string
  title: string
  hot: string
  lede?: string
}) {
  const [a, b] = title.split(hot)
  return (
    <>
      <span className="v7-label">
        <i aria-hidden="true" />
        {label}
      </span>
      <h2 id={id} data-lens="">
        {a}
        <em>{hot}</em>
        {b}
      </h2>
      {lede ? <p className="vn-sec-lede">{lede}</p> : null}
    </>
  )
}

export default function Vneo() {
  const c = vneo
  const more = groups.reduce((n, g) => n + g.items.length, 0)
  return (
    <>
      <Hero />
      <Glance items={c.glance} label="At a glance" />

      {chapters.map((ch, i) => (
        <ChapterSection key={ch.id} chapter={ch} flip={i % 2 === 1} />
      ))}

      <section id="reel" className="vn-sec" aria-labelledby="reel-h">
        <Head
          id="reel-h"
          label={c.reel.label}
          title={c.reel.title}
          hot={c.reel.hot}
          lede={c.reel.lede}
        />
        <Reel />
      </section>

      <Tracker />

      <Path />

      <section id="more" className="vn-sec" aria-labelledby="more-h">
        <Head
          id="more-h"
          label={c.more.label}
          title={c.more.title}
          hot={c.more.hot}
          lede={`${more} more projects.`}
        />
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
          <Link className="v7-go" href={`${VN}/projects`}>
            {c.more.all} →
          </Link>
        </p>
      </section>

      <section id="writing" className="vn-sec" aria-labelledby="writing-h">
        <Head
          id="writing-h"
          label={c.notes.label}
          title={c.notes.title}
          hot={c.notes.hot}
          lede={c.notes.lede}
        />
        <ul className="vn-notes">
          {c.notes.items.map((n) => (
            <li key={n.href}>
              <Link href={n.href}>
                <b>{n.title}</b>
                <span>{n.dek}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="v7-more-all">
          <Link className="v7-go quiet" href={c.notes.all.href}>
            {c.notes.all.label} →
          </Link>
        </p>
      </section>

      <div className="vn-signoff">
        <SignOff copy={c.signOff} warm />
      </div>
    </>
  )
}
