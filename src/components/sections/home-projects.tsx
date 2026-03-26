'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

import { homeContent } from '@/content/home'
import { projectMap } from '@/content/projects'
import { SectionHeading } from '@/components/blocks/section-heading'
import { Container } from '@/components/ui/container'
import { MotionDiv, MotionSection } from '@/components/ui/motion'
import { revealUp, staggerContainer } from '@/lib/motion'

const spotlightProjects = homeContent.projects.spotlightSlugs
  .map((slug) => projectMap[slug])
  .filter(Boolean)

export function HomeProjectsSection() {
  return (
    <MotionSection
      id="selected-work"
      className="section-theme-dark border-b border-border bg-background py-24 sm:py-28"
      {...revealUp}
    >
      <Container className="space-y-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <SectionHeading {...homeContent.projects} />
          <MotionDiv
            className="border border-border bg-surface/35 px-6 py-7"
            {...revealUp}
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

        <MotionDiv className="grid gap-6 md:gap-8" {...staggerContainer}>
          {spotlightProjects.map((project, index) => {
            const href = project.externalUrl || project.githubUrl
            const isExternal = href.startsWith('http')

            return (
              <MotionDiv
                key={project.slug}
                className="group border border-border bg-surface/20 transition-colors duration-300 hover:bg-surface/40"
                {...revealUp}
              >
                <article className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-10">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      {(index + 1).toString().padStart(2, '0')} / {project.technologies[0]}
                    </p>

                    <h3 className="mt-4 text-3xl font-black uppercase leading-[0.95] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                      {project.title}
                    </h3>

                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                      {project.summary}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <li
                          key={`${project.slug}-${tech}`}
                          className="border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-foreground transition-transform duration-300 group-hover:translate-x-1"
                    >
                      View Project
                      <ArrowUpRight size={16} aria-hidden strokeWidth={2.5} />
                    </a>
                  </div>

                  <a
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    aria-label={`Open project: ${project.title}`}
                    className="relative block aspect-[16/10] overflow-hidden border border-border bg-surface"
                  >
                    <Image
                      src={project.media.src}
                      alt={project.media.alt}
                      fill
                      sizes="(min-width: 1024px) 36vw, (min-width: 640px) 80vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </a>
                </article>
              </MotionDiv>
            )
          })}
        </MotionDiv>
      </Container>
    </MotionSection>
  )
}
