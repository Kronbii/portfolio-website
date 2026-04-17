'use client';

import { DotWave } from '@/components/ui/dot-wave';
import { Container } from '@/components/ui/container';
import { FancyText } from '@/components/ui/fancy-text';
import { MotionDiv } from '@/components/ui/motion';
import { revealUpEarly, staggerContainerEarly } from '@/lib/motion';
import { homeContent } from '@/content/home';

export function HomeExperienceSection() {
  const { experience } = homeContent;

  return (
    <section
      id="experience"
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: '#0c0c0c' }}
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
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
                {experience.eyebrow}
              </p>
              <h2 className="mt-4">
                <FancyText
                  className="text-balance text-4xl font-semibold tracking-tight text-white/5 sm:text-5xl"
                  fillClassName="text-white"
                >
                  {experience.title}
                </FancyText>
              </h2>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-white/70 sm:text-lg">
                {experience.description}
              </p>
            </div>

            <MotionDiv
              className="border border-white/10 bg-white/[0.04] px-6 py-7"
              {...revealUpEarly}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                Career Track
              </p>
              <p className="mt-4 text-5xl font-black leading-none text-white sm:text-6xl">
                {experience.items.length}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/60">
                Roles Held
              </p>
            </MotionDiv>
          </div>

          {/* Experience list */}
          <MotionDiv
            className="border-t border-white/10"
            {...staggerContainerEarly}
          >
            {experience.items.map((item, index) => (
              <MotionDiv
                key={item.id}
                className="group border-b border-white/10 py-9 transition-colors duration-300 hover:bg-white/[0.025]"
                {...revealUpEarly}
              >
                <div className="grid grid-cols-[2rem_1fr] gap-x-6 sm:grid-cols-[2rem_1fr_9rem] sm:gap-x-10">

                  {/* Index */}
                  <span className="pt-1 text-xs font-semibold tabular-nums text-white/40">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>

                  {/* Main content */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
                      {item.company}
                      {item.location ? ` · ${item.location}` : ''}
                    </p>
                    <h3 className="mt-2 text-xl font-black uppercase leading-tight tracking-tight text-white sm:text-2xl">
                      {item.role}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
                      {item.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55 transition-colors duration-200 group-hover:border-white/30 group-hover:text-white/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {/* Period – mobile only */}
                    <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:hidden">
                      {item.period}
                    </p>
                  </div>

                  {/* Period – desktop */}
                  <p className="hidden pt-1 text-right text-xs font-semibold uppercase tracking-[0.2em] text-white/40 sm:block">
                    {item.period}
                  </p>

                </div>
              </MotionDiv>
            ))}
          </MotionDiv>

        </Container>
      </div>
    </section>
  );
}
