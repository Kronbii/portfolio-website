import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

import { Container } from '@/components/ui/container'
import { homeContent } from '@/content/home'
import { projectMap } from '@/content/projects'

/**
 * Selected work — stacked sticky lineup.
 *
 * Each figure is one viewport tall and pinned at `top-0` with its image
 * centred, so every image arrives by scrolling and lands in the identical
 * rectangle, covering the one before it. The text column is deliberately NOT
 * sticky: it scrolls past at page speed, which is what makes the two columns
 * read as independent rather than as one moving surface.
 *
 * There is no JavaScript here, and no height measurement — the pairing holds
 * because both columns are grids of equal-height rows.
 *
 * Geometry is matched to vatn.com, measured live: a 660x600 image (11/10 at
 * `max-width: 41.25rem`) inside a 90rem container. That container is wider
 * than the site default of `max-w-7xl`, which caps each column at 592px and
 * cannot fit a 660px image. `44vw` keeps it inside the column below ~1500px.
 *
 * Every image must resolve to identical pixel dimensions or they stop
 * covering each other — so both values are single expressions with no
 * percentages.
 */

const FRAME_W = 'min(41.25rem, 44vw)'
const FRAME_H = `min(calc(${FRAME_W} / 1.1), 76svh)`

const spotlightProjects = homeContent.projects.spotlightSlugs
  .map((slug) => projectMap[slug])
  .filter(Boolean)

export function HomeProjectsSection() {
  const total = spotlightProjects.length.toString().padStart(2, '0')

  return (
    <section
      id="selected-work"
      className="section-theme-dark border-b border-border bg-background"
    >
      {/* No bottom padding here, and the grid below is pulled up by
          `--lineup-pull`. See that variable for why. */}
      <Container className="max-w-[90rem] pt-24 sm:pt-28">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
          {homeContent.projects.eyebrow}
        </p>
        {/* Sized to hold one line at every width rather than wrapped by a
            max-width — `max-w-[16ch]` was what broke it across two lines. */}
        <h2 className="mt-6 whitespace-nowrap text-[clamp(1.25rem,5vw,4.5rem)] leading-[1.1] tracking-tight">
          {homeContent.projects.title}
        </h2>
      </Container>

      <Container className="max-w-[90rem]">
        <div
          className="grid grid-cols-1 lg:mt-[var(--lineup-pull)] lg:grid-cols-2"
          style={
            {
              '--frame-w': FRAME_W,
              '--frame-h': FRAME_H,
              // Each row is viewport-tall with the image centred, so there is
              // (100svh - frame) / 2 of dead space above the first image —
              // 150px at 900px tall, 240px at 1080px. Pulling the grid up by
              // that surplus leaves a fixed 4rem under the title at any
              // viewport height. Both columns shift together, so the pairing
              // is untouched, and pinned images still centre in the viewport
              // because that depends on the row, not the grid offset.
              '--lineup-pull': `calc(4rem - (100svh - ${FRAME_H}) / 2)`,
            } as React.CSSProperties
          }
        >
          {/* Pinned media. Hidden below lg, where each text block carries its
              own inline image instead. */}
          <div className="hidden lg:grid">
            {spotlightProjects.map((project, index) => (
              <figure
                key={project.slug}
                className="sticky top-0 grid h-svh place-content-center"
              >
                <div className="relative h-[var(--frame-h)] w-[var(--frame-w)] overflow-hidden rounded-[2px] border border-border bg-surface">
                  <Image
                    src={project.media.src}
                    alt={project.media.alt}
                    fill
                    sizes="44vw"
                    quality={90}
                    className="object-cover"
                    priority={index === 0}
                  />
                  {/* Inside the frame, so the incoming image occludes it.
                      Outside, every previous caption stays visible. */}
                  <figcaption className="absolute bottom-0 left-0 bg-background px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                    {(index + 1).toString().padStart(2, '0')} / {total}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>

          {/* Flowing copy. One row per project, matched to the media rows. */}
          <div className="grid">
            {spotlightProjects.map((project, index) => {
              const href = project.externalUrl || project.githubUrl
              const isExternal = href.startsWith('http')

              return (
                <div
                  key={project.slug}
                  className="grid h-svh place-content-center lg:pl-16"
                >
                  <div className="flex w-full max-w-[34rem] flex-col justify-between lg:min-h-[var(--frame-h)]">
                    <div className="relative mb-10 aspect-[11/10] w-full overflow-hidden rounded-[2px] border border-border bg-surface lg:hidden">
                      <Image
                        src={project.media.src}
                        alt={project.media.alt}
                        fill
                        sizes="100vw"
                        quality={90}
                        className="object-cover"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="h-px w-10 shrink-0 bg-border" />
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                        {project.technologies[0]}
                      </span>
                    </div>

                    <div className="py-12">
                      <h3 className="text-4xl leading-[0.95] tracking-tight lg:text-5xl">
                        {project.title}
                      </h3>
                      <p className="mt-8 max-w-[40ch] text-base leading-[1.7] text-muted-foreground">
                        {project.summary}
                      </p>
                    </div>

                    <div>
                      <ul className="border-t border-border">
                        {project.features.slice(0, 3).map((feature) => (
                          <li
                            key={feature}
                            className="border-b border-border py-4 text-sm leading-relaxed text-muted-foreground"
                          >
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <a
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="group mt-6 inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground"
                      >
                        View project
                        <ArrowUpRight
                          size={12}
                          strokeWidth={2}
                          aria-hidden
                          className="transition-transform duration-base group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Container>

      <div className="h-[20svh]" />
    </section>
  )
}
