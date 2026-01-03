import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import '../styles/Page.css'

const HomeSection = forwardRef(({ scrollToSection, slideDirection }, ref) => {
  const backgroundImage = '/images/skelly/IMG_1366.PNG'

  // Slide animation variants based on direction
  const getSlideVariants = () => {
    if (slideDirection === 'down') {
      return { x: 0, y: -100, opacity: 0 }
    }
    return { x: 0, y: 0, opacity: 0 }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
      id="home"
      className="page-container section"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
      initial={getSlideVariants()}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ 
        duration: slideDirection ? 0.6 : 0.5,
        ease: 'easeOut'
      }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <div className="overlay" />
      <motion.div
        className="content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="hero-title" variants={itemVariants}>
          Welcome to My Portfolio
        </motion.h1>
        <motion.p className="hero-subtitle" variants={itemVariants}>
          Creative Developer & Designer
        </motion.p>
        <motion.p className="hero-description" variants={itemVariants}>
          Building innovative digital experiences with passion and precision
        </motion.p>
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={() => scrollToSection('projects')}
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  )
})

HomeSection.displayName = 'HomeSection'

export default HomeSection

