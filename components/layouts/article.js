import { motion, useReducedMotion } from 'framer-motion'
import { GridItemStyle } from '../grid-item'

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 20 }
}

const Layout = ({ children }) => {
  const reduceMotion = useReducedMotion()
  return (
    <motion.article
      initial={false}
      animate="enter"
      exit="exit"
      variants={
        reduceMotion
          ? {
              hidden: { opacity: 0 },
              enter: { opacity: 1 },
              exit: { opacity: 0 }
            }
          : variants
      }
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeInOut' }}
      style={{ position: 'relative' }}
    >
      <>
        {children}
        <GridItemStyle />
      </>
    </motion.article>
  )
}

export default Layout
