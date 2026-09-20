import { Container, Heading, SimpleGrid } from '@chakra-ui/react'
import Section from '../components/section'
import Layout from '../components/layouts/article'
import ProjectCard from '../components/project-card'

const projects = [
  {
    href: '/projects/volt',
    image: '/images/volt-home.png',
    title: 'Volt',
    description: 'An Ecommerce app for shoes.'
  },
  {
    image: '/images/prep-home.png',
    title: 'Frontend-Prep',
    description: 'A quiz app to test your knowledge in frontend technologies.'
  },
  {
    image: '/images/kal-ui-home.png',
    title: 'Kal-UI Component Library',
    description: 'A Component Library to build UI faster.'
  },
  {
    image: '/images/revisit-home.png',
    title: 'Revisit Video Library',
    description: 'A Video Library for Hodophiles.'
  },
  {
    image: '/images/noter-home.png',
    title: 'Noter',
    description: 'A Note Taking App.'
  }
]

const Projects = () => (
  <Layout>
    <Container>
      <Heading as="h1" fontSize={20} mb={4}>
        Projects
      </Heading>
      <SimpleGrid columns={[1, 1, 2]} gap={6}>
        {projects.map(project => (
          <Section key={project.title}>
            <ProjectCard {...project} />
          </Section>
        ))}
      </SimpleGrid>
    </Container>
  </Layout>
)

export default Projects
