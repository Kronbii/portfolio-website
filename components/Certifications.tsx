'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiAward, FiExternalLink } from 'react-icons/fi'

interface Certification {
  name: string
  issuer: string
  date: string
  category?: string
  credentialId?: string
  link?: string
}

const certifications: Certification[] = [
  {
    name: 'Google Project Management: Professional Certificate',
    issuer: 'Google / Coursera',
    date: 'Ongoing',
    category: 'Project Management',
    credentialId: 'JDQM5WZLUW27',
    link: 'https://www.coursera.org/account/accomplishments/records/JDQM5WZLUW27',
  },
]

export default function Certifications() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section
      id="certifications"
      ref={ref}
      className="py-24 sm:py-32 relative"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/50 to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-gemini-500 font-medium mb-4">
            Credentials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Certifications & <span className="text-gradient">Recognition</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            The same rigor I bring to your project is backed by accredited training and global recognition.
          </p>
        </motion.div>

        {/* Certifications grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-6"
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{ duration: 0.5 }}
              className="group"
            >
              <div className="glass-card p-6 transition-all duration-300 hover:shadow-glow hover:border-gemini-500/30">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gemini-gradient flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <FiAward size={24} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {cert.name}
                      </h3>
                      {cert.category && (
                        <span className="text-xs font-medium text-gemini-500 bg-gemini-500/10 px-3 py-1 rounded-full flex-shrink-0">
                          {cert.category}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-500 dark:text-slate-400 mb-3">{cert.issuer}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span>Issued: {cert.date}</span>
                      {cert.credentialId && (
                        <span className="hidden sm:inline">ID: {cert.credentialId}</span>
                      )}
                    </div>
                    
                    {cert.link && (
                      <motion.a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-gemini-500 hover:text-gemini-400 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        Verify certificate
                        <FiExternalLink size={14} />
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
