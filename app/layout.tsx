import type { Metadata, Viewport } from 'next'
import './globals.css'
import StructuredData from '@/components/StructuredData'

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
    'Portfolio of Rami Kronbi - AI and Computer Vision Engineer specializing in machine learning, deep learning, and computer vision solutions. Aspiring Project Manager with expertise in TensorFlow, PyTorch, and OpenCV.',
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
  applicationName: 'Rami Kronbi Portfolio',
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
    siteName: 'Rami Kronbi Portfolio',
    title: 'Rami Kronbi | AI & Computer Vision Engineer | Project Manager',
    description:
      'Portfolio of Rami Kronbi - AI and Computer Vision Engineer specializing in machine learning, deep learning, and computer vision solutions. Aspiring Project Manager with expertise in TensorFlow, PyTorch, and OpenCV.',
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
      'Portfolio of Rami Kronbi - AI and Computer Vision Engineer specializing in machine learning, deep learning, and computer vision solutions.',
    images: ['https://ramikronbi.com/og-image.jpg'],
    creator: '@yourtwitter', // Update with your Twitter handle
    site: '@yourtwitter', // Update with your Twitter handle
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
    <html lang="en">
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
      <body>
        <StructuredData />
        {children}
      </body>
    </html>
  )
}
