import type { Metadata } from 'next'

import { GroundControl } from '@/components/v5/ground-control'
import { groundProps } from '@/content/v5/ground'

export const metadata: Metadata = {
  title: { absolute: 'Projects — Rami Kronbi (v5 preview)' },
  description: 'Every project Rami Kronbi has published, placed on the mission chart by what it is for.',
  alternates: { canonical: '/projects' },
  robots: { index: false, follow: false },
}

/** The projects live on the chart: the index is the station, opened on its Projects list. */
export default function V5Projects() {
  return <GroundControl {...groundProps()} initialTab="projects" />
}
