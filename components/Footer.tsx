'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi'

const socialLinks = [
  { icon: <FiGithub size={18} />, href: 'https://github.com/Kronbii', label: 'GitHub' },
  { icon: <FiLinkedin size={18} />, href: 'https://www.linkedin.com/in/rami-kronbi/', label: 'LinkedIn' },
  { icon: <FiMail size={18} />, href: 'mailto:ramykronby@gmail.com', label: 'Email' },
]

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-12 overflow-hidden">
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gemini-500/50 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <motion.a
            href="#home"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gemini-gradient text-white font-bold shadow-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            RK
          </motion.a>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
                whileHover={{ y: -2 }}
              >
                {link.name}
              </motion.a>
            ))}
          </nav>

          {/* Social links */}
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.label !== 'Email' ? '_blank' : undefined}
                rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
                className="p-3 rounded-xl glass text-slate-500 dark:text-slate-400 hover:text-gemini-500 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={link.label}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full max-w-xs h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {currentYear} Rami Kronbi. All rights reserved.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400/60 mt-2 flex items-center justify-center gap-1">
              Built with <FiHeart className="text-red-500" size={12} /> using Next.js & Three.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

