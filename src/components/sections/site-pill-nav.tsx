'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { homeContent } from '@/content/home'
import { Container } from '@/components/ui/container'
import { cn } from '@/lib/utils'

const isExternalLink = (href: string) =>
  href.startsWith('http://') ||
  href.startsWith('https://') ||
  href.startsWith('//') ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:')
const isHttpLink = (href: string) =>
  href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')

export function SitePillNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const visibleRef = useRef(false)
  const lastScrollYRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const items = useMemo(
    () => homeContent.navigation.map((item) => ({ label: item.label, href: item.href })),
    []
  )

  useEffect(() => {
    const setVisibility = (next: boolean) => {
      if (visibleRef.current === next) return
      visibleRef.current = next
      setIsVisible(next)
      if (!next) {
        setIsMobileMenuOpen(false)
      }
    }

    const updateVisibility = () => {
      const currentY = Math.max(0, window.scrollY)
      if (currentY <= 0) {
        setVisibility(false)
        lastScrollYRef.current = currentY
        rafRef.current = null
        return
      }

      const delta = currentY - lastScrollYRef.current

      if (delta > 0) {
        setVisibility(false)
      } else if (delta < 0) {
        setVisibility(true)
      }

      lastScrollYRef.current = currentY
      rafRef.current = null
    }

    const requestUpdate = () => {
      if (rafRef.current !== null) return
      rafRef.current = window.requestAnimationFrame(updateVisibility)
    }

    lastScrollYRef.current = window.scrollY
    updateVisibility()

    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const NavLink = ({
    href,
    label,
    className,
    onClick,
  }: {
    href: string
    label: string
    className?: string
    onClick?: () => void
  }) => {
    const sharedClassName = cn(
      'inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5f5f5] transition-colors hover:bg-[#f5f5f5] hover:text-[#0c0c0c]',
      className
    )

    if (isExternalLink(href)) {
      return (
        <a
          href={href}
          target={isHttpLink(href) ? '_blank' : undefined}
          rel={isHttpLink(href) ? 'noopener noreferrer' : undefined}
          className={sharedClassName}
          onClick={onClick}
        >
          {label}
        </a>
      )
    }

    return (
      <a href={href} className={sharedClassName} onClick={onClick}>
        {label}
      </a>
    )
  }

  return (
    <motion.header
      className={cn('fixed inset-x-0 top-0 z-[80] py-4', isVisible ? 'pointer-events-auto' : 'pointer-events-none')}
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -16,
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Container>
        <div className='rounded-full border border-white/15 bg-[#0c0c0c]/90 px-4 py-2 text-[#f5f5f5] shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur'>
          <div className='flex items-center justify-between gap-3'>
            <Link
              href='/#home'
              className='rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[#f5f5f5] transition-opacity hover:opacity-75'
            >
              KRONBI
            </Link>

            <nav className='hidden items-center gap-1 md:flex'>
              {items.map((item) => (
                <NavLink key={item.href} href={item.href} label={item.label} />
              ))}
            </nav>

            <button
              type='button'
              className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-[#f5f5f5] transition-colors hover:bg-[#f5f5f5] hover:text-[#0c0c0c] md:hidden'
              aria-label='Toggle navigation menu'
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              <span className='sr-only'>Menu</span>
              <span className='text-base leading-none'>{isMobileMenuOpen ? '×' : '☰'}</span>
            </button>
          </div>

          <div
            className={cn(
              'overflow-hidden transition-all duration-200 md:hidden',
              isMobileMenuOpen ? 'max-h-80 pt-3 opacity-100' : 'max-h-0 pt-0 opacity-0'
            )}
          >
            <nav className='flex flex-col gap-1 border-t border-white/10 pt-3'>
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  className='w-full justify-start px-2 py-2'
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </nav>
          </div>
        </div>
      </Container>
    </motion.header>
  )
}
