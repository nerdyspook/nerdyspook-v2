import { useEffect, useState } from 'react'
import localFont from 'next/font/local'
import { Box, VisuallyHidden } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotionPreference } from './motion-preferences'

const bengali = localFont({
  src: '../public/fonts/noto-sans-bengali-name-500.woff2',
  weight: '500',
  display: 'swap',
  adjustFontFallback: false
})

const hindi = localFont({
  src: '../public/fonts/ibm-plex-devanagari-name-500.woff2',
  weight: '500',
  display: 'swap',
  adjustFontFallback: false
})

const spellings = [
  { language: 'bn', name: 'সুশান্ত', font: bengali.className },
  { language: 'hi', name: 'सुशांत', font: hindi.className }
]

const NameSpellings = ({ paused }) => {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotionPreference()

  useEffect(() => {
    if (reduceMotion || paused) return
    const timer = window.setInterval(() => {
      if (!document.hidden)
        setIndex(current => (current + 1) % spellings.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [paused, reduceMotion])

  const current = spellings[index]

  return (
    <>
      {/* Keep both spellings available without repeated screen-reader updates. */}
      <VisuallyHidden>
        <span lang="bn">সুশান্ত</span>, <span lang="hi">सुशांत</span>
      </VisuallyHidden>
      <Box
        as="span"
        aria-hidden="true"
        display="inline-grid"
        alignItems="center"
        fontSize="1.1em"
        lineHeight="1.6"
      >
        {/* The widest spelling reserves space throughout the transition. */}
        {spellings.map(spelling => (
          <Box
            as="span"
            key={spelling.language}
            className={spelling.font}
            lang={spelling.language}
            gridArea="1 / 1"
            visibility="hidden"
          >
            {spelling.name}
          </Box>
        ))}
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={current.language}
            lang={current.language}
            className={current.font}
            style={{ gridArea: '1 / 1', display: 'inline-block' }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
          >
            {current.name}
          </motion.span>
        </AnimatePresence>
      </Box>
    </>
  )
}

export default NameSpellings
