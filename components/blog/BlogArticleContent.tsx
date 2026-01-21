'use client'

import { motion } from 'framer-motion'
import { FiExternalLink, FiBookOpen } from 'react-icons/fi'
import Image from 'next/image'
import { useState } from 'react'
import { BlogArticle } from '@/data/types'
import { CornerButton } from '@/components/ui/corner-button'

interface BlogArticleContentProps {
  article: BlogArticle
}

export default function BlogArticleContent({ article }: BlogArticleContentProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        {article.bannerImage && (
          <div className="relative w-full h-64 md:h-96 overflow-hidden bg-light-surface2 dark:bg-dark-surface2">
            {!imageError ? (
              <>
                <Image
                  src={article.bannerImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-light-bg dark:from-dark-bg via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary-500/30">
                <FiBookOpen size={64} />
              </div>
            )}
          </div>
        )}

        <div className={`w-full px-4 sm:px-6 lg:px-8 ${article.bannerImage ? '-mt-20' : 'pt-12'} relative z-10`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`bg-light-surface dark:bg-dark-surface rounded-3xl border border-light-border/50 dark:border-white/10 shadow-2xl p-6 md:p-8 ${article.bannerImage ? '' : 'mt-0'}`}
          >
            {/* Date and Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <p className="text-sm text-[#252525]">
                {new Date(article.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {article.tags && article.tags.length > 0 && (
                <>
                  <span className="text-[#252525]">•</span>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              {article.title}
            </h1>
            <p className="text-lg text-[#252525] mb-6 leading-relaxed">
              {article.description}
            </p>

            {/* External Links */}
            {(article.mediumUrl || article.devToUrl) && (
              <div className="flex flex-wrap gap-4">
              {article.mediumUrl && (
                <CornerButton
                  href={article.mediumUrl}
                  className="inline-flex items-center space-x-2"
                >
                  <span>READ ON MEDIUM</span>
                  <FiExternalLink size={18} />
                </CornerButton>
              )}
              {article.devToUrl && (
                <CornerButton
                  href={article.devToUrl}
                  className="inline-flex items-center space-x-2"
                >
                  <span>READ ON DEV.TO</span>
                  <FiExternalLink size={18} />
                </CornerButton>
              )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-light-surface dark:bg-dark-surface rounded-3xl border border-light-border/50 dark:border-white/10 p-6 md:p-8 lg:p-12"
        >
          <div
            className="article-content
              [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-bold [&_h1]:text-[#252525] [&_h1]:mb-4 [&_h1]:mt-8
              [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:text-[#252525] [&_h2]:mb-3 [&_h2]:mt-6
              [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-semibold [&_h3]:text-[#252525] [&_h3]:mb-2 [&_h3]:mt-4
              [&_p]:text-[#252525] [&_p]:mb-4 [&_p]:leading-relaxed
              [&_a]:text-primary-600 [&_a]:dark:text-primary-400 [&_a]:underline [&_a]:hover:text-primary-500 [&_a]:dark:hover:text-primary-300
              [&_strong]:text-[#252525] [&_strong]:font-semibold
              [&_code]:text-primary-600 [&_code]:dark:text-primary-400 [&_code]:bg-light-surface2 [&_code]:dark:bg-dark-surface2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
              [&_pre]:bg-light-surface2 [&_pre]:dark:bg-dark-surface2 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-4 [&_pre]:border [&_pre]:border-light-border/30 [&_pre]:dark:border-white/10
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary-500/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#252525] [&_blockquote]:mb-4
              [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-4 [&_ul]:text-[#252525] [&_ul]:space-y-2
              [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-4 [&_ol]:text-[#252525] [&_ol]:space-y-2
              [&_li]:mb-1
              [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto
              [&_hr]:my-8 [&_hr]:border-light-border/30 [&_hr]:dark:border-white/10"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </motion.div>

        {/* External Links Footer */}
        {(article.mediumUrl || article.devToUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-light-surface2/50 dark:bg-white/5 rounded-3xl border border-light-border/50 dark:border-white/10 p-6 md:p-8 text-center"
          >
            <p className="text-[#252525] mb-4">
              This article is also available on:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
            {article.mediumUrl && (
              <CornerButton
                href={article.mediumUrl}
                className="inline-flex items-center space-x-2"
              >
                <span>MEDIUM</span>
                <FiExternalLink size={18} />
              </CornerButton>
            )}
            {article.devToUrl && (
              <CornerButton
                href={article.devToUrl}
                className="inline-flex items-center space-x-2"
              >
                <span>DEV.TO</span>
                <FiExternalLink size={18} />
              </CornerButton>
            )}
            </div>
          </motion.div>
        )}
      </section>
    </>
  )
}
