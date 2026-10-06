'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { memo, useEffect, useRef, useState } from 'react'

import { gsap, reducedMotion, ScrollTrigger } from '../motion/gsap'
import { useMotion } from '../motion/use-motion'
import { Slate } from '../home/slate'
import { EXPLAINERS, ExplainerSvg } from './explainers'
import styles from './work-reel.module.css'

export interface WorkEntry {
  slug: string
  title: string
  kind: string
  line: string
  shows: string
  proof: string
  part: string
  href: string
}

/** One explainer, looping whenever it is on screen (the phone layout). */
const InlineExplainer = memo(function InlineExplainer({ slug }: { slug: string }) {
  const box = useRef<HTMLDivElement>(null)
  useMotion(box, (el) => EXPLAINERS[slug].build(el.querySelector('svg')!), { loop: true, poster: 0.62 })
  return (
    <div ref={box} className={styles.screen}>
      <ExplainerSvg slug={slug} />
    </div>
  )
})

/*
 * Selected work, edited like a reel. On wide screens a player holds still on
 * the left while the entries scroll past on the right; as each entry reaches
 * the middle of the window, the player cuts (a wipe with the lens's colour
 * fringes) to that project's explainer and runs it in a loop. On phones each
 * entry carries its own explainer. Reduced motion holds every explainer on
 * a representative frame.
 */
export function WorkReel({
  slate,
  title,
  lede,
  all,
  read,
  entries,
}: {
  slate: string
  title: string
  lede: string
  all: string
  read: string
  entries: WorkEntry[]
}) {
  const [active, setActive] = useState(0)
  const player = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const timelines = useRef<gsap.core.Timeline[]>([])
  const shown = useRef(0)

  // the player: one looping timeline per explainer; only the one on screen runs
  useEffect(() => {
    const el = player.current
    const ol = list.current
    if (!el || !ol) return
    const wide = window.matchMedia('(min-width: 1021px)')
    if (!wide.matches) return
    const reduced = reducedMotion()
    const ctx = gsap.context(() => {
      const panes = Array.from(el.querySelectorAll<HTMLElement>('[data-pane]'))
      timelines.current = panes.map((p, i) => {
        const tl = EXPLAINERS[entries[i].slug].build(p.querySelector('svg')!)
        tl.repeat(-1)
        if (reduced) tl.progress(0.62)
        tl.pause()
        return tl
      })
      gsap.set(panes, { autoAlpha: 0 })
      gsap.set(panes[0], { autoAlpha: 1 })
      if (!reduced) timelines.current[0].play(0)
      gsap.set(el.querySelector('[data-cut]'), { x: 0, xPercent: -101 })

      Array.from(ol.querySelectorAll<HTMLElement>('[data-entry]')).forEach((entry, i) =>
        ScrollTrigger.create({
          trigger: entry,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (self.isActive) setActive(i)
          },
        }),
      )
    }, el)
    return () => ctx.revert()
  }, [entries])

  // the cut between explainers
  useEffect(() => {
    const el = player.current
    if (!el || !timelines.current.length) return
    const from = shown.current
    if (from === active) return
    shown.current = active
    const panes = Array.from(el.querySelectorAll<HTMLElement>('[data-pane]'))
    const cut = el.querySelector('[data-cut]')
    const reduced = reducedMotion()
    const swap = () => {
      timelines.current[from]?.pause()
      gsap.set(panes[from], { autoAlpha: 0 })
      gsap.set(panes[active], { autoAlpha: 1 })
      if (!reduced) timelines.current[active]?.play(0)
    }
    if (reduced) {
      swap()
      return
    }
    gsap
      .timeline()
      .fromTo(cut, { xPercent: -101 }, { xPercent: 0, duration: 0.2, ease: 'power2.in' })
      .call(swap)
      .to(cut, { xPercent: 101, duration: 0.26, ease: 'power2.out' })
  }, [active])

  return (
    <section className={styles.section} id="work" aria-labelledby="work-h">
      <div className={styles.wrap}>
        <Slate scene={4} label={slate} title={title} lede={lede} id="work-h">
          <Link href="/v4/projects" className={styles.all}>
            {all}
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </Slate>

        <div className={styles.body}>
          <div className={styles.playerCol} aria-hidden="true">
            <div ref={player} className={styles.player}>
              <div className={styles.screen}>
                {entries.map((e) => (
                  <div key={e.slug} data-pane="" className={styles.pane}>
                    <ExplainerSvg slug={e.slug} />
                  </div>
                ))}
                <div data-cut="" className={styles.cut} />
                <div className={styles.hud}>
                  <span>
                    {String(active + 1).padStart(2, '0')} / {String(entries.length).padStart(2, '0')}
                  </span>
                  <span>{entries[active]?.kind}</span>
                </div>
              </div>
              <p className={styles.shows}>{entries[active]?.shows}</p>
            </div>
          </div>

          <ol ref={list} className={styles.entries}>
            {entries.map((e, i) => (
              <li key={e.slug} data-entry="" className={styles.entry} data-on={i === active || undefined}>
                <div className={styles.inline}>
                  <InlineExplainer slug={e.slug} />
                  <p className={styles.shows}>{e.shows}</p>
                </div>
                <span className={styles.no}>
                  {String(i + 1).padStart(2, '0')} · {e.kind}
                </span>
                <h3 className={styles.title} data-lens="0.6">
                  {e.title}
                </h3>
                <p className={styles.line}>{e.line}</p>
                <div className={styles.meta}>
                  <span className={styles.proof}>{e.proof}</span>
                  <span className={styles.part}>{e.part}</span>
                </div>
                <Link href={e.href} className={styles.read}>
                  {read}
                  <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
