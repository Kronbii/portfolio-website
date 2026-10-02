'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from 'react'

import { v2Index } from '@/content/v2/pages'

import { SheetLink } from '../sheet-link'
import styles from './index-list.module.css'

export interface IndexRow {
  id: string
  no: string
  title: { text: string; emphasis?: string }
  summary: string
  meta: string
  topics: string[]
  href: string
  plate?: { src: string; alt: string }
}

export interface IndexTopic {
  slug: string
  label: string
  count: number
}

interface IndexListProps {
  rows: IndexRow[]
  topics: IndexTopic[]
}

/**
 * Filtering reranks rows in place: every row keeps its identity and travels
 * to its new position, and a row that moved holds its highlight until it has
 * been noticed. Raised by the gate board.
 */
export function IndexList({ rows, topics }: IndexListProps) {
  const [active, setActive] = useState<string | null>(null)
  const [moved, setMoved] = useState<Set<string>>(new Set())
  const els = useRef(new Map<string, HTMLLIElement>())
  const before = useRef(new Map<string, number>())
  const [hover, setHover] = useState<IndexRow | null>(null)
  const plate = useRef<HTMLDivElement>(null)

  const { matched, rest } = useMemo(() => {
    if (!active) return { matched: rows, rest: [] as IndexRow[] }
    return {
      matched: rows.filter((r) => r.topics.includes(active)),
      rest: rows.filter((r) => !r.topics.includes(active)),
    }
  }, [rows, active])

  const choose = (slug: string | null) => {
    if (slug === active) return
    before.current = new Map()
    els.current.forEach((el, id) => before.current.set(id, el.getBoundingClientRect().top))
    setActive(slug)
  }

  useLayoutEffect(() => {
    if (before.current.size === 0) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const changed = new Set<string>()
    els.current.forEach((el, id) => {
      const was = before.current.get(id)
      if (was === undefined) return
      const delta = was - el.getBoundingClientRect().top
      if (Math.abs(delta) < 2) return
      changed.add(id)
      if (reduced) return
      el.style.transition = 'none'
      el.style.transform = `translateY(${delta}px)`
      requestAnimationFrame(() => {
        el.style.transition = 'transform 620ms cubic-bezier(0.2, 0.8, 0.2, 1)'
        el.style.transform = ''
      })
    })
    before.current = new Map()
    setMoved(changed)
  }, [active])

  const notice = (id: string) => {
    if (!moved.has(id)) return
    setMoved((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const onMove = (e: PointerEvent) => {
    const el = plate.current
    if (!el || e.pointerType !== 'mouse') return
    el.style.transform = `translate3d(${e.clientX + 24}px, ${e.clientY - 90}px, 0)`
  }

  const activeLabel = topics.find((t) => t.slug === active)?.label ?? ''

  const renderRow = (row: IndexRow, dim: boolean) => (
    <li
      key={row.id}
      ref={(el) => {
        if (el) els.current.set(row.id, el)
        else els.current.delete(row.id)
      }}
      className={styles.item}
      data-dim={dim || undefined}
      data-moved={moved.has(row.id) || undefined}
      onPointerEnter={(e) => {
        notice(row.id)
        if (e.pointerType === 'mouse' && row.plate) setHover(row)
      }}
      onPointerLeave={() => setHover(null)}
      onFocus={() => notice(row.id)}
    >
      <SheetLink href={row.href} className={styles.row}>
        <span className={styles.no}>{row.no}</span>
        <span className={styles.main}>
          <span className={styles.title}>{row.title.text}</span>
          <span className={styles.summary}>{row.summary}</span>
        </span>
        <span className={styles.meta}>{row.meta}</span>
        <ArrowRight className={styles.arrow} size={18} strokeWidth={1.75} aria-hidden="true" />
      </SheetLink>
    </li>
  )

  return (
    <div className={styles.root} onPointerMove={onMove}>
      {topics.length > 0 ? (
      <div className={styles.filters} role="group" aria-label={v2Index.filter.label}>
        <button type="button" className={styles.filter} aria-pressed={active === null} onClick={() => choose(null)}>
          {v2Index.filter.all}
          <span className={styles.count}>{rows.length}</span>
        </button>
        {topics.map((t) => (
          <button
            key={t.slug}
            type="button"
            className={styles.filter}
            aria-pressed={active === t.slug}
            onClick={() => choose(t.slug)}
          >
            {t.label}
            <span className={styles.count}>{t.count}</span>
          </button>
        ))}
      </div>
      ) : null}
      {topics.length > 0 ? (
        <p className={styles.status} aria-live="polite">
          {active ? v2Index.filter.status(matched.length, activeLabel) : ''}
        </p>
      ) : null}

      <ol className={styles.list}>
        {matched.map((row) => renderRow(row, false))}
        {active && rest.length > 0 ? (
          <li key="__divider" className={styles.divider} aria-hidden="true">
            {v2Index.filter.unmatched(activeLabel)}
          </li>
        ) : null}
        {rest.map((row) => renderRow(row, true))}
      </ol>

      <div ref={plate} className={styles.hoverPlate} data-on={hover ? 'true' : undefined} aria-hidden="true">
        {hover?.plate ? (
          <Image src={hover.plate.src} alt="" width={360} height={240} sizes="360px" unoptimized={hover.plate.src.endsWith('.gif')} />
        ) : null}
      </div>
    </div>
  )
}
