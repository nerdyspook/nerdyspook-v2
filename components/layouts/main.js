import Seo from '../seo'
import Navbar from '../navbar'
import { Box, Container, Link, useColorModeValue } from '@chakra-ui/react'
import DogScene from '../dog-scene'
import PortfolioFooter from '../portfolio-footer'
import MusicPlayer from '../music-player'
import { music } from '../../site.config'

const Main = ({ children, router }) => {
  return (
    <Box pb={8}>
      <Seo path={router.pathname} />
      <Link
        href="#main-content"
        position="fixed"
        top={2}
        left={2}
        zIndex="skipLink"
        px={4}
        py={3}
        borderRadius="md"
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('teal.800', 'teal.100')}
        transform="translateY(-160%)"
        _focus={{ transform: 'translateY(0)' }}
      >
        Skip to content
      </Link>
      <Navbar path={router.pathname} />
      <Container
        as="main"
        id="main-content"
        tabIndex={-1}
        maxW="container.content"
        px={0}
        pt={16}
        _focus={{ outline: 'none' }}
      >
        <DogScene />
        {children}
      </Container>
      <PortfolioFooter />
      {music.src && <MusicPlayer key={music.src} {...music} />}
    </Box>
  )
}

export default Main
