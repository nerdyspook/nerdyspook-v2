import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, Spinner, Text, useColorModeValue } from '@chakra-ui/react'
import { IoVolumeHighOutline, IoStop } from 'react-icons/io5'
import { useAudioFocus } from './audio-focus'
import NameSpellings from './name-spellings'

const NamePronunciation = () => {
  const audioRef = useRef(null)
  const releaseRef = useRef(null)
  const requestRef = useRef(0)
  const timeoutRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const { acquire } = useAudioFocus()
  const router = useRouter()
  const color = useColorModeValue('gray.700', 'gray.200')
  const accent = useColorModeValue('teal.700', 'teal.200')
  const active = status !== 'idle'

  const release = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
    releaseRef.current?.()
    releaseRef.current = null
  }, [])

  const stop = useCallback(() => {
    requestRef.current += 1
    audioRef.current?.pause()
    release()
    setStatus('idle')
  }, [release])

  const startTimeout = useCallback(() => {
    const request = requestRef.current
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      if (request !== requestRef.current) return
      stop()
      setError('Audio took too long to load. Please try again.')
    }, 8000)
  }, [stop])

  useEffect(() => {
    const audio = audioRef.current
    router.events.on('routeChangeStart', stop)
    return () => {
      router.events.off('routeChangeStart', stop)
      requestRef.current += 1
      audio.pause()
      release()
    }
  }, [release, router.events, stop])

  const toggle = async () => {
    if (releaseRef.current) {
      stop()
      return
    }
    const audio = audioRef.current
    const request = ++requestRef.current
    setError('')
    setStatus('loading')
    releaseRef.current = acquire()
    startTimeout()
    try {
      if (audio.error) audio.load()
      audio.currentTime = 0
      await audio.play()
    } catch (playbackError) {
      if (request !== requestRef.current) return
      stop()
      if (playbackError.name !== 'AbortError')
        setError('Could not play the pronunciation. Please try again.')
    }
  }

  return (
    <Box gridColumn="1 / -1" gridRow={3} mt={1}>
      <Box
        role="group"
        aria-label="Name pronunciation and spellings"
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        gap={{ base: 2, sm: 3 }}
        color={color}
        textAlign="left"
        fontSize={{ base: '18px', sm: '22px' }}
        fontWeight="500"
        lineHeight="1.5"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={event => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocused(false)
        }}
      >
        <Text as="span">[su-sant-o]</Text>
        <Text as="span" aria-hidden="true">
          ·
        </Text>
        <NameSpellings paused={hovered || focused || active} />
        <Button
          data-audio-control="pronunciation"
          variant="unstyled"
          type="button"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          h="44px"
          w="44px"
          minW="44px"
          color={active ? accent : color}
          aria-label={
            active ? 'Stop name pronunciation' : 'Play name pronunciation'
          }
          aria-pressed={active}
          aria-busy={status === 'loading'}
          _hover={{ color: accent }}
          _focusVisible={{
            outline: '2px solid',
            outlineColor: accent,
            outlineOffset: '4px'
          }}
          onClick={toggle}
        >
          {status === 'loading' ? (
            <Spinner size="xs" aria-hidden="true" />
          ) : active ? (
            <IoStop size={16} aria-hidden="true" />
          ) : (
            <IoVolumeHighOutline size={18} aria-hidden="true" />
          )}
        </Button>
      </Box>
      <audio
        ref={audioRef}
        src="/audio/susanto-calm.wav"
        preload="none"
        aria-hidden="true"
        onPlaying={() => {
          if (!releaseRef.current || audioRef.current.paused) return
          window.clearTimeout(timeoutRef.current)
          setStatus('playing')
        }}
        onWaiting={() => {
          if (!releaseRef.current) return
          setStatus('loading')
          startTimeout()
        }}
        onEnded={stop}
        onPause={() => {
          if (audioRef.current.paused) stop()
        }}
        onError={() => {
          stop()
          setError('Pronunciation is unavailable. Please try again.')
        }}
      />
      <Text role="status" fontSize="sm" color={color}>
        {error}
      </Text>
    </Box>
  )
}

export default NamePronunciation
