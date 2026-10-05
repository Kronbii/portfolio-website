'use client'

import { gsap } from 'gsap'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { B } from '@/components/v7/tempo'
import { vneo } from '@/content/vneo/site'

import { LensImage } from './lens'
import { SlateMark } from './slate'

/*
 * What I build (v3's), as one sentence a visitor reads in a breath. Each
 * phrase is a control: pointing at it (or focusing, or tapping it) brings up
 * the work behind it, so the sentence doubles as the index. Beside it, my
 * portrait, seen through the page's lens, with the ID lock closing on it
 * once, on first sight.
 */
export function Build() {
  const c = vneo.build
  const [active, setActive] = useState(0)
  const group = c.groups[active]
  const plate = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = plate.current
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true })
      el.querySelectorAll('.vn-plock i').forEach((b, i) => {
        tl.fromTo(
          b,
          { opacity: 0, x: [-40, 40, -40, 40][i], y: [-30, -30, 30, 30][i] },
          { opacity: 1, x: 0, y: 0, duration: 0.8 * B, ease: 'power3.out' },
          0.6 * B + i * 0.04
        )
      })
      tl.fromTo(
        '.vn-ptag',
        { opacity: 0 },
        { opacity: 1, duration: 0.06, ease: 'none', repeat: 4, yoyo: true },
        0.7 * B
      )
      tl.progress(0)
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.intersectionRatio >= 0.4) {
            io.disconnect()
            tl.play(0)
          }
        },
        { threshold: [0, 0.4] }
      )
      io.observe(el)
      return () => io.disconnect()
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="build" className="vn-build" aria-labelledby="build-h">
      <SlateMark no={2} label={c.title} />
      <div className="vn-build-top">
        <div className="vn-build-text">
          <h2 id="build-h" className="v7-vh">
            {c.title}
          </h2>
          <p className="vn-build-sentence" data-lens="0.5">
            {c.lead}{' '}
            {c.groups.map((g, i) => (
              <span key={g.id}>
                {/* a span, not a <button>: a phrase has to wrap with the sentence around it */}
                <span
                  role="button"
                  tabIndex={0}
                  className="vn-phrase"
                  aria-pressed={i === active}
                  aria-controls="build-items"
                  onPointerEnter={(e) =>
                    e.pointerType === 'mouse' && setActive(i)
                  }
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActive(i)
                    }
                  }}
                  data-lock="Show"
                >
                  {g.phrase}
                </span>
                {g.joiner}{' '}
              </span>
            ))}
          </p>
          <p className="vn-build-hint">{c.hint}</p>
        </div>

        <figure className="vn-portrait">
          <div ref={plate} className="vn-portrait-plate">
            <LensImage
              src={c.portrait.src}
              alt={c.portrait.alt}
              position="50% 100%"
              className="vn-portrait-img"
              weight={1}
            />
            <span className="vn-plock" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="vn-ptag" aria-hidden="true">
              {c.portrait.tag}
            </span>
          </div>
        </figure>
      </div>

      <ul
        className="vn-build-items"
        id="build-items"
        aria-live="polite"
        key={group.id}
      >
        {group.items.map((it, i) => (
          <li key={it.slug} style={{ '--i': i } as React.CSSProperties}>
            <Link href={it.href} className="vn-bitem">
              <span className="vn-bthumb" aria-hidden={!it.image}>
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={it.image.src}
                    alt={it.image.alt}
                    loading="lazy"
                    style={{
                      objectPosition: it.image.position ?? '50% 50%',
                    }}
                  />
                ) : (
                  <span className="vn-bthumb-kind">{it.kind}</span>
                )}
              </span>
              <span className="vn-bkind">{it.kind}</span>
              <span className="vn-btitle">{it.title}</span>
              <span className="vn-bline">{it.line}</span>
              <span className="vn-bgo" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
