import { ScrollExpand } from '@/components/ui/scroll-expand/ScrollExpand'

import { communityEntries } from '../community-data'
import { CommunityMockShell } from '../shell'

/**
 * Variant A — React Bits `ScrollExpand`, chained.
 *
 * The component expands one media frame from a rounded inset to full bleed as
 * it scrolls. `useWindowScroll` drives it from the page rather than its own
 * nested scroller, so stacking one per item gives the sequential behaviour:
 * the first frame opens, holds, then the next takes over.
 */
export default function ScrollExpandMockPage() {
  return (
    <CommunityMockShell
      variant="Variant A · Scroll to expand"
      note="Each item opens from a small frame to full bleed as you scroll, then hands over to the next. Scroll distance per item is tunable."
      wide
    >
      <div className="mt-24">
        {communityEntries.map((entry, index) => (
          <ScrollExpand
            key={entry.id}
            useWindowScroll
            src={entry.image.src}
            alt={entry.image.alt}
            title={entry.title}
            scrollHint={index === 0 ? 'Scroll' : ''}
            startWidth={46}
            startHeight={62}
            startRadius={2}
            endRadius={0}
            scrollDistance={1}
            holdDistance={0.35}
            overlayScrim={0.6}
            className="h-svh"
          >
            <div className="mx-auto max-w-2xl">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/70">
                {entry.index} — {entry.date}
              </p>
              <h3 className="mt-5 text-4xl leading-[0.95] tracking-tight text-white sm:text-5xl">
                {entry.title}
              </h3>
              <p className="mx-auto mt-6 max-w-[46ch] text-sm leading-[1.7] text-white/80 sm:text-base">
                {entry.tagline}
              </p>
              {entry.href ? (
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-block border-b border-white/40 pb-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white"
                >
                  Visit
                </a>
              ) : null}
            </div>
          </ScrollExpand>
        ))}
      </div>
      <div className="h-[20svh]" />
    </CommunityMockShell>
  )
}
