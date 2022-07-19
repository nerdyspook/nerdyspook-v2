import { Container, Badge, Link, List, ListItem } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Title, ProjectImage, Meta } from '../../components/project'
import P from '../../components/paragraph'
import Layout from '../../components/layouts/article'

const Project = () => {
  return (
    <Layout title="Volt">
      <Container>
        <Title>
          Volt <Badge>2022</Badge>
        </Title>
        <P>
          An Ecommerce app for shoes, having search and filter functionality
          with user authentication.
        </P>
        <List ml={4} my={4}>
          <ListItem>
            <Meta>Website</Meta>
            <Link href="https://volt-shoes.netlify.app/" isExternal>
              https://volt-shoes.netlify.app <ExternalLinkIcon mx="2px" />
            </Link>
          </ListItem>

          <ListItem>
            <Meta>Browsers</Meta>
            <span>Chrome, FIrefox, Safari, Microsoft Edge</span>
          </ListItem>

          <ListItem>
            <Meta>Stack</Meta>
            <span>
              Reactjs, React Router v6, Kal-UI Component Library, SASS
            </span>
          </ListItem>
        </List>

        <ProjectImage src="/images/volt-home.jpg" alt="volt home page" />
      </Container>
    </Layout>
  )
}

export default Project
