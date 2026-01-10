'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiBookOpen, FiArrowRight, FiExternalLink, FiBookmark, FiMoreHorizontal } from 'react-icons/fi'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { blogArticles } from '@/data/blog'
import Link from 'next/link'

export default function BlogPage() {
  const router = useRouter()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  // Sort articles by published date (newest first)
  const sortedArticles = [...blogArticles].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  )

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Back Button */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-light-bg/80 dark:bg-dark-bg/80 border-b border-light-border/50 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/#blog"
            className="inline-flex items-center space-x-2 text-light-text2 dark:text-dark-text2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <FiArrowRight className="rotate-180" size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Header Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary-500/5 blur-[120px]"
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [0.9, 1.1, 0.9],
              x: [0, 50, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent-500/5 blur-[120px]"
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.1, 0.95],
              x: [0, -30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-3 rounded-full border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-light-text2 dark:text-dark-text2 mb-6"
          >
            <FiBookOpen className="text-primary-500" size={14} />
            <span>My Articles</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6"
          >
            Blog <span className="text-gradient">Articles</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-light-text2 dark:text-dark-text2 max-w-2xl mx-auto"
          >
            Exploring AI, Computer Vision, and Technology through writing
          </motion.p>
        </div>
      </section>

      {/* Articles List */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pb-20">
        {sortedArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <p className="text-light-text2 dark:text-dark-text2 text-lg">
              No articles available yet. Check back soon!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sortedArticles.map((article, index) => {
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
                    delay: index * 0.05,
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
                      <div className="flex items-center gap-2 mb-2 text-xs text-light-text2 dark:text-dark-text2">
                        <span className="text-primary-500">📍</span>
                        <span>Pinned</span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-light-text dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-tight">
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-light-text2 dark:text-dark-text2 mb-4 leading-relaxed line-clamp-2">
                      {article.description}
                    </p>

                    {/* Footer with metadata */}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-light-text2 dark:text-dark-text2">
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
                          <FiBookmark size={18} className="text-light-text2 dark:text-dark-text2" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // More options can be added here
                          }}
                          className="p-2 hover:bg-light-surface2 dark:hover:bg-white/10 rounded-lg transition-colors"
                          aria-label="More options"
                        >
                          <FiMoreHorizontal size={18} className="text-light-text2 dark:text-dark-text2" />
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
          </div>
        )}
      </section>
    </div>
  )
}
