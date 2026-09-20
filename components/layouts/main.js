import Head from 'next/head'
import Navbar from '../navbar'
import { Box, Container } from '@chakra-ui/react'
import VoxelDog from '../voxel-dog'
import NoSsr from '../no-ssr'
import PortfolioFooter from '../portfolio-footer'

const Main = ({ children, router }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>NerdySpook</title>
        <link rel="icon" href="/images/favicon.ico"></link>
      </Head>
      <Navbar path={router.asPath} />
      <Container maxW="container.content" px={0} pt={14}>
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
