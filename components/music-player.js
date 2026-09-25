import { useEffect, useRef, useState } from 'react'
import { Box, Flex, Text, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { IoPlay, IoPause } from 'react-icons/io5'
import { AnimatedIconButton } from './animated-button'
import { useReducedMotionPreference } from './motion-preferences'
import { useAudioFocus } from './audio-focus'
import { createMusicVolumeController } from '../libs/music-volume'

const MusicPlayer = ({ src, volume = 0.2 }) => {
  const audioRef = useRef(null)
  const playerRef = useRef(null)
  const stopAutoStartRef = useRef(null)
  const volumeRef = useRef(null)
  const { registerMusic, isForegroundActive } = useAudioFocus()
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
    const controller = createMusicVolumeController(audio)
    volumeRef.current = controller
    const unregister = registerMusic({
      setDucked(value) {
        if (value) {
          if (audio.paused) stopAutoStartRef.current?.()
          controller.activate()
        }
        controller.setDucked(value)
      }
    })
    return () => {
      unregister()
      controller.dispose()
      volumeRef.current = null
    }
  }, [registerMusic])

  useEffect(() => {
    volumeRef.current?.setVolume(volume)
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    let cancelled = false
    let autoStart = true
    let pending = false

    const stopAutoStart = () => {
      autoStart = false
      document.removeEventListener('pointerup', startOnInteraction, true)
      document.removeEventListener('click', startOnInteraction, true)
      document.removeEventListener('keydown', startOnInteraction, true)
    }
    const tryAutoStart = () => {
      if (!autoStart || pending) return
      pending = true
      // Volume is set before this request. Retry blocked autoplay directly
      // inside a user gesture, without changing the browser's audio policy.
      audio
        .play()
        .then(stopAutoStart)
        .catch(playbackError => {
          if (cancelled || !autoStart || playbackError.name === 'AbortError')
            return
          if (playbackError.name === 'NotAllowedError') return
          stopAutoStart()
          setStatus('paused')
          setError('Music could not play. Tap play to try again.')
        })
        .finally(() => {
          pending = false
        })
    }
    function startOnInteraction(event) {
      // The music button owns its own gesture; starting here would make its
      // subsequent click immediately pause the audio again.
      if (playerRef.current?.contains(event.target)) return
      if (event.target.closest?.('[data-audio-control]')) return
      if (isForegroundActive()) return
      if (
        event.type === 'keydown' &&
        (event.repeat ||
          event.metaKey ||
          event.ctrlKey ||
          event.altKey ||
          ['Escape', 'Shift', 'Control', 'Alt', 'Meta'].includes(event.key))
      )
        return
      volumeRef.current?.activate()
      tryAutoStart()
    }

    stopAutoStartRef.current = stopAutoStart
    document.addEventListener('pointerup', startOnInteraction, true)
    document.addEventListener('click', startOnInteraction, true)
    document.addEventListener('keydown', startOnInteraction, true)
    tryAutoStart()

    return () => {
      cancelled = true
      stopAutoStart()
      stopAutoStartRef.current = null
      audio.pause()
    }
  }, [isForegroundActive])

  const togglePlayback = async () => {
    const audio = audioRef.current
    // A deliberate play/pause choice takes precedence over automatic retries.
    stopAutoStartRef.current?.()
    if (!audio.paused) {
      audio.pause()
      return
    }

    setError('')
    setStatus('loading')
    volumeRef.current?.activate()
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
      ref={playerRef}
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
