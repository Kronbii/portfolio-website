'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { FiCode, FiCpu, FiEye, FiUsers, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

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
  const ref = useRef(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [currentIndex, setCurrentIndex] = useState(1) // Start at index 1 (second card)
  const [canScrollLeft, setCanScrollLeft] = useState(true)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Initialize scroll to middle card (index 1)
  useEffect(() => {
    if (!scrollContainerRef.current || cardsRef.current.length === 0) return
    
    // Wait for layout to settle, then scroll to index 1
    const timer = setTimeout(() => {
      const container = scrollContainerRef.current
      const firstCard = cardsRef.current[0]
      if (!container || !firstCard) return
      
      // Calculate card width including gap
      const cardWidth = firstCard.offsetWidth
      const gap = 24 // gap-6 = 24px
      const scrollPosition = (cardWidth + gap) * 1 // Scroll to second card
      
      container.scrollLeft = scrollPosition
    }, 150)

    return () => clearTimeout(timer)
  }, [])

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    
    // Update current index based on scroll position
    const firstCard = cardsRef.current[0]
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth
      const gap = 24
      const newIndex = Math.round(scrollLeft / (cardWidth + gap))
      setCurrentIndex(newIndex)
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    updateScrollButtons()
    container.addEventListener('scroll', updateScrollButtons)
    window.addEventListener('resize', updateScrollButtons)

    return () => {
      container.removeEventListener('scroll', updateScrollButtons)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [])

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return
    
    const firstCard = cardsRef.current[0]
    if (!firstCard) return
    
    const cardWidth = firstCard.offsetWidth
    const gap = 24
    scrollContainerRef.current.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth',
    })
  }

  const scrollLeft = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1)
    }
  }

  const scrollRight = () => {
    if (currentIndex < services.length - 1) {
      scrollToIndex(currentIndex + 1)
    }
  }

  return (
    <section
      id="services"
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm uppercase tracking-[0.4em] text-dark-text2"
          >
            Signature engagements
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight"
          >
            Services with <span className="text-gradient">clear outcomes</span>
          </motion.h2>
        </div>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
        >
          <div className="flex gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                ref={(el) => {
                  cardsRef.current[index] = el
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur flex-shrink-0 w-[85%] sm:w-[80%] lg:w-[75%] snap-center"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-primary-400">
                    {service.icon}
                    <span className="text-xs uppercase tracking-wide text-dark-text2">{service.timeline}</span>
                  </div>
                </div>
                <h3 className="mt-4 text-2xl sm:text-3xl font-semibold text-dark-text">
                  {service.title}
                </h3>
                <p className="mt-2 text-dark-text2 text-sm sm:text-base leading-relaxed">
                  {service.punchline}
                </p>
                <div className="mt-4 space-y-2">
                  {service.highlights.map((item) => (
                    <div key={item} className="flex items-center space-x-2 text-sm sm:text-base text-dark-text">
                      <span className="text-primary-400">
                        <FiCheck />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons - Placed below the cards */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-lg text-dark-text hover:border-primary-500/60 hover:text-primary-300 hover:bg-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/15 disabled:hover:text-dark-text disabled:hover:bg-white/10"
            aria-label="Previous service"
          >
            <FiChevronLeft size={20} />
          </button>
          <div className="flex gap-1.5">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary-500'
                    : 'w-2 bg-white/20 hover:bg-white/30'
                }`}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-lg text-dark-text hover:border-primary-500/60 hover:text-primary-300 hover:bg-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/15 disabled:hover:text-dark-text disabled:hover:bg-white/10"
            aria-label="Next service"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
