import type { Metadata } from 'next'
import Link from 'next/link'

import { SignOff } from '@/components/v2/home/sign-off'
import { FlightLog } from '@/components/v3/home/flight-log'
import { Build } from '@/components/vneo/build'
import { Community } from '@/components/vneo/community'
import { Glance } from '@/components/vneo/glance'
import { Hero } from '@/components/vneo/hero'
import { Loop } from '@/components/vneo/loop'
import { Slate, SlateMark } from '@/components/vneo/slate'
import { pageMeta } from '@/components/vneo/meta'
import { Work } from '@/components/vneo/work'
import { VN, moreGroups, vneo } from '@/content/vneo/site'

export const metadata: Metadata = pageMeta({
  path: '/',
  title: vneo.meta.title,
  description: vneo.meta.description,
})

export default function Vneo() {
  const c = vneo
  const groups = moreGroups()
  const n = groups.reduce((k, g) => k + g.items.length, 0)
  return (
    <>
      <Hero />
      <Glance items={c.glance} label="At a glance" />
      <Build />
      <Work />
      <Community />

      <section id="more" className="vn-more" aria-labelledby="more-h">
        <Slate
          no={5}
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

      <div className="vn-log vn-v3">
        <SlateMark no={6} label="The path" />
        <FlightLog
          title={c.log.title}
          lede={c.log.lede}
          points={c.log.points}
        />
      </div>

      <Loop />

      <div className="vn-signoff">
        <SignOff copy={c.signOff} warm />
      </div>
    </>
  )
}
