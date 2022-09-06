import { Container, Box, Heading, SimpleGrid, Divider } from '@chakra-ui/react'
import Section from '../components/section'
import Layout from '../components/layouts/article'
import { WorkGridItem } from '../components/grid-item'
import thumbVolt from '../public/images/volt-home.jpg'
import thumbFrontendPrep from '../public/images/prep-home.jpg'

const Projects = () => {
  return (
    <Layout>
      <Container>
        <Heading as="h3" fontSize={20} mb={4}>
          Projects
        </Heading>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <Section>
            <WorkGridItem
              id="volt"
              title="Volt"
              thumbnail={'/images/volt-home.jpg'}
            >
              An Ecommerce app for shoes.
            </WorkGridItem>
          </Section>
          <Section>
            <WorkGridItem
              id="frontend-prep"
              title="Frontend-Prep"
              thumbnail={'/images/prep-home.jpg'}
            >
              A quiz app to test your knowledge in frontend technologies.
            </WorkGridItem>
          </Section>
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default Projects
