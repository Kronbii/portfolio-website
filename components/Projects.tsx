'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { FiGithub, FiExternalLink, FiX, FiImage, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Image from 'next/image'
import { HoverButton } from '@/components/ui/hover-button'

interface Project {
  title: string
  description: string
  longDescription?: string
  githubUrl: string
  demoUrl?: string
  technologies: string[]
  image?: string
  features?: string[]
}

const projects: Project[] = [
  {
    title: 'Thermal Super-Resolution with IMDN',
    description:
      'A high-performance thermal super-resolution system achieving 34.2 dB PSNR at 229+ FPS using a novel IMDN-based architecture optimized for real-time thermal imaging.',
    longDescription:
      'This project introduces the first real-time thermal super-resolution framework built on the Information Multi-Distillation Network (IMDN). It delivers 34.2 dB PSNR and 229+ FPS, outperforming existing methods while remaining lightweight (0.69M parameters). The system integrates a thermal-aware loss function and a cross-domain transfer approach to adapt RGB-pretrained models to thermal data, resulting in superior detail preservation and speed. Applications span autonomous driving, industrial monitoring, thermal surveillance, and medical diagnostics. Developed with PyTorch, TensorRT, and OpenCV, this solution establishes a new state-of-the-art benchmark for real-time thermal enhancement.',
    githubUrl: 'https://github.com/Kronbii/thermal-super-resolution',
    technologies: ['Python', 'PyTorch', 'TensorRT', 'OpenCV'],
    image: '/projects/thermal-sr.png',
    features: [
      '34.2 dB PSNR at 229+ FPS real-time inference',
      'Thermal-aware multi-component loss function',
      'Cross-domain RGB-to-thermal transfer learning',
      'Lightweight IMDN architecture (0.69M parameters)',
      'Applications in robotics, security, and autonomous systems',
    ],
  },
  {
    title: 'Autonomous Race Car (WRO 2023 Winner)',
    description:
      'An open-source autonomous race vehicle built in just 20 days for the WRO Future Engineers challenge. Combines embedded control, sensor fusion, and Jetson-powered computer vision for real-time navigation and decision-making.',
    longDescription:
      'This project showcases a fully integrated autonomous vehicle developed from scratch in only 20 days for the World Robot Olympiad Future Engineers 2023 competition. The system combines a Jetson Nano for high-level computer vision and an Arduino Mega for deterministic real-time control using PID steering stabilization and sensor fusion from IMU and color sensors. Designed as a dual-MCU platform, it achieves smooth autonomous cornering, traffic sign detection, and dynamic pathing. Built with OpenCV, C++, and Python, the project demonstrates robust teamwork, rapid prototyping, and reliable embedded AI performance on a tight schedule.',
    githubUrl: 'https://github.com/Kronbii/autonomous-race-car',
    technologies: ['Python', 'C++', 'OpenCV', 'Arduino', 'Jetson Nano'],
    image: '/projects/race-car.png',
    features: [
      'End-to-end autonomous vehicle built in 20 days',
      'Jetson-based traffic sign and lane detection',
      'Arduino PID control with IMU and color sensors',
      'Dual-MCU architecture for modular expandability',
      'Designed and deployed for WRO Future Engineers 2023',
    ],
  },  
  {
    title: 'Smart Learning Table for Classrooms',
    description:
      'An IoT-powered, AI-assisted smart desk that combines hardware control, computer vision, and ergonomic intelligence to enhance classroom learning and posture health.',
    longDescription:
      'The Smart Learning Table is an interactive, sensor-driven workstation designed to improve engagement, comfort, and learning outcomes in classrooms and offices. Built with ESP32 microcontrollers, motorized actuators, and OpenCV-based vision tracking, the desk automatically adjusts height and tilt, monitors user posture, and provides real-time visual feedback. It supports multiple control interfaces, including a web dashboard and Bluetooth controllers, and integrates posture analytics for ergonomic insights. Developed as a collaborative university project, it demonstrates a seamless fusion of IoT, embedded systems, and AI for human-centered design.',
    githubUrl: 'https://github.com/Kronbii/smart-interactive-desk',
    technologies: ['Python', 'OpenCV', 'ESP32', 'React', 'MQTT'],
    image: '/projects/smart-desk.png',
    features: [
      'Motorized height and tilt adjustment via actuators',
      'Posture tracking using computer vision and sensors',
      'Web dashboard and Bluetooth controller interfaces',
      'Real-time visual feedback through LEDs and displays',
      'IoT connectivity with data logging and analytics',
    ],
  },
]

