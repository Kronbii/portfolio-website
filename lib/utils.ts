import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get fallback image path for WebP images
 * Converts .webp to .jpg, .jpeg, or .png based on original format
 */
export function getFallbackImage(webpPath: string): string {
  // Map of WebP images to their original formats
  const fallbackMap: { [key: string]: string } = {
    '/profile.webp': '/profile.jpg',
    '/projects/nasa-space-apps.webp': '/projects/nasa-space-apps.jpeg',
    '/projects/nasna.webp': '/projects/nasna.jpeg',
    '/projects/physics-day-1.webp': '/projects/physics-day-1.jpg',
    '/projects/physics-day-2.webp': '/projects/physics-day-2.jpg',
    '/projects/thermal-sr.webp': '/projects/thermal-sr.png',
    '/projects/race-car.webp': '/projects/race-car.png',
    '/projects/smart-desk.webp': '/projects/smart-desk.png',
    '/projects/project1.webp': '/projects/project1.jpg',
    '/projects/project2.webp': '/projects/project2.jpg',
    '/projects/project3.webp': '/projects/project3.jpg',
    '/og-image.webp': '/og-image.jpg',
  }
  
  return fallbackMap[webpPath] || webpPath.replace('.webp', '.jpg')
}

/**
 * Section width configuration
 * Base width for large screens (desktop)
 * On smaller screens, width increases dynamically
 */
export const SECTION_WIDTH = '76%'

/**
 * Responsive section width configuration
 * Adjust these values to control how aggressively sections scale with screen size
 */
const SECTION_WIDTH_CONFIG = {
  // Base width on large screens (desktop)
  desktopWidth: 76, // percentage
  
  // Maximum width on small screens (mobile)
  mobileWidth: 100, // percentage
  
  // Viewport breakpoints where scaling happens
  startScalingAt: 1400, // pixels - width starts increasing below this
  stopScalingAt: 900,   // pixels - width stops increasing below this (reduced from 768 for more aggressive scaling)
  
  // Scaling aggressiveness (optional override)
  // Higher = more aggressive scaling, Lower = gentler scaling
  // If not set, calculated automatically from the above values
  // Setting a higher value here makes scaling more aggressive
  scalingFactor: 0.05, // More aggressive: changes ~5% per 100px of viewport
}

/**
 * Get the section width style object
 * Returns inline styles for section width with centering
 * Width is responsive: wider on small screens, narrower on large screens
 * This approach works reliably regardless of Tailwind's JIT detection
 */
/**
 * Get standard section background and border styles using CSS variables
 */
export function getSectionStyle(): React.CSSProperties {
  return {
    backgroundColor: 'transparent',
    borderColor: 'rgba(33, 33, 33, 0.2)', // var(--color-border) with 30% opacity
  }
}

/**
 * Card carousel opacity configuration
 * Controls the opacity of non-visible cards in carousels
 */
export const CARD_CAROUSEL_OPACITY = {
  visible: 1,      // Opacity for visible/centered cards
  hidden: 0.05,   // Opacity for non-visible cards (change this value to adjust)
}

export function getSectionWidthStyle(): React.CSSProperties {
  const { desktopWidth, mobileWidth, startScalingAt, stopScalingAt, scalingFactor } = SECTION_WIDTH_CONFIG
  
  // Calculate the width difference and viewport range
  const widthDifference = mobileWidth - desktopWidth // e.g., 95 - 76 = 19
  const viewportRange = startScalingAt - stopScalingAt // e.g., 1200 - 768 = 432
  
  // Use provided scaling factor or calculate from width difference
  // The scaling factor controls how much width changes per pixel of viewport change
  const factor = scalingFactor ?? (widthDifference / viewportRange) // e.g., 19 / 432 = 0.044
  
  // Responsive width calculation:
  // - On screens >= startScalingAt: desktopWidth% (base)
  // - Between stopScalingAt and startScalingAt: smoothly increases from desktopWidth% to mobileWidth%
  // - On screens < stopScalingAt: mobileWidth% (maximum)
  // Formula: start at desktopWidth%, add more as screen gets smaller
  const width = `clamp(${desktopWidth}%, calc(${desktopWidth}% + (${startScalingAt}px - 100vw) * ${factor}), ${mobileWidth}%)`
  
  return {
    width,
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}

/**
 * Get the section max width style object
 * Returns inline styles for max section width with centering
 * Useful for elements that should not exceed section width but can be smaller
 */
export function getSectionMaxWidthStyle(): React.CSSProperties {
  return {
    maxWidth: SECTION_WIDTH,
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}

/**
 * Section header style configuration
 * Returns className and style for consistent section headers (h2 elements)
 * Change these values to update all section headers across the website
 */
export function getSectionHeaderStyle(): {
  className: string
  style: React.CSSProperties
} {
  return {
    className: 'font-medium tracking-tight',
    style: {
      color: 'var(--color-secondary)',
      fontSize: 'clamp(28px, 4vw, 46px)',
    },
  }
}

/**
 * Section subtitle style configuration (h3)
 * Returns className and style for consistent section subtitles
 * Space Grotesk, 26px on desktop/iPad, smaller on mobile, light weight
 */
export function getSectionSubtitleStyle(): {
  className: string
  style: React.CSSProperties
} {
  return {
    className: 'font-light mb-4 mt-1',
    style: {
      color: 'var(--color-secondary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'clamp(18px, 3.5vw, 26px)',
    },
  }
}

/**
 * Section subheading style configuration
 * Returns className and style for consistent section subheadings (description text below headers)
 * Change these values to update all section subheadings across the website
 */
export function getSectionSubheadingStyle(): {
  className: string
  style: React.CSSProperties
} {
  return {
    className: 'font-light max-w-2xl mx-auto',
    style: {
      color: 'var(--color-secondary)',
      fontSize: 'clamp(18px, 3vw, 26px)',
    },
  }
}

/**
 * Get the section width className (for backward compatibility)
 * Note: This may not work with all percentage values due to Tailwind JIT
 * Consider using getSectionWidthStyle() instead for more reliable results
 */
export function getSectionWidthClass(): string {
  return `mx-auto`
}
