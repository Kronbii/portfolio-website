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
      <HomeHeroSection />
      <HomeAboutSection />
      <HomeCapabilitiesSection />
      <HomeProjectsSection />
      <HomeCommunitySection />
      <HomeContactSection />
      <SiteFooterSection />
    </main>
  )
}
