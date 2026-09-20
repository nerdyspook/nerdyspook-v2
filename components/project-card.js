import { useState } from 'react'
import NextLink from 'next/link'
import Image from 'next/image'
import { Box, LinkBox, LinkOverlay, Text } from '@chakra-ui/react'
import { motion, useReducedMotion } from 'framer-motion'

const MotionLinkBox = motion(LinkBox)

const ProjectCard = ({ href, image, title, description }) => {
  const reduceMotion = useReducedMotion()
  const motionEnabled = reduceMotion === false
  const [focused, setFocused] = useState(false)

  return (
    <MotionLinkBox
      w="100%"
      textAlign="center"
      cursor="pointer"
      initial={false}
      animate={focused ? 'hover' : 'rest'}
      whileHover="hover"
      variants={{ rest: { y: 0 }, hover: { y: motionEnabled ? -4 : 0 } }}
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
            rest: { scale: 1 },
            hover: { scale: motionEnabled ? 1.025 : 1 }
          }}
          transition={motionEnabled ? { duration: 0.3 } : { duration: 0 }}
        >
          <Image
            src={image}
            alt={title}
            height={250}
            width={500}
            layout="responsive"
            loading="lazy"
          />
        </motion.div>
      </Box>
      <NextLink href={href} passHref>
        <LinkOverlay>
          <Text mt={2} fontSize={20}>
            {title}
          </Text>
        </LinkOverlay>
      </NextLink>
      <Text fontSize={14}>{description}</Text>
    </MotionLinkBox>
  )
}

export default ProjectCard
