import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

type URLStateValue = string | number | boolean | null

interface UseURLStateOptions<T = URLStateValue> {
  defaultValue?: T
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
}

export function useURLState<T extends URLStateValue>(
  key: string,
  options: UseURLStateOptions<T> = {}
): [T | null, (value: T | null) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const { 
    defaultValue = null, 
    serialize = (v) => String(v),
    deserialize = (v) => v 
  } = options

  const getValueFromURL = useCallback((): T | null => {
    const urlValue = searchParams.get(key)
    if (urlValue === null) return defaultValue as T | null
    
    try {
      return deserialize(urlValue) as T
    } catch {
      return defaultValue as T | null
    }
  }, [searchParams, key, defaultValue, deserialize])

  const [value, setValue] = useState<T | null>(getValueFromURL)

  useEffect(() => {
    setValue(getValueFromURL())
  }, [getValueFromURL])

  const setURLValue = useCallback((newValue: T | null) => {
    setValue(newValue)
    
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      
      if (newValue === null || newValue === defaultValue) {
        params.delete(key)
      } else {
        params.set(key, serialize(newValue))
      }
      
      return params
    }, { replace: true })
  }, [key, serialize, defaultValue, setSearchParams])

  return [value, setURLValue]
}

export function useURLStateObject<T extends Record<string, unknown>>(
  key: string,
  defaultValue: T = {} as T
): [T, (value: Partial<T>) => void] {
  const serialize = useCallback((value: T) => {
    return encodeURIComponent(JSON.stringify(value))
  }, [])
  
  const deserialize = useCallback((value: string) => {
    try {
      return JSON.parse(decodeURIComponent(value))
    } catch {
      return defaultValue
    }
  }, [defaultValue])

  const [state, setState] = useURLState<string>(key, {
    defaultValue: serialize(defaultValue),
    serialize: (v: string) => v,
    deserialize: (v: string) => v
  })

  const parsedState = state ? deserialize(state) : defaultValue

  const updateState = useCallback((updates: Partial<T>) => {
    const newState = { ...parsedState, ...updates }
    setState(serialize(newState))
  }, [parsedState, serialize, setState])

  return [parsedState as T, updateState]
}