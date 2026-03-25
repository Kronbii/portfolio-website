import { Container } from '@/components/ui/container'
import { ScrollReveal } from '@/components/lightswind/scroll-reveal'
import { NumberTicker } from '@/components/ui/number-ticker'

const aboutStats = [
  { value: 4, label: 'Years Experience' },
  { value: 10, label: 'Projects Delivered' },
  { value: 5, label: 'Awards Won' },
  { value: 5, label: 'Community Initiatives' },
]

export function HomeAboutSection() {
  return (
    <section id="about" className="bg-background py-28 lg:py-40 border-b border-border">
      <Container>
        <ScrollReveal
          baseOpacity={0.12}
          baseRotation={2}
          blurStrength={5}
          threshold={0.35}
          duration={0.9}
          staggerDelay={0.08}
          enableBlur
          size="2xl"
          containerClassName="mx-auto max-w-6xl"
          textClassName="text-balance !font-black uppercase !leading-[0.9] tracking-tight !text-5xl sm:!text-6xl md:!text-[5.2rem] lg:!text-[7rem] text-foreground"
        >
          {'GLORP NEXUS VELTRON AXIOM QWENAR ZYTHER MONIX PRAEVOR UMBRAL KINETIX'}
        </ScrollReveal>

        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-x-10 gap-y-10 md:grid-cols-4 md:gap-x-12">
          {aboutStats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center text-[var(--color-primary)]"
            >
              <div className="flex items-start">
                <NumberTicker
                  value={stat.value}
                  className="text-6xl md:text-7xl font-black leading-none"
                />
                <span className="ml-1 text-2xl md:text-3xl font-black leading-none">
                  +
                </span>
              </div>
              <p className="mt-3 text-[11px] md:text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]/80">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
