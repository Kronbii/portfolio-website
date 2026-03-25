'use client'

import { homeContent } from '@/content/home'
import { SectionHeading } from '@/components/blocks/section-heading'

import { Container } from '@/components/ui/container'
import { MotionDiv, MotionSection } from '@/components/ui/motion'
import { revealUp, staggerContainer } from '@/lib/motion'

export function HomeCapabilitiesSection() {
  const { capabilities } = homeContent

  return (
    <MotionSection
      id="capabilities"
      className="border-b border-border py-20 sm:py-24"
      {...revealUp}
    >
      <Container className="space-y-12">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground uppercase pt-8">
          {capabilities.eyebrow}
        </h2>
        <MotionDiv className="flex flex-col border-t border-border" {...staggerContainer}>
          {capabilities.items.map((item, index) => (
            <MotionDiv 
              key={item.title} 
              className="group flex flex-col lg:flex-row items-start lg:items-baseline gap-4 lg:gap-16 border-b border-border py-12 transition-colors hover:bg-muted/20"
              {...revealUp}
            >
              <div className="w-full lg:w-1/4 shrink-0 flex items-baseline justify-between lg:flex-col lg:justify-start gap-4 lg:gap-2">
                <span className="text-3xl lg:text-5xl font-light tracking-tight text-muted-foreground/30 transition-colors group-hover:text-foreground/50">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
                  Capability
                </p>
              </div>
              <div className="w-full lg:w-3/4">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tighter text-foreground transition-transform duration-500 ease-out group-hover:translate-x-2">
                  {item.title}
                </h3>
                <p className="mt-4 lg:mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </MotionDiv>
          ))}
        </MotionDiv>
      </Container>
    </MotionSection>
  )
}
