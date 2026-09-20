import { moments, work } from '../data'
import { Ledger } from '../ledger'
import { PairingIntro, PairingSwitcher } from '../shared'
import { Spreads } from '../spreads'

export default function PairingB() {
  return (
    <main className="bg-background text-foreground">
      <PairingSwitcher current="b" />
      <PairingIntro
        title="Spreads and ledger"
        note="Selected Work reads like a magazine: uneven spreads that swap sides, every third one shorter so the page breathes. Community is a ledger of roles and dates; the row under your hand fills one large plate."
      />
      <Spreads heading="Selected work" work={work} />
      <Ledger heading="Engineering with, and for, other people." moments={moments} />
    </main>
  )
}
