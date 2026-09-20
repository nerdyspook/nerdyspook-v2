import { forwardRef } from 'react'
import { Button, IconButton } from '@chakra-ui/react'
import { motion, useReducedMotion } from 'framer-motion'

const MotionButton = motion.create(Button)
const MotionIconButton = motion.create(IconButton)
const spring = { type: 'spring', stiffness: 500, damping: 30 }

export const AnimatedButton = forwardRef(
  ({ children, rightIcon, ...props }, ref) => {
    const reduceMotion = useReducedMotion()
    const motionEnabled = reduceMotion === false

    return (
      <MotionButton
        ref={ref}
        tabIndex={0}
        transitionProperty="background-color, border-color, color, box-shadow"
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileFocus="hover"
        whileTap={motionEnabled ? { scale: 0.97 } : undefined}
        variants={{ rest: { y: 0 }, hover: { y: motionEnabled ? -1 : 0 } }}
        transition={motionEnabled ? spring : { duration: 0 }}
        rightIcon={
          rightIcon && (
            <motion.span
              style={{ display: 'inline-flex' }}
              variants={{ rest: { x: 0 }, hover: { x: motionEnabled ? 3 : 0 } }}
              transition={motionEnabled ? spring : { duration: 0 }}
            >
              {rightIcon}
            </motion.span>
          )
        }
        {...props}
      >
        {children}
      </MotionButton>
    )
  }
)

export const AnimatedIconButton = forwardRef((props, ref) => {
  const reduceMotion = useReducedMotion()
  const motionEnabled = reduceMotion === false

  return (
    <MotionIconButton
      ref={ref}
      tabIndex={0}
      transitionProperty="background-color, border-color, color, box-shadow"
      whileHover={motionEnabled ? { y: -1 } : undefined}
      whileTap={motionEnabled ? { scale: 0.94 } : undefined}
      transition={motionEnabled ? spring : { duration: 0 }}
      {...props}
    />
  )
})
