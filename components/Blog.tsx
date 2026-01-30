'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiBookOpen, FiBookmark, FiMoreHorizontal } from 'react-icons/fi'
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
      className="relative min-h-screen flex flex-col justify-center py-12 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-l border-r border-b mx-auto"
      style={{ 
        ...getSectionStyle(),
        ...getSectionWidthStyle() 
      }}
    >

      <div className="w-full relative z-10">
        {/* Header Section */}
        <div className="text-center mb-6 lg:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-3 rounded-full border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] mb-6"
            style={{ color: 'var(--color-secondary)' }}
          >
            <FiBookOpen className="text-primary-500" size={14} />
            <span>Latest Articles</span>
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
          className="space-y-3 lg:space-y-6"
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
                className="group relative flex flex-col sm:flex-row gap-2.5 lg:gap-4 p-2.5 sm:p-3 lg:p-6 transition-all duration-300 cursor-pointer blog-article-gradient"
                style={{
                  borderRadius: 0, // Sharp corners
                  border: 'none',
                  position: 'relative',
                }}
              >
                {/* Content Section - Left */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Pinned indicator (show for first article) */}
                  {/* Title */}
                  <h3 className="text-sm lg:text-2xl font-bold mb-1 lg:mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-tight" style={{ color: 'var(--color-secondary)' }}>
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] lg:text-base mb-2 lg:mb-4 leading-relaxed line-clamp-2" style={{ color: 'var(--color-secondary)' }}>
                    {article.description}
                  </p>

                  {/* Footer with metadata */}
                  <div className="flex items-center justify-between mt-auto pt-1 lg:pt-2">
                    <div className="flex items-center gap-1.5 lg:gap-3 text-[10px] lg:text-sm" style={{ color: 'var(--color-secondary)' }}>
                      <span>{timeAgo}</span>
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-1.5 lg:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // Bookmark functionality can be added here
                        }}
                        className="p-1.5 lg:p-2 hover:bg-light-surface2 dark:hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Bookmark"
                      >
                        <FiBookmark className="w-4 h-4 lg:w-[18px] lg:h-[18px]" size={18} style={{ color: 'var(--color-secondary)' }} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // More options can be added here
                        }}
                        className="p-1.5 lg:p-2 hover:bg-light-surface2 dark:hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="More options"
                      >
                        <FiMoreHorizontal className="w-4 h-4 lg:w-[18px] lg:h-[18px]" size={18} style={{ color: 'var(--color-secondary)' }} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Section - Right */}
                {article.bannerImage && (
                  <div className="relative w-full sm:w-28 sm:h-28 lg:w-32 lg:h-32 h-40 sm:h-28 sm:flex-shrink-0 rounded-lg overflow-hidden bg-light-surface2 dark:bg-dark-surface">
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
