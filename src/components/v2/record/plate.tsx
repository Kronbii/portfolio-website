import Image from 'next/image'

import type { AuthorityMedia } from '@/content/authority'
import { mediaSize } from '@/content/v2/media-size'

import styles from './record.module.css'

interface PlateProps {
  media: AuthorityMedia
  /** "Fig. 03.1" — the figure number other entries can cite. */
  label?: string
  /** Force a frame ratio and crop to it; omit to show the whole image. */
  ratio?: string
  focus?: string
  priority?: boolean
  sizes?: string
  className?: string
  /** Hide the caption line (the surrounding entry already says it). */
  bare?: boolean
  /** With a forced ratio: crop to fill (default) or show the whole image on the ground. */
  fit?: 'cover' | 'contain'
}

export function Plate({ media, label, ratio, focus, priority, sizes, className, bare, fit }: PlateProps) {
  const [w, h] = mediaSize[media.src] ?? [media.width ?? 1600, media.height ?? 1000]
  const gif = media.src.endsWith('.gif')
  const svg = media.src.endsWith('.svg')
  return (
    <figure className={`${styles.plate} ${className ?? ''}`}>
      <div className={styles.plateFrame} style={{ aspectRatio: ratio ?? `${w} / ${h}` }}>
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes={sizes ?? '(min-width: 1100px) 60vw, 100vw'}
          unoptimized={gif || svg}
          style={{ objectFit: ratio ? (fit ?? 'cover') : 'contain', objectPosition: focus ?? '50% 50%' }}
        />
      </div>
      {!bare && (label || media.caption) ? (
        <figcaption className={styles.caption}>
          {label ? <span className={styles.figLabel}>{label}</span> : null}
          {media.caption ? <span>{media.caption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
