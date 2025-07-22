import { useContext } from 'react';
import { LocalStorageContext } from '@/shared/contexts/LocalStorageContext';

export const useAppSettings = () => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error('useAppSettings must be used within LocalStorageProvider');
  }
  return context;
};