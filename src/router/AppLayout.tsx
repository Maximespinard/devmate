import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { RootLayout, AppShell, CommandPalette } from '@/shared/components/layout';
import { useCommandPalette, usePWA } from '@/shared/hooks';

export function AppLayout() {
  const commandPalette = useCommandPalette();
  const { isOffline } = usePWA();
  const navigate = useNavigate();

  // Redirect to offline page when offline
  useEffect(() => {
    if (isOffline && window.location.pathname !== '/offline') {
      navigate('/offline');
    } else if (!isOffline && window.location.pathname === '/offline') {
      navigate('/');
    }
  }, [isOffline, navigate]);

  return (
    <RootLayout>
      <AppShell onCommandPaletteOpen={commandPalette.open}>
        <Outlet />
      </AppShell>
      
      {/* Command Palette */}
      <CommandPalette 
        isOpen={commandPalette.isOpen} 
        onClose={commandPalette.close} 
      />
    </RootLayout>
  );
}