import { useEffect, useId, useRef } from 'react'
import { alluraOutline, penStrokes } from '../libs/name-lettering'
import { useReducedMotionPreference } from './motion-preferences'

// The introduction writes once per page session, including client navigation.
let hasWrittenName = false
const PEN_SPEED = 330

// Pace by distance, slowing at tight turns instead of restarting an easing curve
// for every letter. The pen and the revealed ink use the same distance sample.
const measureStroke = path => {
  const length = path.getTotalLength()
  const count = Math.max(2, Math.ceil(length / 2))
  const points = Array.from({ length: count + 1 }, (_, index) =>
    path.getPointAtLength((length * index) / count)
  )
  const timings = [0]
  for (let index = 1; index <= count; index += 1) {
    const previous = points[index - 1]
    const current = points[index]
    const next = points[Math.min(index + 1, count)]
    const incoming = Math.atan2(current.y - previous.y, current.x - previous.x)
    const outgoing = Math.atan2(next.y - current.y, next.x - current.x)
    const turn = Math.abs(
      Math.atan2(Math.sin(outgoing - incoming), Math.cos(outgoing - incoming))
    )
    const pace = 1 + Math.min(turn / 0.5, 1) * 1.3
    timings.push(
      timings[index - 1] + ((length / count) * pace * 1000) / PEN_SPEED
    )
  }
  return {
    path,
    length,
    timings,
    duration: timings[count],
    start: points[0],
    end: points[count]
  }
}

const distanceAtTime = (stroke, time) => {
  let index = 1
  while (index < stroke.timings.length - 1 && stroke.timings[index] < time)
    index += 1
  const before = stroke.timings[index - 1]
  const after = stroke.timings[index]
  const fraction = Math.min(1, Math.max(0, (time - before) / (after - before)))
  return ((index - 1 + fraction) / (stroke.timings.length - 1)) * stroke.length
}

