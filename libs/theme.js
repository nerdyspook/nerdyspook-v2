import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const styles = {
  global: props => ({
    body: {
      '--paper-background': mode('#f0e7db', '#202023')(props),
      backgroundColor: 'var(--paper-background)',
      // A tiny static tile: no extra DOM or animation loop.
      backgroundImage: 'url("/art/paper-grid.svg")',
      backgroundSize: '64px 64px',
      color: mode('#303a36', '#e7e7e1')(props),
      lineHeight: 1.7,
      WebkitFontSmoothing: 'antialiased'
    },
    html: { scrollPaddingTop: '80px' },
    'a:focus-visible, button:focus-visible, [role="button"]:focus-visible': {
      outline: '3px solid',
      outlineColor: mode('teal.700', 'teal.200')(props),
      outlineOffset: '3px'
    },
    '@media (prefers-reduced-motion: reduce)': {
      '*, *::before, *::after': { scrollBehavior: 'auto' }
    }
  })
}

const components = {
  Heading: {
    variants: {
      'section-title': {
        textDecoration: 'underline',
        fontSize: 20,
        textUnderlineOffset: 6,
        textDecorationColor: '#525252',
        textDecorationThickness: 4,
        marginTop: 3,
        marginBottom: 4
      }
    }
  },
  Link: {
    baseStyle: props => ({
      color: mode('#245ab5', '#ff63c3')(props),
      textUnderlineOffset: 3
    })
  }
}

const fonts = {
  body: 'var(--font-body), system-ui, sans-serif',
  heading: 'var(--font-heading), system-ui, sans-serif'
}

const colors = {
  grassTeal: '#88ccca'
}

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true
}

// Shared maximum width for the page, navigation, and footer.
const sizes = {
  container: {
    content: '1000px',
    prose: '760px'
  }
}

const theme = extendTheme({ config, styles, components, fonts, colors, sizes })
export default theme
