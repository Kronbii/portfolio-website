import { lineupEntries } from './lineup-data'
import { StickyLineup } from './sticky-lineup'

export default function StickyLineupSandboxPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <section className="mx-auto w-full max-w-[90rem] px-5 pb-40 pt-40 sm:px-8">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
          Pattern test — sticky lineup
        </p>
        <h2 className="mt-6 max-w-[18ch] text-5xl leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
          The Lineup
        </h2>
        <p className="mt-8 max-w-[52ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
          Scroll. The image on the left pins while you read its paragraph, then
          releases as the next one slides up over it. Pure CSS sticky — the only
          JavaScript is a height sync that keeps each image paired to its text.
        </p>

        <div className="mt-32">
          <StickyLineup entries={lineupEntries} />
        </div>
      </section>

      {/* Tail space, so the last pair has somewhere to release into. */}
      <div className="h-[60svh]" />
    </main>
  )
}
