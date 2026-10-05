'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

import { v2Home } from '@/content/v2/home'
import { siteConfig } from '@/lib/site'

import { Emph } from '../emph'
import styles from './sign-off.module.css'

const Dithering = dynamic(
  () => import('@paper-design/shaders-react').then((m) => m.Dithering),
  {
    ssr: false,
  }
)

const channels = [
  { label: 'Email', href: `mailto:${siteConfig.email}` },
  { label: 'GitHub', href: siteConfig.socials.github },
  { label: 'LinkedIn', href: siteConfig.socials.linkedin },
  { label: 'Medium', href: siteConfig.socials.medium },
]

function FlipLink({ label, href }: { label: string; href: string }) {
  const external = href.startsWith('http')
  return (
    <a
      className={styles.flip}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer me' : undefined}
      aria-label={label}
    >
      <span className={styles.flipRow} aria-hidden="true">
        {label.split('').map((ch, i) => (
          <span
            key={i}
            className={styles.flipChar}
            style={{ ['--i' as string]: i }}
          >
            <span>{ch}</span>
            <span>{ch}</span>
          </span>
        ))}
      </span>
    </a>
  )
}

export type SignOffCopy = typeof v2Home.signOff

/**
 * Defaults to the /v2 copy; another version passes its own. `warm` mounts the
 * shader in idle time after load (so its compile never lands mid-scroll) and
 * holds it still while it is off screen.
 */
export function SignOff({
  copy = v2Home.signOff,
  warm = false,
}: {
  copy?: SignOffCopy
  warm?: boolean
}) {
  const panel = useRef<HTMLDivElement>(null)
  const [front, setFront] = useState('#c9686a')
  const [hot, setHot] = useState(false)
  const [show, setShow] = useState(false)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = panel.current
    if (!el) return
    const read = () =>
      setFront(
        getComputedStyle(el).getPropertyValue('--brand').trim() || '#c9686a'
      )
    read()
    window.addEventListener('v2-theme', read)
    window.addEventListener('v3-theme', read)
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const io = new IntersectionObserver(
      ([entry]) => {
        setNear(entry.isIntersecting)
        if (!warm) setShow(entry.isIntersecting && !reduced)
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    let idle = 0
    if (warm && !reduced) {
      const ric = (
        window as Window & {
          requestIdleCallback?: (
            cb: () => void,
            o?: { timeout: number }
          ) => number
        }
      ).requestIdleCallback
      idle = ric
        ? ric(() => setShow(true), { timeout: 4000 })
        : window.setTimeout(() => setShow(true), 2500)
    }
    return () => {
      if (idle) {
        const cic = (
          window as Window & { cancelIdleCallback?: (h: number) => void }
        ).cancelIdleCallback
        if (cic) cic(idle)
        else clearTimeout(idle)
      }
      window.removeEventListener('v2-theme', read)
      window.removeEventListener('v3-theme', read)
      io.disconnect()
    }
  }, [warm])

  return (
    <section
      className={styles.section}
      id="sign-off"
      aria-labelledby="sign-off-h"
    >
      <div className={styles.inner}>
        <div
          ref={panel}
          className={styles.panel}
          onPointerEnter={() => setHot(true)}
          onPointerLeave={() => setHot(false)}
        >
          <div className={styles.shader} aria-hidden="true">
            {show ? (
              <Dithering
                colorBack="#00000000"
                colorFront={front}
                shape="warp"
                type="4x4"
                size={2}
                speed={warm && !near ? 0 : hot ? 0.55 : 0.18}
                minPixelRatio={1}
                style={{ width: '100%', height: '100%' }}
              />
            ) : null}
          </div>

          <div className={styles.content}>
            <h2 className={styles.h2} id="sign-off-h">
              <Emph {...copy.heading} />
            </h2>
            <p className={styles.body}>{copy.body}</p>

            <ul className={styles.channels}>
              {channels.map((c) => (
                <li key={c.label}>
                  <FlipLink {...c} />
                </li>
              ))}
            </ul>

            <div className={styles.foot}>
              <p className={styles.address}>
                <span className={styles.footLabel}>{copy.emailLabel}</span>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </p>
              <div className={styles.signed}>
                <span className={styles.footLabel}>{copy.signed}</span>
                <span
                  className={styles.sig}
                  role="img"
                  aria-label={`${siteConfig.name}’s signature`}
                />
                <span className={styles.witness}>{copy.witness}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
