import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/layouts/main'
import Fonts from '../components/fonts'
import theme from '../libs/theme'
import { AnimatePresence } from 'framer-motion'
import { Analytics } from "@vercel/analytics/next"
import { MotionPreferencesProvider } from '../components/motion-preferences'

const Website = ({ Component, pageProps, router }) => {
  return (
    <ChakraProvider theme={theme}>
      <MotionPreferencesProvider>
        <Fonts />
        <Layout router={router}>
          <AnimatePresence mode="wait" initial={true}>
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </Layout>
      </MotionPreferencesProvider>
      <Analytics />
    </ChakraProvider>
  )
}

export default Website
