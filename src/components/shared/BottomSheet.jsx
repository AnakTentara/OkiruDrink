import React, { useEffect } from 'react'
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { X } from 'lucide-react'
import './BottomSheet.css'

export default function BottomSheet({ isOpen, onClose, title, children }) {
  const controls = useAnimation()
  const y = useMotionValue(0)

  // When isOpen changes, animate to appropriate state
  useEffect(() => {
    if (isOpen) {
      // Animate from bottom to default position (0)
      controls.start('visible')
    } else {
      controls.start('hidden')
    }
  }, [isOpen, controls])

  // Handle drag end to determine whether to snap to top, snap to default, or close
  const handleDragEnd = (event, info) => {
    const offset = info.offset.y
    const velocity = info.velocity.y

    // If dragged down significantly or with high velocity, close
    if (offset > 150 || velocity > 500) {
      onClose()
    } 
    // If dragged up significantly or with high negative velocity, snap to full screen
    else if (offset < -150 || velocity < -500) {
      controls.start('full')
    } 
    // Otherwise return to default 75% height position
    else {
      controls.start('visible')
    }
  }

  // Backdrop opacity tied to y value (fade out as dragged down)
  // At y=0 (default 75%), opacity is 1
  // At y=vh (bottom), opacity is 0
  const backdropOpacity = useTransform(y, [0, 500], [1, 0])

  if (!isOpen) return null

  return (
    <>
      <motion.div
        className="bs-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ opacity: backdropOpacity }}
        onClick={onClose}
      />
      <motion.div
        className="bs-container"
        initial="hidden"
        animate={controls}
        exit="hidden"
        custom={window.innerHeight}
        variants={{
          hidden: { y: '100%', transition: { type: 'spring', stiffness: 400, damping: 40 } },
          visible: { y: '25%', transition: { type: 'spring', stiffness: 400, damping: 40 } }, // 75% height
          full: { y: '0%', transition: { type: 'spring', stiffness: 400, damping: 40 } }     // 100% height
        }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }} // Allows pulling beyond bounds but snaps back based on handleDragEnd
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ y }}
      >
        <div className="bs-handle-area">
          <div className="bs-handle" />
        </div>
        
        <div className="bs-header">
          <button className="bs-close-btn" onClick={onClose} aria-label="Tutup">
            <X size={20} />
          </button>
          <h3 className="bs-title">{title}</h3>
          <div style={{ width: 36 }} /> {/* Spacer to balance header */}
        </div>

        <div className="bs-content">
          {children}
        </div>
      </motion.div>
    </>
  )
}
