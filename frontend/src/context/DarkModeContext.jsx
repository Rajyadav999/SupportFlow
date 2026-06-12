import { createContext, useContext, useState, useEffect } from 'react'

const DarkModeContext = createContext()

export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) {
      return stored === 'true'
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(prev => !prev)

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export const useDarkMode = () => {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}
