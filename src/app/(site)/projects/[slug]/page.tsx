import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Case } from '@/components/vneo/case'
import { pageMeta } from '@/components/vneo/meta'
import { projectPlate } from '@/content/v2/record'
import { workBySlug, works } from '@/content/v3/work'
import { racePhoto } from '@/content/vneo/site'

/** Imagen's photographs belong to its client: its card stays the site's. */
const PRIVATE_MEDIA = new Set(['imagen-raw-to-edit-dataset-pipeline'])

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
  const plate = projectPlate(w.project)
  return pageMeta({
    path: `/projects/${slug}`,
    title: w.project.metaTitle,
    description: w.project.metaDescription,
    type: 'article',
    image:
      plate && !PRIVATE_MEDIA.has(slug)
        ? { src: racePhoto(plate).src, alt: w.project.title }
        : undefined,
    keywords: w.project.keywords,
  })
}

export default async function VneoProject({ params }: Props) {
  const { slug } = await params
  if (!workBySlug(slug)) notFound()
  return <Case slug={slug} />
}
