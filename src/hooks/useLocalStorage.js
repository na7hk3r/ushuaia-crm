import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue, migrate) {
  const [value, setValue] = useState(() => {
    const normalize = typeof migrate === 'function' ? migrate : value => value
    try {
      const stored = localStorage.getItem(key)
      return normalize(stored ? JSON.parse(stored) : initialValue)
    } catch {
      return normalize(initialValue)
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch { /* ignore quota errors */ }
  }, [key, value])

  return [value, setValue]
}
