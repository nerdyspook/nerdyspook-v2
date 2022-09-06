import {
  Container,
  Heading,
  SimpleGrid,
  Box,
  Text,
  LinkBox,
  LinkOverlay
} from '@chakra-ui/react'
import Image from 'next/image'
import Layout from '../components/layouts/article'
import Section from '../components/section'


const Blogs = () => (
  <Layout title="Blogs">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Blogs
      </Heading>
      <Section delay={0.1}>
        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          {/* <GridItem
            title="Semantic Git Commit messages which everyone should follow!"
            thumbnail={'/images/blogTwo.jpg'}
            href="https://nerdyspook.hashnode.dev/semantic-git-commit-messages-which-everyone-should-follow"
          /> */}

          <Box w="100%" align="center">
            <LinkBox cursor="pointer">
              <Image
                src="/images/blogTwo.png"
                alt="Semantic Git Commit messages which everyone should follow!"
                className="grid-item-thumbnail"
                height={250}
                width={500}
                loading="lazy"
              />
              <LinkOverlay
                href="https://nerdyspook.hashnode.dev/semantic-git-commit-messages-which-everyone-should-follow"
                target="_blank"
              >
                <Text mt={2}>
                  Semantic Git Commit messages which everyone should follow!
                </Text>
              </LinkOverlay>
            </LinkBox>
          </Box>

          {/* <GridItem
            title="CSS Pseudo-elements"
            thumbnail={'/images/blogOne.jpg'}
            href="https://nerdyspook.hashnode.dev/css-pseudo-elements"
          /> */}

          <Box w="100%" align="center">
            <LinkBox cursor="pointer">
              <Image
                src="/images/blogOne.png"
                alt="CSS Pseudo-elements"
                className="grid-item-thumbnail"
                height={250}
                width={500}
                loading="lazy"
              />
              <LinkOverlay
                href="https://nerdyspook.hashnode.dev/css-pseudo-elements"
                target="_blank"
              >
                <Text mt={2}>CSS Pseudo-elements</Text>
              </LinkOverlay>
            </LinkBox>
          </Box>
        </SimpleGrid>
      </Section>
    </Container>
  </Layout>
)

export default Blogs
