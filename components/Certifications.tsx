'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiAward } from 'react-icons/fi'

interface Certification {
  name: string
  issuer: string
  date: string
  credentialId?: string
  link?: string
}

const certifications: Certification[] = [
  {
    name: 'Google Project Management: Professional Certificate',
    issuer: 'Google / Coursera',
    date: 'April 2023',
    credentialId: 'V3EHQ5F4K9TQ',
    link: 'https://www.coursera.org/account/accomplishments/professional-cert/V3EHQ5F4K9TQ',
  },  
]

export default function Certifications() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="certifications"
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-surface"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-dark-text2">Proof of execution</p>
          <h2 className="text-4xl md:text-5xl font-semibold mt-3">Certifications & recognition</h2>
          <p className="mt-4 text-lg text-dark-text2">
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
              className="rounded-3xl border border-white/10 bg-dark-surface2/80 p-6 flex items-start space-x-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-400">
                <FiAward size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-dark-text">
                  {cert.name}
                </h3>
                <p className="text-dark-text2 mb-2">
                  {cert.issuer}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-dark-text2">
                  <span>Issued: {cert.date}</span>
                  {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                </div>
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 transition-colors text-sm mt-3 inline-flex items-center"
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
