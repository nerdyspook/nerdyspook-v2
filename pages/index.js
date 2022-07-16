import NextLink from 'next/link'
import {
  Container,
  Box,
  Heading,
  Image,
  useColorModeValue,
  Link,
  Button
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Section from '../components/section'
import Paragraph from '../components/paragraph'
import { BioSection, BioYear } from '../components/bio'

const Home = () => {
  return (
    <Container>
      <Box
        borderRadius="lg"
        bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
        mb="6"
        p="3"
        align="center"
      >
        Hello, I&apos;m a frontend developer based in India!
      </Box>

      <Box display={{ md: 'flex' }}>
        <Box flexGrow={1}>
          <Heading as="h2" size="xl" variant="page-title">
            Susanto Mahato
          </Heading>
          <p>Digital Craftsman ( Developer / Designer / Artist )</p>
        </Box>
        <Box
          flexShrink={0}
          mt={{ base: 4, md: 0 }}
          ml={{ md: 6 }}
          align="center"
        >
          <Image
            borderColor="whiteAlpha.800"
            borderWidth={2}
            borderStyle="solid"
            borderRadius="full"
            maxWidth="100px"
            maxHeight="100px"
            display="inline-block"
            src="/images/susanto.jpg"
            alt="Profile Picture"
            fallbackSrc="https://via.placeholder.com/150"
          />
        </Box>
      </Box>

      <Section delay={0.1}>
        <Heading as="h3" variant="section-title">
          Work
        </Heading>
        <Paragraph padding="10px">
          I am a frontend developer based in Bengaluru with a passion for
          building digital services/stuff I want. I have a knack for all things
          which goes from launching products, planning and designing all the way
          to solving real-life problems with code. When not online, I love
          hanging out with my friends or watch youtube. I am currently working
          at{' '}
          <Link href="https://applibgroup.dev/" isExternal>
            AppLib Group (HUAWEI)
          </Link>{' '}
          as an intern.
        </Paragraph>

        <Box align="center" my={4}>
          <NextLink href="/works">
            <Button rightIcon={<ChevronRightIcon />} colorScheme="teal">
              My Portfolio
            </Button>
          </NextLink>
        </Box>
      </Section>

      <Section delay={0.3}>
        <Heading as="h3" variant="section-title">
          Bio
        </Heading>
        <BioSection>
          <BioYear>1999</BioYear>
          Born in Durgapur (West Bengal), India.
        </BioSection>
        <BioSection>
          <BioYear>2018</BioYear>
          Completed Higher Secondary in Physics, Chemistry, Mathematics with
          Information Practices from A.G.P.N Convent School.
        </BioSection>
        <BioSection>
          <BioYear>2022</BioYear>
          Completed Bachelor&apos;s in Engineering (Computer Science
          Engineering) at Acharya Institute of Technology.
        </BioSection>
      </Section>

      <Section delay={0.6}>
        <Heading as="h3" variant="section-title">
          I <span style={{ color: 'red', fontSize: '1.35rem' }}>♥</span>
        </Heading>
        <Paragraph>
          Art, Anime, Volleyball, Football, Sketching, Animation, Trekking,
          Music
        </Paragraph>
      </Section>
    </Container>
  )
}

export default Home
