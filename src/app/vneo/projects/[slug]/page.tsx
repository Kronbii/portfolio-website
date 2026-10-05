import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Case } from '@/components/vneo/case'
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
  return {
    title: { absolute: w.project.metaTitle },
    description: w.project.metaDescription,
    alternates: { canonical: `/projects/${slug}` },
    robots: { index: false, follow: false },
  }
}

export default async function VneoProject({ params }: Props) {
  const { slug } = await params
  if (!workBySlug(slug)) notFound()
  return <Case slug={slug} />
}
