import type { CSSProperties } from 'react'
import Image from 'next/image'

const heroImageConfig = {
  mobile: {
    height: '92vh',
    width: 'min(86vw, 42rem)',
  },
  tablet: {
    height: '94vh',
    width: 'min(74vw, 46rem)',
  },
  desktop: {
    height: '110vh',
    width: 'min(52vw, 52rem)',
  },
  position: {
    x: '-50px',
    y: '0px',
  },
}

const heroFadeConfig = {
  mobile: '14rem',
  tablet: '18rem',
  desktop: '24rem',
}

const heroFadeProfile = {
  solidOpacity: 1,
  solidUntil: '10%',
  midOpacity: 0.75,
  midPoint: '80%',
  endOpacity: 0,
  endPoint: '100%',
}

export function HomeHeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#0c0c0c]"
      style={
        {
          '--hero-image-height-mobile': heroImageConfig.mobile.height,
          '--hero-image-width-mobile': heroImageConfig.mobile.width,
          '--hero-image-height-tablet': heroImageConfig.tablet.height,
          '--hero-image-width-tablet': heroImageConfig.tablet.width,
          '--hero-image-height-desktop': heroImageConfig.desktop.height,
          '--hero-image-width-desktop': heroImageConfig.desktop.width,
          '--hero-fade-height-mobile': heroFadeConfig.mobile,
          '--hero-fade-height-tablet': heroFadeConfig.tablet,
          '--hero-fade-height-desktop': heroFadeConfig.desktop,
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 flex items-end justify-center">
        <div
          className="relative h-[var(--hero-image-height-mobile)] w-[var(--hero-image-width-mobile)] sm:h-[var(--hero-image-height-tablet)] sm:w-[var(--hero-image-width-tablet)] lg:h-[var(--hero-image-height-desktop)] lg:w-[var(--hero-image-width-desktop)]"
          style={{
            transform: `translate(${heroImageConfig.position.x}, ${heroImageConfig.position.y})`,
          }}
        >
          <Image
            src="/images/home/portrait.png"
            alt="Portrait of Rami Kronbi"
            fill
            priority
            sizes="(max-width: 639px) 86vw, (max-width: 1023px) 74vw, 52vw"
            className="object-contain object-bottom"
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[var(--hero-fade-height-mobile)] sm:h-[var(--hero-fade-height-tablet)] lg:h-[var(--hero-fade-height-desktop)]"
        style={{
          background: `linear-gradient(
            to top,
            rgba(12, 12, 12, ${heroFadeProfile.solidOpacity}) 0%,
            rgba(12, 12, 12, ${heroFadeProfile.solidOpacity}) ${heroFadeProfile.solidUntil},
            rgba(12, 12, 12, ${heroFadeProfile.midOpacity}) ${heroFadeProfile.midPoint},
            rgba(12, 12, 12, ${heroFadeProfile.endOpacity}) ${heroFadeProfile.endPoint}
          )`,
        }}
      />
    </section>
  )
}
