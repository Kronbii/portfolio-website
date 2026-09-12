import Image from 'next/image'

import { lineupEntries } from '../sticky-lineup/lineup-data'

/**
 * ui-layout.com sticky scroll — the fifth section of the reference.
 *
 * Reference markup, unchanged in mechanism:
 *   <figure className='sticky top-0 h-screen grid place-content-center'>
 *
 * Every panel is exactly one viewport tall and pinned at top-0 with its
 * contents centred, so each image arrives by scrolling and lands in the
 * identical rectangle, covering the one before it. The earlier image stays
 * pinned underneath rather than scrolling away. No JavaScript involved.
 *
 * Two deviations from the reference, both deliberate:
 *  1. The reference pairs the whole image stack with ONE sticky headline.
 *     This section needs per-project copy, so the right column carries one
 *     block per item. Those blocks are NOT sticky — they scroll normally past
 *     the pinned images, which is what makes the two columns read as
 *     independent. Making them sticky and opaque instead turns the copy into
 *     a solid panel sliding up, which reads as a second image, not as text.
 *
 *     They are `h-svh` so each one occupies exactly the scroll distance its
 *     image owns. Both columns are grids of equal-height rows, so the pairing
 *     stays in sync with no JavaScript and no height measurement.
 *  2. `h-screen` -> `h-svh`, and the image box is sized in `svh` so it can
 *     never outgrow a short viewport. Successive images must share exact
 *     dimensions or they stop covering each other.
 *
 * The reference is written for Tailwind v4 (`bg-size-*`, `mask-*`,
 * `bg-linear-to-r`). This project is on v3, so none of those class names
 * would have resolved — they are not used here.
 */

// Matched to vatn.com, measured live: their lineup image renders 660x600 —
// `max-width: 41.25rem` at an 11/10 ratio, identical at 1512px and 1920px
// because it is capped rather than viewport-scaled.
//
// 44vw keeps it inside its column below ~1500px, where 41.25rem would not fit.
// Height is derived from the width so the ratio holds, then clamped for short
// viewports. Both are single expressions, so every image resolves to the same
// pixel dimensions — which is what lets them cover each other exactly.
const FRAME_W = 'min(41.25rem, 44vw)'
const FRAME_H = `min(calc(${FRAME_W} / 1.1), 76svh)`

export default function StackLineupSandboxPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="mx-auto w-full max-w-[90rem] px-5 pb-24 pt-40 sm:px-8">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
          Pattern test — stacked panels
        </p>
        <h2 className="mt-6 max-w-[18ch] text-5xl leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
          Selected Work
        </h2>
        <p className="mt-8 max-w-[52ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
          Each image scrolls up and lands in the same place as the one before
          it, which stays pinned underneath. Pure CSS — no JavaScript at all.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[90rem] px-5 sm:px-8">
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={
            {
              '--frame-w': FRAME_W,
              '--frame-h': FRAME_H,
            } as React.CSSProperties
          }
        >
          {/* LEFT — the image stack. Reference markup, one figure per item. */}
          <div className="hidden lg:grid">
            {lineupEntries.map((entry) => (
              <figure
                key={entry.id}
                className="sticky top-0 grid h-svh place-content-center"
              >
                <div className="relative h-[var(--frame-h)] w-[var(--frame-w)] overflow-hidden rounded-[2px] border border-border bg-surface">
                  <Image
                    src={entry.image.src}
                    alt={entry.image.alt}
                    fill
                    sizes="44vw"
                    className="object-cover"
                    priority
                  />
                  {/* Inside the frame, so the incoming image occludes it.
                      Outside, every previous caption stays visible and they
                      pile up on top of each other. */}
                  <figcaption className="absolute bottom-0 left-0 bg-background px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                    {entry.index} /{' '}
                    {lineupEntries.length.toString().padStart(2, '0')}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>

          {/* RIGHT — matching stack, so copy lands with its image. */}
          <div className="grid">
            {lineupEntries.map((entry) => (
              <div
                key={entry.id}
                className="grid h-svh place-content-center lg:pl-16"
              >
                <div className="flex w-full max-w-[34rem] flex-col justify-between lg:h-[var(--frame-h)]">
                  <div
                    className="relative mb-10 aspect-[11/10] w-full overflow-hidden rounded-[2px] border border-border bg-surface lg:hidden"
                  >
                    <Image
                      src={entry.image.src}
                      alt={entry.image.alt}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Top — locator. Index, rule, context, nothing else. */}
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground">
                      {entry.index}
                    </span>
                    <span className="h-px w-10 shrink-0 bg-border" />
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                      {entry.kicker}
                    </span>
                  </div>

                  {/* Middle — the statement. Measure held well short of the
                      column so the paragraph never fills the width. */}
                  <div className="py-14">
                    <h3 className="text-5xl leading-[0.92] tracking-tight lg:text-6xl">
                      {entry.title}
                    </h3>
                    <p className="mt-10 max-w-[38ch] text-base leading-[1.7] text-muted-foreground">
                      {entry.body}
                    </p>
                  </div>

                  {/* Bottom — the specifics, given room to breathe. */}
                  <dl className="border-t border-border">
                    {entry.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="grid grid-cols-[minmax(0,8rem)_1fr] items-baseline gap-6 border-b border-border py-5"
                      >
                        <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                          {spec.label}
                        </dt>
                        <dd className="text-sm text-foreground">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-[30svh]" />
    </main>
  )
}
