'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import Image from 'next/image'
import { CornerButton } from '@/components/ui/corner-button'
import { getSectionMaxWidthStyle } from '@/lib/utils'

const navItems = [
  { name: 'MILESTONES', href: '#about' },
  { name: 'MISSION', href: '#about' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'CERTIFICATIONS', href: '#certifications' },
  { name: 'SERVICES', href: '#services' },
]

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-[#212121]/30"
      style={{ 
        backgroundColor: '#EAEAEA', 
        boxShadow: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none'
      }}
    >
      <div className="w-full bg-[#EAEAEA]">
        <div className="mx-auto" style={{ 
          ...getSectionMaxWidthStyle(),
          paddingLeft: 'clamp(1rem, 2vw, 2rem)',
          paddingRight: 'clamp(1rem, 2vw, 2rem)',
        }}>
          <div className="relative flex items-center justify-between bg-[#EAEAEA]" style={{ height: 'clamp(4rem, 5vw, 5rem)' }}>
          {/* Logo/Icon */}
          <motion.a
            href="#home"
            className="flex items-center z-10 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative" style={{ 
              height: 'clamp(2.5rem, 3vw, 3rem)', 
              width: 'clamp(2.5rem, 3vw, 3rem)' 
            }}>
              <Image
                src="/figma-assets/logo.svg"
                alt="Rami Kronbi"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.a>

          {/* Desktop Navigation - Absolutely centered */}
          <div className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2" style={{ gap: 'clamp(0.5rem, 2vw, 2rem)' }}>
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="font-normal uppercase tracking-wide text-[#252525] transition-colors hover:opacity-70 whitespace-nowrap"
                style={{
                  fontSize: 'clamp(10px, 1.2vw, 14px)',
                }}
                whileHover={{ y: -2 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Contact Button - Desktop */}
          <div className="hidden lg:block z-10">
            <CornerButton 
              href="#contact"
              style={{
                minWidth: 'clamp(90px, 12vw, 173px)',
                height: 'clamp(32px, 4vw, 40px)',
                fontSize: 'clamp(9px, 1.2vw, 14px)',
                paddingLeft: 'clamp(10px, 1.5vw, 24px)',
                paddingRight: 'clamp(10px, 1.5vw, 24px)',
              }}
            >
              CONTACT ME
            </CornerButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 text-[#252525]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pb-4 border-t border-[#212121]/30"
            >
              <div className="space-y-4 pt-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-base font-normal uppercase tracking-wide text-[#252525] hover:opacity-70"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <CornerButton 
                  href="#contact" 
                  className="mt-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  CONTACT ME
                </CornerButton>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
