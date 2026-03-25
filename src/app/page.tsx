import { HomeAboutSection } from '@/components/sections/home-about'
import { HomeCapabilitiesSection } from '@/components/sections/home-capabilities'
import { HomeProjectsSection } from '@/components/sections/home-projects'
import { HomeCommunitySection } from '@/components/sections/home-community'
import { HomeContactSection } from '@/components/sections/home-contact'
import { HomeHeroSection } from '@/components/sections/home-hero'
import { SiteFooterSection } from '@/components/sections/site-footer'

export default function HomePage() {
  return (
    <main>
      <div className="section-theme-dark">
        <HomeHeroSection />
      </div>
      <div className="section-theme-light">
        <HomeAboutSection />
      </div>
      <div className="section-theme-dark">
        <HomeCapabilitiesSection />
      </div>
      <div className="section-theme-light">
        <HomeProjectsSection />
      </div>
      <div className="section-theme-dark">
        <HomeCommunitySection />
      </div>
      <div className="section-theme-light">
        <HomeContactSection />
      </div>
      <div className="section-theme-dark">
        <SiteFooterSection />
      </div>
    </main>
  )
}
