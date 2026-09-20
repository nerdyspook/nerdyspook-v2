import { useReducedMotionPreference } from './motion-preferences'
import { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'

const visible = { opacity: 1, transform: 'translateY(0px)' }

// Reveal each entry once. Content stays readable before JavaScript runs.
const ScrollReveal = ({ children }) => {
  const ref = useRef(null)
  const revealed = useRef(false)
  const controls = useAnimation()
  const reduceMotion = useReducedMotionPreference()

  useEffect(() => {
    if (
      reduceMotion !== false ||
      revealed.current ||
      typeof IntersectionObserver === 'undefined'
    ) {
      controls.set(visible)
      return
    }

    controls.set({ opacity: 0, transform: 'translateY(12px)' })
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
    <motion.div
      ref={ref}
      initial={false}
      animate={controls}
      onFocusCapture={() => {
        revealed.current = true
        controls.set(visible)
      }}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
