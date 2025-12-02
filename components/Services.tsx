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
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndexRef = useRef<number>(0)
  const touchStartRef = useRef<number>(0)
  const touchEndRef = useRef<number>(0)
  const isAnimatingRef = useRef(false)

  // Create infinite loop by tripling the items
  const extendedServices = [...services, ...services, ...services]
  const itemCount = services.length

  // Initialize scroll to middle set (start at first card of middle set)
  useEffect(() => {
    if (!scrollContainerRef.current || cardsRef.current.length === 0) return
    
    const timer = setTimeout(() => {
      const container = scrollContainerRef.current
      const startIndex = itemCount // First card of middle set
      const startCard = cardsRef.current[startIndex]
      if (!container || !startCard) return
      
      // Scroll to the middle set without animation
      const cardCenter = startCard.offsetLeft + startCard.offsetWidth / 2
      const containerCenter = container.offsetWidth / 2
      container.scrollLeft = cardCenter - containerCenter
      setCurrentIndex(startIndex)
      currentIndexRef.current = startIndex
    }, 150)

    return () => clearTimeout(timer)
  }, [itemCount])

  const updateCurrentIndex = () => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    
    // Find which card is closest to the center of the viewport
    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2
    
    let closestIndex = 0
    let closestDistance = Infinity
    
    cardsRef.current.forEach((card, index) => {
      if (!card) return
      const cardRect = card.getBoundingClientRect()
      const cardCenter = cardRect.left + cardRect.width / 2
      const distance = Math.abs(containerCenter - cardCenter)
      
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })
    
    setCurrentIndex(closestIndex)
    currentIndexRef.current = closestIndex
  }

  // Handle touch events for swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
    touchEndRef.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (isAnimatingRef.current) return
    
    const swipeDistance = touchStartRef.current - touchEndRef.current
    const minSwipeDistance = 50 // Minimum swipe distance to trigger navigation
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped left = go right (next)
        navigateRight()
      } else {
        // Swiped right = go left (previous)
        navigateLeft()
      }
    }
  }

  const navigateLeft = () => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    
    const container = scrollContainerRef.current
    if (!container) {
      isAnimatingRef.current = false
      return
    }
    
    const idx = currentIndexRef.current
    // If we're at or near the start of middle set, instantly jump to end of middle set first
    if (idx <= itemCount) {
      const jumpToIndex = idx + itemCount
      scrollToIndex(jumpToIndex, true)
      
      requestAnimationFrame(() => {
        scrollToIndex(jumpToIndex - 1)
        setTimeout(() => { isAnimatingRef.current = false }, 400)
      })
    } else {
      scrollToIndex(idx - 1)
      setTimeout(() => { isAnimatingRef.current = false }, 400)
    }
  }

  const navigateRight = () => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    
    const container = scrollContainerRef.current
    if (!container) {
      isAnimatingRef.current = false
      return
    }
    
    const idx = currentIndexRef.current
    // If we're at or near the end of middle set, instantly jump to start of middle set first
    if (idx >= itemCount * 2 - 1) {
      const jumpToIndex = idx - itemCount
      scrollToIndex(jumpToIndex, true)
      
      requestAnimationFrame(() => {
        scrollToIndex(jumpToIndex + 1)
        setTimeout(() => { isAnimatingRef.current = false }, 400)
      })
    } else {
      scrollToIndex(idx + 1)
      setTimeout(() => { isAnimatingRef.current = false }, 400)
    }
  }

  // Handle horizontal wheel scrolling to trigger navigation
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let wheelTimeout: NodeJS.Timeout | null = null
    let accumulatedDelta = 0
    const threshold = 50 // Minimum scroll delta to trigger navigation

    const handleWheel = (e: WheelEvent) => {
      // Only handle horizontal scrolling (deltaX)
      // Ignore vertical scrolling (deltaY) - let it scroll the page normally
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault()
        e.stopPropagation()
        
        accumulatedDelta += e.deltaX
        
        // Clear any pending timeout
        if (wheelTimeout) {
          clearTimeout(wheelTimeout)
        }
        
        // Debounce and trigger navigation after scroll stops
        wheelTimeout = setTimeout(() => {
          if (isAnimatingRef.current) {
            accumulatedDelta = 0
            return
          }
          
          if (Math.abs(accumulatedDelta) > threshold) {
            if (accumulatedDelta > 0) {
              // Scrolled right = go to next card
              navigateRight()
            } else {
              // Scrolled left = go to previous card
              navigateLeft()
            }
          }
          
          accumulatedDelta = 0
        }, 150)
      }
      // If it's vertical scrolling, don't prevent default - let page scroll normally
    }

    // Update current index on scroll (for button/touch navigation)
    const handleScroll = () => {
      if (isAnimatingRef.current) return
      updateCurrentIndex()
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('scroll', handleScroll, { passive: true })
    updateCurrentIndex()
    window.addEventListener('resize', updateCurrentIndex)

    return () => {
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateCurrentIndex)
    }
  }, [itemCount])

  const scrollToIndex = (index: number, instant = false) => {
    const container = scrollContainerRef.current
    const targetCard = cardsRef.current[index]
    if (!container || !targetCard) return
    
    const containerRect = container.getBoundingClientRect()
    const cardRect = targetCard.getBoundingClientRect()
    
    // Calculate scroll position to center the card
    const cardCenter = targetCard.offsetLeft + cardRect.width / 2
    const containerCenter = containerRect.width / 2
    const scrollPosition = cardCenter - containerCenter
    
    container.scrollTo({
      left: scrollPosition,
      behavior: instant ? 'instant' : 'smooth',
    })
    
    setCurrentIndex(index)
    currentIndexRef.current = index
  }

  const handleScrollLeft = () => {
    navigateLeft()
  }

  const handleScrollRight = () => {
    navigateRight()
  }

  // Get the actual index in the original array for pagination dots
  const actualIndex = ((currentIndex % itemCount) + itemCount) % itemCount

  return (
    <section
      id="services"
      ref={ref}
      className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm uppercase tracking-[0.4em] text-light-text2 dark:text-dark-text2"
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
            {extendedServices.map((service, index) => {
              const isCentered = index === currentIndex
              return (
                <motion.div
                  key={`${service.title}-${index}`}
                  ref={(el) => {
                    cardsRef.current[index] = el
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: isCentered ? -16 : 0, scale: isCentered ? 1.03 : 1 } : {}}
                  transition={{ duration: 0.15 }}
                  className={`group relative overflow-hidden rounded-3xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-white/[0.03] backdrop-blur flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[400px] transition-all duration-75 ${
                    isCentered 
                      ? 'shadow-xl dark:shadow-2xl shadow-primary-500/10 dark:shadow-primary-500/20 -translate-y-4 scale-[1.03] z-10' 
                      : 'shadow-sm dark:shadow-none'
                  }`}
                  whileHover={{ y: isCentered ? -20 : -4 }}
                >
                  <div className="p-5 sm:p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-primary-400">
                        {service.icon}
                        <span className="text-xs uppercase tracking-wide text-light-text2 dark:text-dark-text2">{service.timeline}</span>
                      </div>
                    </div>
                    <h3 className="mt-4 text-2xl sm:text-3xl font-semibold text-light-text dark:text-dark-text">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-light-text2 dark:text-dark-text2 text-sm sm:text-base leading-relaxed">
                      {service.punchline}
                    </p>
                    <div className="mt-4 space-y-2">
                      {service.highlights.map((item) => (
                        <div key={item} className="flex items-center space-x-2 text-sm sm:text-base text-light-text dark:text-dark-text">
                          <span className="text-primary-400">
                            <FiCheck />
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
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
            className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/10 backdrop-blur-lg text-light-text dark:text-dark-text hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-light-surface dark:hover:bg-white/15 transition-colors"
            aria-label="Previous service"
          >
            <FiChevronLeft size={20} />
          </button>
          <div className="flex gap-1.5">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(itemCount + index)}
                className={`h-2 rounded-full transition-all ${
                  index === actualIndex
                    ? 'w-8 bg-primary-500'
                    : 'w-2 bg-light-border dark:bg-white/20 hover:bg-light-text2/30 dark:hover:bg-white/30'
                }`}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleScrollRight}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/10 backdrop-blur-lg text-light-text dark:text-dark-text hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-light-surface dark:hover:bg-white/15 transition-colors"
            aria-label="Next service"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
