'use client'

import { homeContent } from '@/content/home'
import { projectMap } from '@/content/projects'
import { ProjectCard } from '@/components/blocks/project-card'
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
        <MotionDiv className="grid gap-6 xl:grid-cols-3" {...staggerContainer}>
          {spotlightProjects.map((project) => (
            <MotionDiv key={project.slug} {...revealUp}>
              <ProjectCard project={project} />
            </MotionDiv>
          ))}
        </MotionDiv>
      </Container>
    </MotionSection>
  )
}
