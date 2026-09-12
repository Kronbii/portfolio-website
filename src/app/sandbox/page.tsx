import Link from 'next/link'

const experiments = [
  {
    href: '/sandbox/stack-lineup',
    title: 'Stack lineup',
    note: 'ui-layout.com section 5 — each image scrolls up and lands in the same place, covering the last. Pure CSS.',
  },
  {
    href: '/sandbox/swap-lineup',
    title: 'Swap lineup',
    note: 'One pinned frame; each image crossfades into the same place. Aceternity sticky-scroll-reveal, adapted.',
  },
  {
    href: '/sandbox/sticky-lineup',
    title: 'Sticky lineup',
    note: 'vatn.com "The Lineup" — pinned media column against scrolling text.',
  },
]

export default function SandboxIndexPage() {
  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-5 py-40 sm:px-8">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
        Throwaway
      </p>
      <h1 className="mt-6 text-5xl leading-[0.9] tracking-tight sm:text-6xl">
        Sandbox
      </h1>
      <p className="mt-8 max-w-[52ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
        Patterns under evaluation. Nothing here is linked from the site or
        indexed. Delete the whole folder when it has served its purpose.
      </p>

      <ul className="mt-20">
        {experiments.map((experiment) => (
          <li key={experiment.href} className="border-t border-border">
            <Link
              href={experiment.href}
              className="group block py-8 transition-colors duration-base hover:bg-surface"
            >
              <span className="text-2xl tracking-tight">
                {experiment.title}
              </span>
              <span className="mt-2 block max-w-[52ch] text-sm text-muted-foreground">
                {experiment.note}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
