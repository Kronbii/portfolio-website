import type { Metadata } from 'next'
import './globals.css'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: {
    default: 'Rami Kronbi | AI & Computer Vision Engineer | Project Manager',
    template: '%s | Rami Kronbi'
  },
  description: 'Portfolio of Rami Kronbi - AI and Computer Vision Engineer specializing in machine learning, deep learning, and computer vision solutions. Aspiring Project Manager with expertise in TensorFlow, PyTorch, and OpenCV.',
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
    'ML Engineer'
  ],
  authors: [{ name: 'Rami Kronbi' }],
  creator: 'Rami Kronbi',
  publisher: 'Rami Kronbi',
  metadataBase: new URL('https://ramikronbi.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ramikronbi.vercel.app',
    siteName: 'Rami Kronbi Portfolio',
    title: 'Rami Kronbi | AI & Computer Vision Engineer | Project Manager',
    description: 'Portfolio of Rami Kronbi - AI and Computer Vision Engineer specializing in machine learning, deep learning, and computer vision solutions.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rami Kronbi - AI & Computer Vision Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rami Kronbi | AI & Computer Vision Engineer | Project Manager',
    description: 'Portfolio of Rami Kronbi - AI and Computer Vision Engineer specializing in machine learning, deep learning, and computer vision solutions.',
    images: ['/og-image.jpg'],
    creator: '@yourtwitter', // Update with your Twitter handle
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
  verification: {
    // Add your verification codes here when you get them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StructuredData />
        {children}
      </body>
    </html>
  )
}

