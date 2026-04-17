'use client';

import { DotWave } from '@/components/ui/dot-wave';

export function HomeExperienceSection() {
  return (
    <section
      id="experience"
      className="relative min-h-svh overflow-hidden"
    >
      <DotWave
        bgColor="#0c0c0c"
        dotColor="#9d201a"
        dotGap={24}
        dotRadiusMax={2}
        lightIntensity={0.55}
        fadeIntensity={0.12}
        expansionSpeed={180}
        repeatAnimation
        className="absolute inset-0 w-full h-full"
      />
      {/* content goes here */}
    </section>
  );
}
