'use client'

import Link from 'next/link'
import { gsap } from 'gsap'
import {
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

import { cn } from '@/lib/utils'
import styles from './pill-nav.module.css'

export interface PillNavItem {
  label: string
  href: string
  ariaLabel?: string
}

interface PillNavProps {
  logo: string
  logoAlt?: string
  logoHref?: string
  items: PillNavItem[]
  activeHref?: string
  className?: string
  ease?: string
  baseColor?: string
  pillColor?: string
  hoveredPillTextColor?: string
  pillTextColor?: string
  onMobileMenuClick?: () => void
  initialLoadAnimation?: boolean
}

const isExternalLink = (href: string) =>
  href.startsWith('http://') ||
  href.startsWith('https://') ||
  href.startsWith('//') ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:')

const isHashLink = (href: string) => href.startsWith('#')
const isNextLink = (href: string) => href && !isExternalLink(href) && !isHashLink(href)

type LinkProps = {
  href: string
  className: string
  ariaLabel?: string
  children: ReactNode
  onMouseEnter?: MouseEventHandler<HTMLElement>
  onMouseLeave?: MouseEventHandler<HTMLElement>
  onClick?: MouseEventHandler<HTMLElement>
}

function SmartLink({
  href,
  className,
  ariaLabel,
  children,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: LinkProps) {
  if (isNextLink(href)) {
    return (
      <Link
        href={href}
        className={className}
        aria-label={ariaLabel}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {children}
      </Link>
    )
  }

  const isHttp = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')

  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      target={isHttp ? '_blank' : undefined}
      rel={isHttp ? 'noopener noreferrer' : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {children}
    </a>
  )
}

export default function PillNav({
  logo,
  logoAlt = 'Logo',
  logoHref = '#home',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#0c0c0c',
  pillColor = '#f5f5f5',
  hoveredPillTextColor = '#f5f5f5',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
}: PillNavProps) {
  const resolvedPillTextColor = pillTextColor ?? baseColor
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const circleRefs = useRef<(HTMLSpanElement | null)[]>([])
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])
  const hoverLabelRefs = useRef<(HTMLSpanElement | null)[]>([])
  const tlRefs = useRef<(gsap.core.Timeline | null)[]>([])
  const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([])
  const logoImgRef = useRef<HTMLImageElement | null>(null)
  const logoTweenRef = useRef<gsap.core.Tween | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const navItemsRef = useRef<HTMLDivElement | null>(null)
  const logoRef = useRef<HTMLElement | null>(null)
  const hamburgerTopRef = useRef<HTMLSpanElement | null>(null)
  const hamburgerBottomRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return

        const pill = circle.parentElement
        const rect = pill.getBoundingClientRect()
        const { width: w, height: h } = rect
        const R = ((w * w) / 4 + h * h) / (2 * h)
        const D = Math.ceil(2 * R) + 2
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
        const originY = D - delta

        circle.style.width = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        })

        const label = labelRefs.current[index]
        const hover = hoverLabelRefs.current[index]

        if (label) gsap.set(label, { y: 0 })
        if (hover) gsap.set(hover, { y: h + 12, opacity: 0 })

        tlRefs.current[index]?.kill()
        const tl = gsap.timeline({ paused: true })
        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' },
          0
        )

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0)
        }

        if (hover) {
          gsap.set(hover, { y: Math.ceil(h + 100), opacity: 0 })
          tl.to(hover, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0)
        }

        tlRefs.current[index] = tl
      })
    }

    layout()

    const onResize = () => layout()
    window.addEventListener('resize', onResize)

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {})
    }

    if (mobileMenuRef.current) {
      gsap.set(mobileMenuRef.current, { visibility: 'hidden', opacity: 0, scaleY: 1 })
    }

    if (initialLoadAnimation) {
      if (logoRef.current) {
        gsap.set(logoRef.current, { scale: 0 })
        gsap.to(logoRef.current, {
          scale: 1,
          duration: 0.6,
          ease,
        })
      }

      if (navItemsRef.current) {
        gsap.set(navItemsRef.current, { width: 0, overflow: 'hidden' })
        gsap.to(navItemsRef.current, {
          width: 'auto',
          duration: 0.6,
          ease,
        })
      }
    }

    return () => {
      window.removeEventListener('resize', onResize)
      tlRefs.current.forEach((tl) => tl?.kill())
      activeTweenRefs.current.forEach((tw) => tw?.kill())
      logoTweenRef.current?.kill()
    }
  }, [ease, initialLoadAnimation, items])

  const handleEnter = (index: number) => {
    const tl = tlRefs.current[index]
    if (!tl) return
    activeTweenRefs.current[index]?.kill()
    activeTweenRefs.current[index] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto',
    })
  }

  const handleLeave = (index: number) => {
    const tl = tlRefs.current[index]
    if (!tl) return
    activeTweenRefs.current[index]?.kill()
    activeTweenRefs.current[index] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto',
    })
  }

  const handleLogoEnter = () => {
    if (!logoImgRef.current) return
    logoTweenRef.current?.kill()
    gsap.set(logoImgRef.current, { rotate: 0 })
    logoTweenRef.current = gsap.to(logoImgRef.current, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto',
    })
  }

  const toggleMobileMenu = () => {
    const nextState = !isMobileMenuOpen
    setIsMobileMenuOpen(nextState)

    if (hamburgerTopRef.current && hamburgerBottomRef.current) {
      if (nextState) {
        gsap.to(hamburgerTopRef.current, { rotation: 45, y: 3, duration: 0.3, ease })
        gsap.to(hamburgerBottomRef.current, { rotation: -45, y: -3, duration: 0.3, ease })
      } else {
        gsap.to(hamburgerTopRef.current, { rotation: 0, y: 0, duration: 0.3, ease })
        gsap.to(hamburgerBottomRef.current, { rotation: 0, y: 0, duration: 0.3, ease })
      }
    }

    if (mobileMenuRef.current) {
      if (nextState) {
        gsap.set(mobileMenuRef.current, { visibility: 'visible' })
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center',
          }
        )
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            if (mobileMenuRef.current) {
              gsap.set(mobileMenuRef.current, { visibility: 'hidden' })
            }
          },
        })
      }
    }

    onMobileMenuClick?.()
  }

  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillColor,
    '--hover-text': hoveredPillTextColor,
    '--pill-text': resolvedPillTextColor,
  } as CSSProperties

  return (
    <div className={styles.pillNavContainer}>
      <nav className={cn(styles.pillNav, className)} aria-label="Primary" style={cssVars}>
        <SmartLink
          href={logoHref}
          className={styles.pillLogo}
          ariaLabel="Home"
          onMouseEnter={handleLogoEnter}
        >
          <img
            src={logo}
            alt={logoAlt}
            ref={(el) => {
              logoImgRef.current = el
              logoRef.current = el?.parentElement ?? null
            }}
          />
        </SmartLink>

        <div className={cn(styles.pillNavItems, styles.desktopOnly)} ref={navItemsRef}>
          <ul className={styles.pillList} role="menubar">
            {items.map((item, index) => (
              <li key={item.href || `item-${index}`} role="none">
                <SmartLink
                  href={item.href}
                  className={cn(
                    styles.pill,
                    activeHref === item.href && styles.pillActive
                  )}
                  ariaLabel={item.ariaLabel ?? item.label}
                  onMouseEnter={() => handleEnter(index)}
                  onMouseLeave={() => handleLeave(index)}
                >
                  <span
                    aria-hidden="true"
                    className={styles.hoverCircle}
                    ref={(el) => {
                      circleRefs.current[index] = el
                    }}
                  />
                  <span className={styles.labelStack}>
                    <span
                      className={styles.pillLabel}
                      ref={(el) => {
                        labelRefs.current[index] = el
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={styles.pillLabelHover}
                      ref={(el) => {
                        hoverLabelRefs.current[index] = el
                      }}
                    >
                      {item.label}
                    </span>
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className={cn(styles.mobileMenuButton, styles.mobileOnly)}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={styles.hamburgerLine} ref={hamburgerTopRef} />
          <span className={styles.hamburgerLine} ref={hamburgerBottomRef} />
        </button>
      </nav>

      <div className={cn(styles.mobileMenuPopover, styles.mobileOnly)} ref={mobileMenuRef} style={cssVars}>
        <ul className={styles.mobileMenuList}>
          {items.map((item, index) => (
            <li key={item.href || `mobile-item-${index}`}>
              <SmartLink
                href={item.href}
                className={cn(
                  styles.mobileMenuLink,
                  activeHref === item.href && styles.pillActive
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
