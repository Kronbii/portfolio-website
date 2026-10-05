import type { Metadata } from 'next'
import { Barlow, Barlow_Condensed, Martian_Mono } from 'next/font/google'

import { Intro } from '@/components/v2/intro/intro'
import { INTRO_PRELOAD } from '@/components/v2/intro/timing'
import '@/components/v5/v5.css'
import { V5 } from '@/content/v5/mission'

const display = Barlow_Condensed({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v5-display',
  weight: ['500', '600', '700', '800'],
})
const text = Barlow({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v5-text',
  weight: ['400', '500', '600', '700'],
})
const mono = Martian_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v5-mono',
  axes: ['wdth'],
})

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

const COOKIE = 'v5-intro'

// Day or night chart, stored or from the system, before first paint.
const themeScript = `(function(){try{var r=document.currentScript.parentElement;var s=localStorage.getItem('v5-theme');r.dataset.theme=(s==='day'||s==='night')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'night':'day')}catch(e){}})()`

// The preflight, under its own cookie, landing on #v5-name.
const introScript = `(function(){try{var r=document.currentScript.parentElement;var q=/[?&]intro(?:[=&]|$)/.test(location.search);var home=location.pathname.replace(/\\/$/,'')==='${V5}';var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;var seen=/(?:^|; )${COOKIE}=seen/.test(document.cookie);var on=q||(home&&!rm&&!seen);r.dataset.intro=on?'on':'off';if(on)${JSON.stringify(INTRO_PRELOAD)}.forEach(function(h){var l=document.createElement('link');l.rel='preload';l.as='fetch';l.crossOrigin='anonymous';l.href=h;document.head.appendChild(l)})}catch(e){}})()`

/** /v5 has its own system end to end; only the preflight is shared. */
export default function V5Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-v5=""
      data-intro-root=""
      data-intro-path={V5}
      data-intro-cookie={COOKIE}
      data-intro-name="v5-name"
      data-theme="day"
      data-lenis-prevent=""
      className={`${display.variable} ${text.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
      <Intro />
      {children}
    </div>
  )
}
