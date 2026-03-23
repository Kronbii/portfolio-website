'use client'

import { homeContent } from '@/content/home'
import { SectionHeading } from '@/components/blocks/section-heading'
import { Card } from '@/components/ui/card'
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
        <SectionHeading {...capabilities} />
        <MotionDiv className="grid gap-6 lg:grid-cols-3" {...staggerContainer}>
          {capabilities.items.map((item) => (
            <MotionDiv key={item.title} {...revealUp}>
              <Card className="h-full">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
                  Capability
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </Card>
            </MotionDiv>
          ))}
        </MotionDiv>
      </Container>
    </MotionSection>
  )
}
