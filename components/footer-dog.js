import { useEffect, useRef, useState } from 'react'
import { Box, Image, useColorModeValue } from '@chakra-ui/react'
import {
  DOG_GREETING_DURATION,
  DOG_SIZE,
  getDogGreetingState,
  getDogMessage,
  getDogStoryState,
  isDogHit
} from '../libs/footer-dog'

const FooterDog = () => {
  const canvasRef = useRef(null)
  const bubbleRef = useRef(null)
  const controllerRef = useRef(null)
  const [clicks, setClicks] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const [ready, setReady] = useState(false)
  const bubbleColor = useColorModeValue('#faf6ee', '#2b2b2e')
  const bubbleBorder = useColorModeValue('#d8cfc1', '#48484c')
  const message = speaking ? getDogMessage(clicks) : ''

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    const sheet = new window.Image()
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 720
    let height = 200
    let ratio = 1
    let loaded = false
    let visible = false
    let disposed = false
    let keyboardFocus = false
    let elapsed = 0
    let greeting = null
    let greetingTimer = null
    let lastTime = null
    let animationFrame = null
    let actor = getDogStoryState(0, width, height)

    const render = () => {
      if (!loaded || disposed) return
      actor = greeting
        ? getDogGreetingState(greeting.elapsed, width, height, greeting.xRatio)
        : getDogStoryState(elapsed, width, height)
      if (preference.matches && !greeting) {
        actor = {
          ...actor,
          x: width / 2,
          y: height - 1,
          frame: 17,
          flip: false
        }
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.clearRect(0, 0, width, height)
      context.imageSmoothingEnabled = false
      context.save()
      context.translate(actor.x, actor.y)
      context.scale(actor.flip ? -actor.scale : actor.scale, actor.scale)
      context.drawImage(
        sheet,
        (actor.frame % 4) * DOG_SIZE.width,
        Math.floor(actor.frame / 4) * DOG_SIZE.height,
        DOG_SIZE.width,
        DOG_SIZE.height,
        -DOG_SIZE.width / 2,
        -DOG_SIZE.baseline,
        DOG_SIZE.width,
        DOG_SIZE.height
      )
      context.restore()
      // Keyboard users get a small ground marker, never a box around the dog.
      if (keyboardFocus) {
        context.strokeStyle = '#88ccca'
        context.lineWidth = 2
        context.setLineDash([3, 3])
        context.beginPath()
        context.moveTo(actor.x - 28 * actor.scale, height - 2)
        context.lineTo(actor.x + 28 * actor.scale, height - 2)
        context.stroke()
        context.setLineDash([])
      }
      if (bubbleRef.current) {
        const half = Math.min(250, width) / 2
        const bubbleX = Math.max(half, Math.min(width - half, actor.x))
        bubbleRef.current.style.left = `${bubbleX}px`
        bubbleRef.current.style.setProperty(
          '--dog-tail-x',
          `${actor.x - bubbleX + half}px`
        )
      }
    }

    const finishGreeting = () => {
      greeting = null
      setSpeaking(false)
      render()
    }
    const tick = now => {
      const delta =
        lastTime === null ? 0 : Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      if (greeting) {
        greeting.elapsed += delta
        if (greeting.elapsed >= DOG_GREETING_DURATION) finishGreeting()
      } else if (!keyboardFocus) {
        elapsed += delta
      }
      render()
      animationFrame = window.requestAnimationFrame(tick)
    }
    const sync = () => {
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(greetingTimer)
      lastTime = null
      if (greeting && preference.matches) {
        greetingTimer = window.setTimeout(
          finishGreeting,
          (DOG_GREETING_DURATION - greeting.elapsed) * 1000
        )
      }
      if (
        loaded &&
        visible &&
        !document.hidden &&
        !preference.matches &&
        !disposed
      ) {
        animationFrame = window.requestAnimationFrame(tick)
      } else {
        render()
      }
    }
    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      render()
    }
    controllerRef.current = {
      activate: point => {
        if (!loaded || (point && !isDogHit(actor, point.x, point.y)))
          return false
        greeting = { elapsed: 0, xRatio: actor.x / width }
        render()
        sync()
        return true
      },
      hit: point => loaded && isDogHit(actor, point.x, point.y),
      focus: value => {
        keyboardFocus = value
        render()
      }
    }
    sheet.onload = () => {
      if (disposed) return
      loaded = true
      resize()
      setReady(true)
      sync()
    }
    sheet.src = '/art/footer-dog/dog-motion-atlas.webp'
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(canvas)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    visibilityObserver.observe(canvas)
    preference.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    resize()
    return () => {
      disposed = true
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(greetingTimer)
      sizeObserver.disconnect()
      visibilityObserver.disconnect()
      preference.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
      sheet.onload = null
      controllerRef.current = null
    }
  }, [])

  const localPoint = event => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
  }
  const sayHello = point => {
    if (!controllerRef.current?.activate(point)) return
    setClicks(value => value + 1)
    setSpeaking(true)
  }

  return (
    <Box position="relative" height={{ base: '168px', md: '200px' }}>
      {!ready && (
        <Image
          src="/art/footer-dog/dog-poster.png"
          alt=""
          aria-hidden="true"
          position="absolute"
          bottom="-12px"
          left="50%"
          transform="translateX(-50%)"
          width="128px"
          height="96px"
          pointerEvents="none"
          style={{ imageRendering: 'pixelated' }}
        />
      )}
      <Box
        as="canvas"
        ref={canvasRef}
        role="button"
        tabIndex={0}
        aria-label="Say hello to the walking dog"
        aria-describedby={message ? 'footer-dog-message' : undefined}
        display="block"
        width="100%"
        height="100%"
        opacity={ready ? 1 : 0}
        outline="none"
        boxShadow="none"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        onPointerDown={() => controllerRef.current?.focus(false)}
        onPointerMove={event => {
          event.currentTarget.style.cursor = controllerRef.current?.hit(
            localPoint(event)
          )
            ? 'pointer'
            : 'default'
        }}
        onClick={event =>
          sayHello(event.detail === 0 ? null : localPoint(event))
        }
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            if (!event.repeat) sayHello(null)
          }
        }}
        onFocus={event =>
          controllerRef.current?.focus(
            event.currentTarget.matches(':focus-visible')
          )
        }
        onBlur={() => controllerRef.current?.focus(false)}
      />
      <Box
        ref={bubbleRef}
        position="absolute"
        bottom="96px"
        left="50%"
        transform="translateX(-50%)"
        width="min(250px, 100%)"
        textAlign="left"
        pointerEvents="none"
      >
        <Box
          id="footer-dog-message"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          position="relative"
          bg={message ? bubbleColor : 'transparent'}
          borderWidth={message ? '1px' : 0}
          borderColor={bubbleBorder}
          borderRadius="18px"
          boxShadow={message ? '0 5px 18px rgba(0, 0, 0, 0.08)' : 'none'}
          px={4}
          py={message ? 3 : 0}
          fontSize="14px"
          lineHeight="1.5"
          _after={
            message
              ? {
                  content: '""',
                  position: 'absolute',
                  bottom: '-7px',
                  left: 'clamp(18px, var(--dog-tail-x, 50%), calc(100% - 18px))',
                  width: '12px',
                  height: '12px',
                  bg: bubbleColor,
                  borderRight: '1px solid',
                  borderBottom: '1px solid',
                  borderColor: bubbleBorder,
                  transform: 'translateX(-50%) rotate(45deg)'
                }
              : undefined
          }
        >
          {message}
        </Box>
      </Box>
    </Box>
  )
}

export default FooterDog
