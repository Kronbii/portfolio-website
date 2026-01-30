'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiCode, FiCpu, FiEye, FiUsers, FiCheck } from 'react-icons/fi'
import { useInfiniteCarousel } from '@/hooks/useInfiniteCarousel'
import { useCardCarousel } from '@/hooks/useCardCarousel'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle, getSectionStyle, CARD_CAROUSEL_OPACITY } from '@/lib/utils'
import { ExploreNavigation } from '@/components/ui/explore-navigation'

interface Service {
  icon: React.ReactNode
  title: string
  punchline: string
  timeline: string
  highlights: string[]
}

const services: Service[] = [
  {
    icon: <FiCpu size={28} />,
    title: 'AI Solutions',
    punchline: 'Scope, prototype, and validate AI ideas without a full in-house team.',
    timeline: '4-8 weeks',
    highlights: ['Roadmap + KPIs', 'Hands-on build', 'Weekly reviews'],
  },
  {
    icon: <FiEye size={28} />,
    title: 'Computer Vision Systems',
    punchline: 'Perception stacks tuned for robotics, inspection, and edge deployments.',
    timeline: '3-6 weeks',
    highlights: ['Dataset plan', 'Model + optimization', 'Deployment ready'],
  },
  {
    icon: <FiCode size={28} />,
    title: 'ML Advisory',
    punchline: 'Audits, hiring support, and tighter ML processes for growing teams.',
    timeline: '2-4 weeks',
    highlights: ['Architecture audit', 'Team enablement', 'Hiring support'],
  },
  {
    icon: <FiUsers size={28} />,
    title: 'Robotics & Autonomy',
    punchline: 'Sensor fusion, control, and system design with PM rigor.',
    timeline: '4-10 weeks',
    highlights: ['Firmware + CV', 'Sim + field tests', 'Documentation'],
  },
]

export default function Services() {
  const itemCount = services.length
  const {
    scrollContainerRef,
    cardsRef,
    currentIndex,
    actualIndex,
    extendedItems: extendedServices,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScrollLeft,
    handleScrollRight,
    scrollToIndex,
    getActualIndex,
  } = useInfiniteCarousel(services, { itemCount })

  const {
    sectionRef,
    cardWidth,
    cardHeight,
    visibleCards,
  } = useCardCarousel({
    itemCount,
    scrollContainerRef,
    cardsRef,
    extendedItemsLength: extendedServices.length,
  })

  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      id="services"
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center py-20 lg:py-24 px-4 sm:px-6 lg:px-8 border-l border-r border-b mx-auto relative overflow-hidden"
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
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={getSectionHeaderStyle().className}
            style={getSectionHeaderStyle().style}
          >
            Services with <span className="text-gradient">clear outcomes</span>
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={getSectionSubtitleStyle().className}
            style={getSectionSubtitleStyle().style}
          >
            Signature engagements
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
            {extendedServices.map((service, index) => {
              const isCentered = index === currentIndex
              const isVisible = visibleCards.has(index)
              return (
                <div
                  key={`${service.title}-${index}`}
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
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: isCentered ? -16 : 0, scale: isCentered ? 1.03 : 1 } : {}}
                    transition={{ duration: 0.15 }}
                    className={`group relative overflow-hidden border-2 bg-transparent flex-shrink-0 transition-all duration-100 flex flex-col cursor-pointer clickable-card ${isCentered
                        ? '-translate-y-4 scale-[1.03] z-10'
                        : ''
                      }`}
                    style={{
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`,
                      cursor: 'pointer',
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
                      {/* Icon and Timeline */}
                      <div className="flex items-start justify-between mb-6">
                        <div
                          className="flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-110"
                          style={{
                            width: '56px',
                            height: '56px',
                            borderColor: 'rgba(33, 33, 33, 0.2)',
                            borderRadius: 0,
                            backgroundColor: 'rgba(216, 216, 216, 0.1)',
                          }}
                        >
                          <div style={{ color: 'var(--color-secondary)' }}>
                            {service.icon}
                          </div>
                        </div>

                        {/* Timeline badge */}
                        <div
                          className="border px-3 py-1.5"
                          style={{
                            borderColor: 'rgba(33, 33, 33, 0.2)',
                            borderRadius: 0,
                            backgroundColor: 'rgba(216, 216, 216, 0.05)',
                          }}
                        >
                          <span
                            className="uppercase tracking-wider font-medium"
                            style={{
                              color: 'var(--color-secondary)',
                              opacity: 0.6,
                              fontSize: '11px',
                              letterSpacing: '0.1em',
                            }}
                          >
                            {service.timeline}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className="font-semibold mb-3 transition-transform duration-300 group-hover:translate-x-1"
                        style={{
                          color: 'var(--color-secondary)',
                          fontSize: 'clamp(22px, 3vw, 28px)',
                        }}
                      >
                        {service.title}
                      </h3>

                      {/* Punchline */}
                      <p
                        className="leading-relaxed mb-6 flex-grow"
                        style={{
                          color: 'var(--color-secondary)',
                          opacity: 0.7,
                          fontSize: 'clamp(14px, 1.8vw, 16px)',
                          lineHeight: 1.6,
                        }}
                      >
                        {service.punchline}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-3 mt-auto">
                        {service.highlights.map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-3"
                          >
                            <div
                              className="flex items-center justify-center border flex-shrink-0"
                              style={{
                                width: '18px',
                                height: '18px',
                                borderColor: 'rgba(33, 33, 33, 0.3)',
                                borderRadius: 0,
                              }}
                            >
                              <FiCheck
                                size={12}
                                style={{ color: 'var(--color-secondary)' }}
                              />
                            </div>
                            <span
                              style={{
                                color: 'var(--color-secondary)',
                                fontSize: 'clamp(13px, 1.6vw, 15px)',
                              }}
                            >
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <ExploreNavigation
          onPrevious={handleScrollLeft}
          onNext={handleScrollRight}
          previousLabel="Previous service"
          nextLabel="Next service"
          label="EXPLORE"
        />
      </div>
    </section>
  )
}
