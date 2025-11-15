'use client'

import { motion } from 'framer-motion'
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiArrowUpRight,
  FiTarget,
  FiActivity,
  FiLayers,
} from 'react-icons/fi'
import Image from 'next/image'
import { useState } from 'react'

const heroMetrics = [
  {
    value: '18+',
    label: 'AI Deployments',
    sublabel: 'Robotics · Vision · ML Ops',
  },
  {
    value: '4x',
    label: 'Faster Delivery',
    sublabel: 'Process-led execution',
  },
  {
    value: '7',
    label: 'Teams Led',
    sublabel: 'From brief to launch',
  },
]

const differentiators = [
  'End-to-end partner blending AI engineering, product leadership, and certified project management.',
  'I build vision + robotics systems that actually ship — optimized for Jetson, TensorRT, and embedded edge.',
  'Weekly reporting, transparent documentation, and relentless focus on measurable outcomes.',
]

export default function Hero() {
  const [imageError, setImageError] = useState(false)

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-32 pb-24"
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-dark-text2 shadow-glow"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-400"></span>
            </span>
            <span>Now booking AI & CV products for Q1</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight tracking-tight"
          >
            I build <span className="text-gradient">vision-first products</span> that clients can launch, scale, and trust.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg md:text-xl text-dark-text2 max-w-2xl"
          >
            Mechatronics engineer, AI & Computer Vision specialist, and Google-certified project manager. I architect strategy, lead teams, and ship performant systems for robotics, defense, and immersive products.
          </motion.p>

          <ul className="space-y-5">
            {differentiators.map((point, index) => (
              <motion.li
                key={point}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 * index }}
                className="flex items-start space-x-3 text-base text-dark-text2"
              >
                <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/30">
                  {index === 0 && <FiTarget size={16} />}
                  {index === 1 && <FiActivity size={16} />}
                  {index === 2 && <FiLayers size={16} />}
                </span>
                <span>{point}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.a
              href="#contact"
              className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 px-8 py-4 text-base font-semibold text-white shadow-glow transition-transform"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Book a discovery call
              <FiArrowUpRight className="ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.a>
            <motion.a
              href="#projects"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-dark-text hover:border-primary-500/60 hover:bg-dark-surface transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View case studies
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center gap-6"
          >
            <span className="text-sm uppercase tracking-[0.4em] text-dark-text2">Connect</span>
            <div className="flex space-x-4 text-lg">
              <motion.a
                href="https://github.com/Kronbii"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-dark-text hover:border-primary-500/70 hover:text-primary-300 transition-colors"
                whileHover={{ rotate: 5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="GitHub"
              >
                <FiGithub />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/rami-kronbi/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-dark-text hover:border-primary-500/70 hover:text-primary-300 transition-colors"
                whileHover={{ rotate: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="LinkedIn"
              >
                <FiLinkedin />
              </motion.a>
              <motion.a
                href="mailto:ramykronby@gmail.com"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-dark-text hover:border-primary-500/70 hover:text-primary-300 transition-colors"
                whileHover={{ rotate: 5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Email"
              >
                <FiMail />
              </motion.a>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {heroMetrics.map((metric) => (
              <motion.div
                key={metric.value}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-5 backdrop-blur"
              >
                <p className="text-3xl font-semibold text-gradient">{metric.value}</p>
                <p className="mt-1 text-sm uppercase tracking-wide text-dark-text">{metric.label}</p>
                <p className="text-xs text-dark-text2 mt-1">{metric.sublabel}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative">
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
            className="absolute -left-6 top-10 w-48 rounded-2xl border border-primary-500/30 bg-dark-surface/80 p-4 shadow-glow backdrop-blur-lg"
          >
            <p className="text-xs uppercase text-dark-text2">Signature Outcome</p>
            <p className="text-2xl font-semibold text-primary-400">Vision in weeks</p>
            <p className="text-sm text-dark-text2">From concept to deployable prototype in under 6 weeks.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute -right-4 bottom-10 w-56 rounded-2xl border border-secondary-500/30 bg-dark-surface/80 p-4 shadow-[0_0_30px_rgba(14,165,233,0.15)] backdrop-blur"
          >
            <p className="text-xs uppercase text-dark-text2">Delivery Rhythm</p>
            <div className="mt-2 flex items-center justify-between text-dark-text">
              <div>
                <p className="text-3xl font-semibold">Weekly</p>
                <p className="text-xs uppercase tracking-wide text-dark-text2">Reports</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-secondary-400">100%</p>
                <p className="text-xs text-dark-text2">transparent</p>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-secondary-400 to-primary-500"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
