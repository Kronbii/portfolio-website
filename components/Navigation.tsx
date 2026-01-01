'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { FiMenu, FiX, FiArrowUpRight, FiSun, FiMoon } from 'react-icons/fi'
import { HoverButton } from '@/components/ui/hover-button'
import { useTheme } from 'next-themes'
import Image from 'next/image'

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Community', href: '#community' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Services', href: '#services' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { scrollYProgress } = useScroll()
  const scrollScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 origin-left bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 z-50"
        style={{ scaleX: scrollScale }}
      />
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-3 left-0 right-0 z-40"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between rounded-full border transition-all duration-300 ${
              isScrolled || isMobileMenuOpen
                ? 'border-light-border/50 dark:border-white/15 bg-light-surface/80 dark:bg-dark-surface/80 shadow-lg backdrop-blur-xl'
                : 'border-light-border/20 dark:border-white/5 bg-transparent'
            } px-4 py-2`}
          >
            <motion.a
              href="#home"
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative h-8 w-8 sm:h-10 sm:w-10 group">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 via-secondary-600 to-accent-500 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
                <div className="relative h-full w-full">
                  <Image
                    src="/black-hole.png"
                    alt="Rami Kronbi"
                    fill
                    className="object-contain drop-shadow-[0_0_8px_rgba(49,134,255,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(49,134,255,0.5)] transition-all duration-300"
                    priority
                  />
                </div>
              </div>
            </motion.a>

            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold uppercase tracking-wide text-light-text2 dark:text-dark-text2 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                  whileHover={{ y: -2 }}
                >
                  {item.name}
                </motion.a>
              ))}
              <span className="h-6 w-px bg-light-border dark:bg-white/10" />
              
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/5 text-light-text dark:text-dark-text hover:border-primary-500/60 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {mounted && (
                  resolvedTheme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />
                )}
              </motion.button>

              <HoverButton
                href="#contact"
                variant="outline"
                className="group inline-flex items-center space-x-1 px-4 py-2 text-sm"
              >
                <span>Quick Call</span>
                <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </HoverButton>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              {/* Mobile Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-light-border/50 dark:border-white/15 bg-light-surface2/50 dark:bg-white/5 text-light-text dark:text-dark-text"
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {mounted && (
                  resolvedTheme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />
                )}
              </motion.button>

              <HoverButton
                className="inline-flex h-12 w-12 items-center justify-center p-0"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </HoverButton>
            </div>
          </div>

          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 rounded-3xl border border-light-border/50 dark:border-white/10 bg-light-surface/95 dark:bg-dark-surface/95 p-6 shadow-2xl backdrop-blur-xl lg:hidden"
            >
              <div className="space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-lg font-medium text-light-text dark:text-dark-text hover:text-primary-600 dark:hover:text-primary-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <HoverButton
                href="#contact"
                variant="gradient"
                className="mt-6 w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Rami
              </HoverButton>
            </motion.div>
          )}
        </div>
      </motion.nav>
    </>
  )
}
