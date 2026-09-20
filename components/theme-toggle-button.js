import { AnimatePresence, motion } from 'framer-motion'
import { useColorMode, useColorModeValue } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { AnimatedIconButton } from './animated-button'
import { useReducedMotionPreference } from './motion-preferences'

const ThemeToggleButton = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const reduceMotion = useReducedMotionPreference()
  const dark = colorMode === 'dark'
  const background = useColorModeValue('purple-500', 'orange-200')
  const hoverBackground = useColorModeValue('purple-600', 'orange-300')
  const foreground = useColorModeValue('white', 'gray-800')

  // Animate the full visual surface while the focusable button stays mounted.
  return (
    <AnimatedIconButton
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      bg="transparent"
      _hover={{ bg: 'transparent' }}
      _active={{ bg: 'transparent' }}
      sx={{
        '.theme-toggle-surface': {
          backgroundColor: 'var(--theme-toggle-background)',
          transition: 'background-color 0.2s'
        },
        '&:hover .theme-toggle-surface': {
          backgroundColor: 'var(--theme-toggle-hover-background)'
        }
      }}
      icon={
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={colorMode}
            aria-hidden="true"
            className="theme-toggle-surface"
            initial={{
              transform: `translateY(${reduceMotion ? 0 : -10}px)`,
              opacity: 0
            }}
            animate={{ transform: 'translateY(0px)', opacity: 1 }}
            exit={{
              transform: `translateY(${reduceMotion ? 0 : 10}px)`,
              opacity: 0
            }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'inherit',
              color: `var(--chakra-colors-${foreground})`,
              '--theme-toggle-background': `var(--chakra-colors-${background})`,
              '--theme-toggle-hover-background': `var(--chakra-colors-${hoverBackground})`
            }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </motion.span>
        </AnimatePresence>
      }
      onClick={toggleColorMode}
      minW="44px"
      h="44px"
    />
  )
}

export default ThemeToggleButton
