import { createContext, useContext, useSyncExternalStore } from 'react'
import { MotionConfig } from 'framer-motion'

const MotionPreferences = createContext(true)
const query = '(prefers-reduced-motion: reduce)'
const subscribe = callback => {
  const preference = window.matchMedia(query)
  preference.addEventListener('change', callback)
  return () => preference.removeEventListener('change', callback)
}
const getPreference = () => window.matchMedia(query).matches
const serverPreference = () => true

export const MotionPreferencesProvider = ({ children }) => {
  const reduceMotion = useSyncExternalStore(
    subscribe,
    getPreference,
    serverPreference
  )

  return (
    <MotionPreferences.Provider value={reduceMotion}>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </MotionPreferences.Provider>
  )
}

export const useReducedMotionPreference = () => useContext(MotionPreferences)
