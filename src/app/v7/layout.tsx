import type { Metadata } from 'next'
import {
  Bricolage_Grotesque,
  Newsreader,
  Spline_Sans_Mono,
} from 'next/font/google'
import Link from 'next/link'

import { Intro } from '@/components/v2/intro/intro'
import { INTRO_PRELOAD } from '@/components/v2/intro/timing'
import { Lens } from '@/components/v7/lens'
import '@/components/v7/v7.css'
import { V7, v7Chrome } from '@/content/v7/home'

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v7-display',
  axes: ['opsz'],
})
const serif = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v7-serif',
  style: ['italic'],
})
const mono = Spline_Sans_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v7-mono',
})

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

const COOKIE = 'v7-intro'

// The preflight, under its own cookie, landing on #v7-name.
const introScript = `(function(){try{var r=document.currentScript.parentElement;var q=/[?&]intro(?:[=&]|$)/.test(location.search);var home=location.pathname.replace(/\\/$/,'')==='${V7}';var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;var seen=/(?:^|; )${COOKIE}=seen/.test(document.cookie);var on=q||(home&&!rm&&!seen);r.dataset.intro=on?'on':'off';if(on)${JSON.stringify(INTRO_PRELOAD)}.forEach(function(h){var l=document.createElement('link');l.rel='preload';l.as='fetch';l.crossOrigin='anonymous';l.href=h;document.head.appendChild(l)})}catch(e){}})()`

/** /v7 has its own system end to end; only the preflight is shared. */
export default function V7Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-v7=""
      data-intro-root=""
      data-intro-path={V7}
      data-intro-cookie={COOKIE}
      data-intro-name="v7-name"
      data-lenis-prevent=""
      className={`${display.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
      <a className="v7-skip" href="#v7-main">
        {v7Chrome.skip}
      </a>
      <Intro />
      <header className="v7-top">
        <Link href={V7} className="v7-brand">
          <i aria-hidden="true" />
          {v7Chrome.brand}
        </Link>
        <nav className="v7-nav" aria-label="Primary">
          {v7Chrome.nav.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="v7-main">{children}</main>
      <footer className="v7-footer">
        <p>{v7Chrome.footer.note}</p>
        <p>
          <a href="https://ramikronbi.com">{v7Chrome.footer.live}</a>
        </p>
        <p>{v7Chrome.footer.copyright}</p>
      </footer>
      <Lens />
    </div>
  )
}
