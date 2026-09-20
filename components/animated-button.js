import { useReducedMotionPreference } from './motion-preferences'
import { forwardRef } from 'react'
import { Button, IconButton } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionButton = motion.create(Button)
const MotionIconButton = motion.create(IconButton)
const spring = { type: 'spring', stiffness: 500, damping: 30 }
const restTransform = 'translateY(0px) scale(1)'

export const AnimatedButton = forwardRef(
  ({ children, rightIcon, ...props }, ref) => {
    const reduceMotion = useReducedMotionPreference()
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
        whileTap={
          motionEnabled
            ? { transform: 'translateY(-1px) scale(0.97)' }
            : undefined
        }
        variants={{
          rest: { transform: restTransform },
          hover: {
            transform: motionEnabled
              ? 'translateY(-1px) scale(1)'
              : restTransform
          }
        }}
        transition={motionEnabled ? spring : { duration: 0 }}
        rightIcon={
          rightIcon && (
            <motion.span
              style={{ display: 'inline-flex' }}
              // Full transforms let the browser run the spring off the JS thread.
              variants={{
                rest: { transform: 'translateX(0px)' },
                hover: {
                  transform: `translateX(${motionEnabled ? 3 : 0}px)`
                }
              }}
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
  const reduceMotion = useReducedMotionPreference()
  const motionEnabled = reduceMotion === false

  return (
    <MotionIconButton
      ref={ref}
      tabIndex={0}
      transitionProperty="background-color, border-color, color, box-shadow"
      initial={false}
      animate={{ transform: restTransform }}
      whileHover={
        motionEnabled ? { transform: 'translateY(-1px) scale(1)' } : undefined
      }
      whileTap={
        motionEnabled
          ? { transform: 'translateY(-1px) scale(0.94)' }
          : undefined
      }
      transition={motionEnabled ? spring : { duration: 0 }}
      {...props}
    />
  )
})
