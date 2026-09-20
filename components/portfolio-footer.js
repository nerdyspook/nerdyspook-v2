import NextLink from 'next/link'
import { Box, Flex, Link, useColorModeValue } from '@chakra-ui/react'
import { IoLogoGithub, IoLogoLinkedin, IoCreateOutline } from 'react-icons/io5'
import FooterDog from './footer-dog'

// X brand mark from Simple Icons (simple-icons/simple-icons, icons/x.svg).
const XIcon = ({ size = '1em', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    {...props}
  >
    <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
  </svg>
)

// Edit iconSize on each link to resize its icon.
const socialLinks = [
  {
    href: 'https://x.com/nerdyspook101',
    icon: XIcon,
    iconSize: '14px'
  },
  {
    label: 'GitHub',
    href: 'https://github.com/nerdyspook',
    icon: IoLogoGithub,
    iconSize: '16px'
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/susanto-mahato-761118168/',
    icon: IoLogoLinkedin,
    iconSize: '16px'
  }
]

const PortfolioFooter = () => {
  const border = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
  const ink = useColorModeValue('teal.600', 'teal.200')
  const hover = useColorModeValue('teal.700', 'teal.100')

  return (
    <Box
      as="footer"
      id="footer"
      maxW="container.content"
      mx="auto"
      px={{ base: 4, md: 6 }}
      mt={{ base: 10, md: 16 }}
    >
      <FooterDog />
      <Flex
        as="nav"
        aria-label="Footer social links"
        borderTop="1px solid"
        borderColor={border}
        pt={{ base: 4, md: 6 }}
        pb={{ base: 2, md: 4 }}
        gridGap={{ base: 5, md: 8 }}
        flexWrap="wrap"
        color={ink}
        fontFamily="body"
        fontSize="16px"
        fontWeight="medium"
        sx={{
          a: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            minHeight: '44px',
            color: 'inherit',
            _hover: { color: hover, textDecoration: 'underline' }
          }
        }}
      >
        {socialLinks.map(({ label, href, icon: SocialIcon, iconSize }) => (
          <Link
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} (opens in a new tab)`}
          >
            <SocialIcon
              size={iconSize}
              style={{ flexShrink: 0 }}
              aria-hidden="true"
              focusable="false"
            />
            {label ?? label}
          </Link>
        ))}
        <NextLink href="/blogs" passHref>
          <Link>
            <IoCreateOutline
              size="20px"
              style={{ flexShrink: 0 }}
              aria-hidden="true"
              focusable="false"
            />
            Writing
          </Link>
        </NextLink>
      </Flex>
    </Box>
  )
}

export default PortfolioFooter
