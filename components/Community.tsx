'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { getFallbackImage } from '@/lib/utils'
import { communityItems, CommunityItem } from '@/data/community'
import { useInfiniteCarousel } from '@/hooks/useInfiniteCarousel'
import { getSectionWidthStyle, getSectionHeaderStyle } from '@/lib/utils'

export default function Community() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
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

  return (
    <section
      id="community"
      ref={ref}
      className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 bg-[#EAEAEA] border border-[#212121]/30 mx-auto"
      style={{ backgroundColor: '#EAEAEA', ...getSectionWidthStyle() }}
    >
      <div className="w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm uppercase tracking-[0.4em] text-[#252525] mb-4"
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
            Building Beyond <span className="text-gradient">Code</span>
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
          <div className="flex gap-4 sm:gap-6 px-4 sm:px-6 lg:px-[calc((100vw-72rem)/2+1.5rem)] items-center w-max">
            {extendedItems.map((item, index) => {
              const isCentered = index === currentIndex
              return (
                <motion.div
                  key={`${item.id}-${index}`}
                  ref={(el) => {
                    cardsRef.current[index] = el
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: isCentered ? -16 : 0, scale: isCentered ? 1.03 : 1 } : {}}
                  transition={{ duration: 0.15 }}
                  className={`group relative overflow-hidden rounded-3xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-white/[0.03] backdrop-blur flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[380px] transition-all duration-75 ${
                    isCentered 
                      ? 'shadow-xl dark:shadow-2xl shadow-primary-500/10 dark:shadow-primary-500/20 -translate-y-4 scale-[1.03] z-10' 
                      : 'shadow-sm dark:shadow-none'
                  }`}
                  whileHover={{ y: isCentered ? -20 : -4 }}
                >
                  {/* Image */}
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <Image
                      src={imageSources[index] || item.image}
                      alt={item.title}
                      fill
                      className={`object-cover group-hover:scale-105 transition-transform duration-300`}
                      style={{ objectPosition: item.imagePosition || 'center top' }}
                      unoptimized
                      onError={() => {
                        const fallback = getFallbackImage(item.image)
                        if (imageSources[index] !== fallback) {
                          setImageSources(prev => ({ ...prev, [index]: fallback }))
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-light-surface dark:from-dark-surface2 via-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#252525] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#252525] mb-3">
                      {item.tagline}
                    </p>
                    {item.date && (
                      <p className="text-xs text-[#252525]/70">
                        {item.date}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handleScrollLeft}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/10 backdrop-blur-lg text-[#252525] hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-light-surface dark:hover:bg-white/15 transition-colors"
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
            className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/10 backdrop-blur-lg text-[#252525] hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-light-surface dark:hover:bg-white/15 transition-colors"
            aria-label="Next"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}

