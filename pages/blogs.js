import { Container, COntainer, Heading, SimpleGrid } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'

import thumbBlogOne from '../public/images/blogOne.png'
import thumbBlogTwo from '../public/images/blogTwo.png'

const Blogs = () => (
  <Layout title="Blogs">
    <Container>
      <Heading as="h3" fontSize={20} mb={4}>
        Blogs
      </Heading>
      <Section delay={0.1}>
        <SimpleGrid columns={[1, 2, 2]} gap={6}>
          <GridItem
            title="Semantic Git Commit messages which everyone should follow!"
            thumbnail={'/images/blogTwo.jpg'}
            href="https://nerdyspook.hashnode.dev/semantic-git-commit-messages-which-everyone-should-follow"
          />
          <GridItem
            title="CSS Pseudo-elements"
            thumbnail={'/images/blogOne.jpg'}
            href="https://nerdyspook.hashnode.dev/css-pseudo-elements"
          />
        </SimpleGrid>
      </Section>
    </Container>
  </Layout>
)

export default Blogs
