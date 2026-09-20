import Seo from '../seo'
import Navbar from '../navbar'
import { Box, Container } from '@chakra-ui/react'
import VoxelDog from '../voxel-dog'
import NoSsr from '../no-ssr'
import PortfolioFooter from '../portfolio-footer'

const Main = ({ children, router }) => {
  return (
    <Box pb={8}>
      <Seo path={router.pathname} />
      <Navbar path={router.pathname} />
      <Container as="main" maxW="container.content" px={0} pt={14}>
        <NoSsr>
          <VoxelDog />
        </NoSsr>
        {children}
      </Container>
      <PortfolioFooter />
    </Box>
  )
}

export default Main
