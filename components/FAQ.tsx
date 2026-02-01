'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle, getSectionStyle } from '@/lib/utils'

interface FAQItem {
  id: string
  question: string
  answer: string
}

// Import FAQ data
import faqData from '@/data/faq.json'

const faqs: FAQItem[] = faqData

export default function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [openId, setOpenId] = useState<string | null>(null)

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section
      id="faq"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-l border-r border-b mx-auto overflow-hidden"
      style={{
        ...getSectionStyle(),
        ...getSectionWidthStyle(),
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
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${getSectionHeaderStyle().className} text-center`}
            style={getSectionHeaderStyle().style}
          >
            Frequently Asked <span className="text-gradient">Questions</span>
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${getSectionSubtitleStyle().className} text-center`}
            style={getSectionSubtitleStyle().style}
          >
            Everything you need to know
          </motion.h3>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="border-2 overflow-hidden"
                style={{
                  borderColor: 'rgba(33, 33, 33, 0.2)',
                  borderRadius: 0,
                  backgroundColor: 'var(--color-primary)',
                }}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 transition-all duration-200 hover:bg-opacity-80"
                  style={{
                    backgroundColor: isOpen ? 'rgba(216, 216, 216, 0.05)' : 'transparent',
                  }}
                >
                  <h3
                    className="font-semibold pr-4"
                    style={{
                      color: 'var(--color-secondary)',
                      fontSize: 'clamp(16px, 2vw, 20px)',
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <FiChevronDown
                      size={24}
                      style={{
                        color: 'var(--color-secondary)',
                        opacity: 0.6,
                      }}
                    />
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <p
                      className="leading-relaxed"
                      style={{
                        color: 'var(--color-secondary)',
                        opacity: 0.7,
                        fontSize: 'clamp(14px, 1.8vw, 16px)',
                        lineHeight: 1.7,
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p
            style={{
              color: 'var(--color-secondary)',
              opacity: 0.7,
              fontSize: 'clamp(14px, 1.8vw, 16px)',
            }}
          >
            Have more questions?{' '}
            <a
              href="#contact"
              className="underline-offset-4 hover:underline font-medium"
              style={{
                color: 'var(--color-secondary)',
                opacity: 0.9,
              }}
            >
              Get in touch
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
