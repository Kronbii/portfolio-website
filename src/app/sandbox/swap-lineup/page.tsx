import Image from 'next/image'

import { StickyScroll, type StickyScrollItem } from '@/components/ui/sticky-scroll-reveal'

import { lineupEntries } from '../sticky-lineup/lineup-data'

const items: StickyScrollItem[] = lineupEntries.map((entry) => ({
  title: entry.title,
  eyebrow: entry.kicker,
  description: entry.body,
  meta: entry.specs,
  content: (
    <Image
      src={entry.image.src}
      alt={entry.image.alt}
      fill
      sizes="(max-width: 1024px) 100vw, 42vw"
      className="object-cover"
      priority
    />
  ),
}))

export default function SwapLineupSandboxPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <section className="mx-auto w-full max-w-[90rem] px-5 pb-40 pt-40 sm:px-8">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
          Pattern test — swap variant
        </p>
        <h2 className="mt-6 max-w-[18ch] text-5xl leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
          Selected Work
        </h2>
        <p className="mt-8 max-w-[52ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
          The frame never moves. Each image crossfades into the same rectangle
          as its paragraph takes over. Aceternity&rsquo;s sticky-scroll-reveal,
          rewired to page scroll.
        </p>

        <div className="mt-32">
          <StickyScroll content={items} />
        </div>
      </section>

      <div className="h-[40svh]" />
    </main>
  )
}
