import { useReducedMotionPreference } from './motion-preferences'
import Link from 'next/link'
import Image from 'next/image'
import { Text, useColorModeValue } from '@chakra-ui/react'
import styled from '@emotion/styled'

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  line-height: 20px;
  padding: 2px;

  &:hover img {
    transform: var(--logo-hover-transform);
  }
`

const Logo = () => {
  const reduceMotion = useReducedMotionPreference()
  const footPrintImg = `/images/footprint${useColorModeValue('', '-dark')}.png`

  return (
    <Link href="/" aria-label="NerdySpook home">
      <LogoBox
        style={{
          '--logo-hover-transform': reduceMotion ? 'none' : 'rotate(20deg)'
        }}
      >
        <Image src={footPrintImg} width={20} height={20} alt="" />
        <Text
          color={useColorModeValue('gray.800', 'whiteAlpha.900')}
          fontFamily="heading"
          fontWeight="bold"
          fontSize={{ base: '16px', md: '18px' }}
          ml={2}
        >
          NerdySpook
        </Text>
      </LogoBox>
    </Link>
  )
}

export default Logo
