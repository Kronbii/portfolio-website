'use client'

import Image from 'next/image'

import { homeContent } from '@/content/home'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { MotionDiv, MotionSection } from '@/components/ui/motion'
import { pageEnter, revealUp, staggerContainer } from '@/lib/motion'

export function HomeHeroSection() {
  const { hero } = homeContent

  return (
    <MotionSection id="home" className="border-b border-border" {...pageEnter}>
      <Container className="grid min-h-[calc(100vh-4.5rem)] items-center gap-14 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
        <MotionDiv className="max-w-3xl" {...revealUp}>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            {hero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            {hero.subtitle}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            {hero.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <a href={hero.primaryCta.href}>{hero.primaryCta.label}</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
            </Button>
          </div>
        </MotionDiv>

        <MotionDiv className="relative" {...revealUp}>
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(255,124,67,0.25),transparent_48%)] blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface shadow-elevated">
            <div className="relative aspect-[4/5] bg-surface-2">
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </MotionDiv>

        <MotionDiv
          className="grid gap-4 lg:col-span-2 lg:grid-cols-3"
          {...staggerContainer}
        >
          {hero.metrics.map((metric) => (
            <MotionDiv
              key={metric.label}
              className="rounded-[1.5rem] border border-border bg-surface px-5 py-6 shadow-soft"
              {...revealUp}
            >
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {metric.value}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {metric.label}
              </p>
            </MotionDiv>
          ))}
        </MotionDiv>
      </Container>
    </MotionSection>
  )
}
