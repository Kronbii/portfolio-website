import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ramikronbi.com'
  const lastModified = new Date()

  const sectionEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#projects`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/#services`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const faviconPaths = [
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/favicon-48x48.png',
    '/apple-touch-icon.png',
    '/icon-192.png',
    '/icon-512.png',
  ]

  const faviconEntries: MetadataRoute.Sitemap = faviconPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.2,
  }))

  return [...sectionEntries, ...faviconEntries]
}
