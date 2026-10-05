'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { bento, featured, vneo, VN } from '@/content/vneo/site'

import { Motion, replayIn } from './motion'
import { Slate } from './slate'

/*
 * Selected work: v4's slate, then a short sticky player (v4) whose screen cuts
 * to each project's motion as its entry passes the middle of the window, four
 * entries and no more; then v3's bento, tight and easy, with the motion
 * playing inside the tiles that have it, again on hover. Phones get each
 * entry with its own motion, and the same bento.
 */

export function Work() {
  const c = vneo.work
  const [at, setAt] = useState(0)
  const [cut, setCut] = useState(0)
  const [wide, setWide] = useState(false)
  const list = useRef<HTMLOListElement>(null)
  const atRef = useRef(0)
  const screen = useRef<HTMLDivElement>(null)
  const seen = useRef(new Set<number>([0]))

  // a cut: the piece now on show plays again from the top (the first time, it plays on sight by itself)
  useEffect(() => {
    if (!cut) return
    const pane = screen.current?.querySelectorAll<HTMLElement>('.vn-pane')[at]
    if (!pane) return
    if (seen.current.has(at)) replayIn(pane)
    seen.current.add(at)
  }, [cut, at])

  useEffect(() => {
    const mq = matchMedia('(min-width: 1021px)')
    const on = () => setWide(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    const ol = list.current
    if (!ol || !wide) return
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (!e.isIntersecting) continue
          const i = Number((e.target as HTMLElement).dataset.i)
          if (atRef.current === i) continue
          atRef.current = i
          setAt(i)
          setCut((k) => k + 1)
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    ol.querySelectorAll('[data-i]').forEach((li) => io.observe(li))
    return () => io.disconnect()
  }, [wide])

  const f = featured[at]
  return (
    <section id="work" className="vn-work" aria-labelledby="work-h">
      <Slate
        no={c.no}
        label={c.label}
        title={c.title}
        hot={c.hot}
        lede={c.lede}
        id="work-h"
      >
        <Link className="v7-go" href={`${VN}/projects`}>
          {c.all} →
        </Link>
      </Slate>

      <div className="vn-reelwork">
        {wide ? (
          <div className="vn-player-col" aria-hidden="true">
            <div className="vn-player">
              <div ref={screen} className="vn-screen">
                {/* every piece stays mounted (its 3D, if any, is set up once, in idle time); only the one on show is displayed */}
                {featured.map((e, i) => (
                  <div
                    key={e.slug}
                    className="vn-pane"
                    data-on={i === at ? '' : undefined}
                  >
                    {e.motion ? (
                      <Motion motion={e.motion} label={e.alt} />
                    ) : null}
                  </div>
                ))}
                <span className="vn-cut" key={cut} />
              </div>
              <div className="vn-player-hud">
                <span>
                  {String(at + 1).padStart(2, '0')} /{' '}
                  {String(featured.length).padStart(2, '0')}
                </span>
                <span>{f.shows}</span>
              </div>
            </div>
          </div>
        ) : null}
        <ol ref={list} className="vn-entries">
          {featured.map((e, i) => (
            <li
              key={e.slug}
              data-i={i}
              data-on={wide && i === at ? '' : undefined}
            >
              {!wide && e.motion ? (
                <div className="vn-inline">
                  <Motion motion={e.motion} label={e.alt} />
                </div>
              ) : null}
              <span className="vn-entry-no">
                {String(i + 1).padStart(2, '0')} · {e.kind}
              </span>
              <h3>
                <Link href={e.href}>{e.title}</Link>
              </h3>
              <p className="vn-entry-line">{e.line}</p>
              <dl className="vn-entry-facts">
                <div>
                  <dt>Proof</dt>
                  <dd>{e.proof}</dd>
                </div>
                <div>
                  <dt>My part</dt>
                  <dd>{e.part}</dd>
                </div>
              </dl>
              <Link className="v7-go" href={e.href}>
                {c.open} →
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <ul className="vn-bento" aria-label="More selected work">
        {bento.map((t) => (
          <li
            key={t.slug}
            className={`vn-tile is-${t.size}`}
            onPointerEnter={(ev) => replayIn(ev.currentTarget)}
            onFocusCapture={(ev) => replayIn(ev.currentTarget)}
          >
            <Link
              href={t.href}
              className="vn-tile-link"
              aria-label={`${t.title}: ${t.line}`}
            />
            <div
              className="vn-tile-media"
              aria-hidden="true"
              data-fit={t.size === 'tall' ? 'crop' : 'full'}
            >
              {t.motion ? (
                <Motion motion={t.motion} label={t.alt} tile />
              ) : t.figure ? (
                <div className="vn-figure">
                  <span>
                    <b>{t.figure.from}</b>
                    <small>{t.figure.fromNote}</small>
                  </span>
                  <i>→</i>
                  <span>
                    <b className="fx">{t.figure.to}</b>
                    <small>{t.figure.toNote}</small>
                  </span>
                </div>
              ) : t.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.image.src}
                  alt=""
                  loading="lazy"
                  style={{
                    objectFit: t.image.fit ?? 'cover',
                    objectPosition: t.image.position,
                  }}
                />
              ) : null}
            </div>
            <div className="vn-tile-cap">
              <span className="vn-tile-kind">{t.kind}</span>
              <h3>{t.title}</h3>
              <p>{t.line}</p>
              <span className="vn-badge">{t.proof}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
