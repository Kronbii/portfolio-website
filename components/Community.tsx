'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { FiMic, FiUsers, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

type CommunityType = 'all' | 'speaking' | 'leadership' | 'volunteering'

interface CommunityItem {
  id: string
  type: 'speaking' | 'leadership' | 'volunteering'
  title: string
  tagline: string
  image: string
  imagePosition?: string
  date?: string
  link?: string
}

const communityItems: CommunityItem[] = [
  {
    id: '1',
    type: 'leadership',
    title: 'NASA Space Apps Beirut',
    tagline: 'Leading hackathons & innovation',
    image: '/projects/project1.jpg', // Replace with actual images
    imagePosition: 'center bottom',
    date: '2023 - Present',
  },
  {
    id: '2',
    type: 'leadership',
    title: 'National Physics Day',
    tagline: 'Organized national STEM event',
    image: '/projects/project2.jpg',
    date: '2024',
  },
  {
    id: '3',
    type: 'speaking',
    title: 'Nasna',
    tagline: 'non-profit NGO that leverages data to help people during war crisis in Lebanon',
    image: '/projects/nasna.jpeg',
    imagePosition: '50% 35%',
    date: '2024',
    link: '#',
  },
  {
    id: '4',
    type: 'speaking',
    title: 'Tech Meetup',
    tagline: 'Building ML Systems at Scale',
    image: '/projects/project1.jpg',
    date: '2023',
  },
  {
    id: '5',
    type: 'volunteering',
    title: 'Mentoring Program',
    tagline: 'Guiding aspiring engineers',
    image: '/projects/project2.jpg',
    date: '2023 - Present',
  },
  {
    id: '6',
    type: 'volunteering',
    title: 'Open Source',
    tagline: 'Contributing to CV & ML tools',
    image: '/projects/project3.jpg',
    date: '2022 - Present',
    link: '#',
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
  volunteering: {
    icon: <FiHeart size={20} />,
    label: 'Volunteering',
    color: 'text-accent-400',
    bgColor: 'bg-accent-500/10',
    borderColor: 'border-accent-500/20',
  },
}

export default function Community() {
  const ref = useRef(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [currentIndex, setCurrentIndex] = useState(1)
  const [canScrollLeft, setCanScrollLeft] = useState(true)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const filteredItems = communityItems

  // Initialize scroll to middle card
  useEffect(() => {
    if (!scrollContainerRef.current || cardsRef.current.length === 0) return
    
    const timer = setTimeout(() => {
      const container = scrollContainerRef.current
      const firstCard = cardsRef.current[0]
      if (!container || !firstCard) return
      
      const cardWidth = firstCard.offsetWidth
      const gap = 24
      const scrollPosition = (cardWidth + gap) * 1
      
      container.scrollLeft = scrollPosition
    }, 150)

    return () => clearTimeout(timer)
  }, [])

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    
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
    if (currentIndex < filteredItems.length - 1) {
      scrollToIndex(currentIndex + 1)
    }
  }

  return (
    <section
      id="community"
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-sm uppercase tracking-[0.4em] text-dark-text2 mb-4"
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
          className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
        >
          <div className="flex gap-6">
            {filteredItems.map((item, index) => {
              const config = typeConfig[item.type]
              return (
                <motion.div
                  key={item.id}
                  ref={(el) => {
                    cardsRef.current[index] = el
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur flex-shrink-0 w-[75%] sm:w-[55%] lg:w-[38%] xl:w-[32%] snap-center"
                  whileHover={{ y: -4 }}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-surface2 via-transparent" />
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
                    <h3 className="text-xl sm:text-2xl font-semibold text-dark-text mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-dark-text2 mb-3">
                      {item.tagline}
                    </p>
                    {item.date && (
                      <p className="text-xs text-dark-text2/70">
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
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-lg text-dark-text hover:border-primary-500/60 hover:text-primary-300 hover:bg-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/15 disabled:hover:text-dark-text disabled:hover:bg-white/10"
            aria-label="Previous"
          >
            <FiChevronLeft size={20} />
          </button>
          <div className="flex gap-1.5">
            {filteredItems.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary-500'
                    : 'w-2 bg-white/20 hover:bg-white/30'
                }`}
                aria-label={`Go to item ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-lg text-dark-text hover:border-primary-500/60 hover:text-primary-300 hover:bg-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/15 disabled:hover:text-dark-text disabled:hover:bg-white/10"
            aria-label="Next"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}

