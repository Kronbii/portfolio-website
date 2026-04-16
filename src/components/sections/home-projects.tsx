'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { homeContent } from '@/content/home'
import { projectMap } from '@/content/projects'
import { type Project } from '@/content/schema'
import { FancyText } from '@/components/ui/fancy-text'
import { Container } from '@/components/ui/container'
import { MotionDiv, MotionSection } from '@/components/ui/motion'
import { CometCard } from '@/components/ui/comet-card'
import FeaturesWithPanel, { type FeatureItem } from '@/components/features-with-panel'
import { revealUpEarly, staggerContainerEarly } from '@/lib/motion'
import { cn } from '@/lib/utils'

const spotlightProjects = homeContent.projects.spotlightSlugs
  .map((slug) => projectMap[slug])
  .filter(Boolean)

function toFeatureItems(project: Project): FeatureItem[] {
  return project.features.map((feature) => ({
    title: feature,
    content: project.media.src,
    alt: project.media.alt,
  }))
}

export function HomeProjectsSection() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [cols, setCols] = useState(2)

  useEffect(() => {
    const update = () => setCols(window.innerWidth >= 1024 ? 3 : 2)
    update()
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Group projects into rows based on current column count
  const rows: Project[][] = []
  for (let i = 0; i < spotlightProjects.length; i += cols) {
    rows.push(spotlightProjects.slice(i, i + cols))
  }

  const selectedProject = selectedSlug
    ? spotlightProjects.find((p) => p.slug === selectedSlug) ?? null
    : null

  const handleCardClick = (slug: string) => {
    setSelectedSlug((prev) => (prev === slug ? null : slug))
  }

  return (
    <MotionSection
      id="selected-work"
      className="section-theme-dark border-b border-border bg-background py-24 sm:py-28"
      {...revealUpEarly}
    >
      <Container className="space-y-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {homeContent.projects.eyebrow}
            </p>
            <h2 className="mt-4">
              <FancyText
                className="text-balance text-4xl font-semibold tracking-tight text-foreground/5 sm:text-5xl"
                fillClassName="text-foreground"
              >
                {homeContent.projects.title}
              </FancyText>
            </h2>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {homeContent.projects.description}
            </p>
          </div>
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
          {rows.map((row, rowIndex) => (
            <>
              {row.map((project, cardIndex) => {
                const href = project.externalUrl || project.githubUrl
                const isExternal = href.startsWith('http')
                const isSelected = selectedSlug === project.slug
                const globalIndex = rowIndex * cols + cardIndex

                return (
                  <MotionDiv key={project.slug} {...revealUpEarly}>
                    <CometCard className="w-full" rotateDepth={8} translateDepth={10} scaleOnHover={1.02} zOnHover={20}>
                      <div
                        role="button"
                        onClick={() => handleCardClick(project.slug)}
                        className={cn(
                          'group relative block aspect-square overflow-hidden rounded-2xl cursor-pointer transition-shadow duration-300',
                          isSelected && 'ring-2 ring-white/70'
                        )}
                      >
                        <Image
                          src={project.media.src}
                          alt={project.media.alt}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

                        {isSelected && (
                          <div className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <X size={12} className="text-white" strokeWidth={2.5} />
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                            {(globalIndex + 1).toString().padStart(2, '0')} / {project.technologies[0]}
                          </p>
                          <h3 className="mt-1.5 text-base font-black uppercase leading-[0.95] tracking-tight text-white sm:text-xl">
                            {project.title}
                          </h3>
                          <ul className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <li
                                key={`${project.slug}-${tech}`}
                                className="border border-white/25 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/60"
                              >
                                {tech}
                              </li>
                            ))}
                          </ul>
                          <a
                            href={href}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 transition-transform duration-300 group-hover:translate-x-1"
                          >
                            View Project
                            <ArrowUpRight size={12} aria-hidden strokeWidth={2.5} />
                          </a>
                        </div>
                      </div>
                    </CometCard>
                  </MotionDiv>
                )
              })}

              {/* Panel spans full row width, appears right after this row */}
              <AnimatePresence key={`panel-row-${rowIndex}`}>
                {row.some((p) => p.slug === selectedSlug) && selectedProject && (
                  <motion.div
                    key={selectedProject.slug}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    className="col-span-full overflow-hidden border border-border"
                  >
                    <FeaturesWithPanel
                      title={selectedProject.title}
                      items={toFeatureItems(selectedProject)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ))}
        </MotionDiv>
      </Container>
    </MotionSection>
  )
}
