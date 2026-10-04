import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { WorkTile } from '@/content/v3/home'
import { workBySlug, workHref } from '@/content/v3/work'

import styles from './work-bento.module.css'

interface Props {
  title: string
  lede: string
  all: string
  read: string
  tiles: WorkTile[]
}

/*
 * Selected work, sized by what each piece needs to say. Photo tiles carry the
 * real thing; work without photographs shows its result as type. Every tile
 * answers three questions at a glance: what it does, what Rami did, and the
 * one fact that can be checked. Hovering a photograph sweeps a thermal scan
 * down it.
 */
export function WorkBento({ title, lede, all, read, tiles }: Props) {
  return (
    <section className={styles.section} id="work" aria-labelledby="work-h">
      <div className={styles.wrap}>
        <header className={styles.head}>
          <h2 className={styles.h2} id="work-h">
            {title}
          </h2>
          <div className={styles.aside}>
            <p className={styles.lede}>{lede}</p>
            <Link href="/v3/projects" className={styles.all}>
              {all}
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </header>

        <ul className={styles.grid}>
          {tiles.map((tile) => {
            const w = workBySlug(tile.slug)
            if (!w) return null
            const { project, plain } = w
            const photo = plain.image && !tile.figure && !tile.merges
            // only the large tiles have room for words over the picture
            const layout = photo && (tile.size === 'hero' || tile.size === 'band') ? 'overlay' : 'stack'
            return (
              <li key={tile.slug} className={styles.cell} data-size={tile.size}>
                <Link
                  href={workHref(project.slug)}
                  className={styles.tile}
                  data-kind={photo ? 'photo' : 'type'}
                  data-layout={layout}
                  data-lock="Open"
                >
                  {photo && plain.image ? (
                    <span className={styles.media} aria-hidden="true" data-lens-img="">
                      {/* the photograph as two colour channels the lens shifts apart */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={plain.image.src}
                        alt=""
                        loading="lazy"
                        className={styles.chA}
                        style={{ objectPosition: plain.image.position ?? '50% 50%' }}
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={plain.image.src}
                        alt=""
                        loading="lazy"
                        className={styles.chB}
                        style={{ objectPosition: plain.image.position ?? '50% 50%' }}
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={plain.image.src}
                        alt=""
                        loading="lazy"
                        className={styles.heat}
                        style={{ objectPosition: plain.image.position ?? '50% 50%' }}
                      />
                      <span className={styles.scan} />
                    </span>
                  ) : null}

                  {tile.figure ? (
                    <span className={styles.figure} aria-hidden="true">
                      <span className={styles.figFrom}>
                        <b>{tile.figure.from}</b>
                        <small>{tile.figure.fromNote}</small>
                      </span>
                      <span className={styles.figArrow}>→</span>
                      <span className={styles.figTo}>
                        <b>{tile.figure.to}</b>
                        <small>{tile.figure.toNote}</small>
                      </span>
                    </span>
                  ) : null}

                  {tile.merges ? (
                    <span className={styles.merges} aria-hidden="true">
                      {tile.merges.map((m) => (
                        <span key={m} className={styles.merge}>
                          <span className={styles.mergeDot} />
                          <span className={styles.mergeName}>{m}</span>
                          <span className={styles.mergeState}>merged</span>
                        </span>
                      ))}
                    </span>
                  ) : null}

                  <span className={styles.body}>
                    <span className={styles.kind}>{plain.kind}</span>
                    <span className={styles.title} data-lens="0.55">
                      {project.title}
                    </span>
                    <span className={styles.line}>{plain.line}</span>
                    <span className={styles.meta}>
                      <span className={styles.proof}>{plain.proof}</span>
                      <span className={styles.part}>{plain.part}</span>
                    </span>
                    <span className={styles.read}>
                      {read}
                      <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                    </span>
                  </span>
                  {photo && plain.image ? <span className="v3-sr">{plain.image.alt}</span> : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
