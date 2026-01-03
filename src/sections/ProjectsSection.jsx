import { forwardRef } from 'react'
import { motion, useInView } from 'framer-motion'
import '../styles/Page.css'
import '../styles/Projects.css'

const ProjectsSection = forwardRef(({ slideDirection }, ref) => {
  const backgroundImage = '/images/skelly/IMG_1367.PNG'
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const getSlideVariants = () => {
    if (slideDirection === 'up') {
      return { x: 0, y: 100, opacity: 0 }
    }
    return { x: 0, y: 0, opacity: 0 }
  }

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      introduction: 'A modern, full-stack e-commerce solution built with React and Node.js. Features include real-time inventory management, secure payment processing, and an intuitive admin dashboard.',
      link: 'https://github.com/example/ecommerce-platform',
    },
    {
      id: 2,
      title: 'AI-Powered Analytics Dashboard',
      introduction: 'An intelligent data visualization platform that leverages machine learning to provide actionable insights. Built with Python, TensorFlow, and D3.js for stunning interactive charts.',
      link: 'https://github.com/example/ai-analytics',
    },
    {
      id: 3,
      title: 'Mobile Fitness App',
      introduction: 'A comprehensive fitness tracking application for iOS and Android. Includes workout planning, progress tracking, social features, and integration with wearable devices.',
      link: 'https://github.com/example/fitness-app',
    },
    {
      id: 4,
      title: 'Blockchain Voting System',
      introduction: 'A secure, transparent voting platform built on blockchain technology. Ensures election integrity through cryptographic verification and decentralized consensus mechanisms.',
      link: 'https://github.com/example/blockchain-voting',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.section
      ref={ref}
      id="projects"
      className="page-container section projects-overlay-section"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
      initial={getSlideVariants()}
      animate={{ x: 0, y: 0, opacity: 1 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ 
        duration: slideDirection ? 0.6 : 0.8, 
        ease: 'easeInOut' 
      }}
    >
      <div className="overlay projects-overlay" />
      <div className="content projects-content">
        <motion.h1
          className="page-title"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          My Projects
        </motion.h1>
        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="project-card"
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h2 className="project-title">{project.title}</h2>
              <p className="project-intro">{project.introduction}</p>
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link"
                whileHover={{ x: 5 }}
              >
                View Project →
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
})

ProjectsSection.displayName = 'ProjectsSection'

export default ProjectsSection

