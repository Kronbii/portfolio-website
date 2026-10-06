'use client'

import { useEffect, useState } from 'react'

import styles from './article.module.css'

interface MarginTocProps {
  label: string
  items: { id: string; text: string }[]
}

/** The notebook's margin index: the section you are reading stays marked. */
export function MarginToc({ label, items }: MarginTocProps) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-15% 0px -70% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  if (!items.length) return null
  return (
    <nav className={styles.toc} aria-label={label}>
      <span className={styles.tocLabel}>{label}</span>
      <ol>
        {items.map((item, i) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>
              <span className={styles.tocNo}>{String(i + 1).padStart(2, '0')}</span>
              <span>{item.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
