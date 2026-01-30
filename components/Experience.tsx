'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { FiSend, FiAward, FiTrendingUp } from 'react-icons/fi'
import { getSectionWidthStyle, getSectionHeaderStyle, getSectionSubtitleStyle, getSectionStyle } from '@/lib/utils'

const milestones = [
  {
    period: 'Now',
    year: '2026',
    title: 'Founder & Tech Lead',
    company: 'EVOID',
    description: 'Building bespoke AI/CV and robotics products for startups + industry teams.',
    icon: FiSend,
    highlight: true,
  },
  {
    period: '2024 - Now',
    year: '2024',
    title: 'Applied AI & CV Engineer',
    company: 'Oreyeon LDA',
    description: 'Improving runway safety through advanced computer vision solutions.',
    icon: 'oreyeon',
    highlight: false,
  },
  {
    period: '2023',
    year: '2023',
    title: 'WRO Future Engineers',
    company: 'Champion',
    description: 'Led an autonomous race-car build from concept to podium in 20 days.',
    icon: FiAward,
    highlight: false,
  },
  {
    period: '2021 - 2024',
    year: '2021',
    title: 'NASA Space Apps',
    company: 'Tech Lead & Volunteer',
    description: 'Took part in leading the largest global hackathon in Lebanon.',
    icon: 'nasa',
    highlight: false,
  },
]

const stats = [
  { value: '4+', label: 'Years Experience' },
  { value: '10+', label: 'Projects Delivered' },
  { value: '5+', label: 'Awards Won' },
]

