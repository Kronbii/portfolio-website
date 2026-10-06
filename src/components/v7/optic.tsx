import type { CSSProperties, ReactNode } from 'react'

/*
 * Real chromatic aberration for photographs, without filters: the image is
 * drawn twice, once multiplied by magenta (its red and blue) and once by
 * green, and the two are screened back together over black, which rebuilds
 * the photograph exactly. Sliding the two layers apart by --ca pixels splits
 * the green from the magenta, as an achromatic doublet's secondary spectrum
 * does; at zero they are the picture. Everything stays on the compositor.
 */

export function Optic({
  src,
  className,
  position,
  fit = 'cover',
  style,
}: {
  src: string
  className?: string
  position?: string
  fit?: 'cover' | 'contain'
  style?: CSSProperties
}) {
  const img: CSSProperties = { objectPosition: position, objectFit: fit }
  return (
    <span
      className={`v7-optic ${className ?? ''}`}
      style={style}
      aria-hidden="true"
    >
      <span className="v7-chan v7-chan-m">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" src={src} alt="" style={img} decoding="async" />
      </span>
      <span className="v7-chan v7-chan-g">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" src={src} alt="" style={img} decoding="async" />
      </span>
    </span>
  )
}

/**
 * A line with an aberration: the stroke three times, magenta and green copies
 * either side of the sage one, all drawn on by --draw (1 to 0) and pulled
 * together by --ca.
 */
export function FringePath({
  d,
  className,
  width = 4,
}: {
  d: string
  className?: string
  width?: number
}) {
  return (
    <g
      className={`v7-fl ${className ?? ''}`}
      style={{ '--w': width } as CSSProperties}
    >
      <path className="v7-fl-m" d={d} pathLength={1} />
      <path className="v7-fl-g" d={d} pathLength={1} />
      <path className="v7-fl-c" d={d} pathLength={1} />
    </g>
  )
}

/** A label that can fringe: text-shadow from --ca. */
export function Fx({
  as: Tag = 'div',
  className,
  children,
  style,
}: {
  as?: 'div' | 'span' | 'p'
  className?: string
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <Tag className={`fx ${className ?? ''}`} style={style}>
      {children}
    </Tag>
  )
}
