import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

import { Container } from '@/components/ui/container'
import { homeContent } from '@/content/home'

/**
 * Community — the same stacked sticky lineup as Selected Work, mirrored.
 *
 * Media is on the RIGHT here and copy on the LEFT, so the two sections read as
 * one system rather than one repeated twice. The mechanism is identical: each
 * figure is one viewport tall and pinned at `top-0` with its image centred, so
 * every image arrives by scrolling and lands in the same rectangle, covering
 * the one before it. The copy column is not sticky — it scrolls past at page
 * speed, which is what keeps the two columns reading as independent.
 *
 * No JavaScript and no height measurement: the pairing holds because both
 * columns are grids of equal-height rows.
 *
 * Geometry is shared with home-projects.tsx (660x600 at 11/10, matched to
 * vatn.com, inside a 90rem container). If one changes, change both — the two
 * sections are meant to sit at the same scale.
 */

const FRAME_W = 'min(41.25rem, 44vw)'
const FRAME_H = `min(calc(${FRAME_W} / 1.1), 76svh)`

const communityItems = homeContent.community.items

export function HomeCommunitySection() {
  const total = communityItems.length.toString().padStart(2, '0')

  return (
    <section
      id="community"
      className="border-b border-border bg-background"
    >
      <Container className="max-w-[90rem] pt-24 sm:pt-28">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-muted-foreground">
          {homeContent.community.eyebrow}
        </p>
        <h2 className="mt-6 whitespace-nowrap text-[clamp(1.125rem,4.2vw,4rem)] leading-[1.1] tracking-tight">
          {homeContent.community.title}
        </h2>
      </Container>

      <Container className="max-w-[90rem]">
        <div
          className="grid grid-cols-1 lg:mt-[var(--lineup-pull)] lg:grid-cols-2"
          style={
            {
              '--frame-w': FRAME_W,
              '--frame-h': FRAME_H,
              '--lineup-pull': `calc(4rem - (100svh - ${FRAME_H}) / 2)`,
            } as React.CSSProperties
          }
        >
          {/* LEFT — flowing copy. Mirrored from Selected Work, where this
              column sits on the right. */}
          <div className="grid">
            {communityItems.map((item, index) => (
              <div
                key={item.id}
                className="grid h-svh place-content-center lg:pr-16"
              >
                <div className="flex w-full max-w-[34rem] flex-col justify-between lg:min-h-[var(--frame-h)]">
                  <div className="relative mb-10 aspect-[11/10] w-full overflow-hidden rounded-[2px] border border-border bg-surface lg:hidden">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="100vw"
                      quality={90}
                      className="object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-foreground">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="h-px w-10 shrink-0 bg-border" />
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                      {item.date}
                    </span>
                  </div>

                  <div className="py-6 xl:py-8">
                    <h3 className="text-[2.5rem] leading-[0.95] tracking-tight lg:text-[3rem] xl:text-[3.5rem]">
                      {item.title}
                    </h3>
                    <p className="mt-6 max-w-[38ch] text-[1.0625rem] leading-[1.6] text-muted-foreground xl:mt-7 xl:text-[1.1875rem]">
                      {item.tagline}
                    </p>
                  </div>

                  <div>
                    {item.points?.length ? (
                      <ul className="border-t border-border">
                        {item.points.slice(0, 3).map((point) => (
                          <li
                            key={point}
                            className="border-b border-border py-3 text-[0.9375rem] leading-[1.55] text-muted-foreground xl:py-[0.875rem] xl:text-[1.03125rem]"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-6 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-foreground"
                      >
                        Visit
                        <ArrowUpRight
                          size={12}
                          strokeWidth={2}
                          aria-hidden
                          className="transition-transform duration-base group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — pinned media. Hidden below lg, where each copy block
              carries its own inline image instead. */}
          <div className="hidden lg:grid lg:justify-items-end">
            {communityItems.map((item, index) => (
              <figure
                key={item.id}
                className="sticky top-0 grid h-svh place-content-center"
              >
                <div className="relative h-[var(--frame-h)] w-[var(--frame-w)] overflow-hidden rounded-[2px] border border-border bg-surface">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="44vw"
                    quality={90}
                    className="object-cover"
                  />
                  {/* Inside the frame, so the incoming image occludes it.
                      Outside, every previous caption stays visible. */}
                  <figcaption className="absolute bottom-0 right-0 bg-background px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                    {(index + 1).toString().padStart(2, '0')} / {total}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </Container>

      <div className="h-[20svh]" />
    </section>
  )
}
