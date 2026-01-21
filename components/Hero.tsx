'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { CornerButton } from '@/components/ui/corner-button'
import { getFallbackImage, getSectionWidthStyle } from '@/lib/utils'


export default function Hero() {
  const [imageError, setImageError] = useState(false)

  return (
    <section
      id="home"
      className="relative overflow-hidden min-h-screen flex flex-col pt-12 sm:pt-16 lg:pt-20 bg-[#EAEAEA] border border-[#212121]/30 mx-auto"
      style={{ 
        backgroundColor: '#EAEAEA', 
        ...getSectionWidthStyle(),
      }}
    >
      {/* Grid texture overlay with low opacity */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/figma-assets/grid.png)',
          backgroundPosition: 'center',
          backgroundSize: '1500px 1100px',
          opacity: 0.02,
          zIndex: 0,
        }}
      />
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
            {/* Left side - Text and buttons */}
            <div className="flex justify-center items-center order-2 lg:order-1">
              <div className="space-y-4 sm:space-y-6 lg:space-y-8 w-full">
                <IntroSection />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="flex flex-row flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 lg:gap-10 w-full"
                >
                  <CornerButton
                    href="#contact"
                    variant="primary"
                    className="inline-flex items-center justify-center flex-1 sm:flex-initial"
                    style={{ 
                      minWidth: 'clamp(120px, 25vw, 166px)', 
                      height: 'clamp(40px, 8vw, 46px)',
                      fontSize: 'clamp(12px, 2.5vw, 16px)'
                    }}
                  >
                    MISSION
                  </CornerButton>
                  <CornerButton
                    href="#projects"
                    className="inline-flex items-center justify-center flex-1 sm:flex-initial"
                    style={{ 
                      minWidth: 'clamp(120px, 25vw, 166px)', 
                      height: 'clamp(40px, 8vw, 46px)',
                      fontSize: 'clamp(12px, 2.5vw, 16px)'
                    }}
                  >
                    PORTFOLIO
                  </CornerButton>
                </motion.div>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <HeroPortrait imageError={imageError} setImageError={setImageError} />
            </div>
          </div>
        </div>

        {/* Expertise Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full border border-[#212121]/30 bg-transparent py-3 sm:py-4 lg:py-6 mt-0"
        >
          <div className="w-full px-2 sm:px-4 lg:px-8">
            <div className="flex flex-nowrap justify-center items-center gap-2 sm:gap-4 lg:gap-16">
              {['Machine Learning', 'Computer Vision', 'Artificial Intelligence', 'Robotics', 'Engineering'].map((item, index) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className="text-[#252525] font-normal text-center whitespace-nowrap"
                    style={{ 
                      fontSize: 'clamp(10px, 2vw, 26px)',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.25)'
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
          <div className="w-[3px] h-[3px] rounded-full bg-[#252525]" />
          <span className="text-xs text-[#252525]">
            Scroll Below
          </span>
        </motion.div>
      </div>
    </section>
  )
}

function IntroSection() {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-12">
      <div className="flex flex-row items-baseline gap-1 sm:gap-2 lg:flex-col lg:gap-0">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="leading-none"
          style={{ 
            fontWeight: 300,
            fontSize: 'clamp(2rem, 10vw, 9rem)'
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
            fontWeight: 300,
            fontSize: 'clamp(2rem, 10vw, 9rem)'
          }}
        >
          KRONBI
        </motion.h1>
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
      className="relative w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[600px]"
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
          <p className="text-sm text-[#252525]">Add a portrait</p>
        </div>
      )}
    </motion.div>
  )
}
