import ExpandableCards, {
  type ExpandableCard,
} from '@/components/ui/expandable-cards'

import { communityEntries } from '../community-data'
import { CommunityMockShell } from '../shell'

/** Variant B — Aceternity `expandable-card-demo-standard`, fed real content. */
const cards: ExpandableCard[] = communityEntries.map((entry) => ({
  title: entry.title,
  description: `${entry.date} — ${entry.tagline}`,
  src: entry.image.src,
  ctaText: entry.href ? 'Visit' : 'Details',
  ctaLink: entry.href,
  // A ReactNode, not a function: this page is a server component, and
  // functions cannot be passed across to a client component. The component
  // accepts either.
  content: (
    <ul className="space-y-3">
      {entry.points.map((point) => (
        <li key={point} className="leading-relaxed">
          {point}
        </li>
      ))}
    </ul>
  ),
}))

export default function ExpandableCardsMockPage() {
  return (
    <CommunityMockShell
      variant="Variant B · Expandable cards"
      note="A compact list that expands one item into a centred panel, with the image and title animating between the two states. Good when the detail matters more than the imagery."
    >
      <div className="mt-24 pb-40">
        <ExpandableCards cards={cards} />
      </div>
    </CommunityMockShell>
  )
}
