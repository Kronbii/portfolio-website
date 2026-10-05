import type { Metadata } from 'next'
import Link from 'next/link'

import { SignOff } from '@/components/v2/home/sign-off'
import { Community } from '@/components/vneo/community'
import { Glance } from '@/components/vneo/glance'
import { Hero } from '@/components/vneo/hero'
import { Slate } from '@/components/vneo/slate'
import { Work } from '@/components/vneo/work'
import { VN, moreGroups, vneo } from '@/content/vneo/site'

export const metadata: Metadata = {
  title: { absolute: vneo.meta.title },
  description: vneo.meta.description,
  alternates: { canonical: '/' },
  robots: { index: false, follow: false },
}

export default function Vneo() {
  const c = vneo
  const groups = moreGroups()
  const n = groups.reduce((k, g) => k + g.items.length, 0)
  return (
    <>
      <Hero />
      <Glance items={c.glance} label="At a glance" />
      <Work />
      <Community />

      <section id="more" className="vn-more" aria-labelledby="more-h">
        <Slate
          no={4}
          label={c.more.label}
          title={c.more.title}
          hot={c.more.hot}
          lede={`${n} more projects.`}
          id="more-h"
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

      <div className="vn-signoff">
        <SignOff copy={c.signOff} warm />
      </div>
    </>
  )
}
