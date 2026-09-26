import {
  Box,
  Heading,
  Text,
  VisuallyHidden,
  useColorModeValue
} from '@chakra-ui/react'
import NameWordmark from './name-wordmark'
import ProfileImage from './profile-image'
import NamePronunciation from './name-pronunciation'

const PortfolioHero = () => {
  const ink = useColorModeValue('teal.700', 'teal.200')
  const rule = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

  return (
    <Box
      as="section"
      aria-label="Introduction"
      pt={{ base: 4, md: 6 }}
      pb={{ base: 2, md: 8 }}
      minW={0}
    >
      <Box
        display="grid"
        gridTemplateColumns="minmax(0, 1fr) 100px"
        columnGap={{ base: 4, sm: 8 }}
        alignItems="center"
        mb={4}
      >
        <Text fontSize="17px" textAlign="left" gridColumn={1} gridRow={1}>
          Hey, I’m
        </Text>
        <Box
          boxSize="100px"
          gridColumn={2}
          gridRow={{ base: '1', sm: '1 / 3' }}
          alignSelf="center"
          borderRadius="full"
          overflow="hidden"
          border="2px solid"
          borderColor={rule}
        >
          <ProfileImage />
        </Box>
        <Heading
          as="h1"
          color={ink}
          fontWeight="400"
          lineHeight={1}
          w="100%"
          maxW={{ base: '260px', sm: '320px', md: '360px' }}
          gridColumn={{ base: '1 / -1', sm: '1' }}
          gridRow={2}
          mt={{ base: 2, sm: 0 }}
        >
          <VisuallyHidden>Susanto</VisuallyHidden>
          <NameWordmark />
        </Heading>
        <NamePronunciation />
      </Box>
      <Text fontSize={{ base: '19px', md: '22px' }} letterSpacing="-.025em">
        Developer. Designer. Artist.
      </Text>
    </Box>
  )
}

export default PortfolioHero
