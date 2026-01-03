import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import '../styles/Page.css'

const Home = () => {
  const backgroundImage = '/images/skelly/IMG_1366.PNG'

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
    <motion.div
      className="page-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/projects" className="cta-button">
              View My Work
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Home

