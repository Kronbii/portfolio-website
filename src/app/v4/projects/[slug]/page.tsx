import type { Metadata } from 'next'

import { v2Meta } from '@/components/v2/schema'
import { CaseStudy } from '@/components/v3/work/case-study'
import { CaseExplainer } from '@/components/v4/work/case-explainer'
import { workBySlug, works } from '@/content/v3/work'
import { V4, v4Home } from '@/content/v4/home'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const w = workBySlug(slug)
  if (!w) return { title: 'Not found', robots: { index: false, follow: false } }
  return v2Meta(`/projects/${slug}`, `${w.project.metaTitle} (v4 preview)`, w.project.metaDescription)
}

/** v3's case page, opening on the project's motion explainer where it has one. */
export default async function V4Case({ params }: Props) {
  const { slug } = await params
  // the projects with an explainer are the ones the work reel lists (a client module's
  // registry cannot be read from here)
  const shows = v4Home.work.items.find((i) => i.slug === slug)?.shows
  const motion = shows ? <CaseExplainer slug={slug} shows={shows} /> : undefined
  return <CaseStudy slug={slug} base={V4} motion={motion} />
}
