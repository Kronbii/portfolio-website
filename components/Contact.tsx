'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiGithub, FiLinkedin, FiMail, FiSend, FiClock } from 'react-icons/fi'
import { CornerButton } from '@/components/ui/corner-button'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle } from '@/lib/utils'

const contactSteps = [
  {
    title: 'Discovery call',
    description: '30 minutes to frame goals, constraints, and success signals.',
  },
  {
    title: 'Solution blueprint',
    description: 'Within 72 hours you get scope, budget, and timeline options.',
  },
  {
    title: 'Build + reporting',
    description: 'Weekly iterations with demos and lightweight documentation.',
  },
]

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 border-l border-r border-b mx-auto"
      style={{ 
        backgroundColor: 'transparent', 
        borderColor: 'rgba(33, 33, 33, 0.3)',
        ...getSectionWidthStyle() 
      }}
    >
      <div className="w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`${getSectionHeaderStyle().className} text-center`}
          style={getSectionHeaderStyle().style}
        >
          Let&apos;s build your next intelligent product
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">

          {/* Social Links & Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 sm:space-y-6 lg:space-y-8"
          >
            <div className="rounded-3xl border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm uppercase tracking-[0.4em]" style={{ color: 'var(--color-secondary)' }}>Availability</p>
                </div>
                <div className="text-primary-600 dark:text-primary-400 flex-shrink-0 ml-2">
                  <FiClock size={24} className="sm:w-8 sm:h-8" />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 p-4 sm:p-6"
            style={{ backgroundColor: 'var(--color-accent)' }}>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: 'var(--color-secondary)' }}>Preferred channels</h3>
              <div className="space-y-3 sm:space-y-4">
                <motion.a
                  href="https://github.com/Kronbii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border dark:bg-dark-surface/70 px-3 sm:px-4 py-2.5 sm:py-3"
                  style={{ 
                    backgroundColor: 'var(--color-primary)', 
                    color: 'var(--color-secondary)',
                    borderColor: 'var(--color-secondary)',
                  }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <FiGithub size={20} className="flex-shrink-0" />
                    <span className="text-sm sm:text-base truncate">GitHub</span>
                  </div>
                  <span className="text-xs sm:text-sm ml-2 flex-shrink-0" style={{ color: 'var(--color-secondary)' }}>Case studies</span>
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/rami-kronbi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border dark:bg-dark-surface/70 px-3 sm:px-4 py-2.5 sm:py-3"
                  style={{ 
                    backgroundColor: 'var(--color-primary)', 
                    color: 'var(--color-secondary)',
                    borderColor: 'var(--color-secondary)',
                  }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <FiLinkedin size={20} className="flex-shrink-0" />
                    <span className="text-sm sm:text-base truncate">LinkedIn</span>
                  </div>
                  <span className="text-xs sm:text-sm ml-2 flex-shrink-0 whitespace-nowrap" style={{ color: 'var(--color-secondary)' }}>Professional updates</span>
                </motion.a>
                <motion.a
                  href="mailto:ramykronby@gmail.com"
                  className="flex items-center justify-between rounded-2xl border dark:bg-dark-surface/70 px-3 sm:px-4 py-2.5 sm:py-3"
                  style={{ 
                    backgroundColor: 'var(--color-primary)', 
                    color: 'var(--color-secondary)',
                    borderColor: 'var(--color-secondary)',
                  }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <FiMail size={20} className="flex-shrink-0" />
                    <span className="text-xs sm:text-sm truncate">ramykronby@gmail.com</span>
                  </div>
                  <span className="text-xs sm:text-sm ml-2 flex-shrink-0 whitespace-nowrap" style={{ color: 'var(--color-secondary)' }}>Best for briefs</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
