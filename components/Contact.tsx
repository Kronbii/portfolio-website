'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiGithub, FiLinkedin, FiMail, FiSend, FiClock } from 'react-icons/fi'
import { HoverButton } from '@/components/ui/hover-button'

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
      className="py-24 sm:py-32 relative"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/50 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gemini-500 font-medium mb-4">
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Let&apos;s build your next <span className="text-gradient">intelligent product</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Tell me what you&apos;re building, the outcome you want, and I&apos;ll reply within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form - PRESERVED ALL ORIGINAL FIELDS AND LOGIC */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card p-8">
              {/* Helper text */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                  Let&apos;s talk.
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Fill out the form and I&apos;ll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:border-gemini-500/50 focus:ring-2 focus:ring-gemini-500/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-400 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:border-gemini-500/50 focus:ring-2 focus:ring-gemini-500/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-400 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-slate-900 dark:text-white">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl glass border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:border-gemini-500/50 focus:ring-2 focus:ring-gemini-500/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-400 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <HoverButton
                  type="submit"
                  disabled={isSubmitting}
                  variant="gradient"
                  className="w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FiSend className={isSubmitting ? 'animate-pulse' : ''} />
                  <span>{isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Sent!' : 'Send Message'}</span>
                </HoverButton>
                {submitStatus === 'success' && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-emerald-500 text-center text-sm"
                  >
                    Thank you! I&apos;ll get back to you soon.
                  </motion.p>
                )}
                {submitStatus === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-center text-sm"
                  >
                    Something went wrong. Please try again or email me directly.
                  </motion.p>
                )}
              </form>
            </div>
          </motion.div>

          {/* Social Links & Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Availability card */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 font-medium">
                    Availability
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                    2 client openings
                  </p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gemini-gradient flex items-center justify-center text-white">
                  <FiClock size={24} />
                </div>
              </div>
              <p className="mt-4 text-slate-500 dark:text-slate-400">
                Next kickoff: Dec 2025 · Replies within 24 hours.
              </p>
            </div>

            {/* Preferred channels */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Preferred channels
              </h3>
              <div className="space-y-3">
                <motion.a
                  href="https://github.com/Kronbii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl glass p-4 hover:bg-white/5 dark:hover:bg-white/5 transition-colors group"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <FiGithub size={20} className="text-slate-900 dark:text-white" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">GitHub</span>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-gemini-500 transition-colors">
                    Case studies →
                  </span>
                </motion.a>

                <motion.a
                  href="https://www.linkedin.com/in/rami-kronbi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl glass p-4 hover:bg-white/5 dark:hover:bg-white/5 transition-colors group"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <FiLinkedin size={20} className="text-slate-900 dark:text-white" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">LinkedIn</span>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-gemini-500 transition-colors">
                    Connect →
                  </span>
                </motion.a>

                <motion.a
                  href="mailto:ramykronby@gmail.com"
                  className="flex items-center justify-between rounded-xl glass p-4 hover:bg-white/5 dark:hover:bg-white/5 transition-colors group"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <FiMail size={20} className="text-slate-900 dark:text-white" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">Email</span>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-gemini-500 transition-colors">
                    ramykronby@gmail.com
                  </span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
