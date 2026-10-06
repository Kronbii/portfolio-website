import { Fragment } from 'react'

/** Text with its one hot word set in the hot colour. */
export function Hot({ text, hot }: { text: string; hot?: string }) {
  if (!hot) return <>{text}</>
  const parts = text.split(/(\s+)/)
  const at = parts.findIndex((p) => p.replace(/[.,;:!?]$/, '') === hot)
  return (
    <>
      {parts.map((p, i) =>
        i === at ? (
          <em key={i} className="v3-hot">
            {p}
          </em>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}
