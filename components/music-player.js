import { useEffect, useRef, useState } from 'react'
import { Box, Flex, Text, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { IoPlay, IoPause } from 'react-icons/io5'
import { AnimatedIconButton } from './animated-button'
import { useReducedMotionPreference } from './motion-preferences'

const MusicPlayer = ({ src, volume = 0.2 }) => {
  const audioRef = useRef(null)
  const [status, setStatus] = useState('paused')
  const [error, setError] = useState('')
  const reduceMotion = useReducedMotionPreference()
  const background = useColorModeValue('#f0e7dbf5', '#202023f5')
  const foreground = useColorModeValue('teal.700', 'teal.200')
  const border = useColorModeValue('blackAlpha.300', 'whiteAlpha.300')
  const active = status !== 'paused'
  const label = active ? 'Pause music' : 'Play music'

  useEffect(() => {
    const audio = audioRef.current
    audio.volume = Math.min(1, Math.max(0, volume))
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    let cancelled = false

    // Set the volume above before attempting audible autoplay.
    // Browsers that require a gesture leave the play button available.
    audio.play().catch(playbackError => {
      if (cancelled || playbackError.name === 'AbortError') return
      if (playbackError.name === 'NotAllowedError') return
      setStatus('paused')
      setError('Music could not play. Tap play to try again.')
    })

    return () => {
      cancelled = true
      audio.pause()
    }
  }, [])

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio.paused) {
      audio.pause()
      return
    }

    setError('')
    setStatus('loading')
    try {
      if (audio.error) audio.load()
      await audio.play()
    } catch (playbackError) {
      // Pausing while the file loads cancels the pending play request.
      if (playbackError.name === 'AbortError') return
      setStatus('paused')
      setError('Music could not play. Tap play to try again.')
    }
  }

  return (
    <Box
      position="fixed"
      bottom="max(1.5rem, env(safe-area-inset-bottom))"
      right="max(1.5rem, env(safe-area-inset-right))"
      zIndex="sticky"
    >
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="none"
        onPlay={() => setStatus('loading')}
        onPlaying={() => setStatus('playing')}
        onPause={() => setStatus('paused')}
        onWaiting={() => {
          if (!audioRef.current.paused) setStatus('loading')
        }}
        onError={() => {
          setStatus('paused')
          setError('Music is unavailable. Try again later.')
        }}
      />
      <Text
        role="status"
        position="absolute"
        right={0}
        bottom="56px"
        w="220px"
        p={error ? 3 : 0}
        bg={background}
        borderRadius="md"
        boxShadow={error ? 'md' : 'none'}
        fontSize="sm"
      >
        {error}
      </Text>
      <Tooltip
        label={status === 'loading' ? 'Loading music — click to pause' : label}
        placement="left"
        hasArrow
      >
        <AnimatedIconButton
          type="button"
          aria-label={label}
          aria-pressed={active}
          onClick={togglePlayback}
          minW="44px"
          h="44px"
          borderRadius="full"
          border="1px solid"
          borderColor={border}
          bg={background}
          color={foreground}
          boxShadow="lg"
          backdropFilter="blur(10px)"
          icon={
            status === 'playing' && reduceMotion === false ? (
              <Flex
                aria-hidden="true"
                align="flex-end"
                gap="3px"
                h="16px"
                sx={{
                  '@keyframes music-bar': {
                    from: { transform: 'scaleY(0.3)' },
                    to: { transform: 'scaleY(1)' }
                  }
                }}
              >
                {[0, 0.3, 0.15, 0.45].map(delay => (
                  <Box
                    key={delay}
                    w="3px"
                    h="16px"
                    borderRadius="full"
                    bg="currentColor"
                    transformOrigin="bottom"
                    animation={`music-bar 0.6s ${delay}s ease-in-out infinite alternate`}
                  />
                ))}
              </Flex>
            ) : active ? (
              <IoPause aria-hidden="true" size={18} />
            ) : (
              <IoPlay aria-hidden="true" size={18} />
            )
          }
        />
      </Tooltip>
    </Box>
  )
}

export default MusicPlayer
