import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Space_Grotesk } from 'next/font/google'
import StructuredData from '@/components/StructuredData'

const siteUrl = 'https://ramikronbi.com'
const siteName = 'Rami Kronbi'
const siteDescription =
  'Rami Kronbi - AI and Computer Vision Engineer.'

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
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  keywords: [
    'Rami Kronbi',
    'AI Engineer',
    'Computer Vision Engineer',
    'Machine Learning',
    'Deep Learning',
    'Project Manager',
    'TensorFlow',
    'PyTorch',
    'OpenCV',
    'Artificial Intelligence',
    'CV Engineer',
    'ML Engineer',
    'Data Science',
    'Neural Networks',
    'Image Processing',
    'Object Detection',
    'AI Consultant',
    'ML Consultant'
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  applicationName: siteName,
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: `${siteUrl}/`,
    languages: {
      'en-US': `${siteUrl}/`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: `${siteName} | AI & Computer Vision Engineer`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Rami Kronbi - AI & Computer Vision Engineer',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | AI & Computer Vision Engineer`,
    description: siteDescription,
    images: [`${siteUrl}/og-image.jpg`],
    creator: '@kronbii', // Update with your Twitter handle
    site: '@kronbii', // Update with your Twitter handle
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
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  verification: {
    // Add your verification codes here when you get them
    google: 'NYZnC5C68zUWoECvjepE8pdOfwlGSfp6V1siItS1Ss4',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
    // other: {
    //   'facebook-domain-verification': 'your-facebook-verification-code',
    // },
  },
  category: 'Portfolio',
  classification: 'Professional Portfolio',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': siteName,
    'msapplication-TileColor': '#0a0a0a',
    site_name: siteName,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://www.linkedin.com" />

        {/* Additional SEO Meta Tags */}
        <meta name="author" content="Rami Kronbi" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="coverage" content="worldwide" />
        <meta name="target" content="all" />
      </head>
      <body className={`${spaceGrotesk.className} bg-dark-bg text-dark-text antialiased`}>
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.12),_transparent_60%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/15 blur-[200px]" />
          <div className="absolute -bottom-32 right-0 w-[45vw] h-[45vw] bg-accent-500/15 blur-[220px]" />
        </div>
        <StructuredData />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
