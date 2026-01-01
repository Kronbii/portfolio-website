'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiGithub, FiLinkedin, FiMail, FiSend, FiClock } from 'react-icons/fi'
import { HoverButton } from '@/components/ui/hover-button'

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
      className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 "
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-semibold mb-4 text-center"
        >
          Let&apos;s build your next intelligent product
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-light-text2 dark:text-dark-text2 mb-12 text-lg"
        >
          Tell me what you&apos;re building, the outcome you want, and I&apos;ll reply within 24 hours.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-3xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-dark-surface2/80 p-8 backdrop-blur shadow-sm dark:shadow-none bg-light-surface/70"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-light-text2 dark:text-dark-text2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-light-surface2 dark:bg-dark-surface2 border border-light-border/50 dark:border-dark-surface2 rounded-lg focus:outline-none focus:border-primary-500 text-light-text dark:text-dark-text transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-light-text2 dark:text-dark-text2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-light-surface2 dark:bg-dark-surface2 border border-light-border/50 dark:border-dark-surface2 rounded-lg focus:outline-none focus:border-primary-500 text-light-text dark:text-dark-text transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-light-text2 dark:text-dark-text2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-light-surface2 dark:bg-dark-surface2 border border-light-border/50 dark:border-dark-surface2 rounded-lg focus:outline-none focus:border-primary-500 text-light-text dark:text-dark-text transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <HoverButton
                type="submit"
                disabled={isSubmitting}
                variant="gradient"
                className="w-full flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FiSend />
                <span>{isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Sent!' : 'Send Message'}</span>
              </HoverButton>
              {submitStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-primary-500 text-center"
                >
                  Thank you! I&apos;ll get back to you soon.
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-center"
                >
                  Something went wrong. Please try again or email me directly.
                </motion.p>
              )}
            </form>
          </motion.div>

          {/* Social Links & Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="rounded-3xl border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-light-text2 dark:text-dark-text2">Availability</p>
                  <p className="mt-2 text-2xl font-semibold text-light-text dark:text-dark-text">2 client openings</p>
                </div>
                <div className="text-primary-600 dark:text-primary-400">
                  <FiClock size={32} />
                </div>
              </div>
              <p className="mt-4 text-light-text2 dark:text-dark-text2">Next kickoff: Dec 2025 · Replies within 24 hours.</p>
            </div>

            <div className="rounded-3xl border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 p-6 bg-light-surface/70">
              <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">Preferred channels</h3>
              <div className="space-y-4">
                <motion.a
                  href="https://github.com/Kronbii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-dark-surface/70 px-4 py-3 text-light-text dark:text-dark-text bg-light-surface/70"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-3">
                    <FiGithub size={22} />
                    <span>GitHub</span>
                  </div>
                  <span className="text-sm text-light-text2 dark:text-dark-text2">Case studies</span>
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/rami-kronbi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-dark-surface/70 px-4 py-3 text-light-text dark:text-dark-text bg-light-surface/70"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-3">
                    <FiLinkedin size={22} />
                    <span>LinkedIn</span>
                  </div>
                  <span className="text-sm text-light-text2 dark:text-dark-text2">Professional updates</span>
                </motion.a>
                <motion.a
                  href="mailto:ramykronby@gmail.com"
                  className="flex items-center justify-between rounded-2xl border border-light-border/50 dark:border-white/10 bg-light-surface dark:bg-dark-surface/70 px-4 py-3 text-light-text dark:text-dark-text bg-light-surface/70"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center space-x-3 ">
                    <FiMail size={22} />
                    <span>ramykronby@gmail.com</span>
                  </div>
                  <span className="text-sm text-light-text2 dark:text-dark-text2 ">Best for briefs</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
