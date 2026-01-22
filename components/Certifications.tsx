'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiAward } from 'react-icons/fi'
import { certifications } from '@/data/certifications'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle } from '@/lib/utils'

export default function Certifications() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="certifications"
      ref={ref}
      className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 border-l border-r border-b mx-auto"
      style={{ 
        backgroundColor: 'transparent', 
        borderColor: 'rgba(33, 33, 33, 0.3)',
        ...getSectionWidthStyle() 
      }}
    >
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={getSectionHeaderStyle().className}
            style={getSectionHeaderStyle().style}
          >
            Certifications & recognition
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={getSectionSubtitleStyle().className}
            style={getSectionSubtitleStyle().style}
          >
            Proof of execution
          </motion.h3>
        </motion.div>

        <div className="space-y-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative flex items-start gap-4 p-4 sm:p-6 transition-all duration-300 cursor-pointer blog-article-gradient"
              style={{
                borderRadius: 0,
                border: 'none',
                position: 'relative',
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-400">
                <FiAward size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold" style={{ color: 'var(--color-secondary)' }}>
                  {cert.name}
                </h3>
                <p className="mb-2" style={{ color: 'var(--color-secondary)' }}>
                  {cert.issuer}
                </p>
                <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--color-secondary)' }}>
                  <span>Issued: {cert.date}</span>
                  {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                </div>
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors text-sm mt-3 inline-flex items-center"
                  >
                    Verify certificate
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
