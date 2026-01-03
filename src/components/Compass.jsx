import { useState, useRef } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import '../styles/Compass.css'

const Compass = ({ scrollToSection, activeSection }) => {
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 })
  const [isJoystickDragging, setIsJoystickDragging] = useState(false)
  const [joystickStartPos, setJoystickStartPos] = useState({ x: 0, y: 0 })
  const compassRef = useRef(null)
  const joystickRef = useRef(null)
  
  const joystickX = useMotionValue(0)
  const joystickY = useMotionValue(0)
  const maxDistance = 25 // Maximum distance from center along each axis

  // Handle joystick drag - constrained to cardinal directions
  const handleJoystickDragStart = () => {
    setIsJoystickDragging(true)
    setJoystickStartPos({ x: joystickX.get(), y: joystickY.get() })
  }

  const handleJoystickDrag = (event, info) => {
    if (!compassRef.current) return
    
    // Calculate new position from start position + offset
    const newX = joystickStartPos.x + info.offset.x
    const newY = joystickStartPos.y + info.offset.y
    
    // Constrain to cardinal directions (only move along X or Y axis, not diagonally)
    const absX = Math.abs(newX)
    const absY = Math.abs(newY)
    
    let constrainedX = 0
    let constrainedY = 0
    
    // Determine which axis has more movement
    if (absX > absY) {
      // Moving horizontally (left or right)
      constrainedX = Math.max(-maxDistance, Math.min(maxDistance, newX))
      constrainedY = 0
    } else if (absY > absX) {
      // Moving vertically (up or down)
      constrainedX = 0
      constrainedY = Math.max(-maxDistance, Math.min(maxDistance, newY))
    } else {
      // Equal movement - keep current position
      constrainedX = joystickStartPos.x
      constrainedY = joystickStartPos.y
    }
    
    setJoystickPosition({ x: constrainedX, y: constrainedY })
    joystickX.set(constrainedX)
    joystickY.set(constrainedY)
  }

  const handleJoystickDragEnd = () => {
    setIsJoystickDragging(false)
    
    const { x, y } = joystickPosition
    const threshold = 15 // Minimum distance to trigger navigation
    
    // Determine direction based on position
    let direction = null
    
    if (Math.abs(x) > Math.abs(y)) {
      // Horizontal movement
      if (x > threshold) {
        direction = 'right' // Contact
      } else if (x < -threshold) {
        direction = 'left' // About
      }
    } else {
      // Vertical movement
      if (y > threshold) {
        direction = 'down' // Home
      } else if (y < -threshold) {
        direction = 'up' // Projects
      }
    }
    
    if (direction) {
      const directions = {
        up: 'projects',
        left: 'about',
        right: 'contact',
        down: 'home',
      }
      scrollToSection(directions[direction], direction)
    }
    
    // Reset joystick position
    setJoystickPosition({ x: 0, y: 0 })
    animate(joystickX, 0, { type: 'spring', stiffness: 400, damping: 25 })
    animate(joystickY, 0, { type: 'spring', stiffness: 400, damping: 25 })
  }

  return (
    <motion.div
      className="compass-container"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <div ref={compassRef} className="compass">
        {/* Compass circle */}
        <div className="compass-circle">
          {/* Static arrow lines extending from center */}
          <svg className="compass-arrows" viewBox="0 0 120 120" preserveAspectRatio="none">
            {/* Up arrow */}
            <line x1="60" y1="60" x2="60" y2="15" stroke="rgba(0, 212, 255, 0.6)" strokeWidth="2.5" />
            <polygon points="60,15 52,25 68,25" fill="rgba(0, 212, 255, 0.6)" />
            {/* Down arrow */}
            <line x1="60" y1="60" x2="60" y2="105" stroke="rgba(0, 212, 255, 0.6)" strokeWidth="2.5" />
            <polygon points="60,105 52,95 68,95" fill="rgba(0, 212, 255, 0.6)" />
            {/* Left arrow */}
            <line x1="60" y1="60" x2="15" y2="60" stroke="rgba(0, 212, 255, 0.6)" strokeWidth="2.5" />
            <polygon points="15,60 25,52 25,68" fill="rgba(0, 212, 255, 0.6)" />
            {/* Right arrow */}
            <line x1="60" y1="60" x2="105" y2="60" stroke="rgba(0, 212, 255, 0.6)" strokeWidth="2.5" />
            <polygon points="105,60 95,52 95,68" fill="rgba(0, 212, 255, 0.6)" />
          </svg>

          {/* Crosshair lines */}
          <div className="compass-line compass-line-vertical" />
          <div className="compass-line compass-line-horizontal" />

          {/* Joystick center dot */}
          <motion.div
            ref={joystickRef}
            className="compass-center"
            style={{
              x: joystickX,
              y: joystickY,
            }}
            drag
            dragConstraints={false}
            dragElastic={0}
            onDrag={handleJoystickDrag}
            onDragStart={handleJoystickDragStart}
            onDragEnd={handleJoystickDragEnd}
            whileDrag={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          />
        </div>

        {/* Text labels positioned outside the compass - always visible, not clickable */}
        <div
          className={`compass-label compass-label-up ${activeSection === 'projects' ? 'active' : ''}`}
        >
          PROJECTS
        </div>
        
        <div
          className={`compass-label compass-label-left ${activeSection === 'about' ? 'active' : ''}`}
        >
          ABOUT
        </div>
        
        <div
          className={`compass-label compass-label-right ${activeSection === 'contact' ? 'active' : ''}`}
        >
          CONTACT
        </div>
        
        <div
          className={`compass-label compass-label-down ${activeSection === 'home' ? 'active' : ''}`}
        >
          HOME
        </div>
      </div>
    </motion.div>
  )
}

export default Compass
