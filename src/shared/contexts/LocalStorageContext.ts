import { createContext } from 'react';

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  developerMode: boolean;
}

export interface LocalStorageContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

export const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);