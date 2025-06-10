import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ 
  children, 
  defaultTheme = 'light', 
  storageKey = 'theme',
  enableSystem = true,
  disableTransitionOnChange = false,
  attribute = 'class'
}) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey)
      if (stored) return stored
    }
    
    // Check system preference if enabled
    if (enableSystem && typeof window !== 'undefined') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      return systemTheme
    }
    
    return defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    if (disableTransitionOnChange) {
      root.style.transition = 'none'
    }
    
    root.classList.remove('light', 'dark')
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
    
    if (disableTransitionOnChange) {
      // Force reflow
      root.offsetHeight
      root.style.transition = ''
    }
  }, [theme, disableTransitionOnChange])

  useEffect(() => {
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  const value = {
    theme,
    setTheme,
    themes: ['light', 'dark', ...(enableSystem ? ['system'] : [])]
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
