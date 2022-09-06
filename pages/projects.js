import {
  Container,
  Box,
  Heading,
  SimpleGrid,
  Text,
  LinkBox,
  LinkOverlay
} from '@chakra-ui/react'
import NextLink from 'next/link'
import Image from 'next/image'
import Section from '../components/section'
import Layout from '../components/layouts/article'
import { WorkGridItem } from '../components/grid-item'
// import thumbVolt from '../public/images/volt-home.png'
// import thumbFrontendPrep from '../public/images/prep-home.png'

const Projects = () => {
  return (
    <Layout>
      <Container>
        <Heading as="h3" fontSize={20} mb={4}>
          Projects
        </Heading>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section>
            {/* <WorkGridItem
              id="volt"
              title="Volt"
              thumbnail={'/images/volt-home.jpg'}
            >
              An Ecommerce app for shoes.
            </WorkGridItem> */}

            <Box w="100%" align="center">
              <NextLink href={`/projects/volt`}>
                <LinkBox cursor="pointer">
                  <Image
                    src="/images/volt-home.png"
                    alt="Volt"
                    className="grid-item-thumbnail"
                    // placeholder="blur"
                    height={250}
                    width={500}
                    loading="lazy"
                  />
                  <LinkOverlay href={`/projects/volt`}>
                    <Text mt={2} fontSize={20}>
                      Volt
                    </Text>
                  </LinkOverlay>
                  <Text fontSize={14}>An Ecommerce app for shoes.</Text>
                </LinkBox>
              </NextLink>
            </Box>
          </Section>
          <Section>
            {/* <WorkGridItem
              id="frontend-prep"
              title="Frontend-Prep"
              thumbnail={'/images/prep-home.png'}
            >
              A quiz app to test your knowledge in frontend technologies.
            </WorkGridItem> */}

            <Box w="100%" align="center">
              <NextLink href={`/projects/frontend-prep`}>
                <LinkBox cursor="pointer">
                  <Image
                    src="/images/prep-home.png"
                    alt="Frontend-Prep"
                    className="grid-item-thumbnail"
                    // placeholder="blur"
                    height={250}
                    width={500}
                    loading="lazy"
                  />
                  <LinkOverlay href={`/projects/frontend-prep`}>
                    <Text mt={2} fontSize={20}>
                      Frontend-Prep
                    </Text>
                  </LinkOverlay>
                  <Text fontSize={14}>
                    A quiz app to test your knowledge in frontend technologies.
                  </Text>
                </LinkBox>
              </NextLink>
            </Box>
          </Section>

          <Section>
            <Box w="100%" align="center">
              <NextLink href={`/projects/kal-ui`}>
                <LinkBox cursor="pointer">
                  <Image
                    src="/images/kal-ui-home.png"
                    alt="Kal-UI Component Library"
                    className="grid-item-thumbnail"
                    // placeholder="blur"
                    height={250}
                    width={500}
                    loading="lazy"
                  />
                  <LinkOverlay href={`/projects/kal-ui`}>
                    <Text mt={2} fontSize={20}>
                      Kal-UI Component Library
                    </Text>
                  </LinkOverlay>
                  <Text fontSize={14}>
                    A Component Library to build UI faster.
                  </Text>
                </LinkBox>
              </NextLink>
            </Box>
          </Section>

          <Section>
            <Box w="100%" align="center">
              <NextLink href={`/projects/revisit`}>
                <LinkBox cursor="pointer">
                  <Image
                    src="/images/revisit-home.png"
                    alt="Revisit Video Library"
                    className="grid-item-thumbnail"
                    // placeholder="blur"
                    height={250}
                    width={500}
                    loading="lazy"
                  />
                  <LinkOverlay href={`/projects/revisit`}>
                    <Text mt={2} fontSize={20}>
                      Revisit Video Library
                    </Text>
                  </LinkOverlay>
                  <Text fontSize={14}>A Video Library for Hodophiles.</Text>
                </LinkBox>
              </NextLink>
            </Box>
          </Section>

          <Section>
            <Box w="100%" align="center">
              <NextLink href={`/projects/noter`}>
                <LinkBox cursor="pointer">
                  <Image
                    src="/images/noter-home.png"
                    alt="Noter - Note Taking App"
                    className="grid-item-thumbnail"
                    // placeholder="blur"
                    height={250}
                    width={500}
                    loading="lazy"
                  />
                  <LinkOverlay href={`/projects/noter`}>
                    <Text mt={2} fontSize={20}>
                      Noter
                    </Text>
                  </LinkOverlay>
                  <Text fontSize={14}>A Note Taking App.</Text>
                </LinkBox>
              </NextLink>
            </Box>
          </Section>
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default Projects
