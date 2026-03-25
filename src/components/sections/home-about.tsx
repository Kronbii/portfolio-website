import Image from 'next/image'
import { homeContent } from '@/content/home'
import { Container } from '@/components/ui/container'
import { MotionDiv, MotionSection } from '@/components/ui/motion'
import { revealUp, staggerContainer } from '@/lib/motion'

export function HomeAboutSection() {
  const { about } = homeContent

  return (
    <MotionSection id="about" className="bg-background py-24 lg:py-32 border-b border-border" {...revealUp}>
      <Container>
        <MotionDiv className="flex flex-col lg:flex-row gap-16 lg:gap-24" {...staggerContainer}>
          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <MotionDiv {...revealUp}>
              <h2 className="text-6xl md:text-[6rem] font-bold tracking-tighter uppercase leading-[0.85] text-foreground">
                {about.titleLeading}<br/>
                <span className="text-muted-foreground">{about.titleAccent}</span>
              </h2>
            </MotionDiv>
            
            <MotionDiv {...revealUp} className="hidden lg:flex flex-col gap-12 mt-24">
              <div className="flex gap-16">
                {about.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <p className="text-5xl font-light text-foreground">{stat.value}<span className="text-primarylw">+</span></p>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </MotionDiv>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-12">
            <MotionDiv {...revealUp} className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden bg-surface-2 shadow-2xl">
              <Image
                src={about.image.src}
                alt={about.image.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </MotionDiv>
            
            <MotionDiv {...revealUp} className="flex flex-col gap-6">
              <p className="text-2xl md:text-3xl font-medium tracking-tight text-foreground leading-snug">
                {about.intro}
              </p>
              {about.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </MotionDiv>
            
            <MotionDiv {...revealUp} className="lg:hidden flex flex-wrap gap-8 pt-8 border-t border-border">
              {about.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <p className="text-4xl font-light text-foreground">{stat.value}<span className="text-primarylw">+</span></p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-2">{stat.label}</p>
                </div>
              ))}
            </MotionDiv>
          </div>
        </MotionDiv>
      </Container>
    </MotionSection>
  )
}
