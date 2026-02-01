'use client'

import { motion, useInView } from 'framer-motion'
import { useInfiniteCarousel } from '@/hooks/useInfiniteCarousel'
import { useCardCarousel } from '@/hooks/useCardCarousel'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle, getSectionStyle } from '@/lib/utils'
import { ExploreNavigation } from '@/components/ui/explore-navigation'
import { TestimonialCard } from '@/components/ui/testimonial-card'

interface Testimonial {
  name: string
  role: string
  company: string
  location: string
  countryCode: string
  quote: string
  profileImage: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'Nexus AI',
    location: 'San Francisco, USA',
    countryCode: 'US',
    quote: "The attention to detail in the UI architecture was outstanding. Not only did it look premium, but the performance metrics improved by 40%.",
    profileImage: '/testimonials/sarah-chen.png',
  },
  {
    name: 'Marcus Thorne',
    role: 'Product Lead',
    company: 'Global Fintech',
    location: 'London, UK',
    countryCode: 'GB',
    quote: "Transformed our legacy dashboard into a high-performance, responsive experience. The 'GEO friendly' approach to data visualization was a game changer.",
    profileImage: '/testimonials/marcus-thorne.png',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Founder',
    company: 'EcoStream',
    location: 'Berlin, Germany',
    countryCode: 'DE',
    quote: "A true partner in development. The ability to translate complex requirements into a clean, minimalist design is rare.",
    profileImage: '/testimonials/elena-rodriguez.png',
  },
  {
    name: 'Kenji Tanaka',
    role: 'Engineering Manager',
    company: 'RoboTech',
    location: 'Tokyo, Japan',
    countryCode: 'JP',
    quote: "Exceptional code quality and documentation. The delivered modules were robust and seamlessly integrated with our existing robotics systems.",
    profileImage: '/testimonials/kenji-tanaka.png',
  },
  {
    name: 'Amara Okafor',
    role: 'VP Engineering',
    company: 'DataFlow Inc',
    location: 'Lagos, Nigeria',
    countryCode: 'NG',
    quote: "Delivered a complex AI pipeline ahead of schedule. The technical depth combined with clear communication made all the difference.",
    profileImage: '/testimonials/amara-okafor.png',
  },
  {
    name: 'Lucas Silva',
    role: 'Tech Director',
    company: 'Innovate Labs',
    location: 'São Paulo, Brazil',
    countryCode: 'BR',
    quote: "Brought our computer vision project from concept to production in record time. The expertise in edge deployment was invaluable.",
    profileImage: '/testimonials/lucas-silva.png',
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
    cardHeight: defaultCardHeight,
    visibleCards,
  } = useCardCarousel({
    itemCount,
    scrollContainerRef,
    cardsRef,
    extendedItemsLength: extendedTestimonials.length,
  })

  // Override card height for testimonials with responsive aspect ratio
  // Mobile/tablet: 1.2:1 (more vertical space to prevent clamping)
  // Desktop: 1:1 (compact layout)
  const cardHeight = typeof window !== 'undefined' && window.innerWidth < 1024
    ? cardWidth * 1.2
    : cardWidth

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
                >
                  <TestimonialCard
                    name={testimonial.name}
                    role={testimonial.role}
                    company={testimonial.company}
                    location={testimonial.location}
                    countryCode={testimonial.countryCode}
                    quote={testimonial.quote}
                    profileImage={testimonial.profileImage}
                    isCentered={isCentered}
                    isInView={isInView}
                    isVisible={isVisible}
                    cardWidth={cardWidth}
                    cardHeight={cardHeight}
                  />
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
