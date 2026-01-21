'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiImage, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getFallbackImage } from '@/lib/utils'
import { projects, Project } from '@/data/projects'
import { useInfiniteCarousel } from '@/hooks/useInfiniteCarousel'
import { getSectionWidthStyle, getSectionHeaderStyle } from '@/lib/utils'

// Re-export for backward compatibility
export type { Project }
export { projects }

export default function Projects() {
  const router = useRouter()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({})
  const [imageSources, setImageSources] = useState<{ [key: number]: string }>({})

  const itemCount = projects.length
  const {
    scrollContainerRef,
    cardsRef,
    currentIndex,
    actualIndex,
    extendedItems: extendedProjects,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScrollLeft,
    handleScrollRight,
    scrollToIndex,
    getActualIndex,
  } = useInfiniteCarousel(projects, { itemCount })

  const openProject = (index: number) => {
    const actualIdx = getActualIndex(index)
    const project = projects[actualIdx]
    
    // If project has an external URL, open it in a new tab
    if (project.externalUrl) {
      window.open(project.externalUrl, '_blank', 'noopener,noreferrer')
    } else {
      // Otherwise, navigate to internal project page
      router.push(`/projects/${project.slug}`)
    }
  }

  const handleImageError = (index: number, originalSrc: string) => {
    const fallback = getFallbackImage(originalSrc)
    const currentSrc = imageSources[index] || originalSrc
    
    // If we haven't tried the fallback yet, use it
    if (currentSrc === originalSrc && fallback !== originalSrc) {
      setImageSources((prev) => ({ ...prev, [index]: fallback }))
    } else {
      // If fallback also failed, show error placeholder
    setImageErrors((prev) => ({ ...prev, [index]: true }))
    }
  }

  return (
    <>
      <section
        id="projects"
        ref={ref}
        className="min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 bg-[#EAEAEA] border border-[#212121]/30 mx-auto"
        style={{ backgroundColor: '#EAEAEA', ...getSectionWidthStyle() }}
      >
        <div className="w-full">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center text-sm uppercase tracking-[0.4em] text-[#252525]"
          >
            Portfolio Projects
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={`${getSectionHeaderStyle().className} mb-3 pb-8 text-center`}
            style={getSectionHeaderStyle().style}
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
              {(extendedProjects as Project[]).map((project, index) => {
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
                        src={imageSources[actualIdx] || project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={() => project.image && handleImageError(actualIdx, project.image)}
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
                  <h3 className="text-2xl font-semibold mb-2 text-[#252525] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm uppercase tracking-wide text-[#252525] mb-3">
                    Featured build
                  </p>
                  <p className="text-[#252525] mb-5 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
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
              className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/10 backdrop-blur-lg text-[#252525] hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-light-surface dark:hover:bg-white/15 transition-colors"
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
              className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/10 backdrop-blur-lg text-[#252525] hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 hover:bg-light-surface dark:hover:bg-white/15 transition-colors"
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
            <p className="text-[#252525] text-lg">
              Want a similar transformation? <a href="#contact" className="text-primary-600 dark:text-primary-400 underline-offset-4 hover:underline">Let&apos;s design your roadmap</a> and launch faster.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
