import type { Metadata } from 'next'

import { siteConfig } from '@/lib/site'

/** The site's sharing card: the emblem and the name, in Sage. */
export const CARD = {
  src: '/images/vneo/og.jpg',
  alt: 'Rami Kronbi, robotics, embedded & systems engineer: the Rā’ emblem and his name, in sage on dark.',
}

/**
 * A page's metadata: its own title and description, its canonical URL on
 * ramikronbi.com, and the same for sharing cards, whose image is the site's
 * card unless the page has its own.
 */
export function pageMeta({
  path,
  title,
  description,
  type = 'website',
  image,
  keywords,
}: {
  path: string
  title: string
  description: string
  type?: 'website' | 'article'
  image?: { src: string; alt: string }
  keywords?: string[]
}): Metadata {
  const url = `${siteConfig.url}${path === '/' ? '' : path}`
  const card = image ?? CARD
  const images = [
    {
      url: `${siteConfig.url}${card.src}`,
      alt: card.alt,
      ...(image ? {} : { width: 1200, height: 630 }),
    },
  ]
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    keywords,
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: siteConfig.name,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((i) => i.url),
    },
  }
}
