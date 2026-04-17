'use client';

import { DotWave } from '@/components/ui/dot-wave';
import { Container } from '@/components/ui/container';
import { FancyText } from '@/components/ui/fancy-text';
import { MotionDiv, MotionSection } from '@/components/ui/motion';
import { revealUpEarly, staggerContainerEarly } from '@/lib/motion';
import { homeContent } from '@/content/home';

export function HomeExperienceSection() {
  const { experience } = homeContent;

  return (
    <MotionSection
      id="experience"
      className="relative overflow-hidden section-theme-dark border-b border-border text-foreground"
      style={{ backgroundColor: '#0c0c0c' }}
      {...revealUpEarly}
    >
      <div className="absolute inset-0 opacity-40">
        <DotWave
          bgColor="#0c0c0c"
          dotColor="#9d201a"
          dotGap={24}
          dotRadiusMax={2}
          lightIntensity={0.55}
          fadeIntensity={0.12}
          expansionSpeed={180}
          repeatAnimation
          cover
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 py-24 sm:py-28">
        <Container className="space-y-14">

          {/* Section header */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {experience.eyebrow}
              </p>
              <h2 className="mt-4">
                <FancyText
                  className="text-balance text-4xl font-semibold tracking-tight text-foreground/5 sm:text-5xl"
                  fillClassName="text-foreground"
                >
                  {experience.title}
                </FancyText>
              </h2>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                {experience.description}
              </p>
            </div>

            <MotionDiv
              className="border border-border bg-surface/35 px-6 py-7"
              {...revealUpEarly}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Career Track
              </p>
              <p className="mt-4 text-5xl font-black leading-none text-foreground sm:text-6xl">
                {experience.items.length}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Roles Held
              </p>
            </MotionDiv>
          </div>

          {/* Experience list */}
          <MotionDiv
            className="border-t border-border mt-14"
            {...staggerContainerEarly}
          >
            {experience.items.map((item, index) => (
              <MotionDiv
                key={item.id}
                className="group border-b border-border py-12 transition-colors duration-500 hover:bg-muted/10 cursor-default"
                {...revealUpEarly}
              >
                <div className="grid grid-cols-[2rem_1fr] gap-x-6 sm:grid-cols-[3rem_1fr_9rem] sm:gap-x-10">

                  {/* Index */}
                  <span className="pt-1 text-sm lg:text-base font-semibold tabular-nums text-muted-foreground/50 transition-colors group-hover:text-foreground/70">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>

                  {/* Main content */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand">
                      {item.company}
                      {item.location ? ` · ${item.location}` : ''}
                    </p>
                    <h3 className="mt-2 text-2xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-3xl transition-transform duration-500 ease-out group-hover:translate-x-2">
                      {item.role}
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground transition-transform duration-500 ease-out group-hover:translate-x-2">
                      {item.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2 transition-transform duration-500 ease-out group-hover:translate-x-2">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-border/80 px-3 py-1.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 group-hover:border-foreground/20 group-hover:text-foreground/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {/* Period – mobile only */}
                    <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 sm:hidden transition-transform duration-500 ease-out group-hover:translate-x-2">
                      {item.period}
                    </p>
                  </div>

                  {/* Period – desktop */}
                  <p className="hidden pt-1 text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 sm:block">
                    {item.period}
                  </p>

                </div>
              </MotionDiv>
            ))}
          </MotionDiv>

        </Container>
      </div>
    </MotionSection>
  );
}
