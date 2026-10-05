import type { Metadata } from 'next'

import { v2Meta } from '@/components/v2/schema'
import { CaseStudy } from '@/components/v3/work/case-study'
import { workBySlug, works } from '@/content/v3/work'

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
  return v2Meta(`/projects/${slug}`, `${w.project.metaTitle} (v3 preview)`, w.project.metaDescription)
}

export default async function V3Case({ params }: Props) {
  const { slug } = await params
  return <CaseStudy slug={slug} />
}
