import { Flex, useColorModeValue } from '@chakra-ui/react'
import { EmailIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { AnimatedButton } from './animated-button'
import { contact, emailUrl } from '../libs/contact'

const ContactActions = () => {
  const background = useColorModeValue('teal.700', 'teal.200')
  const hover = useColorModeValue('teal.800', 'teal.300')
  const foreground = useColorModeValue('white', 'gray.900')
  const outline = useColorModeValue('teal.800', 'teal.200')

  return (
    <Flex gap={3} flexWrap="wrap">
      <AnimatedButton
        as="a"
        href={emailUrl}
        leftIcon={<EmailIcon aria-hidden="true" />}
        bg={background}
        color={foreground}
        _hover={{ bg: hover }}
        minH="44px"
      >
        Email me
      </AnimatedButton>
      {contact.resumeUrl && (
        <AnimatedButton
          as="a"
          href={contact.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View résumé (opens in a new tab)"
          leftIcon={<ExternalLinkIcon aria-hidden="true" />}
          variant="outline"
          color={outline}
          borderColor="currentColor"
          minH="44px"
        >
          View résumé
        </AnimatedButton>
      )}
    </Flex>
  )
}

export default ContactActions
