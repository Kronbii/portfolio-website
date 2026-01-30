'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from 'react-icons/fi'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionStyle } from '@/lib/utils'

const contactLinks = [
  {
    icon: FiGithub,
    label: 'GitHub',
    sublabel: 'Case studies',
    href: 'https://github.com/Kronbii',
  },
  {
    icon: FiLinkedin,
    label: 'LinkedIn',
    sublabel: 'Professional updates',
    href: 'https://www.linkedin.com/in/rami-kronbi/',
  },
  {
    icon: FiMail,
    label: 'ramykronby@gmail.com',
    sublabel: 'Best for briefs',
    href: 'mailto:ramykronby@gmail.com',
  },
]

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      id="contact"
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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`${getSectionHeaderStyle().className} text-center mb-4 lg:mb-6`}
          style={getSectionHeaderStyle().style}
        >
          Let&apos;s build your next intelligent product
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12 lg:mb-16"
          style={{
            color: 'var(--color-secondary)',
            opacity: 0.7,
            fontSize: 'clamp(14px, 1.8vw, 18px)',
          }}
        >
          Preferred channels
        </motion.p>

        <div className="max-w-3xl mx-auto">
          {/* Contact Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4 lg:space-y-5"
          >
            {contactLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 8 }}
                  className="group relative flex items-center justify-between border-2 transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    borderColor: 'rgba(33, 33, 33, 0.2)',
                    borderRadius: 0,
                    padding: 'clamp(1.25rem, 2.5vw, 1.75rem) clamp(1.5rem, 3vw, 2rem)',
                  }}
                >
                  {/* Hover border effect */}
                  <div
                    className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      borderColor: 'rgba(33, 33, 33, 0.5)',
                      borderRadius: 0,
                    }}
                  />

                  {/* Subtle gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, rgba(216, 216, 216, 0.2) 0%, transparent 100%)',
                    }}
                  />

                  {/* Content */}
                  <div className="flex items-center gap-4 lg:gap-5 flex-1 min-w-0 relative z-10">
                    {/* Icon with background shape */}
                    <div
                      className="flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110"
                      style={{
                        width: 'clamp(48px, 6vw, 56px)',
                        height: 'clamp(48px, 6vw, 56px)',
                        borderColor: 'rgba(33, 33, 33, 0.2)',
                        borderRadius: 0,
                        backgroundColor: 'rgba(216, 216, 216, 0.1)',
                      }}
                    >
                      <Icon
                        size={24}
                        style={{
                          color: 'var(--color-secondary)',
                          width: 'clamp(20px, 3vw, 24px)',
                          height: 'clamp(20px, 3vw, 24px)',
                        }}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold mb-1 truncate"
                        style={{
                          color: 'var(--color-secondary)',
                          fontSize: 'clamp(15px, 2vw, 18px)',
                        }}
                      >
                        {link.label}
                      </p>
                      <p
                        className="uppercase tracking-wider"
                        style={{
                          color: 'var(--color-secondary)',
                          opacity: 0.5,
                          fontSize: 'clamp(10px, 1.2vw, 12px)',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {link.sublabel}
                      </p>
                    </div>
                  </div>

                  {/* Arrow icon */}
                  <div className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <FiArrowUpRight
                      size={20}
                      style={{
                        color: 'var(--color-secondary)',
                        opacity: 0.4,
                      }}
                    />
                  </div>
                </motion.a>
              )
            })}
          </motion.div>

          {/* Additional info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 lg:mt-16 text-center border-2"
            style={{
              borderColor: 'rgba(33, 33, 33, 0.15)',
              borderRadius: 0,
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              backgroundColor: 'rgba(216, 216, 216, 0.05)',
            }}
          >
            <p
              style={{
                color: 'var(--color-secondary)',
                opacity: 0.6,
                fontSize: 'clamp(13px, 1.6vw, 15px)',
                lineHeight: 1.6,
              }}
            >
              Open to new opportunities and collaborations.
              <br />
              Typical response time: 24-48 hours.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