const NameWordmark = () => {
  const reduceMotion = useReducedMotionPreference()
  const id = useId().replace(/:/g, '')
  const maskId = `allura-ink-${id}`
  const svgRef = useRef(null)
  const inkRef = useRef(null)
  const nibRef = useRef(null)
  const strokeRefs = useRef([])

  useEffect(() => {
    const svg = svgRef.current
    const ink = inkRef.current
    const nib = nibRef.current
    const showFinished = () => {
      ink.removeAttribute('mask')
      nib.style.visibility = 'hidden'
      svg.dataset.writing = 'complete'
    }

    if (reduceMotion !== false) {
      // The provider's server snapshot is conservative. Wait for its hydrated
      // value unless the visitor actually requests reduced motion.
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        showFinished()
      return
    }
    if (hasWrittenName || typeof IntersectionObserver === 'undefined') {
      showFinished()
      return
    }

    let frame = null
    let lastTime = null
    let elapsed = 0
    let started = false
    let finished = false
    let visible = false
    const strokes = strokeRefs.current.map(measureStroke)
    const timeline = []
    let cursor = 220
    strokes.forEach((stroke, index) => {
      const previous = strokes[index - 1]
      if (previous) {
        const distance = Math.hypot(
          stroke.start.x - previous.end.x,
          stroke.start.y - previous.end.y
        )
        if (distance > 2) {
          const duration = Math.min(190, 85 + distance * 1.1)
          timeline.push({
            type: 'lift',
            start: cursor,
            end: cursor + duration,
            from: previous.end,
            to: stroke.start
          })
          cursor += duration
        }
      }
      timeline.push({
        type: 'ink',
        start: cursor,
        end: cursor + stroke.duration,
        stroke
      })
      cursor += stroke.duration
    })
    const finishTime = cursor + 160
    const finalPoint = strokes[strokes.length - 1].end
    ink.setAttribute('mask', `url(#${maskId})`)
    svg.dataset.writing = 'pending'
    strokes.forEach(({ path }) => {
      path.style.visibility = 'hidden'
      path.style.strokeDashoffset = '1'
    })
    nib.style.visibility = 'hidden'

    const movePen = (point, opacity = 0.8) => {
      nib.setAttribute('transform', `translate(${point.x} ${point.y})`)
      nib.style.opacity = String(opacity)
      nib.style.visibility = 'visible'
    }

    const paint = time => {
      nib.style.visibility = 'hidden'
      for (const segment of timeline) {
        if (time < segment.start) break
        if (segment.type === 'lift') {
          if (time < segment.end) {
            const progress =
              (time - segment.start) / (segment.end - segment.start)
            const eased = progress * progress * (3 - 2 * progress)
            movePen(
              {
                x: segment.from.x + (segment.to.x - segment.from.x) * eased,
                y:
                  segment.from.y +
                  (segment.to.y - segment.from.y) * eased -
                  7 * Math.sin(Math.PI * progress)
              },
              0.8 - 0.58 * Math.sin(Math.PI * progress)
            )
            break
          }
        } else {
          const { stroke } = segment
          stroke.path.style.visibility = 'visible'
          const distance = distanceAtTime(
            stroke,
            Math.min(time - segment.start, stroke.duration)
          )
          stroke.path.style.strokeDashoffset = String(
            Math.max(0, 1 - distance / stroke.length)
          )
          if (time < segment.end) {
            movePen(stroke.path.getPointAtLength(distance))
            break
          }
        }
      }
      if (time >= cursor && time < finishTime) {
        movePen(finalPoint, 0.8 * (1 - (time - cursor) / 160))
      }
    }

    const tick = now => {
      frame = null
      if (!visible || document.hidden || finished) return
      if (lastTime !== null) elapsed += Math.min(now - lastTime, 48)
      lastTime = now
      paint(elapsed)
      if (elapsed >= finishTime) {
        // Keep the fully drawn mask in place: no final glyph-fill replacement.
        finished = true
        nib.style.visibility = 'hidden'
        svg.dataset.writing = 'complete'
        return
      }
      frame = window.requestAnimationFrame(tick)
    }
    const sync = () => {
      window.cancelAnimationFrame(frame)
      frame = null
      lastTime = null
      if (!visible || document.hidden || finished) return
      if (!started) {
        started = true
        hasWrittenName = true
        svg.dataset.writing = 'drawing'
      }
      frame = window.requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        sync()
      },
      { threshold: 0.2 }
    )
    observer.observe(svg)
    document.addEventListener('visibilitychange', sync)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      showFinished()
    }
  }, [maskId, reduceMotion])

  return (
    <>
      <svg
        ref={svgRef}
        className="name-wordmark"
        data-writing="pending"
        viewBox="8 16 376 118"
        width="376"
        height="118"
        aria-hidden="true"
        focusable="false"
        style={{ display: 'block', width: '100%', height: 'auto' }}
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="392"
            height="154"
            style={{ maskType: 'alpha' }}
          >
            {penStrokes.map((stroke, index) => (
              <path
                key={stroke.id}
                ref={node => {
                  strokeRefs.current[index] = node
                }}
                d={stroke.d}
                pathLength="1"
                fill="none"
                stroke="white"
                strokeWidth={stroke.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1"
                strokeDashoffset="1"
              />
            ))}
          </mask>
        </defs>
        <path
          ref={inkRef}
          className="name-ink"
          d={alluraOutline}
          fill="currentColor"
        />
        <g
          ref={nibRef}
          className="name-pen"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          style={{ visibility: 'hidden' }}
        >
          <path d="M1 -2L5 -12" strokeWidth="2.4" />
          <path d="M0 0L1 -2" strokeWidth="1" />
        </g>
      </svg>
      <noscript>
        <style>
          {'.name-wordmark .name-ink { visibility: visible !important; }'}
        </style>
      </noscript>
      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          .name-wordmark[data-writing='pending'] .name-ink {
            visibility: hidden;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .name-ink {
            mask: none !important;
            visibility: visible !important;
          }
          .name-pen {
            display: none;
          }
        }
      `}</style>
    </>
  )
}

export default NameWordmark
