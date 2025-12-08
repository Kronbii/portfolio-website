'use client'

import { motion } from 'framer-motion'
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiArrowUpRight,
  FiCompass,
  FiWind,
  FiCheck,
} from 'react-icons/fi'
import Image from 'next/image'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { HoverButton } from '@/components/ui/hover-button'
import { getFallbackImage } from '@/lib/utils'


export default function Hero() {
  const [imageError, setImageError] = useState(false)

  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-screen flex flex-col justify-center pt-20 pb-12"
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

          <div className="order-3 lg:order-1 space-y-8">
            <div className="hidden lg:block">
              <IntroSection />
            </div>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <HoverButton
                  href="#contact"
                  variant="outline"
                  className="inline-flex items-center justify-center"
                >
                  Book a call
                </HoverButton>
                <HoverButton
                  href="#projects"
                  variant="outline"
                  className="inline-flex items-center justify-center"
                >
                  View portfolio
                </HoverButton>
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
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/5 text-light-text dark:text-dark-text hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={item.title}
                    >
                      {item.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div className="order-2 lg:order-2">
            <HeroPortrait imageError={imageError} setImageError={setImageError} />
          </div>
        </div>
      </div>

      {/* Scroll to explore indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 cursor-pointer group"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] ml-[0.25em] text-light-text2/70 dark:text-dark-text2/70 group-hover:text-primary-500 transition-colors">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
            className="text-light-text2/50 dark:text-dark-text2/50 group-hover:text-primary-500 transition-colors"
          >
            <rect x="1" y="1" width="18" height="26" rx="9" stroke="currentColor" strokeWidth="1.5" />
            <motion.circle
              cx="10"
              cy="8"
              r="2.5"
              fill="currentColor"
              animate={{ cy: [8, 14, 8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="fill-primary-500"
            />
          </svg>
        </motion.div>
      </motion.a>
    </section>
  )
}

function IntroSection() {
  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center space-x-3 rounded-full border border-light-border/50 dark:border-white/10 bg-light-surface2/50 dark:bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-light-text2 dark:text-dark-text2"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75 animate-ping"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-400"></span>
        </span>
        <span>portfolio ahead!</span>
      </motion.div>

      <div className="space-y-3">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight"
        >
          Hi, I&apos;m <span className="text-gradient">Rami Kronbi</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="text-sm uppercase tracking-[0.3em] text-light-text2 dark:text-dark-text2"
        >
          AI & Computer Vision Engineer · Founder, EVOID
        </motion.p>
      </div>
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
  const [imageSrc, setImageSrc] = useState('/profile.webp')

  const handleImageError = () => {
    const fallback = getFallbackImage('/profile.webp')
    if (imageSrc === '/profile.webp') {
      setImageSrc(fallback)
    } else {
      setImageError(true)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-[32px] border border-light-border/50 dark:border-white/10 bg-gradient-to-b from-light-surface2/50 dark:from-white/10 to-transparent p-4 backdrop-blur-xl"
      >
        <div className="relative h-[420px] rounded-[28px] bg-light-surface2/80 dark:bg-dark-surface2/80 overflow-hidden flex items-center justify-center">
          {!imageError ? (
            <Image
              src={imageSrc}
              alt="Rami Kronbi"
              fill
              className="object-cover"
              priority
              onError={handleImageError}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-primary-500 space-y-2">
              <span className="text-6xl font-semibold">RK</span>
              <p className="text-sm text-light-text2 dark:text-dark-text2">Add a portrait</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-light-surface2 dark:from-dark-surface2 via-transparent" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute -left-2 top-4 sm:-left-5 sm:top-6 lg:-left-6 lg:top-8 w-36 sm:w-44 lg:w-48 rounded-2xl border border-light-border/50 dark:border-white/25 bg-light-surface/90 dark:bg-white/10 p-3 shadow-[0_6px_18px_rgba(0,0,0,0.15)] dark:shadow-[0_6px_18px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
      >
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-200">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary-500/20 dark:bg-primary-500/25 text-primary-600 dark:text-primary-100">
            <FiCompass size={16} />
          </span>
          <span className="text-[9px] uppercase tracking-[0.35em] text-light-text2 dark:text-white/80">Fun fact</span>
        </div>
        <p className="mt-2 text-sm font-semibold leading-snug text-light-text dark:text-white/90">
          Born to C space, forced to C++
        </p>
      </motion.div>
    </div>
  )
}
