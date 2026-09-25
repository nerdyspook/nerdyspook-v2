const clamp = value => Math.min(1, Math.max(0, value))

export const createMusicVolumeController = (
  audio,
  {
    createContext = () => {
      const Context = window.AudioContext || window.webkitAudioContext
      return Context ? new Context() : null
    },
    requestFrame = callback => window.requestAnimationFrame(callback),
    cancelFrame = frame => window.cancelAnimationFrame(frame),
    now = () => performance.now()
  } = {}
) => {
  let baseVolume = 0.2
  let ducked = false
  let context = null
  let source = null
  let gain = null
  let frame = null
  let disposed = false
  audio.volume = baseVolume

  const targetVolume = () => baseVolume * (ducked ? 0.15 : 1)
  const cancelFade = () => {
    if (frame !== null) cancelFrame(frame)
    frame = null
  }
  const fadeTo = (target, seconds) => {
    cancelFade()
    if (gain) {
      const param = gain.gain
      const time = context.currentTime
      const current = param.value
      if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(time)
      else {
        param.cancelScheduledValues(time)
        param.setValueAtTime(current, time)
      }
      param.linearRampToValueAtTime(target, time + seconds)
      return
    }
    // Older browsers can still fade the native media volume.
    const from = audio.volume
    const start = now()
    const tick = time => {
      const progress = Math.min(1, (time - start) / (seconds * 1000))
      audio.volume = clamp(from + (target - from) * progress)
      frame = progress < 1 ? requestFrame(tick) : null
    }
    frame = requestFrame(tick)
  }

  return {
    // Called only within a user interaction. GainNode also supports smooth
    // ducking on browsers that do not allow setting media-element volume.
    activate() {
      if (disposed) return
      if (!context) {
        try {
          context = createContext()
          if (!context) return
          gain = context.createGain()
          gain.gain.setValueAtTime(targetVolume(), context.currentTime)
          gain.connect(context.destination)
          source = context.createMediaElementSource(audio)
          source.connect(gain)
          audio.volume = 1
          fadeTo(targetVolume(), 0.14)
        } catch {
          context?.close().catch(() => {})
          context = null
          gain = null
          return
        }
      }
      if (context.state !== 'running') context.resume().catch(() => {})
    },
    setVolume(value) {
      baseVolume = clamp(value)
      if (disposed) return
      if (gain) fadeTo(targetVolume(), 0.14)
      else {
        cancelFade()
        audio.volume = targetVolume()
      }
    },
    setDucked(value) {
      if (disposed || ducked === value) return
      ducked = value
      fadeTo(targetVolume(), value ? 0.14 : 0.4)
    },
    dispose() {
      disposed = true
      cancelFade()
      source?.disconnect()
      gain?.disconnect()
      context?.close().catch(() => {})
      audio.volume = baseVolume
    }
  }
}
