import { Container } from '@/components/ui/container'

export function HomeContactPlaceholderSection() {
  return (
    <section id="contact" className="py-20 sm:py-24">
      <Container>
        <div className="rounded-[2rem] border border-dashed border-border bg-surface px-6 py-12 shadow-soft sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
            Contact infrastructure kept
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            The API stays live while the new contact experience is redesigned.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            This reset keeps the server-side contact route and validation in
            place, but the final UI and inquiry flow are intentionally deferred
            until the broader redesign direction is locked.
          </p>
        </div>
      </Container>
    </section>
  )
}
