import type { Metadata } from 'next'
import { Archivo, Geist_Mono } from 'next/font/google'

import { Intro } from '@/components/v2/intro/intro'
import { INTRO_PRELOAD } from '@/components/v2/intro/timing'
import { Chrome } from '@/components/v3/shell/chrome'
import { LockCursor } from '@/components/v3/shell/cursor'
import { Footer } from '@/components/v3/shell/footer'
import { Lens } from '@/components/v3/shell/lens'
import { PalettePicker } from '@/components/v3/shell/palette-picker'
import { ThermalFilter } from '@/components/v3/shell/thermal-filter'
import '@/components/v3/v3.css'
import { DEFAULT_PALETTE, paletteCss, paletteIds } from '@/content/v3/palettes'

const sans = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v3-sans',
  axes: ['wdth'],
})

const mono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-v3-mono',
})

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

const PATH = '/v3'
const COOKIE = 'v3-intro'

// Runs before first paint so the stored or system theme, and the chosen colour
// option (?palette=<id> first, then this device's last pick), never flash.
const themeScript = `(function(){try{var r=document.currentScript.parentElement;var s=localStorage.getItem('v3-theme');r.dataset.theme=(s==='light'||s==='dark')?s:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');var ids=${JSON.stringify(paletteIds)};var q=(location.search.match(/[?&]palette=([a-z]+)/)||[])[1];if(q&&ids.indexOf(q)>=0){localStorage.setItem('v3-palette',q)}var p=q&&ids.indexOf(q)>=0?q:localStorage.getItem('v3-palette');if(p&&ids.indexOf(p)>=0)r.dataset.palette=p;var ab=localStorage.getItem('v3-aberration');if(['off','subtle','strong','wild'].indexOf(ab)>=0)r.dataset.aberration=ab}catch(e){}})()`

// The /v2 preflight, flown here under its own cookie: it plays when a visitor
// first lands on /v3 in a browser session, or on ?intro, never under reduced
// motion, and the model is requested at once when it will.
const introScript = `(function(){try{var r=document.currentScript.parentElement;var q=/[?&]intro(?:[=&]|$)/.test(location.search);var home=location.pathname.replace(/\\/$/,'')==='${PATH}';var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;var seen=/(?:^|; )${COOKIE}=seen/.test(document.cookie);var on=q||(home&&!rm&&!seen);r.dataset.intro=on?'on':'off';if(on)${JSON.stringify(INTRO_PRELOAD)}.forEach(function(h){var l=document.createElement('link');l.rel='preload';l.as='fetch';l.crossOrigin='anonymous';l.href=h;document.head.appendChild(l)})}catch(e){}})()`

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-v3=""
      data-intro-root=""
      data-intro-path={PATH}
      data-intro-cookie={COOKIE}
      data-intro-name="v3-name"
      data-theme="dark"
      data-palette={DEFAULT_PALETTE}
      data-aberration="strong"
      data-lenis-prevent=""
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <style dangerouslySetInnerHTML={{ __html: paletteCss() }} />
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
      <ThermalFilter />
      <Intro />
      <Chrome />
      <main id="v3-main">{children}</main>
      <Footer />
      <Lens />
      <LockCursor />
      <PalettePicker />
    </div>
  )
}
