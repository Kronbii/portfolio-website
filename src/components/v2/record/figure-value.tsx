import { Fragment, type CSSProperties } from 'react'

import styles from './figure-value.module.css'

/** A value is a figure when it carries a number; anything else is words. */
export const isFigure = (value: string) => /\d/.test(value)

/**
 * Instrument figure setting (Bikey, Juno): numbers in tabular mono, units and
 * separators smaller and dimmer, never wrapping. The size steps down with the
 * value's length so a long reading fits its cell instead of breaking. Word
 * values are language, so they are set in the sans, not the data face.
 */
/** The sizing length for a box of readings: its longest figure, so siblings share one scale. */
export const boxLength = (values: string[]) => Math.max(4, ...values.filter(isFigure).map((v) => v.length))

export function FigureValue({ value, className, len }: { value: string; className?: string; len?: number }) {
  if (!isFigure(value)) {
    return <span className={`${styles.words} ${className ?? ''}`}>{value}</span>
  }
  // A reading such as ">95 teams / >250 participants" is two groups; each
  // group never breaks, and only when the floor size cannot fit the whole
  // value on one line does it wrap between groups.
  const groups = value.split(/\s*\/\s*/)
  return (
    <span
      className={`${styles.figure} ${className ?? ''}`}
      style={{ '--len': len ?? Math.max(4, value.length) } as CSSProperties}
    >
      {groups.map((group, g) => (
        <Fragment key={g}>
          {g > 0 ? <span className={styles.sep}> / </span> : null}
          <span className={styles.group}>
            {group.split(/(\s+)/).map((part, i) =>
              /^\s+$/.test(part) ? (
                <Fragment key={i}> </Fragment>
              ) : (
                <span key={i} className={/\d/.test(part) ? styles.num : styles.unit}>
                  {part}
                </span>
              ),
            )}
          </span>
        </Fragment>
      ))}
    </span>
  )
}
