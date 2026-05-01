import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './HeroCarousel.css'

const slides = [
  {
    id: 1,
    image: '/assets/banner_promo.png',
    alt: 'Promo Beli 2 Gratis 1',
  },
  {
    id: 2,
    image: '/assets/banner_fresh.png',
    alt: 'Rasakan Kesegaran Alami',
  },
  {
    id: 3,
    image: '/assets/banner_health.png',
    alt: 'Sehat dan Menyegarkan',
  },
]

const INTERVAL = 4200

export default function HeroCarousel() {
  const [active, setActive] = useState(0)
  const [direction, setDir] = useState(1)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const progressRef = useRef(null)
  const startTimeRef = useRef(Date.now())

  const resetProgress = useCallback(() => {
    startTimeRef.current = Date.now()
    setProgress(0)
  }, [])

  const goTo = (idx) => {
    setDir(idx > active ? 1 : -1)
    setActive(idx)
    resetProgress()
  }

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDir(1)
      setActive(prev => (prev + 1) % slides.length)
      resetProgress()
    }, INTERVAL)
    return () => clearInterval(timerRef.current)
  }, [resetProgress])

  // Progress animation frame
  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const pct = Math.min(elapsed / INTERVAL, 1)
      setProgress(pct)
      if (pct < 1) {
        progressRef.current = requestAnimationFrame(animate)
      }
    }
    progressRef.current = requestAnimationFrame(animate)
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current)
    }
  }, [active])

  const variants = {
    enter:  (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  return (
    <div className="hero-carousel">
      <div className="carousel-track">
        <AnimatePresence custom={direction} mode="popLayout">
          <motion.div
            key={slides[active].id}
            className="carousel-slide"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            <img
              src={slides[active].image}
              alt={slides[active].alt}
              className="carousel-img"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="carousel-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`dot ${i === active ? 'dot-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          >
            {i === active && (
              <span
                className="dot-progress"
                style={{ transform: `scaleX(${progress})` }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
