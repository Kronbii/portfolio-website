'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

import { homeContent } from '@/content/home'
import { projectMap } from '@/content/projects'
import { SectionHeading } from '@/components/blocks/section-heading'
import { Container } from '@/components/ui/container'
import { MotionDiv, MotionSection } from '@/components/ui/motion'
import { CometCard } from '@/components/ui/comet-card'
import { revealUpEarly, staggerContainerEarly } from '@/lib/motion'

const spotlightProjects = homeContent.projects.spotlightSlugs
  .map((slug) => projectMap[slug])
  .filter(Boolean)

export function HomeProjectsSection() {
  return (
    <MotionSection
      id="selected-work"
      className="section-theme-dark border-b border-border bg-background py-24 sm:py-28"
      {...revealUpEarly}
    >
      <Container className="space-y-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <SectionHeading {...homeContent.projects} />
          <MotionDiv
            className="border border-border bg-surface/35 px-6 py-7"
            {...revealUpEarly}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Portfolio Snapshot
            </p>
            <p className="mt-4 text-5xl font-black leading-none text-foreground sm:text-6xl">
              {spotlightProjects.length}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Selected Builds
            </p>
          </MotionDiv>
        </div>

        <MotionDiv
          className="grid grid-cols-2 gap-4 lg:grid-cols-3 md:gap-6"
          {...staggerContainerEarly}
        >
          {spotlightProjects.map((project, index) => {
            const href = project.externalUrl || project.githubUrl
            const isExternal = href.startsWith('http')

            return (
              <MotionDiv key={project.slug} {...revealUpEarly}>
                <CometCard className="w-full">
                  <a
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    aria-label={`Open project: ${project.title}`}
                    className="group relative block aspect-square overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={project.media.src}
                      alt={project.media.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                        {(index + 1).toString().padStart(2, '0')} / {project.technologies[0]}
                      </p>
                      <h3 className="mt-1.5 text-base font-black uppercase leading-[0.95] tracking-tight text-white sm:text-xl">
                        {project.title}
                      </h3>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <li
                            key={`${project.slug}-${tech}`}
                            className="border border-white/25 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/60"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 transition-transform duration-300 group-hover:translate-x-1">
                        View Project
                        <ArrowUpRight size={12} aria-hidden strokeWidth={2.5} />
                      </div>
                    </div>
                  </a>
                </CometCard>
              </MotionDiv>
            )
          })}
        </MotionDiv>
      </Container>
    </MotionSection>
  )
}
