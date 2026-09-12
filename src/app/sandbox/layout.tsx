import { type Metadata } from 'next'

// THROWAWAY. Everything under src/app/sandbox is a testing ground for patterns
// before they earn a place in the real site. Delete the whole folder with:
//   rm -rf src/app/sandbox
// Nothing outside this folder imports from it.

export const metadata: Metadata = {
  title: 'Sandbox',
  robots: { index: false, follow: false },
}

export default function SandboxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none fixed bottom-4 right-4 z-50 rounded-sm border border-border bg-background/80 px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
        Sandbox — not linked, not indexed
      </span>
      {children}
    </div>
  )
}
