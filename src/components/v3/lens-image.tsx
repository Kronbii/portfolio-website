import styles from './lens-image.module.css'

/**
 * A photograph seen through the page's lens. The first copy is the real image
 * (it sizes the frame and carries the alt text) and stays invisible; above it,
 * two copies each keep part of the colour channels (the palette's split) and
 * are added back together. Unshifted they rebuild the photo exactly; the lens
 * moves them apart by --lx/--ly, so the fringe runs through the picture the way
 * it does through glass, not just around its frame.
 */
export function LensImage({
  src,
  alt,
  position,
  className,
  weight,
}: {
  src: string
  alt: string
  position?: string
  className?: string
  weight?: number
}) {
  const style = { objectPosition: position ?? '50% 50%' }
  return (
    <span className={`${styles.lens} ${className ?? ''}`} data-lens-img="" data-lens={weight}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.base} src={src} alt={alt} style={style} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.a} src={src} alt="" aria-hidden="true" style={style} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.b} src={src} alt="" aria-hidden="true" style={style} />
    </span>
  )
}
