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

