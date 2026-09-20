import { Chapters, workToChapters } from '../chapters'
import { moments, work } from '../data'
import { FilmStrip } from '../filmstrip'
import { PairingIntro, PairingSwitcher } from '../shared'

export default function PairingA() {
  return (
    <main className="bg-background text-foreground">
      <PairingSwitcher current="a" />
      <PairingIntro
        title="Chapters and film strip"
        note="Selected Work becomes a cinema: each system fills the viewport, the title set into the plate, and the next plate covers it. Community changes instrument entirely, a horizontal strip of dated moments you move through sideways."
      />
      <Chapters id="selected-work" heading="Selected work" chapters={workToChapters(work)} />
      <FilmStrip heading="Engineering with, and for, other people." moments={moments} />
    </main>
  )
}
