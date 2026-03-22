'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { FiGithub, FiLinkedin } from 'react-icons/fi'
import { CornerButton } from '@/components/ui/corner-button'
import { getFallbackImage, getSectionWidthStyle, getSectionStyle } from '@/lib/utils'


export default function Hero() {
  const [imageError, setImageError] = useState(false)

  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-screen flex flex-col mx-auto border-l border-r border-b"
      style={{
        paddingTop: 'clamp(4rem, 5vh, 5rem)',
        ...getSectionStyle(),
        ...getSectionWidthStyle(),
      }}
    >
      {/* Grid texture overlay with low opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/figma-assets/grid.svg)',
          backgroundPosition: 'center',
          backgroundSize: '50px 50px',
          backgroundRepeat: 'repeat',
          opacity: 0.06,
          zIndex: 0,
        }}
      />
      <div className="relative z-10 flex-1 flex flex-col" style={{
        justifyContent: 'center',
        paddingTop: 'clamp(1rem, 3vh, 2rem)',
        paddingBottom: 'clamp(1rem, 3vh, 2rem)',
      }}>
        <div className="w-full px-4 sm:px-6 xl:px-8">
          <div className="flex flex-col xl:grid xl:grid-cols-2 items-center" style={{
            gap: 'clamp(2rem, 5vw, 4rem)',
          }}>
            {/* Text and buttons - centered, stacked on top in medium viewport */}
            <div className="flex flex-col items-center justify-center w-full xl:items-start order-1 xl:order-1">
              <div className="flex flex-col items-center xl:items-start w-full" style={{
                gap: 'clamp(1.2rem, 3vw, 2.5rem)',
              }}>
                <IntroSection />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="flex flex-row justify-center xl:justify-start w-full flex-wrap"
                  style={{
                    gap: 'clamp(1rem, 3vw, 2.5rem)',
                  }}
                >
                  <CornerButton
                    href="#community"
                    variant="primary"
                    className="hidden md:inline-flex items-center justify-center"
                    style={{
                      minWidth: 'clamp(140px, 25vw, 166px)',
                      height: 'clamp(44px, 8vw, 46px)',
                      fontSize: 'clamp(13px, 2.5vw, 16px)',
                      paddingLeft: 'clamp(12px, 2vw, 24px)',
                      paddingRight: 'clamp(12px, 2vw, 24px)',
                    }}
                  >
                    MISSION
                  </CornerButton>
                  <div className="flex" style={{ gap: 'clamp(2rem, 1.5vw, 1rem)' }}>
                    <CornerButton
                      href="https://github.com/Kronbii"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center"
                      style={{
                        minWidth: 'clamp(44px, 8vw, 46px)',
                        width: 'clamp(44px, 8vw, 46px)',
                        height: 'clamp(44px, 8vw, 46px)',
                        padding: 0,
                      }}
                    >
                      <FiGithub size={20} />
                    </CornerButton>
                    <CornerButton
                      href="https://www.linkedin.com/in/rami-kronbi/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center"
                      style={{
                        minWidth: 'clamp(44px, 8vw, 46px)',
                        width: 'clamp(44px, 8vw, 46px)',
                        height: 'clamp(44px, 8vw, 46px)',
                        padding: 0,
                      }}
                    >
                      <FiLinkedin size={20} />
                    </CornerButton>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Image - below text/buttons in medium viewport, right side on desktop */}
            <div className="flex justify-center xl:justify-end w-full order-2 xl:order-2">
              <HeroPortrait imageError={imageError} setImageError={setImageError} />
            </div>
          </div>
        </div>

        {/* Expertise Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full border-t border-b bg-transparent mt-0"
          style={{
            ...getSectionStyle(),
            paddingTop: 'clamp(0.75rem, 1.5vw, 1.5rem)',
            paddingBottom: 'clamp(0.75rem, 1.5vw, 1.5rem)',
          }}
        >
          <div className="w-full" style={{
            paddingLeft: 'clamp(0.5rem, 2vw, 2rem)',
            paddingRight: 'clamp(0.5rem, 2vw, 2rem)',
          }}>
            <div
              className="flex flex-nowrap justify-center items-center overflow-x-auto no-scrollbar"
              style={{
                gap: 'clamp(0.5rem, 2vw, 4rem)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {['Computer Vision', 'Real-Time AI', 'Autonomous Robotics', 'Edge ML', 'Machine Learning'].map((item, index) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="font-normal text-center whitespace-nowrap flex-shrink-0"
                  style={{
                    color: 'var(--color-secondary)',
                    fontSize: 'clamp(11px, 1.8vw, 26px)',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
                    lineHeight: '1.2',
                  }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator - below expertise bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col items-center gap-2 pt-3 sm:pt-4 lg:pt-6"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center"
          >
            <svg
              width="24"
              height="32"
              viewBox="0 0 24 32"
              fill="none"
              style={{ color: 'var(--color-secondary)' }}
            >
              {/* Sharp downward chevron - minimalist design */}
              <motion.path
                d="M12 4L4 12L12 20L20 12L12 4Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="square"
                strokeLinejoin="miter"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.path
                d="M12 12L4 20L12 28L20 20L12 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="square"
                strokeLinejoin="miter"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              />
            </svg>
          </motion.div>
        </motion.div>
      </div >
    </section >
  )
}

function IntroSection() {
  return (
    <div className="flex flex-col xl:flex-col items-center xl:items-start justify-center xl:justify-start" style={{
      gap: 'clamp(0.5rem, 1.5vw, 1rem)',
    }}>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="leading-none"
        style={{
          fontWeight: 400,
          fontSize: 'clamp(3.5rem, 15vw, 7rem)',
          lineHeight: '1',
        }}
      >
        RAMI
      </motion.h1>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="leading-none"
        style={{
          fontWeight: 400,
          fontSize: 'clamp(3.5rem, 15vw, 7rem)',
          lineHeight: '1',
        }}
      >
        KRONBI
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="text-center xl:text-left"
        style={{
          color: 'var(--color-secondary)',
          opacity: 0.8,
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
          fontWeight: 500,
          letterSpacing: '0.02em',
          marginTop: 'clamp(0.5rem, 1vw, 1rem)',
        }}
      >
        AI Systems & Computer Vision Engineer
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="show-above-430 text-center xl:text-left max-w-2xl"
        style={{
          color: 'var(--color-secondary)',
          opacity: 0.7,
          fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
          lineHeight: 1.6,
          marginTop: 'clamp(0.75rem, 1.5vw, 1.25rem)',
        }}
      >
        Building multidisciplinary intelligent systems—from autonomous robotics to enterprise computer vision and real-time ML applications.
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
  const [imageSrc, setImageSrc] = useState('/figma-assets/hero.png')

  const handleImageError = () => {
    const fallback = getFallbackImage('/figma-assets/hero.png')
    if (imageSrc === '/figma-assets/hero.png') {
      setImageSrc(fallback)
    } else {
      setImageError(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full"
      style={{
        maxWidth: 'clamp(280px, 85vw, 600px)',
        height: 'auto',
      }}
    >
      {!imageError ? (
        <Image
          src={imageSrc}
          alt="Rami Kronbi"
          width={600}
          height={600}
          className="w-full h-auto"
          priority
          onError={handleImageError}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-primary-500 space-y-2 h-[600px]">
          <span className="text-6xl font-semibold">RK</span>
          <p className="text-sm" style={{ color: 'var(--color-secondary)' }}>Add a portrait</p>
        </div>
      )}
    </motion.div>
  )
}
