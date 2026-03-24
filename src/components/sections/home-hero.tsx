import { cn } from '@/lib/utils'
import WoofyHoverImage from '@/components/lightswind/woofy-hover-image'

import styles from './home-hero.module.css'

export function HomeHeroSection() {
  return (
    <section
      id="home"
      className={cn('relative min-h-screen overflow-hidden bg-background', styles.section)}
    >
      {/* Top bar — three captions */}
      <div className={styles.topBar}>
        <span>Based in Lebanon</span>
        <span>Specializing in AI, Robotics, &amp; Web</span>
        <a href="#contact" className={styles.contactCta}>
          Contact
        </a>
      </div>

      {/* Portrait — background layer, bottom-centered */}
      <div className={styles.portraitLayer}>
        <div className={styles.portraitFrame}>
          <div className={styles.portraitGlow} aria-hidden />
          <WoofyHoverImage
            src="/images/home/portrait.png"
            revealSrc="/images/home/test-2.png"
            alt="Portrait of Rami Kronbi"
            width="100%"
            height="100%"
            mode="effect"
            className="absolute inset-0 z-10"
          />
        </div>
      </div>

      {/* Text overlay — centered, above fade */}
      <div className={styles.textOverlay}>
        <div className={styles.nameBlock}>
          <span className={styles.roleText}>Systems Engineer</span>
          <h1 className={styles.nameHeading}>Rami Kronbi</h1>
          <p className={styles.missionText}>For all humanity</p>
        </div>
      </div>

      {/* Bottom fade — covers the portrait feet */}
      <div className={styles.fade} aria-hidden />
    </section>
  )
}
