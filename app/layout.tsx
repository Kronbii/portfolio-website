import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Space_Grotesk } from 'next/font/google'
import StructuredData from '@/components/StructuredData'

const siteUrl = 'https://ramikronbi.com'
const siteName = 'Rami Kronbi'
const siteDescription = 'Rami Kronbi - AI and Computer Vision Engineer.'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'Rami Kronbi',
    'AI Engineer',
    'Computer Vision Engineer',
    'Machine Learning',
    'Deep Learning',
    'TensorFlow',
    'PyTorch',
    'OpenCV',
    'Artificial Intelligence',
    'Data Science',
    'Neural Networks',
    'Image Processing',
    'Object Detection',
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: `${siteUrl}/`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName,
    url: siteUrl,
    title: `${siteName} | AI & Computer Vision Engineer`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${siteName} - AI & Computer Vision Engineer`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | AI & Computer Vision Engineer`,
    description: siteDescription,
    images: [`${siteUrl}/og-image.jpg`],
    creator: '@kronbii',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'NYZnC5C68zUWoECvjepE8pdOfwlGSfp6V1siItS1Ss4',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* REQUIRED FIX: Correct Website Identity Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Rami Kronbi',
              alternateName: 'RamiKronbi',
              url: 'https://ramikronbi.com/',
            }),
          }}
        />

        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Basic */}
        <meta name="author" content="Rami Kronbi" />
        <meta name="language" content="English" />
      </head>

      <body
        className={`${spaceGrotesk.className} bg-dark-bg text-dark-text antialiased`}
      >
        <StructuredData />

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
