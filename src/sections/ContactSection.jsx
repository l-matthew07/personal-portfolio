import { forwardRef } from 'react'
import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import '../styles/Page.css'
import '../styles/Contact.css'

const ContactSection = forwardRef(({ slideDirection }, ref) => {
  const backgroundImage = '/images/skelly/IMG_3246.PNG'
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Thank you for your message! I\'ll get back to you soon.')
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  const getSlideVariants = () => {
    if (slideDirection === 'right') {
      return { x: -100, y: 0, opacity: 0 }
    }
    return { x: 0, y: 0, opacity: 0 }
  }

  return (
    <motion.section
      ref={ref}
      id="contact"
      className="page-container section"
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
      <div className="overlay" />
      <motion.div
        className="content contact-content"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.h1 className="page-title" variants={itemVariants}>
          Get In Touch
        </motion.h1>
        <motion.p className="contact-subtitle" variants={itemVariants}>
          Have a project in mind? Let's work together to bring your ideas to life.
        </motion.p>
        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          <motion.input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows="6"
            required
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button
            type="submit"
            className="submit-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </motion.form>
        <motion.div className="social-links" variants={itemVariants}>
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            GitHub
          </motion.a>
          <motion.a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: -5 }}
          >
            LinkedIn
          </motion.a>
          <motion.a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            Twitter
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.section>
  )
})

ContactSection.displayName = 'ContactSection'

export default ContactSection

