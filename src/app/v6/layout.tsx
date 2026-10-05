import type { Metadata } from 'next'
import { Instrument_Serif, JetBrains_Mono, Manrope } from 'next/font/google'

import { Intro } from '@/components/v2/intro/intro'
import { INTRO_PRELOAD } from '@/components/v2/intro/timing'
import { Chrome } from '@/components/v6/chrome'
import '@/components/v6/scenes.css'
import '@/components/v6/v6.css'
import { V6, v6Chrome } from '@/content/v6/reel'

const display = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v6-display',
})
const serif = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v6-serif',
  weight: '400',
  style: ['italic'],
})
const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v6-mono',
})

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

const COOKIE = 'v6-intro'

// The preflight, under its own cookie, landing on #v6-name.
const introScript = `(function(){try{var r=document.currentScript.parentElement;var q=/[?&]intro(?:[=&]|$)/.test(location.search);var home=location.pathname.replace(/\\/$/,'')==='${V6}';var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;var seen=/(?:^|; )${COOKIE}=seen/.test(document.cookie);var on=q||(home&&!rm&&!seen);r.dataset.intro=on?'on':'off';if(on)${JSON.stringify(INTRO_PRELOAD)}.forEach(function(h){var l=document.createElement('link');l.rel='preload';l.as='fetch';l.crossOrigin='anonymous';l.href=h;document.head.appendChild(l)})}catch(e){}})()`

/** /v6 has its own system end to end; only the preflight is shared. */
export default function V6Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-v6=""
      data-intro-root=""
      data-intro-path={V6}
      data-intro-cookie={COOKIE}
      data-intro-name="v6-name"
      data-lenis-prevent=""
      className={`${display.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
      <a className="v6-skip v6-mono" href="#v6-main">
        {v6Chrome.skip}
      </a>
      <Intro />
      <Chrome />
      <main id="v6-main">{children}</main>
      <footer className="v6-footer v6-mono">
        <p>{v6Chrome.footer.note}</p>
        <p>
          <a href="https://ramikronbi.com">{v6Chrome.footer.live}</a>
        </p>
        <p>{v6Chrome.footer.copyright}</p>
      </footer>
      <div className="v6-grain" aria-hidden="true" />
    </div>
  )
}
