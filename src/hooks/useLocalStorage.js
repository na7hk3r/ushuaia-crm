import { useState, useEffect } from 'react'

const LOCAL_STORAGE_SYNC_EVENT = 'ushuaia-local-storage-sync'

function readStoredValue(key, initialValue, migrate) {
  const normalize = typeof migrate === 'function' ? migrate : value => value
  try {
    const stored = localStorage.getItem(key)
    return normalize(stored ? JSON.parse(stored) : initialValue)
  } catch {
    return normalize(initialValue)
  }
}

export function useLocalStorage(key, initialValue, migrate) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue, migrate))

  useEffect(() => {
    function syncValue(event) {
      if (event.key !== key) return
      setValue(readStoredValue(key, initialValue, migrate))
    }

    function syncLocalValue(event) {
      if (event.detail?.key !== key) return
      setValue(readStoredValue(key, initialValue, migrate))
    }

    window.addEventListener('storage', syncValue)
    window.addEventListener(LOCAL_STORAGE_SYNC_EVENT, syncLocalValue)
    return () => {
      window.removeEventListener('storage', syncValue)
      window.removeEventListener(LOCAL_STORAGE_SYNC_EVENT, syncLocalValue)
    }
  }, [key, initialValue, migrate])

  useEffect(() => {
    try {
      const serializedValue = JSON.stringify(value)
      if (localStorage.getItem(key) === serializedValue) return
      localStorage.setItem(key, serializedValue)
      window.dispatchEvent(new CustomEvent(LOCAL_STORAGE_SYNC_EVENT, { detail: { key } }))
    } catch { /* ignore quota errors */ }
  }, [key, value])

  return [value, setValue]
}
