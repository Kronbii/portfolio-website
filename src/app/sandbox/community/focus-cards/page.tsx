import { FocusCards } from '@/components/ui/focus-cards'

import { communityEntries } from '../community-data'
import { CommunityMockShell } from '../shell'

/** Variant C — Aceternity `focus-cards`: hovering one blurs the rest. */
const cards = communityEntries.map((entry) => ({
  title: entry.title,
  src: entry.image.src,
}))

export default function FocusCardsMockPage() {
  return (
    <CommunityMockShell
      variant="Variant C · Focus cards"
      note="A grid where hovering one card blurs and shrinks the others. Quietest of the four, and the only one that shows everything at once."
      wide
    >
      <div className="mt-24 pb-40">
        <FocusCards cards={cards} />
      </div>
    </CommunityMockShell>
  )
}
