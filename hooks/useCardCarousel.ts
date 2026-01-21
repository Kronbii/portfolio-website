import { useRef, useState, useEffect } from 'react'

interface UseCardCarouselOptions {
  itemCount: number
  cardsPerView?: number // Default 3
  gap?: number // Default 24px
  padding?: number // Default 32px
  scrollContainerRef?: React.RefObject<HTMLDivElement>
  cardsRef?: React.MutableRefObject<(HTMLDivElement | null)[]>
  extendedItemsLength?: number
}

interface UseCardCarouselReturn {
  sectionRef: React.RefObject<HTMLElement>
  cardWidth: number
  cardHeight: number
  visibleCards: Set<number>
}

export function useCardCarousel(
  options: UseCardCarouselOptions
): UseCardCarouselReturn {
  const { 
    itemCount, 
    cardsPerView = 3, 
    gap = 24, 
    padding = 32,
    scrollContainerRef,
    cardsRef,
    extendedItemsLength = 0,
  } = options
  const sectionRef = useRef<HTMLElement>(null)
  const [cardWidth, setCardWidth] = useState(450)
  const [cardHeight, setCardHeight] = useState(600)
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())

  // Calculate card size to fit cardsPerView cards in the section
  useEffect(() => {
    const updateCardSize = () => {
      if (!sectionRef.current) return
      
      const section = sectionRef.current
      const sectionWidth = section.offsetWidth
      
      // Get computed padding from the section
      const computedStyle = window.getComputedStyle(section)
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || padding
      const paddingRight = parseFloat(computedStyle.paddingRight) || padding
      const totalSectionPadding = paddingLeft + paddingRight
      
      // Account for scroll container padding which varies by breakpoint
      // The scroll container has: px-4 sm:px-6 lg:px-[calc((100vw-72rem)/2+1.5rem)]
      const viewportWidth = window.innerWidth
      let containerPadding = 0
      if (viewportWidth >= 1024) {
        // lg and above: calc((100vw-72rem)/2+1.5rem) - approximate as 32px per side
        containerPadding = 64 // 32px * 2
      } else if (viewportWidth >= 640) {
        // sm to lg: 24px (1.5rem) per side
        containerPadding = 48 // 24px * 2
      } else {
        // xs: 16px (1rem) per side
        containerPadding = 32 // 16px * 2
      }
      
      // Calculate available width accounting for all padding
      // Add a small safety margin (8px) to prevent overflow
      const safetyMargin = 8
      const availableWidth = sectionWidth - totalSectionPadding - containerPadding - safetyMargin
      const calculatedCardWidth = (availableWidth - (gap * (cardsPerView - 1))) / cardsPerView
      
      // Maintain aspect ratio (450:600 = 3:4)
      const calculatedCardHeight = (calculatedCardWidth * 4) / 3
      
      // Use a more conservative minimum for tablets and clamp to max
      setCardWidth(Math.max(250, Math.min(calculatedCardWidth, 450))) // Clamp between 250px and 450px
      setCardHeight(Math.max(333, Math.min(calculatedCardHeight, 600))) // Maintain aspect ratio
    }

    updateCardSize()
    window.addEventListener('resize', updateCardSize)
    return () => window.removeEventListener('resize', updateCardSize)
  }, [cardsPerView, gap, padding])

  // Center the first cards on initial load
  useEffect(() => {
    const container = scrollContainerRef?.current
    const section = sectionRef.current
    if (!container || !section || extendedItemsLength === 0) return

    let hasCentered = false

    const centerInitialCards = () => {
      if (hasCentered) return
      
      // Wait for cards to be rendered and measured
      const timeoutId = setTimeout(() => {
        if (!container || !section || hasCentered || !cardsRef) return

        // Find the first card of the middle set (itemCount)
        const firstCardIndex = itemCount
        const secondCard = cardsRef.current[firstCardIndex + 1]
        
        if (!secondCard) return

        // Get section boundaries
        const sectionRect = section.getBoundingClientRect()
        const sectionCenter = sectionRect.left + sectionRect.width / 2
        
        // Get container position relative to viewport
        const containerRect = container.getBoundingClientRect()
        const containerLeft = containerRect.left
        
        // Position of second card relative to container
        const secondCardLeft = secondCard.offsetLeft
        
        // Calculate scroll position so that the second card is centered in the section
        const targetCardCenterInContainer = sectionCenter - containerLeft
        const scrollPosition = secondCardLeft + (cardWidth / 2) - targetCardCenterInContainer
        
        container.scrollLeft = Math.max(0, scrollPosition)
        hasCentered = true
      }, 400)

      return () => clearTimeout(timeoutId)
    }

    return centerInitialCards()
  }, [extendedItemsLength, cardWidth, itemCount, scrollContainerRef, cardsRef])

  // Track which cards are visible within the section boundaries
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleCards((prev) => {
          const updated = new Set(prev)
          entries.forEach((entry) => {
            const index = parseInt(entry.target.getAttribute('data-card-index') || '-1')
            if (index >= 0) {
              if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                updated.add(index)
              } else {
                updated.delete(index)
              }
            }
          })
          return updated
        })
      },
      {
        root: section,
        rootMargin: '0px',
        threshold: [0, 0.5, 1],
      }
    )

    // Observe all card containers after a delay to ensure they're rendered
    const timeoutId = setTimeout(() => {
      const cardElements = section.querySelectorAll('[data-card-index]')
      cardElements.forEach((el) => observer.observe(el))
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      const cardElements = section.querySelectorAll('[data-card-index]')
      cardElements.forEach((el) => observer.unobserve(el))
      observer.disconnect()
    }
  }, [itemCount, cardWidth, extendedItemsLength])

  return {
    sectionRef,
    cardWidth,
    cardHeight,
    visibleCards,
  }
}
