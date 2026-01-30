'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiAward, FiExternalLink } from 'react-icons/fi'
import { certifications } from '@/data/certifications'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle, getSectionStyle } from '@/lib/utils'

export default function Certifications() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="certifications"
      ref={ref}
      className="min-h-screen flex flex-col justify-center py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-l border-r border-b mx-auto relative overflow-hidden"
      style={{
        ...getSectionStyle(),
        ...getSectionWidthStyle()
      }}
    >
      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/figma-assets/grid.svg)',
          backgroundPosition: 'center',
          backgroundSize: '50px 50px',
          backgroundRepeat: 'repeat',
          opacity: 0.03,
          zIndex: 0,
        }}
      />

      <div className="w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-14"
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

        <div className="space-y-5 lg:space-y-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative flex items-start gap-4 lg:gap-6 border-2 transition-all duration-300 cursor-pointer"
              style={{
                borderColor: 'rgba(33, 33, 33, 0.2)',
                borderRadius: 0,
                backgroundColor: 'var(--color-primary)',
                padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              }}
            >
              {/* Hover border effect */}
              <div
                className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  borderColor: 'rgba(33, 33, 33, 0.4)',
                  borderRadius: 0,
                }}
              />

              {/* Subtle gradient overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(216, 216, 216, 0.2) 0%, transparent 100%)',
                }}
              />

              {/* Icon */}
              <div
                className="flex items-center justify-center border-2 flex-shrink-0 transition-all duration-300 group-hover:scale-110 relative z-10"
                style={{
                  width: 'clamp(56px, 7vw, 64px)',
                  height: 'clamp(56px, 7vw, 64px)',
                  borderColor: 'rgba(33, 33, 33, 0.2)',
                  borderRadius: 0,
                  backgroundColor: 'rgba(216, 216, 216, 0.1)',
                }}
              >
                <FiAward
                  size={28}
                  style={{
                    color: 'var(--color-secondary)',
                    width: 'clamp(24px, 3.5vw, 28px)',
                    height: 'clamp(24px, 3.5vw, 28px)',
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 relative z-10">
                <h3
                  className="font-semibold mb-2 transition-transform duration-300 group-hover:translate-x-1"
                  style={{
                    color: 'var(--color-secondary)',
                    fontSize: 'clamp(16px, 2.2vw, 20px)',
                  }}
                >
                  {cert.name}
                </h3>

                <p
                  className="mb-3 lg:mb-4"
                  style={{
                    color: 'var(--color-secondary)',
                    opacity: 0.7,
                    fontSize: 'clamp(14px, 1.8vw, 16px)',
                  }}
                >
                  {cert.issuer}
                </p>

                {/* Metadata badges */}
                <div className="flex flex-wrap gap-2 lg:gap-3 mb-3">
                  {/* Issued date badge */}
                  <div
                    className="inline-flex items-center border px-3 py-1"
                    style={{
                      borderColor: 'rgba(33, 33, 33, 0.2)',
                      borderRadius: 0,
                      backgroundColor: 'rgba(216, 216, 216, 0.05)',
                    }}
                  >
                    <span
                      className="uppercase tracking-wider font-medium"
                      style={{
                        color: 'var(--color-secondary)',
                        opacity: 0.6,
                        fontSize: '10px',
                        letterSpacing: '0.1em',
                      }}
                    >
                      Issued: {cert.date}
                    </span>
                  </div>

                  {/* Credential ID badge */}
                  {cert.credentialId && (
                    <div
                      className="inline-flex items-center border px-3 py-1"
                      style={{
                        borderColor: 'rgba(33, 33, 33, 0.2)',
                        borderRadius: 0,
                        backgroundColor: 'rgba(216, 216, 216, 0.05)',
                      }}
                    >
                      <span
                        className="uppercase tracking-wider font-medium"
                        style={{
                          color: 'var(--color-secondary)',
                          opacity: 0.6,
                          fontSize: '10px',
                          letterSpacing: '0.1em',
                        }}
                      >
                        ID: {cert.credentialId}
                      </span>
                    </div>
                  )}
                </div>

                {/* Verify Link */}
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 border-2 px-4 py-2 transition-all duration-300 hover:translate-x-1"
                    style={{
                      borderColor: 'rgba(33, 33, 33, 0.3)',
                      borderRadius: 0,
                      color: 'var(--color-secondary)',
                      fontSize: 'clamp(12px, 1.5vw, 14px)',
                      fontWeight: 500,
                    }}
                  >
                    <span>Verify certificate</span>
                    <FiExternalLink size={14} />
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
