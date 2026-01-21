'use client'

import { motion, useInView } from 'framer-motion'
import { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { getFallbackImage } from '@/lib/utils'
import { communityItems, CommunityItem } from '@/data/community'
import { useInfiniteCarousel } from '@/hooks/useInfiniteCarousel'
import { useCardCarousel } from '@/hooks/useCardCarousel'
import { getSectionWidthStyle, getSectionHeaderStyle } from '@/lib/utils'
import { UniversalCard } from '@/components/ui/universal-card'

export default function Community() {
  const [imageSources, setImageSources] = useState<{ [key: number]: string }>({})

  const itemCount = communityItems.length
  const {
    scrollContainerRef,
    cardsRef,
    currentIndex,
    actualIndex,
    extendedItems,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScrollLeft,
    handleScrollRight,
    scrollToIndex,
  } = useInfiniteCarousel(communityItems, { itemCount })

  const {
    sectionRef,
    cardWidth,
    cardHeight,
    visibleCards,
  } = useCardCarousel({
    itemCount,
    scrollContainerRef,
    cardsRef,
    extendedItemsLength: extendedItems.length,
  })

  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section
      id="community"
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 border-l border-r border-b mx-auto"
      style={{ 
        backgroundColor: 'var(--color-primary)', 
        borderColor: 'rgba(33, 33, 33, 0.3)',
        ...getSectionWidthStyle() 
      }}
    >
      <div className="w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm uppercase tracking-[0.4em] mb-4"
            style={{ color: 'var(--color-secondary)' }}
          >
            Community First
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${getSectionHeaderStyle().className} tracking-tight`}
            style={getSectionHeaderStyle().style}
          >
            BUILDING BEYOND <span className="text-gradient">CODE</span>
          </motion.h2>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-x-scroll scrollbar-hide py-8 touch-pan-y"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-6 px-4 sm:px-6 lg:px-[calc((100vw-72rem)/2+1.5rem)] items-center w-max">
            {extendedItems.map((item, index) => {
              const isCentered = index === currentIndex
              const isVisible = visibleCards.has(index)
              
              return (
                <div
                  key={`${item.id}-${index}`}
                  data-card-index={index}
                  ref={(el) => {
                    cardsRef.current[index] = el
                  }}
                  style={{
                    filter: isVisible ? 'blur(0px)' : 'blur(2px)',
                    opacity: isVisible ? 1 : 0.25,
                    transition: 'filter 0.5s ease, opacity 0.5s ease',
                  }}
                >
                  <UniversalCard
                    image={imageSources[index] || item.image}
                    imageAlt={item.title}
                    title={item.title}
                    description={item.tagline}
                    date={item.date}
                    isCentered={isCentered}
                    isInView={isInView}
                    imagePosition={item.imagePosition || 'center top'}
                    cardWidth={cardWidth}
                    cardHeight={cardHeight}
                    onImageError={() => {
                      const fallback = getFallbackImage(item.image)
                      if (imageSources[index] !== fallback) {
                        setImageSources(prev => ({ ...prev, [index]: fallback }))
                      }
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handleScrollLeft}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/10 backdrop-blur-lg hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-light-surface dark:hover:bg-white/15 transition-colors"
                  style={{ color: 'var(--color-secondary)' }}
            aria-label="Previous"
          >
            <FiChevronLeft size={20} />
          </button>
          <div className="flex gap-1.5">
            {communityItems.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(itemCount + index)}
                className={`h-2 rounded-full transition-all ${
                  index === actualIndex
                    ? 'w-8 bg-primary-500'
                    : 'w-2 bg-light-border dark:bg-white/20 hover:bg-light-text2/30 dark:hover:bg-white/30'
                }`}
                aria-label={`Go to item ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleScrollRight}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/10 backdrop-blur-lg hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-light-surface dark:hover:bg-white/15 transition-colors"
                  style={{ color: 'var(--color-secondary)' }}
            aria-label="Next"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}

