'use client'

import { motion, useInView } from 'framer-motion'
import { FiGlobe } from 'react-icons/fi'
import { useInfiniteCarousel } from '@/hooks/useInfiniteCarousel'
import { useCardCarousel } from '@/hooks/useCardCarousel'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle, getSectionStyle, CARD_CAROUSEL_OPACITY } from '@/lib/utils'
import { ExploreNavigation } from '@/components/ui/explore-navigation'

interface Testimonial {
  name: string
  role: string
  company: string
  location: string
  countryCode: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'Nexus AI',
    location: 'San Francisco, USA',
    countryCode: 'US',
    quote: "The attention to detail in the UI architecture was outstanding. Not only did it look premium, but the performance metrics improved by 40%.",
  },
  {
    name: 'Marcus Thorne',
    role: 'Product Lead',
    company: 'Global Fintech',
    location: 'London, UK',
    countryCode: 'GB',
    quote: "Transformed our legacy dashboard into a high-performance, responsive experience. The 'GEO friendly' approach to data visualization was a game changer.",
  },
  {
    name: 'Elena Rodriguez',
    role: 'Founder',
    company: 'EcoStream',
    location: 'Berlin, Germany',
    countryCode: 'DE',
    quote: "A true partner in development. The ability to translate complex requirements into a clean, minimalist design is rare.",
  },
  {
    name: 'Kenji Tanaka',
    role: 'Engineering Manager',
    company: 'RoboTech',
    location: 'Tokyo, Japan',
    countryCode: 'JP',
    quote: "Exceptional code quality and documentation. The delivered modules were robust and seamlessly integrated with our existing robotics systems.",
  },
  {
    name: 'Amara Okafor',
    role: 'VP Engineering',
    company: 'DataFlow Inc',
    location: 'Lagos, Nigeria',
    countryCode: 'NG',
    quote: "Delivered a complex AI pipeline ahead of schedule. The technical depth combined with clear communication made all the difference.",
  },
  {
    name: 'Lucas Silva',
    role: 'Tech Director',
    company: 'Innovate Labs',
    location: 'São Paulo, Brazil',
    countryCode: 'BR',
    quote: "Brought our computer vision project from concept to production in record time. The expertise in edge deployment was invaluable.",
  },
]

export default function Testimonials() {
  const itemCount = testimonials.length
  const {
    scrollContainerRef,
    cardsRef,
    currentIndex,
    actualIndex,
    extendedItems: extendedTestimonials,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScrollLeft,
    handleScrollRight,
  } = useInfiniteCarousel(testimonials, { itemCount })

  const {
    sectionRef,
    cardWidth,
    cardHeight,
    visibleCards,
  } = useCardCarousel({
    itemCount,
    scrollContainerRef,
    cardsRef,
    extendedItemsLength: extendedTestimonials.length,
  })

  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-l border-r border-b mx-auto overflow-hidden"
      style={{
        ...getSectionStyle(),
        ...getSectionWidthStyle(),
      }}
    >
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-secondary) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.05,
          zIndex: 0,
        }}
      />

      <div className="w-full relative z-10">
        {/* Header Section */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={getSectionHeaderStyle().className}
            style={getSectionHeaderStyle().style}
          >
            Global <span className="text-gradient">Endorsements</span>
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={getSectionSubtitleStyle().className}
            style={getSectionSubtitleStyle().style}
          >
            Trusted by teams worldwide
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
            {extendedTestimonials.map((testimonial, index) => {
              const isCentered = index === currentIndex
              const isVisible = visibleCards.has(index)

              return (
                <div
                  key={`${testimonial.name}-${index}`}
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
                  <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: isCentered ? -16 : 0, scale: isCentered ? 1.03 : 1 } : {}}
                    transition={{ duration: 0.15 }}
                    className={`group relative overflow-hidden border-2 bg-transparent flex-shrink-0 transition-all duration-100 flex flex-col ${isCentered ? '-translate-y-4 scale-[1.03] z-10' : ''
                      }`}
                    style={{
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`,
                      boxShadow: isCentered
                        ? '0 20px 25px -5px rgba(37, 37, 37, 0.1), 0 10px 10px -5px rgba(37, 37, 37, 0.04)'
                        : '0 1px 2px 0 rgba(37, 37, 37, 0.05)',
                      borderColor: 'rgba(33, 33, 33, 0.2)',
                      borderRadius: 0,
                      backgroundColor: 'var(--color-primary)',
                    }}
                    whileHover={{ y: isCentered ? -20 : -4 }}
                  >
                    {/* Hover border effect */}
                    <div
                      className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        borderColor: 'rgba(33, 33, 33, 0.4)',
                        borderRadius: 0,
                      }}
                    />

                    {/* Subtle gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-30 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(216, 216, 216, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      }}
                    />

                    <div className="p-6 sm:p-8 relative z-10 flex flex-col h-full">
                      {/* Quote */}
                      <div className="mb-6 lg:mb-8 flex-grow">
                        <p
                          className="leading-relaxed italic"
                          style={{
                            color: 'var(--color-secondary)',
                            fontSize: 'clamp(14px, 1.8vw, 16px)',
                            lineHeight: 1.6,
                          }}
                        >
                          "{testimonial.quote}"
                        </p>
                      </div>

                      {/* Divider */}
                      <div
                        className="w-full h-px mb-4 opacity-20"
                        style={{ backgroundColor: 'var(--color-secondary)' }}
                      />

                      {/* Author Info */}
                      <div>
                        <h4
                          className="font-bold mb-1"
                          style={{
                            color: 'var(--color-secondary)',
                            fontSize: 'clamp(16px, 2vw, 18px)',
                          }}
                        >
                          {testimonial.name}
                        </h4>
                        <p
                          className="font-medium mb-3"
                          style={{
                            color: 'var(--color-secondary)',
                            opacity: 0.7,
                            fontSize: 'clamp(13px, 1.6vw, 14px)',
                          }}
                        >
                          {testimonial.role} @ {testimonial.company}
                        </p>

                        {/* GEO Friendly Location Tag */}
                        <div
                          className="flex items-center gap-2 p-2 border inline-flex"
                          style={{
                            borderColor: 'rgba(33, 33, 33, 0.2)',
                            backgroundColor: 'rgba(216, 216, 216, 0.05)',
                          }}
                        >
                          <FiGlobe
                            size={14}
                            style={{ color: 'var(--color-secondary)', opacity: 0.6 }}
                          />
                          <span
                            className="uppercase tracking-wider font-semibold"
                            style={{
                              color: 'var(--color-secondary)',
                              opacity: 0.8,
                              fontSize: 'clamp(10px, 1.2vw, 11px)',
                              letterSpacing: '0.1em',
                            }}
                          >
                            {testimonial.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <ExploreNavigation
          onPrevious={handleScrollLeft}
          onNext={handleScrollRight}
          previousLabel="Previous testimonial"
          nextLabel="Next testimonial"
          label="EXPLORE"
        />
      </div>
    </section>
  )
}
