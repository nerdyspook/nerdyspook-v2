import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const styles = {
  global: props => ({
    body: {
      bg: mode('#f0e7db', '#202023')(props)
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
    content: '1000px'
  }
}

const theme = extendTheme({ config, styles, components, fonts, colors, sizes })
export default theme
