'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { homeContent } from '@/content/home'
import { type CommunityItem } from '@/content/schema'
import { FancyText } from '@/components/ui/fancy-text'
import { Container } from '@/components/ui/container'
import { MotionDiv, MotionSection } from '@/components/ui/motion'
import { CometCard } from '@/components/ui/comet-card'
import FeaturesWithPanel, { type FeatureItem } from '@/components/features-with-panel'
import { revealUpEarly, staggerContainerEarly } from '@/lib/motion'
import { cn } from '@/lib/utils'

const communityItems = homeContent.community.items

function toFeatureItems(item: CommunityItem): FeatureItem[] {
  const features: FeatureItem[] = [
    { title: item.tagline, content: item.image.src, alt: item.image.alt },
  ]
  if (item.date) {
    features.push({ title: `Active: ${item.date}`, content: item.image.src, alt: item.image.alt })
  }
  return features
}

export function HomeCommunitySection() {
  const { community } = homeContent
  const [selectedId, setSelectedId] = useState<string | null>(null)
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

  const rows: CommunityItem[][] = []
  for (let i = 0; i < communityItems.length; i += cols) {
    rows.push(communityItems.slice(i, i + cols))
  }

  const selectedItem = selectedId
    ? communityItems.find((item) => item.id === selectedId) ?? null
    : null

  const handleCardClick = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  return (
    <MotionSection
      id="community"
      className="border-b border-border bg-background py-24 sm:py-28"
      {...revealUpEarly}
    >
      <Container className="space-y-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {community.eyebrow}
            </p>
            <h2 className="mt-4">
              <FancyText
                className="text-balance text-4xl font-semibold tracking-tight text-foreground/5 sm:text-5xl"
                fillClassName="text-foreground"
              >
                {community.title}
              </FancyText>
            </h2>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {community.description}
            </p>
          </div>
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

        <MotionDiv
          className="grid grid-cols-2 gap-4 lg:grid-cols-3 md:gap-6"
          {...staggerContainerEarly}
        >
          {rows.map((row, rowIndex) => (
            <>
              {row.map((item, cardIndex) => {
                const hasLink = Boolean(item.link)
                const isExternal = item.link?.startsWith('http')
                const isSelected = selectedId === item.id
                const globalIndex = rowIndex * cols + cardIndex

                return (
                  <MotionDiv key={item.id} {...revealUpEarly}>
                    <CometCard className="w-full" rotateDepth={8} translateDepth={10} scaleOnHover={1.02} zOnHover={20}>
                      <div
                        role="button"
                        onClick={() => handleCardClick(item.id)}
                        className={cn(
                          'group relative block aspect-square overflow-hidden rounded-2xl cursor-pointer transition-shadow duration-300',
                          isSelected && 'ring-2 ring-white/70'
                        )}
                      >
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
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
                            {(globalIndex + 1).toString().padStart(2, '0')} / {item.date}
                          </p>
                          <h3 className="mt-1.5 text-base font-black uppercase leading-[0.95] tracking-tight text-white sm:text-xl">
                            {item.title}
                          </h3>
                          {hasLink && item.link ? (
                            <a
                              href={item.link}
                              target={isExternal ? '_blank' : undefined}
                              rel={isExternal ? 'noopener noreferrer' : undefined}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 transition-transform duration-300 group-hover:translate-x-1"
                            >
                              Learn More
                              <ArrowUpRight size={12} aria-hidden strokeWidth={2.5} />
                            </a>
                          ) : (
                            <span className="mt-3 inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                              Local Impact Initiative
                            </span>
                          )}
                        </div>
                      </div>
                    </CometCard>
                  </MotionDiv>
                )
              })}

              <AnimatePresence key={`panel-row-${rowIndex}`}>
                {row.some((item) => item.id === selectedId) && selectedItem && (
                  <motion.div
                    key={selectedItem.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    className="col-span-full overflow-hidden border border-border"
                  >
                    <FeaturesWithPanel
                      title={selectedItem.title}
                      items={toFeatureItems(selectedItem)}
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
