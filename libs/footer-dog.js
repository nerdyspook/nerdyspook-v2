export const DOG_MESSAGES = [
  'Hello, human! I’m the footer’s chief nap officer.',
  'Zoro asked me for directions. We’re both lost now.',
  'I found a bug. It had six legs, so I let it go.',
  'My tech stack: fetch, sit, stay… and a very long nap.',
  'One more click counts as a belly rub. Those are the rules.',
  'Your next great idea might arrive after a little walk.',
  'I guard the footer. The top of the page is above my pay grade.',
  'You made it to the bottom! Have a virtual tail wag.'
]

export const getDogMessage = clicks =>
  clicks > 0 ? DOG_MESSAGES[(clicks - 1) % DOG_MESSAGES.length] : ''

export const DOG_SIZE = { width: 128, height: 96, baseline: 84 }
export const DOG_GREETING_DURATION = 4.8
const progress = (time, start, end) =>
  Math.max(0, Math.min(1, (time - start) / (end - start)))
const smooth = value => value * value * (3 - 2 * value)
const frameAt = (time, frames, durations) => {
  let remaining = time * 1000
  for (let index = 0; index < frames.length; index += 1) {
    if (remaining < durations[index]) return frames[index]
    remaining -= durations[index]
  }
  return frames[frames.length - 1]
}

export const getDogRoute = width => {
  const scale = Math.min(1, Math.max(1, width) / 160)
  const span = Math.max(0, Math.min(420, width - 140 * scale))
  const hop = Math.min(48 * scale, span * 0.28)
  const outward = Math.max(0.8, span / (54 * scale))
  const homeward = Math.max(0.8, (span - hop) / (54 * scale))
  return {
    scale,
    span,
    left: (width - span) / 2,
    right: (width + span) / 2,
    hop,
    outward,
    homeward,
    duration: outward + 2.4 + 1 + homeward + 0.9 + 2.6 + 0.6
  }
}

// Position is continuous; the eight gait poses advance with distance travelled.
export const getDogStoryState = (elapsed, width, height) => {
  const route = getDogRoute(width)
  let time = elapsed % route.duration
  const actor = {
    x: route.left,
    y: height - 1,
    scale: route.scale,
    flip: false,
    frame: 20,
    beat: 'walk'
  }
  const walkFrame = distance =>
    20 + (Math.floor(distance / (6.75 * route.scale)) % 8)

  if (time < route.outward) {
    const distance = route.span * progress(time, 0, route.outward)
    return { ...actor, x: route.left + distance, frame: walkFrame(distance) }
  }
  time -= route.outward
  actor.x = route.right
  if (time < 2.4) {
    return {
      ...actor,
      beat: 'look',
      frame: frameAt(time, [16, 17, 19, 17], [500, 850, 150, 900])
    }
  }
  time -= 2.4
  actor.flip = true
  if (time < 1) {
    const flight = progress(time, 0.16, 0.78)
    return {
      ...actor,
      beat: 'hop',
      x: route.right - smooth(flight) * route.hop,
      y: actor.y - 4 * flight * (1 - flight) * 22 * route.scale,
      frame: frameAt(time, [9, 10, 11, 8], [160, 400, 220, 220])
    }
  }
  time -= 1
  if (time < route.homeward) {
    const distance =
      (route.span - route.hop) * progress(time, 0, route.homeward)
    return {
      ...actor,
      x: route.right - route.hop - distance,
      frame: walkFrame(distance)
    }
  }
  time -= route.homeward
  actor.x = route.left
  actor.flip = false
  if (time < 0.9) {
    return {
      ...actor,
      beat: 'settle',
      frame: frameAt(time, [16, 13, 14, 15], [160, 240, 260, 240])
    }
  }
  if (time < 3.5) {
    return {
      ...actor,
      beat: 'sleep',
      frame: Math.floor((time - 0.9) / 0.65) % 4
    }
  }
  return {
    ...actor,
    beat: 'wake',
    frame: frameAt(time - 3.5, [4, 5, 6, 8], [140, 160, 160, 140])
  }
}

export const getDogGreetingState = (time, width, height, xRatio) => {
  const { scale } = getDogRoute(width)
  return {
    x: Math.max(64 * scale, Math.min(width - 64 * scale, width * xRatio)),
    y: height - 1,
    scale,
    flip: false,
    frame: frameAt(
      time,
      [16, 17, 18, 17, 19, 17],
      [250, 350, 700, 1500, 140, 1860]
    ),
    beat: 'hello'
  }
}

export const isDogHit = (actor, x, y) =>
  Math.abs(x - actor.x) <= 50 * actor.scale &&
  y >= actor.y - 84 * actor.scale &&
  y <= actor.y + 4