function ExperienceCard({
  item,
  index,
  isInView,
  isFeatured = false,
  isWide = false,
}: {
  item: typeof milestones[0]
  index: number
  isInView: boolean
  isFeatured?: boolean
  isWide?: boolean
}) {
  const IconComponent = typeof item.icon === 'string' ? null : item.icon
  const iconSrc = typeof item.icon === 'string' ? item.icon : null

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.2 + index * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      className="group relative border-2 transition-all duration-300 overflow-hidden h-full flex flex-col"
      style={{
        borderColor: 'rgba(33, 33, 33, 0.2)',
        borderRadius: 0,
        backgroundColor: 'var(--color-primary)',
        padding: isFeatured ? 'clamp(1.5rem, 3vw, 3rem)' : 'clamp(1rem, 2vw, 2rem)',
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

      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(216, 216, 216, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header with Icon and Period */}
        <div className="flex items-start justify-between mb-4 lg:mb-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <div
              className="flex items-center justify-center border-2 bg-transparent overflow-visible"
              style={{
                width: isFeatured ? 'clamp(48px, 6vw, 64px)' : 'clamp(40px, 5vw, 48px)',
                height: isFeatured ? 'clamp(48px, 6vw, 64px)' : 'clamp(40px, 5vw, 48px)',
                borderColor: 'rgba(33, 33, 33, 0.2)',
                borderRadius: 0,
              }}
            >
              {iconSrc ? (
                <Image
                  src={`/${iconSrc}.svg`}
                  alt={item.company}
                  width={isFeatured ? 48 : 32}
                  height={isFeatured ? 48 : 32}
                  className="transition-transform duration-300 group-hover:scale-110"
                  style={{
                    objectFit: 'contain',
                    width: isFeatured ? 'clamp(32px, 5vw, 48px)' : 'clamp(24px, 4vw, 32px)',
                    height: isFeatured ? 'clamp(32px, 5vw, 48px)' : 'clamp(24px, 4vw, 32px)',
                  }}
                />
              ) : IconComponent ? (
                <IconComponent
                  className="transition-transform duration-300 group-hover:scale-110"
                  size={isFeatured ? 32 : 24}
                  style={{
                    color: 'var(--color-secondary)',
                    width: isFeatured ? 'clamp(24px, 4vw, 32px)' : 'clamp(20px, 3vw, 24px)',
                    height: isFeatured ? 'clamp(24px, 4vw, 32px)' : 'clamp(20px, 3vw, 24px)',
                  }}
                />
              ) : null}
            </div>
          </div>

          <div className="text-right">
            <p
              className="uppercase tracking-widest font-medium"
              style={{
                color: 'var(--color-secondary)',
                opacity: 0.5,
                fontSize: isFeatured ? 'clamp(10px, 1.2vw, 14px)' : 'clamp(9px, 1vw, 11px)',
                letterSpacing: '0.15em',
              }}
            >
              {item.period}
            </p>
          </div>
        </div>

        {/* Company */}
        <motion.p
          className="font-semibold mb-2 lg:mb-3"
          style={{
            color: 'var(--color-secondary)',
            fontSize: isFeatured ? 'clamp(14px, 1.8vw, 18px)' : 'clamp(12px, 1.5vw, 16px)',
          }}
        >
          {item.company}
        </motion.p>

        {/* Title */}
        <motion.h3
          className="font-semibold mb-3 lg:mb-4"
          style={{
            color: 'var(--color-secondary)',
            fontSize: isFeatured ? 'clamp(24px, 3.5vw, 36px)' : 'clamp(18px, 2.5vw, 24px)',
            lineHeight: 1.2,
          }}
          whileHover={{ x: 2 }}
        >
          {item.title}
        </motion.h3>

        {/* Description */}
        <p
          className="leading-relaxed flex-grow"
          style={{
            color: 'var(--color-secondary)',
            opacity: 0.7,
            fontSize: isFeatured ? 'clamp(14px, 1.8vw, 18px)' : 'clamp(13px, 1.6vw, 16px)',
            lineHeight: 1.6,
          }}
        >
          {item.description}
        </p>

        {/* Bottom accent line - appears on hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ backgroundColor: 'var(--color-secondary)' }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.article>
  )
}

function StatsCard({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      className="border-2 h-full flex flex-col justify-center"
      style={{
        borderColor: 'rgba(33, 33, 33, 0.2)',
        borderRadius: 0,
        backgroundColor: 'var(--color-primary)',
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
      }}
    >
      <h3
        className="uppercase tracking-widest font-medium mb-6 lg:mb-8"
        style={{
          color: 'var(--color-secondary)',
          opacity: 0.5,
          fontSize: 'clamp(10px, 1.2vw, 12px)',
          letterSpacing: '0.2em',
        }}
      >
        Impact
      </h3>

      <div className="space-y-6 lg:space-y-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
          >
            <motion.p
              className="font-bold mb-1"
              style={{
                color: 'var(--color-secondary)',
                fontSize: 'clamp(28px, 4vw, 40px)',
                lineHeight: 1,
              }}
              whileHover={{ scale: 1.05 }}
            >
              {stat.value}
            </motion.p>
            <p
              className="uppercase tracking-wider"
              style={{
                color: 'var(--color-secondary)',
                opacity: 0.6,
                fontSize: 'clamp(10px, 1.2vw, 12px)',
                letterSpacing: '0.1em',
              }}
            >
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      id="experience"
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
            Professional <span className="text-gradient">Experience</span>
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${getSectionSubtitleStyle().className} text-center`}
            style={getSectionSubtitleStyle().style}
          >
            Milestones & Achievements
          </motion.h3>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Featured Card - Current Role (Large) */}
          <div className="lg:col-span-8">
            <ExperienceCard
              item={milestones[0]}
              index={0}
              isInView={isInView}
              isFeatured={true}
            />
          </div>

          {/* Stats Card */}
          <div className="lg:col-span-4">
            <StatsCard isInView={isInView} />
          </div>

          {/* Experience Card 2 (Medium) */}
          <div className="lg:col-span-5">
            <ExperienceCard
              item={milestones[1]}
              index={1}
              isInView={isInView}
            />
          </div>

          {/* Experience Card 3 (Wide) */}
          <div className="lg:col-span-7">
            <ExperienceCard
              item={milestones[2]}
              index={2}
              isInView={isInView}
              isWide={true}
            />
          </div>

          {/* Experience Card 4 (Wide) */}
          <div className="lg:col-span-7">
            <ExperienceCard
              item={milestones[3]}
              index={3}
              isInView={isInView}
              isWide={true}
            />
          </div>

          {/* Growth indicator - fills remaining space */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="border-2 h-full flex flex-col items-center justify-center text-center"
              style={{
                borderColor: 'rgba(33, 33, 33, 0.2)',
                borderRadius: 0,
                backgroundColor: 'var(--color-primary)',
                padding: 'clamp(2rem, 4vw, 3rem)',
                minHeight: '200px',
              }}
            >
              <FiTrendingUp
                size={48}
                style={{
                  color: 'var(--color-secondary)',
                  marginBottom: 'clamp(1rem, 2vw, 1.5rem)',
                }}
              />
              <p
                className="font-medium"
                style={{
                  color: 'var(--color-secondary)',
                  fontSize: 'clamp(14px, 1.8vw, 18px)',
                }}
              >
                Continuously growing
              </p>
              <p
                style={{
                  color: 'var(--color-secondary)',
                  opacity: 0.6,
                  fontSize: 'clamp(12px, 1.5vw, 14px)',
                  marginTop: '0.5rem',
                }}
              >
                Always learning
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
