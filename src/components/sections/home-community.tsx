'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

import { homeContent } from '@/content/home'
import { SectionHeading } from '@/components/blocks/section-heading'
import { Container } from '@/components/ui/container'
import { MotionDiv, MotionSection } from '@/components/ui/motion'
import { revealUpEarly, staggerContainerEarly } from '@/lib/motion'

export function HomeCommunitySection() {
  const { community } = homeContent

  return (
    <MotionSection
      id="community"
      className="border-b border-border bg-background py-24 sm:py-28"
      {...revealUpEarly}
    >
      <Container className="space-y-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <SectionHeading {...community} />
          <MotionDiv
            className="border border-border bg-surface/40 px-6 py-7"
            {...revealUpEarly}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Mission In Action
            </p>
            <p className="mt-4 text-5xl font-black leading-none text-foreground sm:text-6xl">
              {community.items.length}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Initiatives Led
            </p>
          </MotionDiv>
        </div>

        <MotionDiv className="grid gap-6 lg:grid-cols-2" {...staggerContainerEarly}>
          {community.items.map((item, index) => {
            const hasLink = Boolean(item.link)
            const isExternal = item.link?.startsWith('http')
            const cardClassName =
              'group overflow-hidden border border-border bg-surface/40 transition-colors duration-300 hover:bg-surface/60'

            const cardContent = (
              <>
                <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1024px) 44vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
                  <span className="absolute left-4 top-4 border border-border bg-background/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur-sm">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>

                <div className="space-y-5 p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {item.date}
                  </p>

                  <h3 className="text-2xl font-black uppercase leading-[0.95] tracking-tight text-foreground sm:text-3xl">
                    {item.title}
                  </h3>

                  <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {item.tagline}
                  </p>

                  {hasLink ? (
                    <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-transform duration-300 group-hover:translate-x-1">
                      Learn More
                      <ArrowUpRight size={16} aria-hidden strokeWidth={2.5} />
                    </span>
                  ) : (
                    <span className="inline-flex border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Local Impact Initiative
                    </span>
                  )}
                </div>
              </>
            )

            if (hasLink && item.link) {
              return (
                <MotionDiv key={item.id} {...revealUpEarly}>
                  <a
                    href={item.link}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className={cardClassName}
                  >
                    {cardContent}
                  </a>
                </MotionDiv>
              )
            }

            return (
              <MotionDiv key={item.id} {...revealUpEarly}>
                <article className={cardClassName}>{cardContent}</article>
              </MotionDiv>
            )
          })}
        </MotionDiv>
      </Container>
    </MotionSection>
  )
}
