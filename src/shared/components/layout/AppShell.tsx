import { useState, type ReactNode } from 'react'
import { useMediaQuery } from '@/shared/hooks'
import { Sidebar } from './Sidebar'
import { MobileBottomNav } from './MobileBottomNav'
import { cn } from '@/shared/utils/utils'

interface AppShellProps {
  children: ReactNode
  onCommandPaletteOpen?: () => void
}

export function AppShell({ children, onCommandPaletteOpen }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <div className="min-h-screen bg-background">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="gradient-mesh" />
      </div>

      {/* Desktop Layout with Sidebar */}
      {isDesktop && (
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onCommandPaletteOpen={onCommandPaletteOpen}
        />
      )}

      {/* Main Content */}
      <main
        className={cn(
          'relative z-10',
          isDesktop && (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'),
          !isDesktop && 'pb-20' // Add padding for mobile bottom nav
        )}
      >
        <div className="min-h-screen">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {!isDesktop && (
        <MobileBottomNav onCommandPaletteOpen={onCommandPaletteOpen} />
      )}
    </div>
  )
}