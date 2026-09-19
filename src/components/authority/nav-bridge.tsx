'use client'

import { useEffect } from 'react'

const KNOWN_FRAGMENTS = new Set([
  '#home',
  '#about',
  '#experience',
  '#selected-work',
  '#community',
  '#contact',
])

/**
 * The incumbent site header uses fragment-only hrefs such as `#home` that only
 * work on the homepage. On authority routes those anchors point at nothing on
 * the current page, so they silently do nothing. This bridge rewrites those
 * fragment hrefs to `/#home` etc. after mount, without modifying the header
 * itself and without touching local breadcrumbs or section anchors inside the
 * authority root.
 */
export function AuthorityNavBridge() {
  useEffect(() => {
    const authorityRoot = document.querySelector('main[data-authority-root]')
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
    links.forEach((link) => {
      if (authorityRoot && authorityRoot.contains(link)) return
      const raw = link.getAttribute('href')
      if (!raw || !KNOWN_FRAGMENTS.has(raw)) return
      link.setAttribute('href', `/${raw}`)
    })
  }, [])
  return null
}
