import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useColorMode, useColorModeValue } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { AnimatedIconButton } from './animated-button'

const ThemeToggleButton = () => {
  const { toggleColorMode } = useColorMode()
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        style={{ display: 'inline-block' }}
        key={useColorModeValue('light', 'dark')}
        initial={{ y: reduceMotion ? 0 : -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: reduceMotion ? 0 : 10, opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.25 }}
      >
        <AnimatedIconButton
          aria-label="Toggle theme"
          colorScheme={useColorModeValue('purple', 'orange')}
          icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
          onClick={toggleColorMode}
        ></AnimatedIconButton>
      </motion.div>
    </AnimatePresence>
  )
}

export default ThemeToggleButton
