import Navigation from '@/components/Navigation'
import ParticleBackground from '@/components/ParticleBackground'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Community from '@/components/Community'
import Certifications from '@/components/Certifications'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Three.js particle background */}
      <ParticleBackground />
      
      {/* Main content */}
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Community />
        <Certifications />
        <Contact />
        <Footer />
      </div>
    </main>
  )
}
