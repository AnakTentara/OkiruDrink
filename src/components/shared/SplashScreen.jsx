import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './SplashScreen.css'

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('logo') // logo → tagline → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('tagline'), 800)
    const t2 = setTimeout(() => setPhase('exit'), 2000)
    const t3 = setTimeout(() => onFinish(), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onFinish])

  return (
    <AnimatePresence>
      {phase !== 'exit' ? null : null}
      <motion.div
        className="splash-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        animate={phase === 'exit' ? { opacity: 0, scale: 1.08 } : { opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Animated background orbs */}
        <div className="splash-orb splash-orb-1" />
        <div className="splash-orb splash-orb-2" />
        <div className="splash-orb splash-orb-3" />

        {/* Grid overlay */}
        <div className="splash-grid" />

        <div className="splash-content">
          {/* Logo */}
          <motion.div
            className="splash-logo-wrap"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          >
            <img src="/logo.jpg" alt="OkiruDrink" className="splash-logo" />
            <motion.div
              className="splash-logo-ring"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            />
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            className="splash-brand"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            OkiruDrink
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="splash-tagline"
            initial={{ opacity: 0, y: 10 }}
            animate={phase === 'logo' ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Healthy but Tasty 🌿
          </motion.p>

          {/* Loading dots */}
          <motion.div
            className="splash-dots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="splash-dot"
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>
        </div>

        {/* Bottom text */}
        <motion.p
          className="splash-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'tagline' ? 0.6 : 0 }}
          transition={{ duration: 0.3 }}
        >
          Teh Jintan Alami dari Muara Enim
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}
