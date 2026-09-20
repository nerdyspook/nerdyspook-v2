import NextLink from 'next/link'
import { Box, Heading, Text, Container, Divider } from '@chakra-ui/react'
import { AnimatedButton } from '../components/animated-button'

const NotFound = () => {
  return (
    <Container>
      <Heading as="h1" mb={4}>
        404: Page Not Found
      </Heading>
      <Text>🐶 Woofy couldn&apos;t find the page you were looking for.</Text>
      <Divider my={6} />
      <Box my={6} align="center">
        <NextLink href="/" passHref>
          <AnimatedButton as="a" colorScheme="teal">
            Return to home
          </AnimatedButton>
        </NextLink>
      </Box>
    </Container>
  )
}

export default NotFound
