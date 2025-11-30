'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from 'next-themes'
import { HoverButton } from '@/components/ui/hover-button'

const navItems = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Community', href: '#community' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  
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
      const currentScrollY = window.scrollY
      
      setIsScrolled(currentScrollY > 20)
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }
      
      setLastScrollY(currentScrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      {/* Scroll progress indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
        style={{ 
          scaleX: scrollScale,
          background: 'linear-gradient(90deg, #4285f4, #8b5cf6, #06b6d4)',
        }}
      />
      
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: isHidden ? -100 : 0, 
          opacity: isHidden ? 0 : 1 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-4 left-0 right-0 z-40"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between rounded-2xl transition-all duration-300 ${
              isScrolled || isMobileMenuOpen
                ? 'glass-card shadow-glass-lg'
                : 'bg-transparent border-transparent'
            } px-4 py-3`}
          >
            {/* Logo */}
            <motion.a
              href="#home"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gemini-gradient text-white font-bold text-sm shadow-glow">
                RK
              </span>
              <div className="hidden sm:block">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-medium">
                  AI & CV Engineer
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white -mt-0.5">
                  Rami Kronbi
                </p>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                  <motion.span
                    className="absolute bottom-0 left-1/2 h-0.5 bg-gemini-gradient rounded-full"
                    initial={{ width: 0, x: '-50%' }}
                    whileHover={{ width: '60%' }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </div>

            {/* Right side: Theme toggle + CTA */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              {mounted && (
                <motion.button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl glass hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={theme}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === 'dark' ? (
                        <FiSun className="w-5 h-5 text-amber-400" />
                      ) : (
                        <FiMoon className="w-5 h-5 text-slate-600" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              )}

              {/* Desktop CTA */}
              <div className="hidden lg:block">
                <HoverButton
                  href="#contact"
                  variant="gradient"
                  className="px-5 py-2.5 text-sm font-medium"
                >
                  Let&apos;s Talk
                </HoverButton>
              </div>

              {/* Mobile menu button */}
              <motion.button
                className="lg:hidden p-2.5 rounded-xl glass"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </motion.button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="mt-3 rounded-2xl glass-card shadow-glass-lg overflow-hidden lg:hidden"
              >
                <div className="p-6 space-y-1">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-3 text-lg font-medium text-slate-900 dark:text-white hover:text-gemini-500 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </div>
                <div className="px-6 pb-6">
                  <HoverButton
                    href="#contact"
                    variant="gradient"
                    className="w-full justify-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Let&apos;s Talk
                  </HoverButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  )
}
