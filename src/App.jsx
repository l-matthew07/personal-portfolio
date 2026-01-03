import { useEffect, useRef, useState } from 'react'
import Navigation from './components/Navigation'
import Compass from './components/Compass'
import HomeSection from './sections/HomeSection'
import ProjectsSection from './sections/ProjectsSection'
import AboutSection from './sections/AboutSection'
import ContactSection from './sections/ContactSection'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [slideDirection, setSlideDirection] = useState(null)
  const homeRef = useRef(null)
  const projectsRef = useRef(null)
  const aboutRef = useRef(null)
  const contactRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'home', ref: homeRef },
        { id: 'projects', ref: projectsRef },
        { id: 'about', ref: aboutRef },
        { id: 'contact', ref: contactRef },
      ]

      const scrollPosition = window.scrollY + 150 // Account for nav height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect()
          const sectionTop = rect.top + window.scrollY
          const sectionBottom = sectionTop + rect.height
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId, direction = null) => {
    if (direction) {
      setSlideDirection(direction)
      setTimeout(() => setSlideDirection(null), 600) // Reset after animation
    }

    const refs = {
      home: homeRef,
      projects: projectsRef,
      about: aboutRef,
      contact: contactRef,
    }

    const ref = refs[sectionId]
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="app-container">
      <Navigation activeSection={activeSection} scrollToSection={scrollToSection} />
      <Compass scrollToSection={scrollToSection} activeSection={activeSection} />
      <HomeSection ref={homeRef} scrollToSection={scrollToSection} slideDirection={slideDirection} />
      <ProjectsSection ref={projectsRef} slideDirection={slideDirection} />
      <AboutSection ref={aboutRef} slideDirection={slideDirection} />
      <ContactSection ref={contactRef} slideDirection={slideDirection} />
    </div>
  )
}

export default App
