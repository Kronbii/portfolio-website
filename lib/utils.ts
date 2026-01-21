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
 * Change this value to update the width of all sections across the website
 * Value should be a percentage (e.g., '70%', '80%', '90%')
 */
export const SECTION_WIDTH = '76%'

/**
 * Get the section width style object
 * Returns inline styles for section width with centering
 * This approach works reliably regardless of Tailwind's JIT detection
 */
export function getSectionWidthStyle(): React.CSSProperties {
  return {
    width: SECTION_WIDTH,
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
    className: 'text-[#252525] font-medium',
    style: {
      fontSize: 'clamp(28px, 4vw, 46px)',
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
    className: 'text-[#252525] font-light max-w-2xl mx-auto',
    style: {
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
