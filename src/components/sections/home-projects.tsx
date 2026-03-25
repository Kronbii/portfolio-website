'use client'

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
      className="border-b border-border py-20 sm:py-24"
      {...revealUp}
    >
      <Container className="space-y-12">
        <SectionHeading {...homeContent.projects} />
        <MotionDiv className="flex flex-col border-t border-border mt-8" {...staggerContainer}>
          {spotlightProjects.map((project, index) => (
            <MotionDiv 
              key={project.slug} 
              className="group relative border-b border-border"
              {...revealUp}
            >
              <a 
                href={project.externalUrl || project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="relative z-10 block w-full py-12 lg:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex items-baseline gap-6 lg:w-1/2">
                  <span className="text-xl font-light text-muted-foreground/30 transition-colors group-hover:text-foreground/50">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground transition-transform duration-500 ease-out group-hover:translate-x-4">
                    {project.title}
                  </h3>
                </div>
                <div className="lg:w-1/3 flex flex-col lg:items-end">
                  <p className="text-sm opacity-0 group-hover:opacity-100 lg:text-right transition-opacity duration-500 text-muted-foreground lg:-translate-y-2 group-hover:translate-y-0 absolute lg:relative top-4 right-4 lg:top-auto lg:right-auto bg-background/80 lg:bg-transparent p-2 lg:p-0 backdrop-blur-sm lg:backdrop-blur-none rounded md:max-w-xs">
                    {project.summary}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand mt-4 lg:mt-6 group-hover:text-primarylw transition-colors">
                    Explore
                  </p>
                </div>
              </a>
              {/* Hover Image Reveal */}
              <div className="absolute top-1/2 left-[60%] lg:left-[70%] -translate-x-1/2 -translate-y-1/2 w-[280px] h-[190px] lg:w-[480px] lg:h-[320px] opacity-0 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-100 group-hover:scale-105 group-hover:rotate-2 z-0 overflow-hidden rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-surface-2">
                <img src={project.media.src} alt={project.media.alt} className="w-full h-full object-cover" />
              </div>
            </MotionDiv>
          ))}
        </MotionDiv>
      </Container>
    </MotionSection>
  )
}
