import { useReducedMotionPreference } from './motion-preferences'
import { useState } from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import { Box, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionLinkBox = motion.create(LinkBox)

const ProjectCard = ({ href, image, title, description }) => {
  const reduceMotion = useReducedMotionPreference()
  const motionEnabled = reduceMotion === false
  const [focused, setFocused] = useState(false)

  return (
    <MotionLinkBox
      w="100%"
      textAlign="center"
      cursor={href ? 'pointer' : 'default'}
      initial={false}
      animate={focused ? 'hover' : 'rest'}
      whileHover={href ? 'hover' : undefined}
      variants={{
        rest: { transform: 'translateY(0px)' },
        hover: { transform: `translateY(${motionEnabled ? -4 : 0}px)` }
      }}
      transition={motionEnabled ? { duration: 0.2 } : { duration: 0 }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false)
      }}
    >
      <Box overflow="hidden" borderRadius="12px">
        <motion.div
          variants={{
            rest: { transform: 'scale(1)' },
            hover: { transform: `scale(${motionEnabled ? 1.025 : 1})` }
          }}
          transition={motionEnabled ? { duration: 0.3 } : { duration: 0 }}
        >
          <Image
            src={image}
            alt={title}
            height={250}
            width={500}
            sizes="(min-width: 768px) 320px, (min-width: 480px) 50vw, 100vw"
            style={{ width: '100%', height: 'auto' }}
            loading="lazy"
          />
        </motion.div>
      </Box>
      {href ? (
        <LinkOverlay as={NextLink} href={href}>
          <Text as="h2" mt={2} fontSize={20}>
            {title}
          </Text>
        </LinkOverlay>
      ) : (
        <Text as="h2" mt={2} fontSize={20}>
          {title}
        </Text>
      )}
      <Text fontSize={14}>{description}</Text>
    </MotionLinkBox>
  )
}

export default ProjectCard
