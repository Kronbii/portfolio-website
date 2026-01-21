'use client'

import { motion, useInView } from 'framer-motion'
import { useState } from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { getFallbackImage } from '@/lib/utils'
import { communityItems, CommunityItem } from '@/data/community'
import { useInfiniteCarousel } from '@/hooks/useInfiniteCarousel'
import { useCardCarousel } from '@/hooks/useCardCarousel'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle } from '@/lib/utils'
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
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={getSectionHeaderStyle().className}
            style={getSectionHeaderStyle().style}
          >
            MISSION & <span className="text-gradient">VISION</span>
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={getSectionSubtitleStyle().className}
            style={getSectionSubtitleStyle().style}
          >
            Building Communities Beyond Code
          </motion.h3>

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

        {/* Navigation - Explore Style */}
        <div className="flex justify-center items-center gap-12 mt-8">
          {/* Left Arrow Button */}
          <button
            onClick={handleScrollLeft}
            className="relative flex items-center justify-center w-10 h-10 group"
            aria-label="Previous"
            style={{ color: 'var(--color-secondary)' }}
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
              <div className="absolute top-0 left-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
            </div>
            <div className="absolute top-0 right-0 w-3 h-3 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
              <div className="absolute top-0 right-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
            </div>
            <div className="absolute bottom-0 left-0 w-3 h-3 transition-all duration-300 group-hover:-translate-x-1 group-hover:translate-y-1">
              <div className="absolute bottom-0 left-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
              <div className="absolute bottom-0 left-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1">
              <div className="absolute bottom-0 right-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
              <div className="absolute bottom-0 right-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
            </div>
            {/* Arrow icon */}
            <FiArrowLeft size={18} className="relative z-10" />
          </button>

          {/* EXPLORE Text */}
          <span 
            className="text-xl uppercase tracking-wider font-light"
            style={{ color: 'var(--color-secondary)' }}
          >
            EXPLORE
          </span>

          {/* Right Arrow Button */}
          <button
            onClick={handleScrollRight}
            className="relative flex items-center justify-center w-10 h-10 group"
            aria-label="Next"
            style={{ color: 'var(--color-secondary)' }}
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
              <div className="absolute top-0 left-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
            </div>
            <div className="absolute top-0 right-0 w-3 h-3 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
              <div className="absolute top-0 right-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
            </div>
            <div className="absolute bottom-0 left-0 w-3 h-3 transition-all duration-300 group-hover:-translate-x-1 group-hover:translate-y-1">
              <div className="absolute bottom-0 left-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
              <div className="absolute bottom-0 left-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1">
              <div className="absolute bottom-0 right-0 w-3 h-[1px]" style={{ backgroundColor: 'var(--color-secondary)' }} />
              <div className="absolute bottom-0 right-0 w-[1px] h-3" style={{ backgroundColor: 'var(--color-secondary)' }} />
            </div>
            {/* Arrow icon */}
            <FiArrowRight size={18} className="relative z-10" />
          </button>
        </div>
      </div>
    </section>
  )
}

