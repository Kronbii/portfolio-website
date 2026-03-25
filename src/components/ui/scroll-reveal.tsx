'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef } from 'react'

import { cn } from '@/lib/utils'
import styles from './scroll-reveal.module.css'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: string
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  enableBlur?: boolean
  baseOpacity?: number
  baseRotation?: number
  blurStrength?: number
  containerClassName?: string
  textClassName?: string
  rotationEnd?: string
  wordAnimationEnd?: string
}

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLHeadingElement | null>(null)

  const splitText = useMemo(() => {
    return children.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word
      return (
        <span className={styles.word} key={index}>
          {word}
        </span>
      )
    })
  }, [children])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const scroller = scrollContainerRef?.current ?? window
    const wordSelector = `.${styles.word}`
    const wordElements = element.querySelectorAll<HTMLElement>(wordSelector)

    const rotationTween = gsap.fromTo(
      element,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: element,
          scroller,
          start: 'top bottom',
          end: rotationEnd,
          scrub: true,
        },
      }
    )

    const opacityTween = gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity' },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: element,
          scroller,
          start: 'top bottom-=20%',
          end: wordAnimationEnd,
          scrub: true,
        },
      }
    )

    const blurTween = enableBlur
      ? gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: 'none',
            filter: 'blur(0px)',
            stagger: 0.05,
            scrollTrigger: {
              trigger: element,
              scroller,
              start: 'top bottom-=20%',
              end: wordAnimationEnd,
              scrub: true,
            },
          }
        )
      : null

    return () => {
      rotationTween.scrollTrigger?.kill()
      rotationTween.kill()
      opacityTween.scrollTrigger?.kill()
      opacityTween.kill()
      blurTween?.scrollTrigger?.kill()
      blurTween?.kill()
    }
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
  ])

  return (
    <h2 ref={containerRef} className={cn(styles.scrollReveal, containerClassName)}>
      <p className={cn(styles.scrollRevealText, textClassName)}>{splitText}</p>
    </h2>
  )
}
