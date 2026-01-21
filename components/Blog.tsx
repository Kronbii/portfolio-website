'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiBookOpen, FiArrowRight, FiBookmark, FiMoreHorizontal } from 'react-icons/fi'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getLatestArticles, BlogArticle } from '@/data/blog'
import Link from 'next/link'
import { CornerButton } from '@/components/ui/corner-button'
import { getSectionHeaderStyle, getSectionSubheadingStyle } from '@/lib/utils'
import { getSectionWidthStyle } from '@/lib/utils'

export default function Blog() {
  const router = useRouter()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const latestArticles = getLatestArticles(3)

  if (latestArticles.length === 0) {
    return null // Don't render if no articles
  }

  return (
    <section
      id="blog"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#EAEAEA] border border-[#212121]/30 mx-auto"
      style={{ backgroundColor: '#EAEAEA', ...getSectionWidthStyle() }}
    >

      <div className="w-full relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-3 rounded-full border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#252525] mb-6"
          >
            <FiBookOpen className="text-primary-500" size={14} />
            <span>Latest Articles</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${getSectionHeaderStyle().className} mb-6`}
            style={getSectionHeaderStyle().style}
          >
            <span className="text-gradient">BLOG ARTICLES</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={getSectionSubheadingStyle().className}
            style={getSectionSubheadingStyle().style}
          >
            Exploring AI, Computer Vision, and Technology through writing
          </motion.p>
        </div>

        {/* Articles List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {latestArticles.map((article, index) => {
            // Calculate time ago
            const publishedDate = new Date(article.publishedDate)
            const now = new Date()
            const hoursAgo = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60))
            const daysAgo = Math.floor(hoursAgo / 24)
            const timeAgo = daysAgo > 0 ? `${daysAgo}d ago` : `${hoursAgo}h ago`

            return (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.4 + index * 0.1,
                }}
                onClick={(e) => {
                  e.preventDefault()
                  router.push(`/blog/${article.slug}`)
                }}
                className="group relative flex flex-col sm:flex-row gap-4 p-4 sm:p-6 rounded-xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-white/[0.03] hover:border-primary-500/30 hover:bg-light-surface2/50 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
              >
                {/* Content Section - Left */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Pinned indicator (show for first/latest article) */}
                  {index === 0 && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-[#252525]">
                      <span className="text-primary-500">📍</span>
                      <span>Pinned</span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-[#252525] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-tight">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-[#252525] mb-4 leading-relaxed line-clamp-2">
                    {article.description}
                  </p>

                  {/* Footer with metadata */}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-[#252525]">
                      <span>{timeAgo}</span>
                      <span>•</span>
                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <span className="text-primary-600 dark:text-primary-400">
                          {article.tags[0]}
                        </span>
                      )}
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // Bookmark functionality can be added here
                        }}
                        className="p-2 hover:bg-light-surface2 dark:hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Bookmark"
                      >
                        <FiBookmark size={18} className="text-[#252525]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // More options can be added here
                        }}
                        className="p-2 hover:bg-light-surface2 dark:hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="More options"
                      >
                        <FiMoreHorizontal size={18} className="text-[#252525]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Section - Right */}
                {article.bannerImage && (
                  <div className="relative w-full sm:w-32 sm:h-32 h-48 sm:flex-shrink-0 rounded-lg overflow-hidden bg-light-surface2 dark:bg-dark-surface">
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

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <CornerButton
            href="/blog"
            className="inline-flex items-center gap-2"
          >
            <span>VIEW ALL ARTICLES</span>
          </CornerButton>
        </motion.div>
      </div>
    </section>
  )
}
