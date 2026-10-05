import type { Metadata } from 'next'
import { Archivo, Geist_Mono } from 'next/font/google'

import { Intro } from '@/components/v2/intro/intro'
import { Chrome } from '@/components/v3/shell/chrome'
import { LockCursor } from '@/components/v3/shell/cursor'
import { Footer } from '@/components/v3/shell/footer'
import { Lens } from '@/components/v3/shell/lens'
import { PalettePicker } from '@/components/v3/shell/palette-picker'
import { introScript, themeScript } from '@/components/v3/shell/scripts'
import { ThermalFilter } from '@/components/v3/shell/thermal-filter'
import '@/components/v3/v3.css'
import '@/components/v4/v4.css'
import { DEFAULT_PALETTE, paletteCss } from '@/content/v3/palettes'
import { V4, v4Chrome, v4Nav } from '@/content/v4/home'

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

const COOKIE = 'v4-intro'

/*
 * /v4 is /v3's system with motion graphics as its medium, so the root is both:
 * data-v3 brings the tokens, palettes, lens, cursor, and shell; data-v4 what
 * is new. The intro flies here under its own cookie and lands on #v4-name.
 */
export default function V4Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-v3=""
      data-v4=""
      data-intro-root=""
      data-intro-path={V4}
      data-intro-cookie={COOKIE}
      data-intro-name="v4-name"
      data-theme="dark"
      data-palette={DEFAULT_PALETTE}
      data-aberration="strong"
      data-lenis-prevent=""
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <style dangerouslySetInnerHTML={{ __html: paletteCss() }} />
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <script dangerouslySetInnerHTML={{ __html: introScript(V4, COOKIE) }} />
      <ThermalFilter />
      <Intro />
      <Chrome base={V4} nav={v4Nav} preview={v4Chrome.preview} />
      <main id="v3-main">{children}</main>
      <Footer note={v4Chrome.footer} />
      <Lens />
      <LockCursor />
      <PalettePicker />
    </div>
  )
}
