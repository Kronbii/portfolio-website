import Image from 'next/image'

import { cn } from '@/lib/utils'

import styles from './home-hero.module.css'

export function HomeHeroSection() {
  return (
    <section
      id="home"
      className={cn('relative min-h-screen overflow-hidden bg-background', styles.section)}
    >
      {/* Portrait — background layer, bottom-centered */}
      <div className={styles.portraitLayer}>
        <div className={styles.portraitFrame}>
          <div className={styles.portraitGlow} aria-hidden />
          <Image
            src="/images/home/portrait.png"
            alt="Portrait of Rami Kronbi"
            fill
            priority
            sizes="(max-width: 639px) 86vw, (max-width: 1023px) 74vw, 52vw"
            className="object-contain object-bottom relative z-10"
          />
        </div>
      </div>

      {/* Text overlay — centered, above fade */}
      <div className={styles.textOverlay}>
        <div className={styles.nameBlock}>
          <span className={styles.roleText}>Systems Engineer</span>
          <h1 className={styles.nameHeading}>Rami Kronbi</h1>
        </div>
      </div>

      {/* Bottom fade — covers the portrait feet */}
      <div className={styles.fade} aria-hidden />
    </section>
  )
}
