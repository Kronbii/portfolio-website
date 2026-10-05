import Link from 'next/link'

import { v7Copy, type Chapter } from '@/content/v7/home'

import { ClinicsScene } from './scenes/clinics'
import { FamiliesScene } from './scenes/families'
import { MachinesScene } from './scenes/machines'
import { SignersScene } from './scenes/signers'
import { StudentsScene } from './scenes/students'
import { VotersScene } from './scenes/voters'

/*
 * A chapter: who it is for, one sentence, one scene. The sentence's one
 * human word is set in the serif; the rest is a line, my part, and where to
 * read more. Nothing else competes with the scene.
 */

export function SceneFor({ chapter: c }: { chapter: Chapter }) {
  const r = v7Copy.replay
  const n = v7Copy.illustration
  switch (c.id) {
    case 'voters':
      return <VotersScene label={c.alt} replay={r} />
    case 'families':
      return <FamiliesScene label={c.alt} replay={r} />
    case 'clinics':
      return <ClinicsScene label={c.alt} replay={r} note={n} />
    case 'signers':
      return <SignersScene label={c.alt} replay={r} note={n} />
    case 'students':
      return <StudentsScene label={c.alt} replay={r} />
    case 'machines':
      return (
        <MachinesScene
          label={c.alt}
          replay={r}
          src={c.plate.kind === 'image' ? c.plate.src : undefined}
        />
      )
  }
}

function Title({ text, hot }: { text: string; hot: string }) {
  const i = text.indexOf(hot)
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <em>{hot}</em>
      {text.slice(i + hot.length)}
    </>
  )
}

const Go = ({
  l,
  quiet,
}: {
  l: { label: string; href: string; external?: boolean }
  quiet?: boolean
}) =>
  l.external ? (
    <a
      className={`v7-go${quiet ? ' quiet' : ''}`}
      href={l.href}
      rel="noopener"
      target="_blank"
    >
      {l.label} ↗
    </a>
  ) : (
    <Link className={`v7-go${quiet ? ' quiet' : ''}`} href={l.href}>
      {l.label} →
    </Link>
  )

export function ChapterSection({
  chapter: c,
  flip,
}: {
  chapter: Chapter
  flip?: boolean
}) {
  return (
    <section
      id={c.id}
      className={`v7-ch${flip ? ' flip' : ''}`}
      aria-labelledby={`${c.id}-h`}
    >
      <div className="v7-ch-text">
        <span className="v7-label">
          <i aria-hidden="true" />
          {c.label}
        </span>
        <h2 id={`${c.id}-h`} data-lens="">
          <Title text={c.title} hot={c.hot} />
        </h2>
        <p className="v7-ch-line">{c.line}</p>
        <p className="v7-part">
          <span>{v7Copy.partLabel}</span>
          {c.part}
        </p>
        <p className="v7-ch-links">
          <Go l={c.link} />
          {c.more ? <Go l={c.more} quiet /> : null}
        </p>
      </div>
      <SceneFor chapter={c} />
    </section>
  )
}
