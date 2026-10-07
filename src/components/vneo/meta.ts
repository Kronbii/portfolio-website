import type { Metadata } from 'next'

import { siteConfig } from '@/lib/site'

/** The site's sharing card: Rami's portrait beside the emblem and his name, in Sage. */
export const CARD = {
  src: '/images/vneo/rami-kronbi-card.jpg',
  alt: 'Rami Kronbi in profile beside his name and the Rā’ emblem: robotics, embedded & systems engineer.',
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
    alternates: {
      canonical: path,
      types: {
        'application/rss+xml': [
          { url: '/feed.xml', title: `Writing — ${siteConfig.name}` },
        ],
      },
    },
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
