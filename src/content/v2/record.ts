/**
 * Read-only views over the authority content layer for the /v2 preview.
 * Numbering follows the order records already have in the content files, so
 * an entry number is stable and can be cited from anywhere ("No. 07").
 */

import {
  articles,
  getArticle,
  getProject,
  projects,
  readyArticles,
  readyProjects,
  topics,
  type ArticleRecord,
  type AuthorityMedia,
  type AuthoritySource,
  type ProjectRecord,
} from '@/content/authority'
import { isRenderable } from '@/content/authority/visibility'

import { articleEmphasis, projectEmphasis, topicEmphasis } from './emphasis'
import { mediaSize } from './media-size'

export const V2 = '/v2'

const pad = (n: number) => String(n).padStart(2, '0')

export function projectNumber(slug: string): string {
  const ready = readyProjects.findIndex((p) => p.slug === slug)
  if (ready >= 0) return `No. ${pad(ready + 1)}`
  const review = projects.filter((p) => p.state === 'review').findIndex((p) => p.slug === slug)
  return `R. ${pad(review + 1)}`
}

export function noteNumber(slug: string): string {
  const ready = readyArticles.findIndex((a) => a.slug === slug)
  if (ready >= 0) return `N. ${pad(ready + 1)}`
  const review = articles.filter((a) => a.state === 'review').findIndex((a) => a.slug === slug)
  return `R. ${pad(review + 1)}`
}

export const projectHref = (slug: string) => `${V2}/projects/${slug}`
export const noteHref = (slug: string) => `${V2}/writing/${slug}`
export const topicHref = (slug: string) => `${V2}/topics/${slug}`

export const projectTitle = (p: ProjectRecord) => ({ text: p.title, emphasis: projectEmphasis[p.slug] })
export const noteTitle = (a: ArticleRecord) => ({ text: a.title, emphasis: articleEmphasis[a.slug] })
export const topicTitle = (slug: string) => {
  const t = topics.find((x) => x.slug === slug)
  return { text: t?.title ?? slug, emphasis: topicEmphasis[slug] }
}

/** Every image the record carries, hero first. */
export function projectImages(p: ProjectRecord): AuthorityMedia[] {
  const hero =
    p.hero.kind === 'image' ? [p.hero.media] : p.hero.kind === 'gallery' ? p.hero.items : []
  const rest = (p.media ?? []).filter((m) => !hero.some((h) => h.src === m.src))
  return [...hero, ...rest]
}

export function projectPlate(p: ProjectRecord, src?: string): AuthorityMedia | undefined {
  const all = projectImages(p)
  if (src) return all.find((m) => m.src === src) ?? all[0]
  return all[0]
}

/** Hero framing: keep wide images whole; sit tall ones on the page inside a landscape frame. */
export function heroFrame(src: string): { ratio?: string; fit?: 'contain' } {
  const [w, h] = mediaSize[src] ?? [16, 10]
  return w / h >= 1.5 ? {} : { ratio: '16 / 9', fit: 'contain' }
}

export function primarySource(p: { sources: AuthoritySource[] }): AuthoritySource | undefined {
  return (
    p.sources.find((s) => s.kind === 'repository') ??
    p.sources.find((s) => s.kind === 'demo') ??
    p.sources[0]
  )
}

export function companionNote(p: ProjectRecord): ArticleRecord | undefined {
  const a = getArticle(p.articleSlug)
  return a && a.state === 'ready' ? a : undefined
}

export function companionProject(a: ArticleRecord): ProjectRecord | undefined {
  const p = a.projectSlug ? getProject(a.projectSlug) : undefined
  return p && p.state === 'ready' ? p : undefined
}

export function topicCounts(slug: string) {
  return {
    projects: readyProjects.filter((p) => p.topics.includes(slug)).length,
    notes: readyArticles.filter((a) => a.topics.includes(slug)).length,
  }
}

/** Topic hubs render only with at least two ready items (the live rule). */
export const liveTopics = topics.filter((t) => {
  const c = topicCounts(t.slug)
  return c.projects + c.notes >= 2
})

const liveTopicSlugs = new Set(liveTopics.map((t) => t.slug))

/** Only methods with a live hub are shown or linked; the rest are internal keywords. */
export const filedTopics = (slugs: string[]) => slugs.filter((s) => liveTopicSlugs.has(s))

export function hostOf(href: string): string {
  try {
    return new URL(href).host.replace(/^www\./, '')
  } catch {
    return href
  }
}

export const renderableProjects = projects.filter((p) => isRenderable(p.state))
export const renderableArticles = articles.filter((a) => isRenderable(a.state))

export const sourceKindLabel: Record<AuthoritySource['kind'], string> = {
  repository: 'Repository',
  demo: 'Demo',
  documentation: 'Docs',
  article: 'Article',
  institution: 'Institution',
  listing: 'Listing',
  cv: 'CV',
  video: 'Video',
}
