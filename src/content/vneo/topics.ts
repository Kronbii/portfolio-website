/**
 * Topic hubs: the projects and notes behind each field. A hub stands only
 * with at least two ready items behind it (the editorial rule the GEO pages
 * set), and links only to pages the site has.
 */

import { readyArticles, readyProjects, topics } from '@/content/authority'
import { workBySlug } from '@/content/v3/work'

export const hubProjects = (slug: string) =>
  readyProjects.filter((p) => p.topics.includes(slug) && workBySlug(p.slug))
export const hubArticles = (slug: string) =>
  readyArticles.filter((a) => a.topics.includes(slug))
export const hubs = topics.filter(
  (t) => hubProjects(t.slug).length + hubArticles(t.slug).length >= 2
)
export const topicHref = (slug: string) => `/topics/${slug}`
