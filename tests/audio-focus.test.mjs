import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

// The website uses Next's ES module transform without package-wide type=module.
const load = async path =>
  import(
    `data:text/javascript;base64,${Buffer.from(
      await readFile(new URL(path, import.meta.url))
    ).toString('base64')}`
  )
const { createAudioFocus } = await load('../libs/audio-focus.js')
const { createMusicVolumeController } = await load('../libs/music-volume.js')

const setup = ({ webAudio = true } = {}) => {
  const ramps = []
  const audio = { volume: 1, paused: false, currentTime: 42 }
  let time = 0
  let frame = 0
  const frames = new Map()
  const parameter = {
    value: 0.2,
    setValueAtTime(value) {
      this.value = value
    },
    cancelAndHoldAtTime() {},
    linearRampToValueAtTime(value, at) {
      ramps.push([value, at])
      this.value = value
    }
  }
  const context = {
    currentTime: 10,
    state: 'suspended',
    sources: 0,
    resumes: 0,
    destination: {},
    createGain: () => ({ gain: parameter, connect() {}, disconnect() {} }),
    createMediaElementSource() {
      this.sources++
      return { connect() {}, disconnect() {} }
    },
    resume() {
      this.resumes++
      this.state = 'running'
      return Promise.resolve()
    },
    close() {
      this.state = 'closed'
      return Promise.resolve()
    }
  }
  const controller = createMusicVolumeController(audio, {
    createContext: () => (webAudio ? context : null),
    now: () => time,
    requestFrame: fn => {
      frames.set(++frame, fn)
      return frame
    },
    cancelFrame: id => frames.delete(id)
  })
  const advance = ms => {
    time += ms
    const callbacks = [...frames.values()]
    frames.clear()
    callbacks.forEach(fn => fn(time))
  }
  return { audio, context, controller, ramps, advance, frames }
}

test('one foreground sound cannot release another sound’s ducking', () => {
  const focus = createAudioFocus()
  const states = []
  focus.registerMusic({ setDucked: value => states.push(value) })
  const releaseFirst = focus.acquire()
  const releaseSecond = focus.acquire()
  releaseFirst()
  releaseFirst()
  assert.equal(focus.isForegroundActive(), true)
  assert.equal(states.at(-1), true)
  releaseSecond()
  assert.equal(focus.isForegroundActive(), false)
  assert.equal(states.at(-1), false)
})

test('registering and removing music during foreground playback preserves ownership', () => {
  const focus = createAudioFocus()
  const release = focus.acquire()
  const states = []
  const unregister = focus.registerMusic({
    setDucked: value => states.push(value)
  })
  assert.deepEqual(states, [true])
  unregister()
  assert.deepEqual(states, [true, false])
  assert.equal(focus.isForegroundActive(), true)
  release()
  assert.equal(focus.isForegroundActive(), false)
})

test('music fades down and back without changing playback or its position', () => {
  const { controller, audio, context, ramps } = setup()
  controller.setVolume(0.2)
  controller.activate()
  controller.activate()
  assert.equal(context.sources, 1)
  assert.equal(context.resumes, 1)
  controller.setDucked(true)
  assert.deepEqual(ramps.at(-1), [0.03, 10.14])
  audio.paused = true // User pauses while pronunciation is playing.
  controller.setDucked(false)
  assert.deepEqual(ramps.at(-1), [0.2, 10.4])
  assert.equal(audio.paused, true)
  assert.equal(audio.currentTime, 42)
  controller.dispose()
  assert.equal(context.state, 'closed')
})

test('paused music remains paused while the volume changes', () => {
  const { controller, audio, ramps } = setup()
  audio.paused = true
  controller.activate()
  controller.setDucked(true)
  controller.setDucked(false)
  assert.equal(audio.paused, true)
  assert.equal(ramps.at(-1)[0], 0.2)
})

test('rapid replay and volume updates restore the latest normal volume', () => {
  const { controller, ramps } = setup()
  controller.activate()
  controller.setDucked(true)
  controller.setVolume(0.4)
  assert.equal(ramps.at(-1)[0], 0.06)
  controller.setDucked(false)
  controller.setDucked(true)
  assert.equal(ramps.at(-1)[0], 0.06)
  controller.setDucked(false)
  assert.equal(ramps.at(-1)[0], 0.4)
})

test('native volume fallback cancels old fades and cleans up pending frames', () => {
  const { controller, audio, advance, frames } = setup({ webAudio: false })
  controller.activate()
  controller.setVolume(0.2)
  controller.setDucked(true)
  advance(140)
  assert.ok(Math.abs(audio.volume - 0.03) < 1e-9)
  controller.setDucked(false)
  advance(200)
  assert.ok(audio.volume > 0.03 && audio.volume < 0.2)
  controller.setDucked(true)
  advance(140)
  assert.ok(Math.abs(audio.volume - 0.03) < 1e-9)
  controller.setDucked(false)
  controller.dispose()
  assert.equal(frames.size, 0)
  assert.equal(audio.volume, 0.2)
})
