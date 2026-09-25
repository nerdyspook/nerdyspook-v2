// Foreground sounds borrow volume, never ownership of background playback.
export const createAudioFocus = () => {
  const owners = new Set()
  let music = null

  return {
    isForegroundActive: () => owners.size > 0,
    registerMusic(controller) {
      music = controller
      music.setDucked(owners.size > 0)
      return () => {
        if (music !== controller) return
        music.setDucked(false)
        music = null
      }
    },
    acquire() {
      const owner = Symbol('foreground-audio')
      owners.add(owner)
      music?.setDucked(true)
      return () => {
        if (!owners.delete(owner)) return
        music?.setDucked(owners.size > 0)
      }
    }
  }
}
