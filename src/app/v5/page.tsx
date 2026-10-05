import type { Metadata } from 'next'

import { GroundControl } from '@/components/v5/ground-control'
import { groundProps } from '@/content/v5/ground'
import { v5Copy } from '@/content/v5/mission'

export const metadata: Metadata = {
  title: { absolute: v5Copy.meta.title },
  description: v5Copy.meta.description,
  alternates: { canonical: '/' },
  robots: { index: false, follow: false },
}

export default function V5Home() {
  return <GroundControl {...groundProps()} />
}
