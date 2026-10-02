import type { Metadata } from 'next'
import { Instrument_Serif, JetBrains_Mono, Manrope } from 'next/font/google'

import { Chrome } from '@/components/v2/shell/chrome'
import { Footer } from '@/components/v2/shell/footer'
import '@/components/v2/v2.css'
import { readyArticles, readyProjects } from '@/content/authority'
import { liveTopics } from '@/content/v2/record'

const sans = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v2-sans',
  weight: ['400', '500', '600', '700', '800'],
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v2-serif',
  weight: '400',
  style: ['normal', 'italic'],
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v2-mono',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

// Runs before first paint so the stored or system theme never flashes.
const themeScript = `(function(){try{var r=document.currentScript.parentElement;var s=localStorage.getItem('v2-theme');r.dataset.theme=(s==='light'||s==='dark')?s:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark')}catch(e){}})()`

export default function V2Layout({ children }: { children: React.ReactNode }) {
  const counts = {
    '/v2/projects': readyProjects.length,
    '/v2/writing': readyArticles.length,
    '/v2/topics': liveTopics.length,
  }

  return (
    <div
      data-v2=""
      data-theme="dark"
      data-lenis-prevent=""
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <Chrome counts={counts} />
      <main id="v2-main">{children}</main>
      <Footer />
    </div>
  )
}
