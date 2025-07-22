import { useCallback, useEffect, useState } from 'react'

type StorageValue = string | number | boolean | object | null

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
  initializeWithValue?: boolean
}

export function useLocalStorage<T extends StorageValue>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    initializeWithValue = true
  } = options

  const getStoredValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? deserializer(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }, [key, initialValue, deserializer])

  const [storedValue, setStoredValue] = useState<T>(
    initializeWithValue ? getStoredValue() : initialValue
  )

  useEffect(() => {
    if (!initializeWithValue) {
      setStoredValue(getStoredValue())
    }
  }, [initializeWithValue, getStoredValue])

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serializer(valueToStore))
        
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: serializer(valueToStore),
            url: window.location.href,
            storageArea: window.localStorage
          })
        )
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, serializer, storedValue])

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
        
        window.dispatchEvent(
          new StorageEvent('storage', {
            key,
            newValue: null,
            url: window.location.href,
            storageArea: window.localStorage
          })
        )
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.storageArea === window.localStorage) {
        try {
          setStoredValue(e.newValue ? deserializer(e.newValue) : initialValue)
        } catch (error) {
          console.error(`Error parsing localStorage event for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue, deserializer])

  return [storedValue, setValue, removeValue]
}