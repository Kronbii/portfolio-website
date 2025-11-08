import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rami Kronbi | AI & CV Engineer | Project Manager',
  description: 'Portfolio website of Rami Kronbi - AI and Computer Vision Engineer and aspiring Project Manager',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

