'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

import { homeContent } from '@/content/home'
import { SectionHeading } from '@/components/blocks/section-heading'

import { Container } from '@/components/ui/container'
import { MotionDiv, MotionSection } from '@/components/ui/motion'
import { revealUp, staggerContainer } from '@/lib/motion'

export function HomeCommunitySection() {
  const { community } = homeContent

  return (
    <section
      id="community"
      className="border-b border-border py-20 sm:py-24"
    >
      <Container className="space-y-12">
        <SectionHeading {...community} />
        <MotionDiv className="flex flex-col border-t border-border mt-8" {...staggerContainer}>
          {community.items.map((item) => (
            <MotionDiv 
              key={item.id} 
              className="group flex flex-col md:flex-row gap-8 lg:gap-16 items-center py-12 lg:py-20 border-b border-border transition-colors hover:bg-muted/10 cursor-default"
              {...revealUp}
            >
              <div className="w-full md:w-[45%] lg:w-[40%] relative aspect-[4/3] overflow-hidden bg-surface-2">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
              </div>
              <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col p-4 md:p-0">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground/50 transition-colors group-hover:text-muted-foreground">
                  {item.date}
                </p>
                <h3 className="mt-4 text-3xl lg:text-5xl font-semibold tracking-tighter text-foreground transition-colors group-hover:text-primarylw">
                  {item.title}
                </h3>
                <p className="mt-4 lg:mt-6 text-base lg:text-xl leading-relaxed text-muted-foreground max-w-2xl">
                  {item.tagline}
                </p>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 lg:mt-10 inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-foreground transition-all duration-300 hover:text-primarylw group-hover:translate-x-2"
                  >
                    Learn more
                    <ArrowUpRight size={16} aria-hidden strokeWidth={2.5} />
                  </a>
                ) : null}
              </div>
            </MotionDiv>
          ))}
        </MotionDiv>
      </Container>
    </section>
  )
}
