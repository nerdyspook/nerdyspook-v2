import { Container, Box, Heading } from '@chakra-ui/react'

const Home = () => {
  return (
    <Container>
      <Box borderRadius="lg" bg="red" mb="6" p="3" align="center">
        Hello, I&apos;m a full-stack developer based in India!
      </Box>

      <Box display={{ md: 'flex' }}>
        <Box flexGrow={1}>
          <Heading as="h2" variant="page-title">
            Susanto Mahato
          </Heading>
          <p>Digital Craftsman ( Developer / Designer / Artist )</p>
        </Box>
      </Box>
    </Container>
  )
}

export default Home