export default function Projects() {
  const ref = useRef(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndexRef = useRef<number>(0)
  const touchStartRef = useRef<number>(0)
  const touchEndRef = useRef<number>(0)
  const isAnimatingRef = useRef(false)

  // Create infinite loop by tripling the items
  const extendedProjects = [...projects, ...projects, ...projects]
  const itemCount = projects.length

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

  // Get the actual index in the original array for modal
  const getActualIndex = (index: number) => {
    return ((index % itemCount) + itemCount) % itemCount
  }

  const openProject = (index: number) => {
    const actualIdx = getActualIndex(index)
    setSelectedProject(actualIdx)
  }

  const closeProject = () => {
    setSelectedProject(null)
  }

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }))
  }

  // Get the actual index in the original array for pagination dots
  const actualIndex = ((currentIndex % itemCount) + itemCount) % itemCount

  return (
    <>
      <section
        id="projects"
        ref={ref}
        className="min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center text-sm uppercase tracking-[0.4em] text-light-text2 dark:text-dark-text2"
          >
            Portfolio Projects
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold mb-3 pb-8 text-center"
          >
            Real work,<span className="text-gradient"> delivered with impact</span>
          </motion.h2>

          {/* Scrollable Projects Container */}
          <div
            ref={scrollContainerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-x-scroll scrollbar-hide py-8 touch-pan-y"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-6 px-4 sm:px-6 lg:px-[calc((100vw-72rem)/2+1.5rem)] items-center w-max">
              {extendedProjects.map((project, index) => {
                const isCentered = index === currentIndex
                const actualIdx = getActualIndex(index)
                return (
                  <motion.div
                    key={`${project.title}-${index}`}
                    ref={(el) => {
                      cardsRef.current[index] = el
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: isCentered ? -8 : 0, scale: isCentered ? 1.02 : 1 } : {}}
                    transition={{ duration: 0.15 }}
                    className={`group relative overflow-hidden rounded-3xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-dark-surface2/80 hover:border-primary-500/50 transition-all duration-300 cursor-pointer shadow-sm dark:shadow-none flex-shrink-0 w-[320px] sm:w-[360px] lg:w-[400px] ${
                      isCentered 
                        ? 'shadow-xl dark:shadow-2xl shadow-primary-500/10 dark:shadow-primary-500/20 -translate-y-4 scale-[1.02] z-10' 
                        : ''
                    }`}
                    whileHover={{ y: isCentered ? -12 : -8, scale: isCentered ? 1.04 : 1.02 }}
                    onClick={() => openProject(index)}
                  >
                    <div className="relative w-full h-52 overflow-hidden bg-light-surface2 dark:bg-dark-surface">
                      {project.image && !imageErrors[actualIdx] ? (
                        <>
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={() => handleImageError(actualIdx)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-light-surface dark:from-dark-surface2 to-transparent" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary-500/30">
                          <FiImage size={48} />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-semibold mb-2 text-light-text dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm uppercase tracking-wide text-light-text2 dark:text-dark-text2 mb-3">
                        Featured build
                      </p>
                      <p className="text-light-text2 dark:text-dark-text2 mb-5 leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.technologies.slice(0, 3).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-primary-500/15 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-sm">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="text-primary-600 dark:text-primary-400 text-sm font-semibold group-hover:text-primary-500 dark:group-hover:text-primary-300 transition-colors">
                        Tap for outcomes →
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
              aria-label="Previous project"
            >
              <FiChevronLeft size={20} />
            </button>
            <div className="flex gap-1.5">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(itemCount + index)}
                  className={`h-2 rounded-full transition-all ${
                    index === actualIndex
                      ? 'w-8 bg-primary-500'
                      : 'w-2 bg-light-border dark:bg-white/20 hover:bg-light-text2/30 dark:hover:bg-white/30'
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleScrollRight}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/10 backdrop-blur-lg text-light-text dark:text-dark-text hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-light-surface dark:hover:bg-white/15 transition-colors"
              aria-label="Next project"
            >
              <FiChevronRight size={20} />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 rounded-3xl border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 p-6 text-center"
          >
            <p className="text-light-text dark:text-dark-text text-lg">
              Want a similar transformation? <a href="#contact" className="text-primary-600 dark:text-primary-400 underline-offset-4 hover:underline">Let&apos;s design your roadmap</a> and launch faster.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={closeProject}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-8 lg:inset-16 z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-light-surface dark:bg-dark-surface rounded-3xl border border-light-border/50 dark:border-white/10 shadow-2xl max-w-5xl mx-auto overflow-hidden">
                {projects[selectedProject] && (
                  <>
                    {/* Modal Header */}
                    <div className="relative">
                      <div className="relative w-full h-64 md:h-96 overflow-hidden bg-light-surface2 dark:bg-dark-surface2">
                        {projects[selectedProject].image && !imageErrors[selectedProject] ? (
                          <>
                            <Image
                              src={projects[selectedProject].image}
                              alt={projects[selectedProject].title}
                              fill
                              className="object-cover"
                              onError={() => handleImageError(selectedProject)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-light-surface dark:from-dark-surface to-transparent" />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary-500/30">
                            <FiImage size={64} />
                          </div>
                        )}
                      </div>
                      <HoverButton
                        onClick={closeProject}
                        variant="outline"
                        className="absolute top-4 right-4 bg-light-surface/90 dark:bg-dark-surface/90 hover:bg-light-surface dark:hover:bg-dark-surface text-light-text2 dark:text-dark-text2 hover:text-primary-500 rounded-full p-2 z-10"
                        aria-label="Close project"
                      >
                        <FiX size={24} />
                      </HoverButton>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 md:p-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-500">
                        {projects[selectedProject].title}
                      </h2>
                      
                      <p className="text-lg text-light-text2 dark:text-dark-text2 mb-6 leading-relaxed">
                        {projects[selectedProject].longDescription || projects[selectedProject].description}
                      </p>

                      {projects[selectedProject].features && (
                        <div className="mb-6">
                          <h3 className="text-xl font-bold mb-3 text-light-text dark:text-dark-text">Key Features</h3>
                          <ul className="space-y-2">
                            {projects[selectedProject].features!.map((feature, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-light-text2 dark:text-dark-text2">
                                <span className="text-primary-500 mt-1">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-3 text-light-text dark:text-dark-text">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                          {projects[selectedProject].technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-4 py-2 bg-primary-500/15 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <HoverButton
                          href={projects[selectedProject].githubUrl}
                          variant="gradient"
                          className="flex items-center space-x-2"
                        >
                          <FiGithub size={20} />
                          <span>View on GitHub</span>
                        </HoverButton>
                        {projects[selectedProject].demoUrl && (
                          <HoverButton
                            href={projects[selectedProject].demoUrl}
                            variant="outline"
                            className="flex items-center space-x-2"
                          >
                            <FiExternalLink size={20} />
                            <span>Live Demo</span>
                          </HoverButton>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
