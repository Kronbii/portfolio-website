import type { Metadata, Viewport } from 'next'
import './globals.css'
import StructuredData from '@/components/StructuredData'
import { Space_Grotesk } from 'next/font/google'

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
  metadataBase: new URL('https://ramikronbi.com'),
  title: {
    default: 'Rami Kronbi | AI & Computer Vision Engineer | Project Manager',
    template: '%s | Rami Kronbi'
  },
  description:
    'Rami Kronbi - AI and Computer Vision Engineer specializing in machine learning, deep learning, and computer vision solutions. Aspiring Project Manager with expertise in TensorFlow, PyTorch, and OpenCV.',
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
  authors: [{ name: 'Rami Kronbi', url: 'https://ramikronbi.com' }],
  creator: 'Rami Kronbi',
  publisher: 'Rami Kronbi',
  applicationName: 'Rami Kronbi',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://ramikronbi.com/',
    languages: {
      'en-US': 'https://ramikronbi.com/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ramikronbi.com',
    siteName: 'Rami Kronbi',
    title: 'Rami Kronbi | AI & Computer Vision Engineer | Project Manager',
    description:
      'Rami Kronbi - AI and Computer Vision Engineer specializing in machine learning, deep learning, and computer vision solutions. Aspiring Project Manager with expertise in TensorFlow, PyTorch, and OpenCV.',
    images: [
      {
        url: 'https://ramikronbi.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rami Kronbi - AI & Computer Vision Engineer',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rami Kronbi | AI & Computer Vision Engineer | Project Manager',
    description:
      'Rami Kronbi - AI and Computer Vision Engineer specializing in machine learning, deep learning, and computer vision solutions.',
    images: ['https://ramikronbi.com/og-image.jpg'],
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
    google: 'google-site-verification=NYZnC5C68zUWoECvjepE8pdOfwlGSfp6V1siItS1Ss4',
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
    'apple-mobile-web-app-title': 'Rami Kronbi',
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
        <title>Rami Kronbi</title>
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
        <meta name="application-name" content="Rami Kronbi" />
        <meta name="apple-mobile-web-app-title" content="Rami Kronbi" />
        <meta property="og:site_name" content="Rami Kronbi" />
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
