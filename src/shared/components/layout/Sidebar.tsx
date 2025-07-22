import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Command, Menu, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/utils/utils'
import { tools, badgeConfig } from '@/shared/constants/tools'

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
  onCommandPaletteOpen?: () => void
}

export function Sidebar({ isCollapsed = false, onToggle, onCommandPaletteOpen }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const currentTool = tools.find(tool => location.pathname.startsWith(tool.path))

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen z-40 border-r border-white/8 bg-card/50 backdrop-blur-xl"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/8">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">DM</span>
              </div>
              <span className="text-xl font-bold text-white">
                DevMate
              </span>
            </motion.div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-8 h-8 p-0 hover:bg-white/8"
          >
            {isCollapsed ? <Menu size={16} /> : <X size={16} />}
          </Button>
        </div>

        {/* Command Palette Button */}
        <div className="p-4 border-b border-white/8">
          <Button
            variant="outline"
            onClick={onCommandPaletteOpen}
            className={cn(
              "w-full justify-start bg-white/4 border-white/8 hover:bg-white/8 text-white/70",
              isCollapsed && "w-12 h-12 p-0 justify-center"
            )}
          >
            <Command size={16} />
            {!isCollapsed && (
              <>
                <span className="ml-2 flex-1 text-left">Search tools...</span>
                <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded border border-white/20 font-mono">
                  ⌘K
                </kbd>
              </>
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon
              const isActive = currentTool?.id === tool.id
              const badgeInfo = tool.badge ? badgeConfig[tool.badge] : null
              const BadgeIcon = badgeInfo?.icon

              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => navigate(tool.path)}
                    className={cn(
                      "w-full justify-start relative group transition-all duration-200",
                      "hover:bg-white/8 hover:text-primary",
                      isActive && "bg-primary/20 text-primary border border-primary/30",
                      isCollapsed ? "h-12 px-3" : "h-11 px-3"
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-6 bg-primary rounded-r"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <IconComponent 
                      size={16} 
                      className={cn(
                        "transition-colors duration-200",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                      )} 
                    />
                    
                    {!isCollapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left font-medium">
                          {tool.name}
                        </span>
                        
                        {tool.badge && badgeInfo && BadgeIcon && (
                          <Badge
                            className={cn('text-xs px-1 py-0.5 border ml-1', badgeInfo.color)}
                          >
                            <BadgeIcon size={6} />
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-white/8">
            <div className="text-xs text-muted-foreground text-center">
              <p className="mb-1">DevMate v1.0.0</p>
              <p>Premium developer tools</p>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  )
}