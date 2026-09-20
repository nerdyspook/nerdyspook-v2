import { useEffect, useRef } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'

const visible = { opacity: 1, y: 0 }

// Reveal each entry once. Content stays readable before JavaScript runs.
const ScrollReveal = ({ children }) => {
  const ref = useRef(null)
  const revealed = useRef(false)
  const controls = useAnimation()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (
      reduceMotion !== false ||
      revealed.current ||
      typeof IntersectionObserver === 'undefined'
    ) {
      controls.set(visible)
      return
    }

    controls.set({ opacity: 0, y: 12 })
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        revealed.current = true
        controls.start({
          ...visible,
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
        })
        observer.disconnect()
      },
      { threshold: 0.1, rootMargin: '0px 0px -16px 0px' }
    )
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
      controls.stop()
    }
  }, [controls, reduceMotion])

  return (
    <motion.div ref={ref} initial={false} animate={controls}>
      {children}
    </motion.div>
  )
}

export default ScrollReveal
