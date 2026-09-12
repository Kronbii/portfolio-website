import { homeContent } from '@/content/home'

/**
 * One shape, fed to all four community mock-ups so they can be compared on
 * identical content rather than on whatever each vendor demo shipped with.
 * Sandbox-local on purpose — this folder gets deleted whole.
 */
export interface CommunityEntry {
  id: string
  index: string
  title: string
  tagline: string
  date: string
  href?: string
  image: { src: string; alt: string }
  points: string[]
}

export const communityEntries: CommunityEntry[] = homeContent.community.items.map(
  (item, i) => ({
    id: item.id,
    index: (i + 1).toString().padStart(2, '0'),
    title: item.title,
    tagline: item.tagline,
    date: item.date,
    href: item.link,
    image: item.image,
    points: item.points ?? [],
  })
)

export const communityIntro = {
  eyebrow: homeContent.community.eyebrow,
  title: homeContent.community.title,
  description: homeContent.community.description,
}
