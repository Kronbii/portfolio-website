'use client'

import { motion, useInView } from 'framer-motion'
import { useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { getFallbackImage } from '@/lib/utils'
import { projects, Project } from '@/data/projects'
import { useInfiniteCarousel } from '@/hooks/useInfiniteCarousel'
import { useCardCarousel } from '@/hooks/useCardCarousel'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle, getSectionStyle, CARD_CAROUSEL_OPACITY } from '@/lib/utils'
import { UniversalCard } from '@/components/ui/universal-card'
import { ExploreNavigation } from '@/components/ui/explore-navigation'

// Re-export for backward compatibility
export type { Project }
export { projects }

export default function Projects() {
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({})
  const [imageSources, setImageSources] = useState<{ [key: number]: string }>({})

  const itemCount = projects.length
  const {
    scrollContainerRef,
    cardsRef,
    currentIndex,
    actualIndex,
    extendedItems: extendedProjects,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScrollLeft,
    handleScrollRight,
    scrollToIndex,
    getActualIndex,
  } = useInfiniteCarousel(projects, { itemCount })

  const {
    sectionRef,
    cardWidth,
    cardHeight,
    visibleCards,
  } = useCardCarousel({
    itemCount,
    scrollContainerRef,
    cardsRef,
    extendedItemsLength: extendedProjects.length,
  })

  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  const openProject = (index: number) => {
    const actualIdx = getActualIndex(index)
    const project = projects[actualIdx]

    // Open external URL or GitHub URL in a new tab
    const url = project.externalUrl || project.githubUrl
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleImageError = (index: number, originalSrc: string) => {
    const fallback = getFallbackImage(originalSrc)
    const currentSrc = imageSources[index] || originalSrc

    // If we haven't tried the fallback yet, use it
    if (currentSrc === originalSrc && fallback !== originalSrc) {
      setImageSources((prev) => ({ ...prev, [index]: fallback }))
    } else {
      // If fallback also failed, show error placeholder
      setImageErrors((prev) => ({ ...prev, [index]: true }))
    }
  }

  return (
    <>
      <section
        id="projects"
        ref={sectionRef}
        className="relative min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 border-l border-r border-b mx-auto overflow-hidden"
        style={{
          ...getSectionStyle(),
          ...getSectionWidthStyle()
        }}
      >
        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/figma-assets/grid.svg)',
            backgroundPosition: 'center',
            backgroundSize: '50px 50px',
            backgroundRepeat: 'repeat',
            opacity: 0.03,
            zIndex: 0,
          }}
        />

        <div className="w-full relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${getSectionHeaderStyle().className} text-center`}
            style={getSectionHeaderStyle().style}
          >
            Real work,<span className="text-gradient"> delivered with impact</span>
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${getSectionSubtitleStyle().className} text-center`}
            style={getSectionSubtitleStyle().style}
          >
            Portfolio Projects
          </motion.h3>

          {/* Scrollable Projects Container */}
          <div
            ref={scrollContainerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-x-scroll scrollbar-hide py-8 touch-pan-y"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-6 px-4 sm:px-6 lg:px-[calc((100vw-72rem)/2+1.5rem)] items-center w-max">
              {(extendedProjects as Project[]).map((project, index) => {
                const isCentered = index === currentIndex
                const isVisible = visibleCards.has(index)
                const actualIdx = getActualIndex(index)
                const projectImage = project.image && !imageErrors[actualIdx]
                  ? (imageSources[actualIdx] || project.image)
                  : null
                return (
                  <div
                    key={`${project.title}-${index}`}
                    data-card-index={index}
                    ref={(el) => {
                      cardsRef.current[index] = el
                    }}
                    style={{
                      filter: isVisible ? 'blur(0px)' : 'blur(2px)',
                      opacity: isVisible ? CARD_CAROUSEL_OPACITY.visible : CARD_CAROUSEL_OPACITY.hidden,
                      transition: 'filter 0.5s ease, opacity 0.5s ease',
                    }}
                  >
                    <UniversalCard
                      image={projectImage}
                      imageAlt={project.title}
                      title={project.title}
                      description={project.description}
                      isCentered={isCentered}
                      isInView={isInView}
                      onClick={() => openProject(index)}
                      onImageError={() => project.image && handleImageError(actualIdx, project.image)}
                      cardWidth={cardWidth}
                      cardHeight={cardHeight}
                    >
                    </UniversalCard>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <ExploreNavigation
            onPrevious={handleScrollLeft}
            onNext={handleScrollRight}
            previousLabel="Previous project"
            nextLabel="Next project"
            label="EXPLORE"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 border-2 p-6 text-center"
            style={{
              borderColor: 'rgba(33, 33, 33, 0.2)',
              borderRadius: 0,
              backgroundColor: 'rgba(216, 216, 216, 0.05)',
            }}
          >
            <p className="text-lg" style={{ color: 'var(--color-secondary)' }}>
              Want a similar transformation? <a href="#contact" className="underline-offset-4 hover:underline" style={{ color: 'var(--color-secondary)', opacity: 0.8 }}>Let&apos;s design your roadmap</a> and launch faster.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
