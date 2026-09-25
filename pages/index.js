import NextLink from 'next/link'
import {
  Container,
  Box,
  Heading,
  useColorModeValue,
  Text
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import TimelineDot from '../components/timeline-dot'
import ScrollReveal from '../components/scroll-reveal'
import { AnimatedButton } from '../components/animated-button'
import { BioSection, BioYear } from '../components/bio'
import PortfolioHero from '../components/portfolio-hero'

const workHistory = [
  {
    period: 'Mar 2025 — Present',
    company: 'Zipteams',
    current: true,
    role: 'Software Engineer 2',
    summary: (
      <>
        Own the React, Next.js, and TypeScript frontend, delivering dashboard
        features and a Chrome extension with shared authentication. Upgraded the
        dashboard to Next.js 14 and React 18 and cut CI build time by{' '}
        <strong>about 43%</strong> through caching and parallel jobs. Improve
        performance and release reliability with code-splitting, deliberate
        rendering choices, and feature flags.
      </>
    )
  },
  {
    period: 'Feb 2024 — Feb 2025',
    company: 'Mool Innovation Labs',
    role: 'Frontend Engineer',
    summary:
      'Owned payroll and employee onboarding, rebuilding complex forms with validation and consistent data handling. Introduced Storybook for component reviews and Sentry for issue tracking, while improving the performance and accessibility of core workflows.'
  },
  {
    period: 'Sep 2022 — Sep 2023',
    company: 'Dukaan',
    roles: [
      {
        role: 'Frontend Engineer',
        summary: (
          <>
            Built the iOS and Android frontend of a React Native commerce app
            from scratch, serving around <strong>20,000 active users</strong>.
            Improved app performance by <strong>15%</strong> and integrated
            Firebase, MoEngage, and AppsFlyer for cross-platform analytics.
          </>
        )
      },
      {
        role: 'Frontend Engineer Intern',
        summary:
          'Developed and maintained the seller web application with React, JavaScript, and Material UI. Used React Context for shared state and SCSS for styling across the application.'
      }
    ]
  },
  {
    period: 'Apr 2022 — Jul 2022',
    company: 'Applib Group',
    role: 'Software Engineer Intern',
    summary:
      'Developed reusable UI library components for HarmonyOS using eTS, extending my frontend experience to a new application platform.'
  }
]

const Home = () => {
  const bodyColor = useColorModeValue('gray.700', 'gray.300')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const accentColor = useColorModeValue('teal.700', 'teal.200')
  const roleDividerColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const timelineColor = useColorModeValue('gray.300', 'gray.600')
  const timelineBackground = useColorModeValue('#f0e7db', '#202023')

  return (
    <Layout>
      <Container maxW="container.prose" px={{ base: 6, md: 6 }}>
        <PortfolioHero />
        <Section delay={0.1}>
          <Text
            color={bodyColor}
            fontSize={{ base: '1.125rem', md: '1.3rem' }}
            lineHeight="1.75"
            letterSpacing="-.015em"
            textAlign="left"
            w="100%"
            mt={{ base: 8, md: 2 }}
          >
            I am a frontend engineer based in Bengaluru with a passion for
            building digital services/stuff I want. I have a knack for all
            things which goes from launching products, planning and designing
            all the way to solving real-life problems with code. When not
            online, I love hanging out with my friends or watch youtube.
          </Text>
        </Section>

        <Section delay={0.2}>
          <Heading
            as="h2"
            fontSize={{ base: '1.4rem', md: '1.6rem' }}
            fontWeight="600"
            mt={{ base: 12, md: 16 }}
            mb={8}
          >
            Work
          </Heading>
          <Box as="ol" listStyleType="none" m={0} p={0}>
            {workHistory.map(
              ({ period, company, role, roles, summary, current }) => (
                <Box
                  as="li"
                  key={`${company}-${period}`}
                  position="relative"
                  pl={{ base: 6, md: 8 }}
                  pb={{ base: 8, md: 9 }}
                  _before={{
                    content: '""',
                    position: 'absolute',
                    left: '5px',
                    top: '14px',
                    bottom: '-14px',
                    borderLeft: '1px solid',
                    borderColor: timelineColor
                  }}
                  _last={{ pb: 0, _before: { display: 'none' } }}
                >
                  {current ? (
                    <TimelineDot color={accentColor} />
                  ) : (
                    <Box
                      as="span"
                      aria-hidden="true"
                      position="absolute"
                      left="1px"
                      top="9px"
                      boxSize="9px"
                      borderRadius="full"
                      border="2px solid"
                      borderColor={timelineColor}
                      bg={timelineBackground}
                    />
                  )}
                  <ScrollReveal>
                    <Box
                      display="flex"
                      flexDirection={{ base: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ base: 'flex-start', sm: 'baseline' }}
                      gridGap={{ base: 1, sm: 4 }}
                    >
                      <Heading
                        as="h3"
                        fontSize={{ base: '1.125rem', md: '1.25rem' }}
                        fontWeight="600"
                        lineHeight="1.4"
                        color={current ? accentColor : undefined}
                      >
                        {company}
                      </Heading>
                      <Text
                        fontSize="0.875rem"
                        color={current ? accentColor : mutedColor}
                        sx={{ fontVariantNumeric: 'tabular-nums' }}
                        whiteSpace="nowrap"
                        flexShrink={0}
                        textAlign={{ base: 'left', sm: 'right' }}
                      >
                        {period}
                      </Text>
                    </Box>
                    {roles ? (
                      <Box as="ol" listStyleType="none" m={0} mt={2} p={0}>
                        {roles.map((position, index) => (
                          <Box
                            as="li"
                            key={position.role}
                            mt={index ? 4 : 0}
                            pt={index ? 4 : 0}
                            borderTopWidth={index ? '1px' : 0}
                            borderColor={roleDividerColor}
                          >
                            <Heading
                              as="h4"
                              fontFamily="body"
                              fontSize="0.875rem"
                              fontWeight="500"
                              lineHeight="1.5"
                              color={mutedColor}
                            >
                              {position.role}
                            </Heading>
                            <Text
                              color={bodyColor}
                              fontSize="1rem"
                              lineHeight="1.75"
                              mt={3}
                              sx={{ strong: { fontWeight: 600 } }}
                            >
                              {position.summary}
                            </Text>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <>
                        <Text fontSize="0.875rem" color={mutedColor} mt={1}>
                          {role}
                        </Text>
                        <Text
                          color={bodyColor}
                          fontSize="1rem"
                          lineHeight="1.75"
                          w="100%"
                          mt={3}
                          sx={{ strong: { fontWeight: 600 } }}
                        >
                          {summary}
                        </Text>
                      </>
                    )}
                  </ScrollReveal>
                </Box>
              )
            )}
          </Box>
          <Box align="center" my={4}>
            <AnimatedButton
              as={NextLink}
              href="/projects"
              rightIcon={<ChevronRightIcon />}
              bg={useColorModeValue('teal.700', 'teal.200')}
              color={useColorModeValue('white', 'gray.900')}
              _hover={{ bg: useColorModeValue('teal.800', 'teal.300') }}
              minH="44px"
            >
              My Portfolio
            </AnimatedButton>
          </Box>
        </Section>

        <Section delay={0.3}>
          <Heading as="h2" fontSize="1.4rem" fontWeight="600" mt={12} mb={5}>
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
          <BioSection>
            <BioYear>2023</BioYear>
            Developed, maintained and shipped mobile and web applications at
            Dukaan.
          </BioSection>
        </Section>

        <Section delay={0.6}>
          <Heading as="h2" fontSize="1.4rem" fontWeight="600" mt={10} mb={5}>
            I <span style={{ color: 'red', fontSize: '1.35rem' }}>♥</span>
          </Heading>
          <Text color={bodyColor} fontSize="1rem" lineHeight="1.8">
            Art, Anime, Volleyball, Football, Sketching, Animation, Trekking,
            Music
          </Text>
        </Section>
      </Container>
    </Layout>
  )
}

export default Home
