import { HomeAboutSection } from '@/components/sections/home-about'
import { HomeCapabilitiesSection } from '@/components/sections/home-capabilities'
import { HomeProjectsSection } from '@/components/sections/home-projects'
import { HomeCommunitySection } from '@/components/sections/home-community'
import { HomeContactSection } from '@/components/sections/home-contact'
import { HomeHeroSection } from '@/components/sections/home-hero'
import { SiteFooterSection } from '@/components/sections/site-footer'

export default function HomePage() {
  return (
    <main className="snap-y snap-mandatory">
      <div className="section-theme-dark snap-start snap-always">
        <HomeHeroSection />
      </div>
      <div className="section-theme-light snap-start snap-always">
        <HomeAboutSection />
      </div>
      <div className="section-theme-dark snap-start snap-always">
        <HomeCapabilitiesSection />
      </div>
      <div className="section-theme-light snap-start snap-always">
        <HomeProjectsSection />
      </div>
      <div className="section-theme-dark snap-start snap-always">
        <HomeCommunitySection />
      </div>
      <div className="section-theme-light snap-start snap-always">
        <HomeContactSection />
      </div>
      <div className="section-theme-dark snap-start snap-always">
        <SiteFooterSection />
      </div>
    </main>
  )
}
