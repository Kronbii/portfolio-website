import type { Metadata } from 'next'
import { Instrument_Serif, JetBrains_Mono, Manrope } from 'next/font/google'

import { Intro } from '@/components/v2/intro/intro'
import { INTRO_COOKIE, INTRO_PATH, INTRO_PRELOAD } from '@/components/v2/intro/timing'
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

// Also before first paint: the preflight intro plays when a visitor first lands on
// the home page in a browser session (a session cookie, shared across tabs), or on
// ?intro, and never under reduced motion; deep links go straight to their page.
// When it will play, the model and its decoder are requested right away.
const introScript = `(function(){try{var r=document.currentScript.parentElement;var q=/[?&]intro(?:[=&]|$)/.test(location.search);var home=location.pathname.replace(/\\/$/,'')==='${INTRO_PATH}';var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;var seen=/(?:^|; )${INTRO_COOKIE}=seen/.test(document.cookie);var on=q||(home&&!rm&&!seen);r.dataset.intro=on?'on':'off';if(on)${JSON.stringify(INTRO_PRELOAD)}.forEach(function(h){var l=document.createElement('link');l.rel='preload';l.as='fetch';l.crossOrigin='anonymous';l.href=h;document.head.appendChild(l)})}catch(e){}})()`

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
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
      <Intro />
      <Chrome counts={counts} />
      <main id="v2-main">{children}</main>
      <Footer />
    </div>
  )
}
