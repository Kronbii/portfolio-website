import { Container } from '@/components/ui/container'
import ScrollReveal from '@/components/ui/scroll-reveal'

export function HomeAboutSection() {
  return (
    <section id="about" className="bg-background py-28 lg:py-40 border-b border-border">
      <Container>
        <ScrollReveal
          baseOpacity={0.12}
          baseRotation={2}
          blurStrength={5}
          rotationStart="top 88%"
          rotationEnd="bottom bottom"
          wordAnimationStart="top 84%"
          wordAnimationEnd="bottom bottom"
          wordStagger={0.12}
          containerClassName="mx-auto max-w-6xl"
          textClassName="text-balance font-black uppercase leading-[0.9] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] text-foreground"
        >
          {'GLORP NEXUS VELTRON AXIOM QWENAR ZYTHER MONIX PRAEVOR UMBRAL KINETIX'}
        </ScrollReveal>
      </Container>
    </section>
  )
}
