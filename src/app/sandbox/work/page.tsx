import Link from 'next/link'

const pairings = [
  { href: '/sandbox/work/a', title: 'A — Chapters and film strip', note: 'Full-bleed project plates that cover each other; Community as a horizontal dated strip.' },
  { href: '/sandbox/work/b', title: 'B — Spreads and ledger', note: 'Magazine diptychs with a varied rhythm; Community as a dated ledger with one hover plate.' },
  { href: '/sandbox/work/c', title: 'C — Evidence wall and chapters', note: 'A mixed-size wall of real media that opens in place; Community as full-bleed chapters.' },
]

export default function WorkSandboxIndex() {
  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-40 sm:px-8">
      <h1 className="text-5xl leading-[0.9] tracking-tight sm:text-6xl">Work sections</h1>
      <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
        Three pairings for the homepage Selected Work and Community sections. Each pairing gives the two sections different grammars so they stop reading as twins.
      </p>
      <ul className="mt-16">
        {pairings.map((p) => (
          <li key={p.href} className="border-t border-border">
            <Link href={p.href} className="group block py-8 transition-colors duration-base hover:bg-surface">
              <span className="text-2xl tracking-tight">{p.title}</span>
              <span className="mt-2 block max-w-[52ch] text-sm text-muted-foreground">{p.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
