import { Chapters, momentsToChapters } from '../chapters'
import { moments, work } from '../data'
import { PairingIntro, PairingSwitcher } from '../shared'
import { Wall } from '../wall'

export default function PairingC() {
  return (
    <main className="bg-background text-foreground">
      <PairingSwitcher current="c" />
      <PairingIntro
        title="Evidence wall and chapters"
        note="Selected Work is a wall of real media at mixed sizes, everything visible at once; the tile you choose opens in place. Community takes the cinema instead: each moment fills the viewport with the role and the room named."
      />
      <Wall heading="Selected work" work={work} />
      <Chapters id="community" heading="Community" chapters={momentsToChapters(moments)} />
    </main>
  )
}
