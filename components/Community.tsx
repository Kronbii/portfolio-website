'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { FiMic, FiUsers, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface CommunityItem {
  id: string
  type: 'speaking' | 'leadership'
  title: string
  tagline: string
  image: string
  imagePosition?: string
  date?: string
  link?: string
}

const communityItems: CommunityItem[] = [
    {
    id: '2',
    type: 'leadership',
    title: 'NASA Space Apps Beirut',
    tagline: 'Organizing the Beirut chapter of NASA’s Space Apps—the world’s largest global hackathon',
    image: '/projects/nasa-space-apps.jpeg',
    imagePosition: '50% 50%',
    date: '2022 - 2025',
  },
  {
    id: '3',
    type: 'leadership',
    title: '"Nasna" - crisis support',
    tagline: 'Founder of a nonprofit NGO that applies data to deliver aid and crisis support to communities impacted by the war in Lebanon.',
    image: '/projects/nasna.jpeg',
    imagePosition: '50% 35%',
    date: '2024',
    link: '#',
  },
    {
    id: '4',
    type: 'leadership',
    title: 'National Physics Day',
    tagline: 'Leading and organizing Lebanon’s biggest annual event for the physics and astronomy community.',
    image: '/projects/physics-day-1.jpg',
    imagePosition: '50% 35%',
    date: '2021 - 2025',
  },
]

const typeConfig = {
  speaking: {
    icon: <FiMic size={20} />,
    label: 'Speaking',
    color: 'text-primary-400',
    bgColor: 'bg-primary-500/10',
    borderColor: 'border-primary-500/20',
  },
  leadership: {
    icon: <FiUsers size={20} />,
    label: 'Leadership',
    color: 'text-secondary-400',
    bgColor: 'bg-secondary-500/10',
    borderColor: 'border-secondary-500/20',
  },
}

export default function Community() {
  const ref = useRef(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [currentIndex, setCurrentIndex] = useState(0)

  // Create infinite loop by tripling the items
  const extendedItems = [...communityItems, ...communityItems, ...communityItems]
  const itemCount = communityItems.length

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
  }

  // Handle scroll events
  const handleScroll = () => {
    updateCurrentIndex()
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    updateCurrentIndex()
    container.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', updateCurrentIndex)

    return () => {
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
  }

  const handleScrollLeft = () => {
    const container = scrollContainerRef.current
    if (!container) return
    
    // If we're at or near the start of middle set, instantly jump to end of middle set first
    if (currentIndex <= itemCount) {
      // Jump to equivalent position in the LAST set (instantly, no animation)
      const jumpToIndex = currentIndex + itemCount
      scrollToIndex(jumpToIndex, true)
      
      // Then smoothly scroll left to the previous card
      requestAnimationFrame(() => {
        scrollToIndex(jumpToIndex - 1)
      })
    } else {
      // Normal scroll left
      scrollToIndex(currentIndex - 1)
    }
  }

  const handleScrollRight = () => {
    const container = scrollContainerRef.current
    if (!container) return
    
    // If we're at or near the end of middle set, instantly jump to start of middle set first
    if (currentIndex >= itemCount * 2 - 1) {
      // Jump to equivalent position in the FIRST set (instantly, no animation)
      const jumpToIndex = currentIndex - itemCount
      scrollToIndex(jumpToIndex, true)
      
      // Then smoothly scroll right to the next card
      requestAnimationFrame(() => {
        scrollToIndex(jumpToIndex + 1)
      })
    } else {
      // Normal scroll right
      scrollToIndex(currentIndex + 1)
    }
  }

  // Get the actual index in the original array for pagination dots
  const actualIndex = ((currentIndex % itemCount) + itemCount) % itemCount

  return (
    <section
      id="community"
      ref={ref}
      className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm uppercase tracking-[0.4em] text-light-text2 dark:text-dark-text2 mb-4"
          >
            Community First
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight"
          >
            Building Beyond <span className="text-gradient">Code</span>
          </motion.h2>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8"
        >
          <div className="flex gap-6 items-center">
            {extendedItems.map((item, index) => {
              const config = typeConfig[item.type]
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
                  className={`group relative overflow-hidden rounded-3xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-white/[0.03] backdrop-blur flex-shrink-0 w-[75%] sm:w-[55%] lg:w-[38%] xl:w-[32%] snap-center transition-all duration-75 ${
                    isCentered 
                      ? 'shadow-xl dark:shadow-2xl shadow-primary-500/10 dark:shadow-primary-500/20 -translate-y-4 scale-[1.03] z-10' 
                      : 'shadow-sm dark:shadow-none'
                  }`}
                  whileHover={{ y: isCentered ? -20 : -4 }}
                >
                  {/* Image */}
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className={`object-cover group-hover:scale-105 transition-transform duration-300`}
                      style={{ objectPosition: item.imagePosition || 'center top' }}
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-light-surface dark:from-dark-surface2 via-transparent" />
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.borderColor} ${config.bgColor} ${config.color} backdrop-blur-sm`}>
                        {config.icon}
                        <span className="text-xs font-medium">{config.label}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-semibold text-light-text dark:text-dark-text mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-light-text2 dark:text-dark-text2 mb-3">
                      {item.tagline}
                    </p>
                    {item.date && (
                      <p className="text-xs text-light-text2/70 dark:text-dark-text2/70">
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
            className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/10 backdrop-blur-lg text-light-text dark:text-dark-text hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-light-surface dark:hover:bg-white/15 transition-colors"
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
            className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/10 backdrop-blur-lg text-light-text dark:text-dark-text hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-light-surface dark:hover:bg-white/15 transition-colors"
            aria-label="Next"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}

