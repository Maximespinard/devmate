import { createContext, useContext, useCallback } from 'react'
import type { ReactNode } from 'react'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'

interface AppSettings {
  theme: 'dark' | 'light' | 'system'
  sidebarCollapsed: boolean
  commandPaletteOpen: boolean
  developerMode: boolean
}

interface LocalStorageContextType {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
  resetSettings: () => void
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  developerMode: false
}

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined)

interface LocalStorageProviderProps {
  children: ReactNode
}

export const LocalStorageProvider = ({ children }: LocalStorageProviderProps) => {
  const [settings, setSettings, resetSettings] = useLocalStorage<AppSettings>(
    'devmate-settings',
    defaultSettings
  )

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }))
  }, [setSettings])

  const value: LocalStorageContextType = {
    settings,
    updateSettings,
    resetSettings: () => resetSettings()
  }

  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  )
}

export const useAppSettings = () => {
  const context = useContext(LocalStorageContext)
  if (!context) {
    throw new Error('useAppSettings must be used within LocalStorageProvider')
  }
  return context
}