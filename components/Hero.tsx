'use client'

import { motion } from 'framer-motion'
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiArrowDown,
} from 'react-icons/fi'
import Image from 'next/image'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { HoverButton } from '@/components/ui/hover-button'

export default function Hero() {
  const [imageError, setImageError] = useState(false)

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card mb-8"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400 font-medium">
                Available for projects
              </span>
            </motion.div>

            {/* Main heading with Gemini gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
            >
              <span className="block text-slate-900 dark:text-white">Hi, I&apos;m</span>
              <span className="text-gradient-animated block mt-2">
                Rami Kronbi
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 mb-8"
            >
              AI & Computer Vision Engineer crafting intelligent systems 
              that see, understand, and transform the world.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              <HoverButton
                href="#contact"
                variant="gradient"
                className="px-8 py-4 text-base font-semibold"
              >
                Get in touch
              </HoverButton>
              <HoverButton
                href="#projects"
                variant="outline"
                className="px-8 py-4 text-base font-semibold"
              >
                View my work
              </HoverButton>
            </motion.div>

            {/* Social links - PRESERVED EXACTLY AS ORIGINAL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4 justify-center lg:justify-start"
            >
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
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-900 dark:text-white hover:border-gemini-500/60 hover:text-gemini-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={item.title}
                  >
                    {item.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - Photo card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <HeroPortrait imageError={imageError} setImageError={setImageError} />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FiArrowDown className="w-5 h-5 text-gemini-500" />
          </motion.div>
        </motion.div>
      </div>
    </section>
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
    <div className="relative w-full max-w-md">
      {/* Glow effect behind the card */}
      <div className="absolute -inset-4 bg-gradient-to-r from-gemini-500/20 via-purple-500/20 to-cyan-500/20 rounded-[40px] blur-3xl opacity-60" />
      
      {/* Main floating card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Glass container */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative glass-card p-3 rounded-[32px] shadow-glass-lg"
        >
          {/* Inner image container */}
          <div className="relative h-[380px] sm:h-[420px] rounded-[24px] overflow-hidden bg-slate-100 dark:bg-slate-800">
            {!imageError ? (
              <Image
                src="/profile.jpg"
                alt="Rami Kronbi - AI & Computer Vision Engineer"
                fill
                className="object-cover"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gemini-500">
                <span className="text-6xl font-bold">RK</span>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Portrait</p>
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#050508]/80 via-transparent to-transparent" />
          </div>
        </motion.div>

        {/* Floating info cards */}
        <motion.div
          initial={{ opacity: 0, y: 20, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute -left-6 top-8 sm:-left-8"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="glass-card px-4 py-3 rounded-2xl shadow-glass max-w-[180px]"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">Fun Fact</span>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">
              Born to explore space, forced to C++
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="absolute -right-6 bottom-16 sm:-right-8"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="glass-card px-4 py-3 rounded-2xl shadow-glass max-w-[180px]"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-gemini-400" />
              <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">Founder</span>
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">
              EVOID Tech Solutions
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
