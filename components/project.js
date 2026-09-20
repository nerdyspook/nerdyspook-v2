import NextLink from 'next/link'
import NextImage from 'next/image'
import { Heading, Box, Link, Badge } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

export const Title = ({ children }) => (
  <Box>
    <Link as={NextLink} href="/projects">
      Projects
    </Link>
    <span>
      &nbsp;
      <ChevronRightIcon />
      &nbsp;
    </span>
    <Heading display="inline-block" as="h1" fontSize={20} mb={4}>
      {children}
    </Heading>
  </Box>
)

export const ProjectImage = ({ src, alt }) => (
  <Box mb={4} borderRadius="lg" overflow="hidden">
    <NextImage
      src={src}
      alt={alt}
      sizes="(max-width: 480px) 90vw, 480px"
      style={{ width: '100%', height: 'auto' }}
    />
  </Box>
)

export const Meta = ({ children }) => (
  <Badge colorScheme="green" mr={2} px="10px" py="2px">
    {children}
  </Badge>
)
