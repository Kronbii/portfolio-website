import { homeContent } from '@/content/home'
import { Container } from '@/components/ui/container'
import { MotionDiv, MotionSection } from '@/components/ui/motion'
import StaggerChars from '@/components/ui/stagger-chars'
import { revealUp, staggerContainer } from '@/lib/motion'

export function HomeContactSection() {
  const { contact } = homeContent

  return (
    <MotionSection id="contact" className="py-32 lg:py-48 bg-background">
      <Container>
        <MotionDiv className="flex flex-col items-center text-center max-w-7xl mx-auto" {...staggerContainer}>
          <MotionDiv {...revealUp}>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              {contact.eyebrow}
            </p>
            <h2 className="mt-8 mx-auto max-w-[72rem] text-5xl md:text-7xl lg:text-[7.2rem] font-bold tracking-tighter text-foreground leading-[0.9] uppercase">
              {contact.title}
            </h2>
          </MotionDiv>
          
          <MotionDiv
            className="mt-20 grid w-full max-w-3xl grid-cols-2 gap-x-4 gap-y-6 md:gap-x-8 md:gap-y-8"
            {...revealUp}
          >
            {contact.channels.map((channel) => (
              <a
                key={channel.href}
                href={channel.href}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
                rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center justify-center text-foreground"
              >
                <StaggerChars
                  text={channel.label}
                  hoverText={channel.label}
                  direction="alternate"
                  delay={0.02}
                  duration={0.5}
                  className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-primary)]"
                  hoverClassName="text-[#9d201a]"
                />
              </a>
            ))}
          </MotionDiv>
        </MotionDiv>
      </Container>
    </MotionSection>
  )
}
