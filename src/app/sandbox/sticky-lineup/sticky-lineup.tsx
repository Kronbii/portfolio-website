'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef } from 'react'

/**
 * Sticky lineup — the vatn.com "The Lineup" scroll pattern.
 *
 * Two columns share one gap value. Each media slot is a plain block whose
 * height is synced to its paired text block; inside it sits a `position: sticky`
 * figure. The figure pins while you read its paragraph, then unpins as the slot
 * ends and the next image slides up over it. No scroll listener, no
 * IntersectionObserver, no animation library — the only JS is the height sync.
 *
 * Deviation from vatn: they run the sync on `load` + a debounced `resize` and
 * set heights on the elements they also measure, so they have to reset to
 * `auto` and force a reflow first. Here the measured elements (the figure and
 * the text's inner wrapper) are never the ones written to, so measurement is
 * always natural and a ResizeObserver can drive it without feedback looping.
 */

export interface LineupSpec {
  label: string
  value: string
}

export interface LineupItem {
  name: string
  note: string
}

export interface LineupEntry {
  id: string
  index: string
  kicker: string
  title: string
  body: string
  specs: LineupSpec[]
  items: LineupItem[]
  image: { src: string; alt: string }
}

const DESKTOP_QUERY = '(min-width: 1024px)'

export function StickyLineup({ entries }: { entries: LineupEntry[] }) {
  const mediaSlots = useRef<(HTMLDivElement | null)[]>([])
  const mediaFigures = useRef<(HTMLElement | null)[]>([])
  const textSlots = useRef<(HTMLDivElement | null)[]>([])
  const textInners = useRef<(HTMLDivElement | null)[]>([])

  const sync = useCallback(() => {
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches
    const pairs = Math.min(mediaSlots.current.length, textSlots.current.length)

    for (let i = 0; i < pairs; i += 1) {
      const mediaSlot = mediaSlots.current[i]
      const textSlot = textSlots.current[i]
      if (!mediaSlot || !textSlot) continue

      if (!isDesktop) {
        mediaSlot.style.height = ''
        textSlot.style.height = ''
        continue
      }

      // Measured, never written to — so these are always natural heights.
      const mediaHeight = mediaFigures.current[i]?.offsetHeight ?? 0
      const textHeight = textInners.current[i]?.offsetHeight ?? 0
      const target = Math.ceil(Math.max(mediaHeight, textHeight))
      if (!target) continue

      const next = `${target}px`
      if (mediaSlot.style.height !== next) mediaSlot.style.height = next
      if (textSlot.style.height !== next) textSlot.style.height = next

      // The effect lives entirely in this difference. If the image is as tall
      // as its slot the figure has nowhere to travel and sticky does nothing,
      // which looks exactly like sticky being broken. Keep it loud in dev.
      if (process.env.NODE_ENV !== 'production' && target - mediaHeight < 24) {
        console.warn(
          `[sticky-lineup] pair ${i} has ${target - mediaHeight}px of travel — ` +
            `image is ${mediaHeight}px, text is ${textHeight}px. ` +
            'The text block must be taller than the image for the pin to be visible.'
        )
      }
    }
  }, [])

  useEffect(() => {
    let frame = 0
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(sync)
    }

    const observer = new ResizeObserver(schedule)
    for (const element of [...mediaFigures.current, ...textInners.current]) {
      if (element) observer.observe(element)
    }

    const media = window.matchMedia(DESKTOP_QUERY)
    media.addEventListener('change', schedule)

    // Web fonts land after first paint and change every text height.
    document.fonts?.ready.then(schedule).catch(() => {})
    schedule()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      media.removeEventListener('change', schedule)
    }
  }, [sync])

  return (
    <div
      className="lineup-row grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10"
      style={
        {
          // One value, read by both columns. If these ever diverge, the
          // images desynchronise from their paragraphs and the effect breaks.
          '--lineup-gap': 'clamp(6rem, 11vw, 15rem)',
          '--lineup-sticky-top': '6rem',
        } as React.CSSProperties
      }
    >
      {/* LEFT — sticky media. Hidden below lg; each text block carries its own
          inline image there instead, exactly as vatn does. */}
      <div
        className="hidden flex-col items-start lg:flex"
        style={{ gap: 'var(--lineup-gap)' }}
      >
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            ref={(el) => {
              mediaSlots.current[i] = el
            }}
            className="w-full"
          >
            <figure
              ref={(el) => {
                mediaFigures.current[i] = el
              }}
              className="sticky w-full"
              style={{ top: 'var(--lineup-sticky-top)' }}
            >
              <div className="relative h-[min(56svh,34rem)] w-full overflow-hidden rounded-sm border border-border bg-surface">
                <Image
                  src={entry.image.src}
                  alt={entry.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
              <figcaption className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                {entry.index} / {entries.length.toString().padStart(2, '0')}
              </figcaption>
            </figure>
          </div>
        ))}
      </div>

      {/* RIGHT — scrolling text. Same gap, same order, one block per image. */}
      <div className="grid" style={{ gap: 'var(--lineup-gap)' }}>
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            ref={(el) => {
              textSlots.current[i] = el
            }}
          >
            <div
              ref={(el) => {
                textInners.current[i] = el
              }}
            >
              <div className="relative mb-8 aspect-[11/10] w-full overflow-hidden rounded-sm border border-border bg-surface lg:hidden">
                <Image
                  src={entry.image.src}
                  alt={entry.image.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                {entry.kicker}
              </p>
              <h3 className="mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl">
                {entry.title}
              </h3>
              <p className="mt-6 max-w-[46ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                {entry.body}
              </p>

              <dl className="mt-10">
                {entry.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="grid grid-cols-[minmax(0,9rem)_1fr] gap-4 border-t border-border py-4"
                  >
                    <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                      {spec.label}
                    </dt>
                    <dd className="text-sm text-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-14 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                Components
              </p>
              <ul className="mt-4">
                {entry.items.map((item) => (
                  <li
                    key={item.name}
                    className="grid grid-cols-[minmax(0,10rem)_1fr] items-start gap-6 border-t border-border py-5"
                  >
                    <span className="text-2xl leading-none tracking-tight">
                      {item.name}
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {item.note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
