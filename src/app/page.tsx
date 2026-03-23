import { HomeCapabilitiesSection } from '@/components/sections/home-capabilities'
import { HomeContactPlaceholderSection } from '@/components/sections/home-contact-placeholder'
import { HomeHeroSection } from '@/components/sections/home-hero'
import { HomeProjectsSection } from '@/components/sections/home-projects'

export default function HomePage() {
  return (
    <main>
      <HomeHeroSection />
      <HomeCapabilitiesSection />
      <HomeProjectsSection />
      <HomeContactPlaceholderSection />
    </main>
  )
}
