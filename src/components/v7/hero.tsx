'use client'

import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

import { chapters, v7Copy } from '@/content/v7/home'

import { Optic } from './optic'
import { B, focusIn } from './tempo'

/*
 * The first screen says three things: who (the name), what (robotics,
 * embedded, and systems engineer), and for whom. The last one cycles, calmly:
 * "I build for voters", then families in a crisis, clinics, people who sign,
 * students, each held for six beats at 96 BPM while its work comes into focus
 * beside it. The full sentence is in the page for anyone who cannot watch.
 */

const PEOPLE = chapters.filter((c) => c.id !== 'machines')
const HOLD = 6 * B

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const c = v7Copy.hero

  useEffect(() => {
    const el = root.current
    if (!el) return
    const host = el.closest<HTMLElement>('[data-intro-root]')
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const words = Array.from(
      el.querySelectorAll<HTMLElement>('.v7-for-word > span')
    )
    const plates = Array.from(
      el.querySelectorAll<HTMLElement>('.v7-window-plate > *')
    )
    const caps = Array.from(
      el.querySelectorAll<HTMLElement>('.v7-window-cap [data-i]')
    )
    const dots = Array.from(el.querySelectorAll<HTMLElement>('.v7-dots i'))
    const n = words.length

    const ctx = gsap.context(() => {
      const show = (i: number, on: boolean) => {
        gsap.set([words[i], plates[i], caps[i]], {
          autoAlpha: on ? 1 : 0,
          '--ca': 0,
          filter: 'none',
        })
        if (on) dots[i].dataset.on = ''
        else delete dots[i].dataset.on
      }
      for (let i = 0; i < n; i++) show(i, i === 0)
      if (reduce) {
        el.dataset.rolled = ''
        return
      }

      // the cycle: the outgoing word and plate defocus into their fringe, the next resolves out of it
      const cycle = gsap.timeline({ paused: true, repeat: -1 })
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n
        const at = (i + 1) * HOLD
        cycle.to(
          [words[i], caps[i]],
          {
            autoAlpha: 0,
            filter: 'blur(8px)',
            '--ca': 8,
            y: -10,
            duration: 0.8 * B,
            ease: 'power1.in',
          },
          at - 0.8 * B
        )
        cycle.to(
          plates[i],
          {
            autoAlpha: 0,
            filter: 'blur(14px)',
            '--ca': 18,
            scale: 1.04,
            duration: 1.1 * B,
            ease: 'power1.in',
          },
          at - 1.1 * B
        )
        cycle.call(
          () => {
            delete dots[i].dataset.on
            dots[j].dataset.on = ''
          },
          [],
          at - 0.4 * B
        )
        cycle.fromTo(
          [words[j], caps[j]],
          { autoAlpha: 0, filter: 'blur(8px)', '--ca': 8, y: 12 },
          {
            autoAlpha: 1,
            filter: 'blur(0px)',
            '--ca': 0,
            y: 0,
            duration: 1.1 * B,
            ease: 'power2.out',
            immediateRender: false,
          },
          at - 0.15 * B
        )
        cycle.fromTo(
          plates[j],
          { autoAlpha: 0, filter: 'blur(16px)', '--ca': 20, scale: 1.05 },
          {
            autoAlpha: 1,
            filter: 'blur(0px)',
            '--ca': 0,
            scale: 1,
            duration: 1.6 * B,
            ease: 'power2.out',
            immediateRender: false,
          },
          at - 0.5 * B
        )
      }

      // the entrance: the name comes into focus (unless the preflight just set it down)
      let intro: gsap.core.Timeline | null = null
      const makeIntro = (landed: boolean) => {
        const t = gsap.timeline({ onComplete: () => void cycle.play(0) })
        if (!landed)
          focusIn(t, '.v7-name > span', 0, {
            dur: 1.6 * B,
            blur: 16,
            ca: 14,
            stagger: 0.35 * B,
          })
        focusIn(t, '.v7-role', landed ? 0 : 0.9 * B, { y: 14 })
        focusIn(t, '.v7-for', landed ? 0.4 * B : 1.4 * B, { y: 18, ca: 10 })
        focusIn(t, '.v7-window', landed ? 0.6 * B : 1.6 * B, {
          dur: 1.8 * B,
          blur: 18,
          ca: 16,
          scale: 1.03,
        })
        focusIn(t, '.v7-now, .v7-down', landed ? 1.2 * B : 2.4 * B, {
          y: 12,
          stagger: 0.3 * B,
        })
        return t
      }

      // pause the cycle while the hero is off screen
      const io = new IntersectionObserver(([e]) => {
        if (!intro || intro.progress() < 1) return
        if (e.isIntersecting) cycle.resume()
        else cycle.pause()
      })
      io.observe(el)

      const start = () => {
        el.dataset.rolled = ''
        intro = makeIntro(host?.dataset.intro === 'done')
      }
      const s = host?.dataset.intro
      if (s === 'on' || s === 'playing' || s === 'reveal') {
        gsap.set('.v7-role, .v7-for, .v7-window, .v7-now, .v7-down', {
          autoAlpha: 0,
        })
        const mo = new MutationObserver(() => {
          const v = host!.dataset.intro
          if (v === 'done' || v === 'off') {
            mo.disconnect()
            // later than the context's own run, so added to it (scoped selectors, reverted on unmount)
            ctx.add(start)
          }
        })
        mo.observe(host!, { attributes: true, attributeFilter: ['data-intro'] })
        return () => {
          mo.disconnect()
          io.disconnect()
        }
      }
      start()
      return () => io.disconnect()
    }, el)
    return () => ctx.revert()
  }, [])

  const list = PEOPLE.map((p) => p.who)
  const sentence = `${c.lead} ${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}.`

  return (
    <section ref={root} id="top" className="v7-hero" aria-labelledby="v7-name">
      <div>
        {/* exactly two lines: the preflight's name lands on them one to one */}
        <h1 id="v7-name" className="v7-name" data-lens="">
          <span className="fx">{c.first}</span>
          <span className="fx">
            {c.last}
            <span>.</span>
          </span>
        </h1>
        <p className="v7-role fx">
          {c.role}
          <span className="v7-where">{c.where}</span>
        </p>
        <p className="v7-for fx">
          <span className="v7-vh">{sentence}</span>
          <span aria-hidden="true">
            {c.lead}{' '}
            <span className="v7-for-word">
              {PEOPLE.map((p) => (
                <span key={p.id} className="fx">
                  <em>{p.who}</em>.
                </span>
              ))}
            </span>
          </span>
        </p>
        <p className="v7-now">
          <b>{c.now.label}</b>
          <a href={c.now.href}>{c.now.text}</a>
        </p>
        <a className="v7-down" href="#voters">
          {c.down}
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M8 2v11M3.5 8.5 8 13l4.5-4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
      <div className="v7-window" aria-hidden="true">
        <div className="v7-window-plate">
          {PEOPLE.map((p) =>
            p.plate.kind === 'image' ? (
              <Optic key={p.id} src={p.plate.src} position={p.plate.position} />
            ) : (
              <div
                key={p.id}
                className="v7-type fx"
                dir={p.plate.dir}
                lang={p.plate.dir === 'rtl' ? 'ar' : undefined}
              >
                {p.plate.text}
              </div>
            )
          )}
        </div>
        <div className="v7-window-cap">
          <span style={{ display: 'inline-grid' }}>
            {PEOPLE.map((p, i) => (
              <span key={p.id} data-i={i} style={{ gridArea: '1 / 1' }}>
                <b>{p.name}</b> · {p.label.toLowerCase()}
              </span>
            ))}
          </span>
          <span className="v7-dots">
            {PEOPLE.map((p) => (
              <i key={p.id} />
            ))}
          </span>
        </div>
      </div>
    </section>
  )
}
