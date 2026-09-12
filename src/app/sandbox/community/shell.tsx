import { type ReactNode } from 'react'

import { communityIntro } from './community-data'

/** Shared frame so all four mock-ups are judged on the pattern, not the chrome. */
export function CommunityMockShell({
  variant,
  note,
  children,
  wide = false,
}: {
  variant: string
  note: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div
        className={`mx-auto w-full px-5 pt-40 sm:px-8 ${wide ? 'max-w-[90rem]' : 'max-w-5xl'}`}
      >
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
          {communityIntro.eyebrow} — {variant}
        </p>
        <h2 className="mt-6 text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          {communityIntro.title}
        </h2>
        <p className="mt-8 max-w-[52ch] text-base leading-[1.7] text-muted-foreground">
          {note}
        </p>
      </div>
      {children}
    </main>
  )
}
