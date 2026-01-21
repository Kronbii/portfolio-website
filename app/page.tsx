import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Blog from '@/components/Blog'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Services from '@/components/Services'
import Community from '@/components/Community'
import Certifications from '@/components/Certifications'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#EAEAEA]" style={{ backgroundColor: '#EAEAEA' }}>
      <Navigation />
      <Hero />
      <Blog />
      <About />
      <Experience />
      <Community />
      <Projects />
      <Certifications />
      <Services />
      <Contact />
    </main>
  )
}

