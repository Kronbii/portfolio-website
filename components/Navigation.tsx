'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import Image from 'next/image'
import { CornerButton } from '@/components/ui/corner-button'
import { getSectionWidthStyle } from '@/lib/utils'

const navItems = [
  { name: 'MISSION', href: '#community' },
  { name: 'MILESTONES', href: '#experience' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'CERTIFICATIONS', href: '#certifications' },
  { name: 'SERVICES', href: '#services' },
  { name: 'BLOG', href: '#blog' },
]

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop
      setHasScrolled(scrollPosition > 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Check initial scroll position
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 ${hasScrolled ? 'border-b' : ''}`}
      style={{
        backgroundColor: hasScrolled ? 'var(--color-primary)' : 'transparent',
        borderColor: hasScrolled ? 'rgba(33, 33, 33, 0.3)' : 'transparent',
        boxShadow: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        transition: 'background-color 0.5s ease, border-color 0.5s ease',
      }}
    >
      <div className="w-full" style={{
        backgroundColor: hasScrolled ? 'var(--color-primary)' : 'transparent',
        transition: 'background-color 0.5s ease',
      }}>
        <div className="mx-auto" style={{
          ...getSectionWidthStyle(),
          paddingLeft: 'clamp(0.75rem, 2vw, 2rem)',
          paddingRight: 'clamp(0.75rem, 2vw, 2rem)',
        }}>
          <div className="relative flex items-center justify-between" style={{
            height: 'clamp(4rem, 5vw, 5rem)',
            backgroundColor: hasScrolled ? 'var(--color-primary)' : 'transparent',
            transition: 'background-color 0.5s ease',
          }}>
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
            <div className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2" style={{ gap: 'clamp(0.5rem, 1.5vw, 1.5rem)' }}>
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="font-normal uppercase tracking-wide transition-colors hover:opacity-70 whitespace-nowrap"
                  style={{
                    color: 'var(--color-secondary)',
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
              className="lg:hidden flex items-center justify-center w-10 h-10"
              style={{ color: 'var(--color-secondary)' }}
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
              className="lg:hidden pb-4 border-t"
              style={{ borderColor: 'rgba(33, 33, 33, 0.3)' }}
            >
              <div className="space-y-4 pt-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-base font-normal uppercase tracking-wide hover:opacity-70"
                    style={{ color: 'var(--color-secondary)' }}
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
