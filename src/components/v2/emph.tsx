import { Fragment } from 'react'

interface EmphProps {
  text: string
  emphasis?: string
}

/** Short compounds ("Super-Resolution", "real-time") never break at their hyphen. */
const keepWhole = (part: string) => part.includes('-') && part.length <= 16

/** Renders a heading's text with its one emphasised word in italic serif. */
export function Emph({ text, emphasis }: EmphProps) {
  const parts = text.split(/(\s+)/)
  const at = emphasis ? parts.findIndex((part) => part === emphasis) : -1
  return (
    <>
      {parts.map((part, i) => {
        const word = keepWhole(part) ? <span style={{ whiteSpace: 'nowrap' }}>{part}</span> : part
        return i === at ? (
          <em key={i} className="v2-em">
            {word}
          </em>
        ) : (
          <Fragment key={i}>{word}</Fragment>
        )
      })}
    </>
  )
}
