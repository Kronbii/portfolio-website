'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FiGlobe } from 'react-icons/fi'
import { getSectionStyle, CARD_CAROUSEL_OPACITY } from '@/lib/utils'

interface TestimonialCardProps {
  name: string
  role: string
  company: string
  location: string
  countryCode: string
  quote: string
  profileImage?: string
  isCentered?: boolean
  isInView?: boolean
  isVisible?: boolean
  cardWidth?: number
  cardHeight?: number
}

export function TestimonialCard({
  name,
  role,
  company,
  location,
  countryCode,
  quote,
  profileImage,
  isCentered = false,
  isInView = true,
  isVisible = true,
  cardWidth = 380,
  cardHeight = 380,
}: TestimonialCardProps) {
  return (
    <div
      style={{
        filter: isVisible ? 'blur(0px)' : 'blur(2px)',
        opacity: isVisible ? CARD_CAROUSEL_OPACITY.visible : CARD_CAROUSEL_OPACITY.hidden,
        transition: 'filter 0.5s ease, opacity 0.5s ease',
      }}
    >
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: isCentered ? -16 : 0, scale: isCentered ? 1.03 : 1 } : {}}
        transition={{ duration: 0.15 }}
        className={`group relative overflow-hidden border-2 bg-transparent flex-shrink-0 transition-all duration-100 flex flex-col ${isCentered ? '-translate-y-4 scale-[1.03] z-10' : ''
          }`}
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          boxShadow: isCentered
            ? '0 20px 25px -5px rgba(37, 37, 37, 0.1), 0 10px 10px -5px rgba(37, 37, 37, 0.04)'
            : '0 1px 2px 0 rgba(37, 37, 37, 0.05)',
          borderColor: 'rgba(33, 33, 33, 0.2)',
          borderRadius: 0,
          backgroundColor: 'var(--color-primary)',
        }}
        whileHover={{ y: isCentered ? -20 : -4 }}
      >
        {/* Hover border effect */}
        <div
          className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            borderColor: 'rgba(33, 33, 33, 0.4)',
            borderRadius: 0,
          }}
        />

        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(216, 216, 216, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
          }}
        />

        <div className="p-4 sm:p-5 lg:p-6 relative z-10 flex flex-col h-full">
          {/* Quote */}
          <div className="mb-4 lg:mb-5 flex-grow">
            <p
              className="leading-relaxed italic"
              style={{
                color: 'var(--color-secondary)',
                fontSize: 'clamp(13px, 1.8vw, 15px)',
                lineHeight: 1.65,
              }}
            >
              "{quote}"
            </p>
          </div>

          {/* Divider */}
          <div
            className="w-full h-px mb-3 opacity-20"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          />

          {/* Author Info with Profile Image */}
          <div className="flex items-start gap-2.5">
            {/* Profile Image */}
            {profileImage && (
              <div
                className="flex-shrink-0 relative overflow-hidden border"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  borderColor: 'rgba(33, 33, 33, 0.2)',
                }}
              >
                <Image
                  src={profileImage}
                  alt={name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            {/* Text Info */}
            <div className="flex-1 min-w-0">
              <h4
                className="font-bold mb-0"
                style={{
                  color: 'var(--color-secondary)',
                  fontSize: 'clamp(14px, 2vw, 16px)',
                }}
              >
                {name}
              </h4>
              <p
                className="font-medium mb-2"
                style={{
                  color: 'var(--color-secondary)',
                  opacity: 0.7,
                  fontSize: 'clamp(12px, 1.5vw, 13px)',
                }}
              >
                {role} @ {company}
              </p>

              {/* GEO Friendly Location Tag */}
              <div
                className="flex items-center gap-2 p-1.5 border inline-flex"
                style={{
                  borderColor: 'rgba(33, 33, 33, 0.2)',
                  backgroundColor: 'rgba(216, 216, 216, 0.05)',
                }}
              >
                <FiGlobe
                  size={12}
                  style={{ color: 'var(--color-secondary)', opacity: 0.6 }}
                />
                <span
                  className="uppercase tracking-wider font-semibold"
                  style={{
                    color: 'var(--color-secondary)',
                    opacity: 0.8,
                    fontSize: 'clamp(9px, 1.2vw, 10px)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  )
}
