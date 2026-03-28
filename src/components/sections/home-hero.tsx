import { cn } from '@/lib/utils'
import { homeContent } from '@/content/home'
import WoofyHoverImage from '@/components/lightswind/woofy-hover-image'

import styles from './home-hero.module.css'

export function HomeHeroSection() {
  const { hero } = homeContent

  return (
    <section
      id="home"
      className={cn('relative min-h-svh overflow-hidden bg-background', styles.section)}
    >
      {/* Top bar — three captions */}
      <div className={styles.topBar}>
        <img src="/images/home/sig.png" alt="Signature" className={styles.signatureMark} />
        <span className={styles.specialtyText}>{hero.specialty}</span>
        <a href={hero.secondaryCta.href} className={styles.contactCta}>
          {hero.secondaryCta.label}
        </a>
      </div>

      {/* Portrait — background layer, bottom-centered */}
      <div className={styles.portraitLayer}>
        <div className={styles.portraitFrame}>
          <div className={styles.portraitGlow} aria-hidden />
          <img
            src={hero.image.src}
            alt={hero.image.alt}
            className="absolute inset-0 z-10 h-full w-full object-cover sm:hidden"
            loading="eager"
            decoding="async"
          />
          <WoofyHoverImage
            src={hero.image.src}
            alt={hero.image.alt}
            width="100%"
            height="100%"
            className="absolute inset-0 z-10 hidden sm:block"
          />
        </div>
      </div>

      {/* Text overlay — centered, above fade */}
      <div className={styles.textOverlay}>
        <div className={styles.nameBlock}>
          <span className={styles.roleText}>{hero.role}</span>
          <h1 className={styles.nameHeading}>{hero.name}</h1>
          <p className={styles.missionText}>{hero.mission}</p>
        </div>
      </div>

      {/* Bottom fade — covers the portrait feet */}
      <div className={styles.fade} aria-hidden />
    </section>
  )
}
