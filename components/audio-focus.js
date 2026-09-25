import { createContext, useContext, useState } from 'react'
import { createAudioFocus } from '../libs/audio-focus'

const AudioFocusContext = createContext(null)

export const AudioFocusProvider = ({ children }) => {
  const [focus] = useState(createAudioFocus)
  return (
    <AudioFocusContext.Provider value={focus}>
      {children}
    </AudioFocusContext.Provider>
  )
}

export const useAudioFocus = () => useContext(AudioFocusContext)
