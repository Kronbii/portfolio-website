import { ArrowUpRight } from 'lucide-react'
import { homeContent } from '@/content/home'
import { Container } from '@/components/ui/container'
import { MotionDiv, MotionSection } from '@/components/ui/motion'
import { revealUp, staggerContainer } from '@/lib/motion'

export function HomeContactSection() {
  const { contact } = homeContent

  return (
    <MotionSection id="contact" className="py-32 lg:py-48 bg-background">
      <Container>
        <MotionDiv className="flex flex-col items-center text-center max-w-6xl mx-auto" {...staggerContainer}>
          <MotionDiv {...revealUp}>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand">
              {contact.eyebrow}
            </p>
            <h2 className="mt-8 text-5xl md:text-7xl lg:text-[8rem] font-bold tracking-tighter text-foreground leading-[0.9] uppercase text-balance">
              {contact.title}
            </h2>
          </MotionDiv>
          
          <MotionDiv className="mt-20 w-full flex flex-col sm:flex-row justify-center gap-6 lg:gap-8" {...revealUp}>
            {contact.channels.map((channel) => (
              <a
                key={channel.href}
                href={channel.href}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
                rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group relative flex items-center justify-between sm:justify-center gap-4 py-5 px-10 border border-border rounded-full transition-colors hover:bg-foreground hover:text-background text-lg font-medium"
              >
                <span>{channel.label}</span>
                <ArrowUpRight
                  size={20}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  aria-hidden
                />
              </a>
            ))}
          </MotionDiv>
        </MotionDiv>
      </Container>
    </MotionSection>
  )
}
