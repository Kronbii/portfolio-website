'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { FiMenu, FiX, FiArrowUpRight } from 'react-icons/fi'
import { HoverButton } from '@/components/ui/hover-button'

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#projects' },
  { name: 'Community', href: '#community' },
  { name: 'Services', href: '#services' },
  { name: 'Certifications', href: '#certifications' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scrollScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
                ? 'border-white/15 bg-dark-surface/80 shadow-lg backdrop-blur-xl'
                : 'border-white/5 bg-transparent'
            } px-4 py-2`}
          >
            <motion.a
              href="#home"
              className="flex items-center space-x-2 text-lg font-semibold text-dark-text"
              whileHover={{ scale: 1.02 }}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-bold">
                RK
              </span>
              <div className="hidden sm:block">
                <p className="text-sm uppercase tracking-widest text-dark-text2">AI & CV Engineer</p>
                <p className="-mt-1 text-base text-dark-text">Rami Kronbi</p>
              </div>
            </motion.a>

            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold uppercase tracking-wide text-dark-text2 transition-colors hover:text-primary-400"
                  whileHover={{ y: -2 }}
                >
                  {item.name}
                </motion.a>
              ))}
              <span className="h-6 w-px bg-white/10" />
              <HoverButton
                href="#contact"
                variant="outline"
                className="group inline-flex items-center space-x-1 px-4 py-2 text-sm"
              >
                <span>Quick Call</span>
                <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </HoverButton>
            </div>

            <HoverButton
              className="lg:hidden inline-flex h-12 w-12 items-center justify-center p-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </HoverButton>
          </div>

          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 rounded-3xl border border-white/10 bg-dark-surface/95 p-6 shadow-2xl backdrop-blur-xl lg:hidden"
            >
              <div className="space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-lg font-medium text-dark-text hover:text-primary-400"
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
