'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiGithub, FiLinkedin, FiMail, FiClock } from 'react-icons/fi'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionStyle } from '@/lib/utils'

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="contact"
      ref={ref}
      className="min-h-screen flex flex-col justify-center py-12 lg:py-24 px-4 sm:px-6 lg:px-8 border-l border-r border-b mx-auto"
      style={{ 
        ...getSectionStyle(),
        ...getSectionWidthStyle() 
      }}
    >
      <div className="w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`${getSectionHeaderStyle().className} text-center mb-8 sm:mb-10 lg:mb-12`}
          style={getSectionHeaderStyle().style}
        >
          Let&apos;s build your next intelligent product
        </motion.h2>

        <div className="max-w-2xl mx-auto">
          {/* Social Links & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 sm:space-y-5 lg:space-y-6"
          >
            <div className="border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 p-4 sm:p-5 lg:p-6"
            style={{ 
              backgroundColor: 'var(--color-primary)', 
              borderRadius: 0,
              color: 'var(--paint-texture-color-start)',
              backgroundClip: 'unset',
              WebkitBackgroundClip: 'unset'
            }}>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-5 lg:mb-6" style={{ color: 'var(--color-secondary)' }}>Preferred channels</h3>
              <div className="space-y-3 sm:space-y-4">
                <motion.a
                  href="https://github.com/Kronbii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between dark:bg-dark-surface/70 px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4"
                  style={{ 
                    backgroundColor: 'var(--color-accent)', 
                    color: 'var(--color-secondary)',
                    borderWidth: 0,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    borderImage: 'none',
                    borderRadius: 0,
                  }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <FiGithub className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" size={20} />
                    <span className="text-sm sm:text-base lg:text-lg truncate">GitHub</span>
                  </div>
                  <span className="text-xs sm:text-sm lg:text-base ml-3 flex-shrink-0" style={{ color: 'var(--color-secondary)' }}>Case studies</span>
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/rami-kronbi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between dark:bg-dark-surface/70 px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4"
                  style={{ 
                    backgroundColor: 'var(--color-accent)', 
                    color: 'var(--color-secondary)',
                    borderWidth: 0,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    borderImage: 'none',
                    borderRadius: 0,
                  }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <FiLinkedin className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" size={20} />
                    <span className="text-sm sm:text-base lg:text-lg truncate">LinkedIn</span>
                  </div>
                  <span className="text-xs sm:text-sm lg:text-base ml-3 flex-shrink-0 whitespace-nowrap" style={{ color: 'var(--color-secondary)' }}>Professional updates</span>
                </motion.a>
                <motion.a
                  href="mailto:ramykronby@gmail.com"
                  className="flex items-center justify-between dark:bg-dark-surface/70 px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4"
                  style={{ 
                    backgroundColor: 'var(--color-accent)', 
                    color: 'var(--color-secondary)',
                    borderWidth: 0,
                    borderColor: 'rgba(0, 0, 0, 0)',
                    borderStyle: 'none',
                    borderImage: 'none',
                    borderRadius: 0,
                  }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <FiMail className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" size={20} />
                    <span className="text-xs sm:text-sm lg:text-base truncate">ramykronby@gmail.com</span>
                  </div>
                  <span className="text-xs sm:text-sm lg:text-base ml-3 flex-shrink-0 whitespace-nowrap" style={{ color: 'var(--color-secondary)' }}>Best for briefs</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
