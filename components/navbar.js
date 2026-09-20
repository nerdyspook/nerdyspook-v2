import { useReducedMotionPreference } from './motion-preferences'
import { useState } from 'react'
import { LayoutGroup, motion } from 'framer-motion'
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
  const reduceMotion = useReducedMotionPreference()
  const inactiveColor = useColorModeValue('gray.700', 'whiteAlpha.900')
  const accent = useColorModeValue('teal.700', 'teal.200')

  return (
    <Link
      as={NextLink}
      href={href}
      scroll={false}
      position="relative"
      display="inline-flex"
      alignItems="center"
      p={2}
      minH="44px"
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
  )
}

const Navbar = ({ path: currentPath, ...props }) => {
  const path = (currentPath || '/').split(/[?#]/)[0]
  const [indicatedPath, setIndicatedPath] = useState(null)

  return (
    <Box
      position="fixed"
      as="nav"
      aria-label="Main navigation"
      w="100%"
      bg={useColorModeValue('#f0e7dbf5', '#202023f5')}
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
        <Flex align="center" mr={{ base: 1, md: 5 }}>
          <Heading as="div" size="lg" letterSpacing={'tighter'}>
            <Logo />
          </Heading>
        </Flex>

        <LayoutGroup id="navigation">
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
              minH="44px"
              display="inline-flex"
              alignItems="center"
              p={2}
              onMouseEnter={() => setIndicatedPath(null)}
              onFocus={() => setIndicatedPath(null)}
            >
              View Source
            </Link>
          </Stack>
        </LayoutGroup>

        <Flex flex={1} justify="flex-end" align="center" gap={1}>
          <ThemeToggleButton />
          <Box display={{ base: 'inline-block', md: 'none' }}>
            <Menu isLazy id="navbar-menu">
              <MenuButton
                as={AnimatedIconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Open navigation menu"
                minW="44px"
                h="44px"
              />
              <MenuList sx={{ '[role="menuitem"]': { minHeight: '44px' } }}>
                <MenuItem as={NextLink} href="/">
                  About
                </MenuItem>
                <MenuItem as={NextLink} href="/projects">
                  Projects
                </MenuItem>
                <MenuItem as={NextLink} href="/blogs">
                  Blogs
                </MenuItem>

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
        </Flex>
      </Container>
    </Box>
  )
}

export default Navbar
