import { useCallback } from 'react'
import type { ReactNode } from 'react'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { LocalStorageContext } from '@/shared/contexts/LocalStorageContext'
import type { AppSettings, LocalStorageContextType } from '@/shared/contexts/LocalStorageContext'

const defaultSettings: AppSettings = {
  theme: 'dark',
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  developerMode: false
}

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

