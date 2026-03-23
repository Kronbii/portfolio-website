import Link from 'next/link'

import { type NavItem } from '@/content/schema'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

interface SiteHeaderProps {
  items: NavItem[]
}

export function SiteHeader({ items }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground"
        >
          RK
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Button asChild variant="secondary" size="sm">
          <a href="#contact">Start a conversation</a>
        </Button>
      </Container>
    </header>
  )
}
