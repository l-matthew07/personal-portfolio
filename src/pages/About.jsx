import { motion } from 'framer-motion'
import '../styles/Page.css'
import '../styles/About.css'

const About = () => {
  const backgroundImage = '/images/skelly/IMG_3401.PNG'

  const skills = [
    'React',
    'JavaScript',
    'TypeScript',
    'Node.js',
    'Python',
    'UI/UX Design',
    'GraphQL',
    'Docker',
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
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
        className="content about-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="page-title" variants={itemVariants}>
          About Me
        </motion.h1>
        <motion.div className="about-text" variants={itemVariants}>
          <p>
            I'm a passionate developer and designer with a love for creating
            beautiful, functional digital experiences. With years of experience
            in web development, I specialize in building modern, responsive
            applications that combine elegant design with robust functionality.
          </p>
          <p>
            My approach to development is centered around user experience,
            performance, and clean code. I believe in continuous learning and
            staying up-to-date with the latest technologies and best practices
            in the industry.
          </p>
        </motion.div>
        <motion.div className="skills-section" variants={itemVariants}>
          <h2>Skills & Technologies</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                className="skill-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 200,
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default About

