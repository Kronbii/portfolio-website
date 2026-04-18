'use client';

import { useState } from 'react';
import Grainient from '@/components/Grainient';
import { Container } from '@/components/ui/container';
import { FancyText } from '@/components/ui/fancy-text';
import { MotionDiv, MotionSection } from '@/components/ui/motion';
import { revealUpEarly, staggerContainerEarly } from '@/lib/motion';
import { homeContent } from '@/content/home';
import { AnimatePresence, motion } from 'motion/react';

export function HomeExperienceSection() {
  const { experience } = homeContent;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <MotionSection
      id="experience"
      className="relative overflow-hidden section-theme-dark border-b border-border text-foreground"
      style={{ backgroundColor: '#0c0c0c' }}
      {...revealUpEarly}
    >
      <div className="absolute inset-0">
        <Grainient
          color1="#0c0c0c"
          color2="#4a4a4a"
          color3="#1e1410"
          timeSpeed={1}
          colorBalance={0.0}
          warpStrength={8}
          warpFrequency={6.0}
          warpSpeed={1.0}
          warpAmplitude={60.0}
          blendAngle={0.0}
          blendSoftness={0.05}
          rotationAmount={700.0}
          noiseScale={2.0}
          grainAmount={0.15}
          grainScale={1.0}
          grainAnimated={true}
          contrast={1.6}
          gamma={1.0}
          saturation={1.0}
          centerX={0.0}
          centerY={0.0}
          zoom={0.8}
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 py-16 sm:py-28">
        <Container className="space-y-4">

          {/* Section header */}
          <div className="grid gap-6 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
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
              className="border border-border bg-surface/35 px-6 py-7 hidden sm:block"
              {...revealUpEarly}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Career Track
              </p>
              <p className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black leading-none text-foreground">
                {experience.items.length}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Roles Held
              </p>
            </MotionDiv>
          </div>

          <div className="grid gap-8 sm:gap-16 lg:grid-cols-[1fr_minmax(0,26rem)] lg:gap-20 items-start pt-8 sm:pt-14">
            {/* Left Column: Interactive List */}
            <MotionDiv className="flex flex-col w-full border-t border-border" {...staggerContainerEarly}>
              {experience.items.map((item, index) => {
                const isActive = activeIndex === index;
                return (
                  <MotionDiv
                    key={item.id}
                    className={`group border-b border-border py-6 sm:py-12 cursor-pointer transition-all duration-500 ease-out ${isActive ? 'bg-muted/10 opacity-100' : 'opacity-40 hover:opacity-80 hover:bg-muted/5'}`}
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => {
                      if (window.innerWidth >= 1024) setActiveIndex(index);
                    }}
                    {...revealUpEarly}
                  >
                    <div className="px-3 sm:px-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
                        <div className="flex items-baseline gap-6">
                          <span className="text-sm font-semibold tabular-nums text-muted-foreground/40 transition-colors group-hover:text-foreground/70">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand transition-colors duration-500">
                              {item.company}
                              {item.location ? ` · ${item.location}` : ''}
                            </p>
                            <h3 className="mt-2 text-2xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-3xl transition-transform duration-500 ease-out sm:group-hover:translate-x-2">
                              {item.role}
                            </h3>
                          </div>
                        </div>
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 transition-transform duration-500 ease-out sm:group-hover:-translate-x-2 self-start sm:self-auto pl-10 sm:pl-0">
                          {item.period}
                        </p>
                      </div>

                      {/* Mobile inline expansion (hidden on desktop) */}
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden lg:hidden"
                          >
                            <div className="pt-6 pl-10 sm:pl-[3.25rem]">
                              <p className="text-sm leading-relaxed text-muted-foreground">
                                {item.description}
                              </p>
                              <div className="mt-6 flex flex-wrap gap-2">
                                {item.technologies.map((tech) => (
                                  <span
                                    key={tech}
                                    className="rounded-full border border-border/80 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </MotionDiv>
                );
              })}
            </MotionDiv>

            {/* Right Column: Sticky Detail Panel (Desktop only) */}
            <div className="hidden lg:block sticky top-32">
              <div className="relative border border-border bg-surface/35 backdrop-blur-sm p-10 pb-12 overflow-hidden flex flex-col justify-between" style={{ minHeight: '420px' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="flex flex-col h-full relative z-10"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-6xl font-black text-foreground/5 tabular-nums leading-none">
                        {(activeIndex + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand px-3 py-1.5 border border-brand/20 bg-brand/5 rounded-full">
                        {experience.items[activeIndex].period}
                      </span>
                    </div>
                    
                    <div className="mt-8">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground mb-3">
                        {experience.items[activeIndex].company}
                        {experience.items[activeIndex].location ? ` · ${experience.items[activeIndex].location}` : ''}
                      </p>
                      <h4 className="text-3xl font-black uppercase leading-tight tracking-tight text-foreground">
                        {experience.items[activeIndex].role}
                      </h4>
                    </div>

                    <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground/90">
                      {experience.items[activeIndex].description}
                    </p>

                    {/* tag spacer */}
                    <div className="flex-grow min-h-[3rem]" />
                    
                    <div className="flex flex-wrap gap-2">
                      {experience.items[activeIndex].technologies.map(tech => (
                        <span
                          key={tech}
                          className="rounded-full bg-foreground/5 border border-border/50 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:bg-foreground/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Subtle aesthetic backdrop for panel */}
                <div className="absolute -bottom-24 -right-24 w-[300px] h-[300px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
              </div>
            </div>

          </div>
        </Container>
      </div>
    </MotionSection>
  );
}
