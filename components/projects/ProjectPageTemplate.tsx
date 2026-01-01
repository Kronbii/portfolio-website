'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink, FiArrowLeft, FiCode, FiServer, FiPlay } from 'react-icons/fi'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/components/Projects'
import { HoverButton } from '@/components/ui/hover-button'
import { getFallbackImage } from '@/lib/utils'
import { useState } from 'react'

interface ProjectPageTemplateProps {
  project: Project
  children?: React.ReactNode
}

export default function ProjectPageTemplate({ project, children }: ProjectPageTemplateProps) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(project.image || '')

  const handleImageError = () => {
    if (project.image) {
      const fallback = getFallbackImage(project.image)
      if (fallback !== project.image && imageSrc === project.image) {
        setImageSrc(fallback)
      } else {
        setImageError(true)
      }
    }
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Back Button */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-light-bg/80 dark:bg-dark-bg/80 border-b border-light-border/50 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/#projects"
            className="inline-flex items-center space-x-2 text-light-text2 dark:text-dark-text2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <FiArrowLeft size={20} />
            <span>Back to Projects</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative w-full h-64 md:h-96 overflow-hidden bg-light-surface2 dark:bg-dark-surface2">
          {project.image && !imageError ? (
            <>
              <Image
                src={imageSrc || project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-light-bg dark:from-dark-bg via-transparent to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary-500/30">
              <FiCode size={64} />
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-light-surface dark:bg-dark-surface rounded-3xl border border-light-border/50 dark:border-white/10 shadow-2xl p-6 md:p-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              {project.title}
            </h1>
            <p className="text-lg text-light-text2 dark:text-dark-text2 mb-6 leading-relaxed">
              {project.longDescription || project.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <HoverButton
                href={project.githubUrl}
                variant="gradient"
                className="flex items-center space-x-2"
              >
                <FiGithub size={20} />
                <span>View on GitHub</span>
              </HoverButton>
              {project.demoUrl && (
                <HoverButton
                  href={project.demoUrl}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <FiExternalLink size={20} />
                  <span>Live Demo</span>
                </HoverButton>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Features Section */}
            {project.features && project.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-light-surface dark:bg-dark-surface rounded-3xl border border-light-border/50 dark:border-white/10 p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">
                  Key Features
                </h2>
                <ul className="space-y-3">
                  {project.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-light-text2 dark:text-dark-text2">
                      <span className="text-primary-500 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Custom Content - Children */}
            {children}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-light-surface dark:bg-dark-surface rounded-3xl border border-light-border/50 dark:border-white/10 p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold mb-4 text-light-text dark:text-dark-text">
                Project Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-light-text2 dark:text-dark-text2 mb-1">Links</p>
                  <div className="space-y-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                    >
                      <FiGithub size={16} />
                      <span className="text-sm">GitHub Repository</span>
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
                      >
                        <FiExternalLink size={16} />
                        <span className="text-sm">Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

