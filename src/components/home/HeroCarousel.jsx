import React, { useState, useEffect, useRef } from 'react'
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

export default function HeroCarousel() {
  const [active, setActive]   = useState(0)
  const [direction, setDir]   = useState(1)
  const timerRef = useRef(null)

  const goTo = (idx) => {
    setDir(idx > active ? 1 : -1)
    setActive(idx)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDir(1)
      setActive(prev => (prev + 1) % slides.length)
    }, 4200)
    return () => clearInterval(timerRef.current)
  }, [])

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

      {/* Dots */}
      <div className="carousel-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`dot ${i === active ? 'dot-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
