import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Blog from '@/components/Blog'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Services from '@/components/Services'
import Community from '@/components/Community'
import Certifications from '@/components/Certifications'
import Contact from '@/components/Contact'
import PaperTexture from '@/components/PaperTexture'

export default function Home() {
  return (
    <main className="min-h-screen relative" style={{ backgroundColor: 'var(--color-primary)' }}>
      <PaperTexture />
      <div className="relative z-10">
      <Navigation />
      <Hero />
      <Community />
      <Experience />
      <Projects />
      <Blog />
      <Certifications />
      <Services />
      <Contact />
      </div>
    </main>
  )
}

