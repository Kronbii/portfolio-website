'use client'

import { ArrowUpRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

/** The live counterpart of the current /v2 page. */
export function LiveLink({ className, label }: { className?: string; label: string }) {
  const pathname = usePathname()
  const live = pathname.replace(/^\/v2/, '') || '/'
  return (
    <a className={className} href={live}>
      {label}
      <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
    </a>
  )
}
