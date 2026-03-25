'use client'

import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { homeContent } from '@/content/home'
import PillNav, { type PillNavItem } from '@/components/ui/pill-nav'

const SHOW_OFFSET_PX = 12

export function SitePillNav() {
  const [isVisible, setIsVisible] = useState(false)
  const visibleRef = useRef(false)
  const lastScrollYRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const items = useMemo<PillNavItem[]>(
    () =>
      homeContent.navigation.map((item) => ({
        label: item.label,
        href: item.href,
      })),
    []
  )

  useEffect(() => {
    const setVisibility = (next: boolean) => {
      if (visibleRef.current === next) return
      visibleRef.current = next
      setIsVisible(next)
    }

    const updateVisibility = () => {
      const currentY = Math.max(0, window.scrollY)
      const heroSection = document.getElementById('home')
      const heroBottom = heroSection
        ? heroSection.offsetTop + heroSection.offsetHeight - SHOW_OFFSET_PX
        : 120

      const isPastHero = currentY > heroBottom

      if (!isPastHero) {
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

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-4 z-[70] flex justify-center px-4"
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -16,
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="pointer-events-auto w-full md:w-auto">
        <PillNav
          logo="/icons/icon-192.png"
          logoAlt="Rami Kronbi"
          logoHref="#home"
          items={items}
          baseColor="#0c0c0c"
          pillColor="#f5f5f5"
          pillTextColor="#0c0c0c"
          hoveredPillTextColor="#f5f5f5"
          initialLoadAnimation={false}
        />
      </div>
    </motion.div>
  )
}
