import { Calendar, Globe, Radio, Rocket, Telescope } from 'lucide-react'
import Image from 'next/image'
import { type ElementType } from 'react'

import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'

import { communityEntries } from '../community-data'
import { CommunityMockShell } from '../shell'

/**
 * Variant D — Magic UI `bento-grid`.
 *
 * The grid is `auto-rows-[22rem] grid-cols-3`, so spans are assigned per item
 * rather than uniformly — five items into six cells, with the first given the
 * double-width slot so the layout reads as composed rather than as a leftover
 * row.
 */
const icons: ElementType<{ className?: string }>[] = [
  Radio,
  Rocket,
  Globe,
  Calendar,
  Telescope,
]

const spans = [
  'lg:col-span-2',
  'lg:col-span-1',
  'lg:col-span-1',
  'lg:col-span-2',
  'lg:col-span-3',
]

export default function BentoMockPage() {
  return (
    <CommunityMockShell
      variant="Variant D · Bento grid"
      note="Asymmetric tiles at a glance, each with a hover reveal. Densest of the four — the whole section fits on roughly one screen."
      wide
    >
      <div className="mt-24 pb-40">
        <BentoGrid className="grid-cols-1 lg:grid-cols-3">
          {communityEntries.map((entry, index) => (
            <BentoCard
              key={entry.id}
              name={entry.title}
              className={spans[index]}
              Icon={icons[index]}
              description={entry.tagline}
              href={entry.href ?? '#'}
              cta={entry.href ? 'Visit' : 'Details'}
              background={
                <div className="absolute inset-0">
                  <Image
                    src={entry.image.src}
                    alt={entry.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover opacity-40 transition-opacity duration-300 group-hover:opacity-25"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
                </div>
              }
            />
          ))}
        </BentoGrid>
      </div>
    </CommunityMockShell>
  )
}
