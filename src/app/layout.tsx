import type { Metadata, Viewport } from 'next'
import { Zalando_Sans } from 'next/font/google'

import { StructuredData } from '@/components/structured-data'
import { siteConfig } from '@/lib/site'
import '@/styles/globals.css'

const zalandoSans = Zalando_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-zalando',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f3efe8',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: '/images/shared/og-image.jpg',
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/images/shared/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/icons/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icons/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      { rel: 'icon', url: '/icons/icon-192.png', sizes: '192x192' },
      { rel: 'icon', url: '/icons/icon-512.png', sizes: '512x512' },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${zalandoSans.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body>
        <StructuredData />
        <div className="min-h-screen bg-background text-foreground">{children}</div>
      </body>
    </html>
  )
}
