'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiAward } from 'react-icons/fi'
import { certifications } from '@/data/certifications'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubheadingStyle } from '@/lib/utils'

export default function Certifications() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="certifications"
      ref={ref}
      className="min-h-screen flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 border mx-auto"
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
          <p className="text-sm uppercase tracking-[0.4em]" style={{ color: 'var(--color-secondary)' }}>Proof of execution</p>
          <h2 className={`${getSectionHeaderStyle().className} mt-3`} style={getSectionHeaderStyle().style}>Certifications & recognition</h2>
          <p className={`${getSectionSubheadingStyle().className} mt-4`} style={getSectionSubheadingStyle().style}>
            The same rigor I bring to your project is backed by accredited training and global wins.
          </p>
        </motion.div>

        <div className="space-y-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-3xl border border-light-border/50 dark:border-white/10 dark:bg-dark-surface2/80 p-6 flex items-start space-x-4 shadow-sm dark:shadow-none"
              style={{ backgroundColor: 'var(--color-accent)' }}
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
