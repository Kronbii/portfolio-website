'use client'

import { motion } from 'framer-motion'
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiArrowUpRight,
  FiCompass,
  FiWind,
} from 'react-icons/fi'
import Image from 'next/image'
import { useState, type Dispatch, type SetStateAction } from 'react'

const heroMetrics = [
  { value: '18+', label: 'AI launches' },
  { value: '4x', label: 'Faster delivery' },
  { value: '7', label: 'Teams led' },
]

const focusChips = ['Vision & robotics', 'Edge optimization', 'Project leadership']

export default function Hero() {
  const [imageError, setImageError] = useState(false)

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-28 pb-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-primary-500/15 blur-[120px]"
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.95] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent-500/10 blur-[140px]"
          animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.1, 0.95] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="lg:hidden">
            <IntroSection />
          </div>

          <div className="order-3 lg:order-1 space-y-6">
            <div className="hidden lg:block">
              <IntroSection />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-lg text-dark-text2 max-w-2xl"
            >
              I help founders and teams go from idea → working product without drowning in technical overhead. Think of me as your mix of mechatronics engineer, CV specialist, and certified project manager.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              {focusChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-dark-text"
                >
                  {chip}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                href="#contact"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 px-8 py-4 text-base font-semibold text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Book a discovery call
                <FiArrowUpRight className="ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </motion.a>
              <motion.a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-dark-text"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View case studies
              </motion.a>
            </motion.div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex space-x-4 text-lg">
                {[
                  { icon: <FiGithub />, href: 'https://github.com/Kronbii', title: 'GitHub' },
                  { icon: <FiLinkedin />, href: 'https://www.linkedin.com/in/rami-kronbi/', title: 'LinkedIn' },
                  { icon: <FiMail />, href: 'mailto:ramykronby@gmail.com', title: 'Email' },
                ].map((item) => (
                  <motion.a
                    key={item.title}
                    href={item.href}
                    target={item.title === 'Email' ? undefined : '_blank'}
                    rel={item.title === 'Email' ? undefined : 'noopener noreferrer'}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-dark-text hover:border-primary-500/60 hover:text-primary-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={item.title}
                  >
                    {item.icon}
                  </motion.a>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:max-w-md">
              {heroMetrics.map((metric) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center"
                >
                  <p className="text-2xl sm:text-3xl font-semibold text-gradient">{metric.value}</p>
                  <p className="text-xs uppercase tracking-wide text-dark-text2">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="order-2 lg:order-2">
            <HeroPortrait imageError={imageError} setImageError={setImageError} />
          </div>
        </div>
      </div>
    </section>
  )
}

function IntroSection() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center space-x-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-dark-text2"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75 animate-ping"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-400"></span>
        </span>
        <span>Available for Feb 2025</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight"
      >
        Hi, I&apos;m <span className="text-gradient">Rami Kronbi</span> — building AI so you don&apos;t have to.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.05 }}
        className="text-sm uppercase tracking-[0.3em] text-dark-text2"
      >
        Rami Kronbi · AI & Computer Vision Engineer · Founder, EVOID
      </motion.p>
    </div>
  )
}

function HeroPortrait({
  imageError,
  setImageError,
}: {
  imageError: boolean
  setImageError: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-[32px] border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-4 backdrop-blur-xl"
      >
        <div className="relative h-[420px] rounded-[28px] bg-dark-surface2/80 overflow-hidden flex items-center justify-center">
          {!imageError ? (
            <Image
              src="/profile.jpg"
              alt="Rami Kronbi"
              fill
              className="object-cover"
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-primary-500 space-y-2">
              <span className="text-6xl font-semibold">RK</span>
              <p className="text-sm text-dark-text2">Add a portrait</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-surface2 via-transparent" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute -left-2 top-4 sm:-left-5 sm:top-6 lg:-left-6 lg:top-8 w-36 sm:w-44 lg:w-48 rounded-2xl border border-white/25 bg-white/10 p-3 shadow-[0_6px_18px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
      >
        <div className="flex items-center gap-2 text-primary-200">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary-500/25 text-primary-100">
            <FiCompass size={16} />
          </span>
          <span className="text-[9px] uppercase tracking-[0.35em] text-white/80">Fun fact</span>
        </div>
        <p className="mt-2 text-sm font-semibold leading-snug text-white/90">
          Born to explore space, forced to C++
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute -right-2 bottom-4 sm:-right-4 sm:bottom-6 lg:-right-6 lg:bottom-6 w-36 sm:w-48 rounded-2xl border border-white/25 bg-gradient-to-br from-white/10 to-white/5 p-3 shadow-[0_8px_22px_rgba(3,105,161,0.35)] backdrop-blur-2xl"
      >
        <div className="flex items-center gap-2 text-secondary-200">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-secondary-500/30 text-secondary-50">
            <FiWind size={16} />
          </span>
          <span className="text-[9px] uppercase tracking-[0.35em] text-white/80">Alter ego</span>
        </div>
        <p className="mt-2 text-sm font-semibold leading-snug text-white/90">
          An engineer? a pilot? idk
        </p>
      </motion.div>
    </div>
  )
}
