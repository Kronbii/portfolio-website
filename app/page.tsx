import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Skills from '@/components/Skills'
import Services from '@/components/Services'
import Certifications from '@/components/Certifications'
import Standout from '@/components/Standout'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <About />
      <Projects />
      <Skills />
      <Certifications />
      <Contact />
    </main>
  )
}

