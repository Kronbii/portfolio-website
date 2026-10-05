import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Dossier } from '@/components/v5/dossier'
import { GroundControl } from '@/components/v5/ground-control'
import { workBySlug, works } from '@/content/v3/work'
import { groundProps } from '@/content/v5/ground'

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
    title: { absolute: `${w.project.metaTitle} (v5 preview)` },
    description: w.project.metaDescription,
    alternates: { canonical: `/projects/${slug}` },
    robots: { index: false, follow: false },
  }
}

/** The station, flown to this project, with its dossier open over the chart. */
export default async function V5Dossier({ params }: Props) {
  const { slug } = await params
  if (!workBySlug(slug)) notFound()
  return <GroundControl {...groundProps()} focus={slug} dossier={<Dossier slug={slug} />} />
}
