import { useRef, useState, useEffect, useCallback } from 'react'

interface UseInfiniteCarouselOptions {
  itemCount: number
}

interface UseInfiniteCarouselReturn<T> {
  scrollContainerRef: React.RefObject<HTMLDivElement>
  cardsRef: React.MutableRefObject<(HTMLDivElement | null)[]>
  currentIndex: number
  actualIndex: number
  extendedItems: T[]
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: () => void
  handleScrollLeft: () => void
  handleScrollRight: () => void
  scrollToIndex: (index: number, instant?: boolean) => void
  getActualIndex: (index: number) => number
}

export function useInfiniteCarousel<T>(
  items: T[],
  options: UseInfiniteCarouselOptions
): UseInfiniteCarouselReturn<T> {
  const { itemCount } = options
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndexRef = useRef<number>(0)
  const touchStartRef = useRef<number>(0)
  const touchEndRef = useRef<number>(0)
  const isAnimatingRef = useRef(false)

  // Create infinite loop by tripling the items
  const extendedItems = [...items, ...items, ...items]

  // Get the actual index in the original array
  const getActualIndex = useCallback((index: number) => {
    return ((index % itemCount) + itemCount) % itemCount
  }, [itemCount])

  // Get the actual index in the original array for pagination dots
  const actualIndex = ((currentIndex % itemCount) + itemCount) % itemCount

  const updateCurrentIndex = useCallback(() => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    
    // Find which card is closest to the center of the viewport
    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2
    
    let closestIndex = 0
    let closestDistance = Infinity
    
    cardsRef.current.forEach((card, index) => {
      if (!card) return
      const cardRect = card.getBoundingClientRect()
      const cardCenter = cardRect.left + cardRect.width / 2
      const distance = Math.abs(containerCenter - cardCenter)
      
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })
    
    setCurrentIndex(closestIndex)
    currentIndexRef.current = closestIndex
  }, [])

  const scrollToIndex = useCallback((index: number, instant = false) => {
    const container = scrollContainerRef.current
    const targetCard = cardsRef.current[index]
    if (!container || !targetCard) return
    
    const containerRect = container.getBoundingClientRect()
    const cardRect = targetCard.getBoundingClientRect()
    
    // Calculate scroll position to center the card
    const cardCenter = targetCard.offsetLeft + cardRect.width / 2
    const containerCenter = containerRect.width / 2
    const scrollPosition = cardCenter - containerCenter
    
    container.scrollTo({
      left: scrollPosition,
      behavior: instant ? 'instant' : 'smooth',
    })
    
    setCurrentIndex(index)
    currentIndexRef.current = index
  }, [])

  const navigateLeft = useCallback(() => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    
    const container = scrollContainerRef.current
    if (!container) {
      isAnimatingRef.current = false
      return
    }
    
    const idx = currentIndexRef.current
    // If we're at or near the start of middle set, instantly jump to end of middle set first
    if (idx <= itemCount) {
      const jumpToIndex = idx + itemCount
      scrollToIndex(jumpToIndex, true)
      
      requestAnimationFrame(() => {
        scrollToIndex(jumpToIndex - 1)
        setTimeout(() => { isAnimatingRef.current = false }, 400)
      })
    } else {
      scrollToIndex(idx - 1)
      setTimeout(() => { isAnimatingRef.current = false }, 400)
    }
  }, [itemCount, scrollToIndex])

  const navigateRight = useCallback(() => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    
    const container = scrollContainerRef.current
    if (!container) {
      isAnimatingRef.current = false
      return
    }
    
    const idx = currentIndexRef.current
    // If we're at or near the end of middle set, instantly jump to start of middle set first
    if (idx >= itemCount * 2 - 1) {
      const jumpToIndex = idx - itemCount
      scrollToIndex(jumpToIndex, true)
      
      requestAnimationFrame(() => {
        scrollToIndex(jumpToIndex + 1)
        setTimeout(() => { isAnimatingRef.current = false }, 400)
      })
    } else {
      scrollToIndex(idx + 1)
      setTimeout(() => { isAnimatingRef.current = false }, 400)
    }
  }, [itemCount, scrollToIndex])

  // Handle touch events for swipe detection
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
    touchEndRef.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndRef.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (isAnimatingRef.current) return
    
    const swipeDistance = touchStartRef.current - touchEndRef.current
    const minSwipeDistance = 50 // Minimum swipe distance to trigger navigation
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped left = go right (next)
        navigateRight()
      } else {
        // Swiped right = go left (previous)
        navigateLeft()
      }
    }
  }, [navigateLeft, navigateRight])

  const handleScrollLeft = useCallback(() => {
    navigateLeft()
  }, [navigateLeft])

  const handleScrollRight = useCallback(() => {
    navigateRight()
  }, [navigateRight])

  // Initialize scroll to middle set (start at first card of middle set)
  useEffect(() => {
    if (!scrollContainerRef.current || cardsRef.current.length === 0) return
    
    const timer = setTimeout(() => {
      const container = scrollContainerRef.current
      const startIndex = itemCount // First card of middle set
      const startCard = cardsRef.current[startIndex]
      if (!container || !startCard) return
      
      // Scroll to the middle set without animation
      const cardCenter = startCard.offsetLeft + startCard.offsetWidth / 2
      const containerCenter = container.offsetWidth / 2
      container.scrollLeft = cardCenter - containerCenter
      setCurrentIndex(startIndex)
      currentIndexRef.current = startIndex
    }, 150)

    return () => clearTimeout(timer)
  }, [itemCount])

  // Handle horizontal wheel scrolling to trigger navigation
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let wheelTimeout: NodeJS.Timeout | null = null
    let accumulatedDelta = 0
    const threshold = 50 // Minimum scroll delta to trigger navigation

    const handleWheel = (e: WheelEvent) => {
      // Only handle horizontal scrolling (deltaX)
      // Ignore vertical scrolling (deltaY) - let it scroll the page normally
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault()
        e.stopPropagation()
        
        accumulatedDelta += e.deltaX
        
        // Clear any pending timeout
        if (wheelTimeout) {
          clearTimeout(wheelTimeout)
        }
        
        // Debounce and trigger navigation after scroll stops
        wheelTimeout = setTimeout(() => {
          if (isAnimatingRef.current) {
            accumulatedDelta = 0
            return
          }
          
          if (Math.abs(accumulatedDelta) > threshold) {
            if (accumulatedDelta > 0) {
              // Scrolled right = go to next card
              navigateRight()
            } else {
              // Scrolled left = go to previous card
              navigateLeft()
            }
          }
          
          accumulatedDelta = 0
        }, 150)
      }
      // If it's vertical scrolling, don't prevent default - let page scroll normally
    }

    // Update current index on scroll (for button/touch navigation)
    const handleScroll = () => {
      if (isAnimatingRef.current) return
      updateCurrentIndex()
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('scroll', handleScroll, { passive: true })
    updateCurrentIndex()
    window.addEventListener('resize', updateCurrentIndex)

    return () => {
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateCurrentIndex)
    }
  }, [itemCount, navigateLeft, navigateRight, updateCurrentIndex])

  return {
    scrollContainerRef,
    cardsRef,
    currentIndex,
    actualIndex,
    extendedItems,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleScrollLeft,
    handleScrollRight,
    scrollToIndex,
    getActualIndex,
  }
}

