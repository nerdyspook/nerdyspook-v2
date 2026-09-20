import { useReducedMotionPreference } from './motion-preferences'
import { useEffect, useRef, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'

// Adjust these values to change the pulse without touching the timeline layout.
const pulse = {
  transform: ['scale(1)', 'scale(2.8)'],
  opacity: [0.5, 0],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    repeatDelay: 0.3,
    ease: 'easeOut'
  }
}

const TimelineDot = ({ color }) => {
  const dotRef = useRef(null)
  const reduceMotion = useReducedMotionPreference()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (reduceMotion !== false) return

    let inView = false
    const updateVisibility = () => {
      setIsVisible(inView && document.visibilityState === 'visible')
    }
    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting
            updateVisibility()
          })
        : null

    if (observer) {
      observer.observe(dotRef.current)
    } else {
      inView = true
      updateVisibility()
    }
    document.addEventListener('visibilitychange', updateVisibility)

    return () => {
      observer?.disconnect()
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [reduceMotion])

  const shouldPulse = reduceMotion === false && isVisible

  return (
    <Box
      ref={dotRef}
      as="span"
      aria-hidden="true"
      position="absolute"
      left={0}
      top="8px"
      boxSize="11px"
      color={color}
      pointerEvents="none"
    >
      <motion.span
        initial={false}
        animate={
          shouldPulse ? pulse : { transform: 'scale(1.8)', opacity: 0.18 }
        }
        transition={{ duration: 0 }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'currentColor'
        }}
      />
      <Box
        as="span"
        position="absolute"
        inset={0}
        borderRadius="full"
        bg="currentColor"
      />
    </Box>
  )
}

export default TimelineDot
