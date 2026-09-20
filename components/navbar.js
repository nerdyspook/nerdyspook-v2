import { useState } from 'react'
import { AnimateSharedLayout, motion, useReducedMotion } from 'framer-motion'
import Logo from './logo'
import NextLink from 'next/link'
import {
  Container,
  Box,
  Link,
  Stack,
  Heading,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  useColorModeValue
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import ThemeToggleButton from './theme-toggle-button'
import { AnimatedIconButton } from './animated-button'

const LinkItem = ({ href, path, indicatedPath, onIndicate, children }) => {
  const active = path === href || path.startsWith(`${href}/`)
  const indicated = indicatedPath ? indicatedPath === href : active
  const reduceMotion = useReducedMotion()
  const inactiveColor = useColorModeValue('gray.700', 'whiteAlpha.900')
  const accent = useColorModeValue('teal.600', 'teal.200')

  return (
    <NextLink href={href} passHref scroll={false}>
      <Link
        position="relative"
        display="inline-block"
        p={2}
        color={active || indicated ? accent : inactiveColor}
        aria-current={active ? 'page' : undefined}
        onMouseEnter={() => onIndicate(href)}
        onFocus={() => onIndicate(href)}
        _hover={{ color: accent, textDecoration: 'none' }}
      >
        {children}
        {indicated && (
          <motion.span
            layoutId="navigation-underline"
            aria-hidden="true"
            transition={
              reduceMotion === false
                ? { type: 'spring', stiffness: 500, damping: 35 }
                : { duration: 0 }
            }
            style={{
              position: 'absolute',
              bottom: 2,
              left: 8,
              right: 8,
              height: 2,
              borderRadius: 2,
              background: 'currentColor',
              pointerEvents: 'none'
            }}
          />
        )}
      </Link>
    </NextLink>
  )
}

const Navbar = props => {
  const path = (props.path || '/').split(/[?#]/)[0]
  const [indicatedPath, setIndicatedPath] = useState(null)

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue('#ffffff40', '@20202380')}
      style={{ backdropFilter: 'blur(10px)' }}
      zIndex={2}
      {...props}
    >
      <Container
        display="flex"
        px={{ base: 4, md: 6 }}
        py={2}
        maxW="container.content"
        wrap="wrap"
        align="center"
        justify="space-between"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            <Logo />
          </Heading>
        </Flex>

        <AnimateSharedLayout>
          <Stack
            onMouseLeave={() => setIndicatedPath(null)}
            onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setIndicatedPath(null)
            }}
            direction={{ base: 'column', md: 'row' }}
            display={{ base: 'none', md: 'flex' }}
            width={{ base: 'full', md: 'auto' }}
            alignItems="center"
            flexGrow={1}
            mt={{ base: 4, md: 0 }}
          >
            <LinkItem
              href="/projects"
              path={path}
              indicatedPath={indicatedPath}
              onIndicate={setIndicatedPath}
            >
              Projects
            </LinkItem>
            <LinkItem
              href="/blogs"
              path={path}
              indicatedPath={indicatedPath}
              onIndicate={setIndicatedPath}
            >
              Blogs
            </LinkItem>
            <Link
              href="https://github.com/nerdyspook/nerdyspook-v2"
              isExternal
              p={2}
              onMouseEnter={() => setIndicatedPath(null)}
              onFocus={() => setIndicatedPath(null)}
            >
              View Source
            </Link>
          </Stack>
        </AnimateSharedLayout>

        <Box flex={1} align="right">
          <ThemeToggleButton />
          <Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
            <Menu isLazy id="navbar-menu">
              <MenuButton
                as={AnimatedIconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
              />
              <MenuList>
                <NextLink href="/" passHref>
                  <MenuItem as={Link}>About</MenuItem>
                </NextLink>
                <NextLink href="/projects" passHref>
                  <MenuItem as={Link}>Projects</MenuItem>
                </NextLink>
                <NextLink href="/blogs" passHref>
                  <MenuItem as={Link}>Blogs</MenuItem>
                </NextLink>

                <MenuItem
                  as={Link}
                  href="https://github.com/nerdyspook/nerdyspook-v2"
                  isExternal
                >
                  View Source
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Navbar
