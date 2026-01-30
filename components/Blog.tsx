'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiBookOpen, FiBookmark, FiMoreHorizontal, FiClock } from 'react-icons/fi'
import Image from 'next/image'
import { getLatestArticles, BlogArticle } from '@/data/blog'
import { getSectionHeaderStyle, getSectionSubtitleStyle, getSectionWidthStyle, getSectionStyle } from '@/lib/utils'

export default function Blog() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const latestArticles = getLatestArticles(3)
  const articlesToDisplay = latestArticles

  if (articlesToDisplay.length === 0) {
    return null // Don't render if no articles
  }

  const handleArticleClick = (article: BlogArticle) => {
    if (article.externalUrl) {
      window.open(article.externalUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section
      id="blog"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-l border-r border-b mx-auto"
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
        {/* Header Section */}
        <div className="text-center mb-10 lg:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 border-2 px-5 py-2.5 mb-6"
            style={{
              color: 'var(--color-secondary)',
              borderColor: 'rgba(33, 33, 33, 0.2)',
              borderRadius: 0,
              backgroundColor: 'rgba(216, 216, 216, 0.05)',
            }}
          >
            <FiBookOpen size={16} style={{ color: 'var(--color-secondary)' }} />
            <span
              className="uppercase tracking-widest font-medium"
              style={{
                fontSize: '11px',
                letterSpacing: '0.15em',
              }}
            >
              Latest Articles
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={getSectionHeaderStyle().className}
            style={getSectionHeaderStyle().style}
          >
            <span className="text-gradient">BLOG ARTICLES</span>
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={getSectionSubtitleStyle().className}
            style={getSectionSubtitleStyle().style}
          >
            Exploring AI, Computer Vision, and Technology through writing
          </motion.h3>
        </div>

        {/* Articles List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-5 lg:space-y-6"
        >
          {articlesToDisplay.map((article, index) => {
            // Calculate time ago
            const publishedDate = new Date(article.publishedDate)
            const now = new Date()
            const hoursAgo = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60))
            const daysAgo = Math.floor(hoursAgo / 24)
            const timeAgo = daysAgo > 0 ? `${daysAgo}d ago` : `${hoursAgo}h ago`

            return (
              <motion.article
                key={`${article.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + index * 0.1,
                }}
                onClick={(e) => {
                  e.preventDefault()
                  handleArticleClick(article)
                }}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col sm:flex-row gap-4 lg:gap-6 border-2 transition-all duration-300 cursor-pointer"
                style={{
                  borderColor: 'rgba(33, 33, 33, 0.2)',
                  borderRadius: 0,
                  backgroundColor: 'var(--color-primary)',
                  padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                }}
              >
                {/* Hover border effect */}
                <div
                  className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    borderColor: 'rgba(33, 33, 33, 0.4)',
                    borderRadius: 0,
                  }}
                />

                {/* Subtle gradient overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, rgba(216, 216, 216, 0.3) 0%, transparent 100%)',
                  }}
                />

                {/* Content Section - Left */}
                <div className="flex-1 flex flex-col min-w-0 relative z-10">
                  {/* Time badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="inline-flex items-center gap-2 border px-3 py-1"
                      style={{
                        borderColor: 'rgba(33, 33, 33, 0.2)',
                        borderRadius: 0,
                        backgroundColor: 'rgba(216, 216, 216, 0.05)',
                      }}
                    >
                      <FiClock
                        size={12}
                        style={{ color: 'var(--color-secondary)', opacity: 0.5 }}
                      />
                      <span
                        className="uppercase tracking-wider font-medium"
                        style={{
                          color: 'var(--color-secondary)',
                          opacity: 0.5,
                          fontSize: '10px',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-bold mb-2 lg:mb-3 line-clamp-2 leading-tight transition-transform duration-300 group-hover:translate-x-1"
                    style={{
                      color: 'var(--color-secondary)',
                      fontSize: 'clamp(16px, 2.5vw, 22px)',
                    }}
                  >
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="leading-relaxed line-clamp-2 flex-grow"
                    style={{
                      color: 'var(--color-secondary)',
                      opacity: 0.7,
                      fontSize: 'clamp(13px, 1.6vw, 15px)',
                      lineHeight: 1.6,
                    }}
                  >
                    {article.description}
                  </p>

                  {/* Action Icons - visible on hover */}
                  <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Bookmark functionality can be added here
                      }}
                      className="border p-2 transition-all duration-300 hover:bg-opacity-10"
                      aria-label="Bookmark"
                      style={{
                        borderColor: 'rgba(33, 33, 33, 0.2)',
                        borderRadius: 0,
                      }}
                    >
                      <FiBookmark size={14} style={{ color: 'var(--color-secondary)' }} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // More options can be added here
                      }}
                      className="border p-2 transition-all duration-300 hover:bg-opacity-10"
                      aria-label="More options"
                      style={{
                        borderColor: 'rgba(33, 33, 33, 0.2)',
                        borderRadius: 0,
                      }}
                    >
                      <FiMoreHorizontal size={14} style={{ color: 'var(--color-secondary)' }} />
                    </button>
                  </div>
                </div>

                {/* Image Section - Right */}
                {article.bannerImage && (
                  <div
                    className="relative w-full sm:w-32 sm:h-32 lg:w-40 lg:h-40 h-48 flex-shrink-0 overflow-hidden border-2 z-10"
                    style={{
                      borderColor: 'rgba(33, 33, 33, 0.2)',
                      borderRadius: 0,
                      backgroundColor: 'rgba(216, 216, 216, 0.05)',
                    }}
                  >
                    <Image
                      src={article.bannerImage}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
              </motion.article>

            )
          })}
        </motion.div>

      </div>
    </section>
  )
}
