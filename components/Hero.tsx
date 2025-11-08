'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiArrowDown, FiUser } from 'react-icons/fi'
import Image from 'next/image'
import { useState } from 'react'

export default function Hero() {
  const [imageError, setImageError] = useState(false)

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Profile Picture */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary-500/50 shadow-2xl shadow-primary-500/20 bg-dark-surface2 flex items-center justify-center">
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
                <div className="flex flex-col items-center justify-center text-primary-500">
                  <FiUser size={80} />
                  <span className="text-sm mt-2 text-dark-text2">Add your photo</span>
                </div>
              )}
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary-500/30 pointer-events-none"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Text Content */}
          <div className="text-center md:text-left flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="text-dark-text">Hi, I&apos;m </span>
              <span className="text-primary-500">Rami Kronbi</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-dark-text2 mb-4"
            >
              AI & Computer Vision Engineer
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-dark-text2 mb-8"
            >
              Aspiring Project Manager
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center md:justify-start space-x-6 mb-12"
            >
              <motion.a
                href="https://github.com/Kronbii"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl text-dark-text2 hover:text-primary-500 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                title="GitHub"
              >
                <FiGithub />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/rami-kronbi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl text-dark-text2 hover:text-primary-500 transition-colors"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                title="LinkedIn"
              >
                <FiLinkedin />
              </motion.a>
              <motion.a
                href="mailto:your.email@example.com"
                className="text-3xl text-dark-text2 hover:text-primary-500 transition-colors"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                title="Email"
              >
                <FiMail />
              </motion.a>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center mt-12"
        >
          <motion.a
            href="#services"
            className="flex flex-col items-center text-dark-text2 hover:text-primary-500 transition-colors"
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="mb-2">Scroll to explore</span>
            <FiArrowDown size={24} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

