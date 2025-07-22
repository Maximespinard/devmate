import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreHorizontal, X, Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/utils/utils'
import { popularTools, moreTools } from '@/shared/constants/tools'
import { ToolCard } from '@/shared/components/common/ToolCard'

interface MobileBottomNavProps {
  onCommandPaletteOpen?: () => void
}

export function MobileBottomNav({ onCommandPaletteOpen }: MobileBottomNavProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [showMoreModal, setShowMoreModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const currentTool = [...popularTools, ...moreTools].find(tool => 
    location.pathname.startsWith(tool.path)
  )

  const filteredMoreTools = moreTools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const NavButton = ({ tool, isActive }: { tool: typeof popularTools[0], isActive: boolean }) => {
    const IconComponent = tool.icon
    
    return (
      <button
        onClick={() => navigate(tool.path)}
        className={cn(
          "flex-1 flex flex-col items-center justify-center py-2 px-1 relative transition-all duration-200",
          "hover:bg-white/8 rounded-lg",
          isActive && "text-primary"
        )}
      >
        {isActive && (
          <motion.div
            layoutId="mobileActiveIndicator"
            className="absolute top-0 w-8 h-0.5 bg-primary rounded-full"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
        
        <div className={cn(
          "w-6 h-6 mb-1 transition-colors duration-200",
          isActive ? "text-primary" : "text-muted-foreground"
        )}>
          <IconComponent size={20} />
        </div>
        
        <span className={cn(
          "text-xs font-medium transition-colors duration-200",
          isActive ? "text-primary" : "text-muted-foreground"
        )}>
          {tool.shortName || tool.name}
        </span>
      </button>
    )
  }

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="bg-card/80 backdrop-blur-xl border-t border-white/8 safe-area-pb">
          <div className="flex items-center justify-around h-16 px-2">
            {/* Popular Tools */}
            {popularTools.map(tool => {
              const isActive = currentTool?.id === tool.id
              return (
                <NavButton
                  key={tool.id}
                  tool={tool}
                  isActive={isActive}
                />
              )
            })}

            {/* More Button */}
            <button
              onClick={() => setShowMoreModal(true)}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 hover:bg-white/8 rounded-lg transition-all duration-200"
            >
              <div className="w-6 h-6 mb-1 text-muted-foreground">
                <MoreHorizontal size={20} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                More
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* More Tools Modal */}
      <AnimatePresence>
        {showMoreModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setShowMoreModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-white/8 rounded-t-2xl lg:hidden safe-area-pb"
            >
              <div className="flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/8">
                  <h2 className="text-lg font-semibold text-foreground">More Tools</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMoreModal(false)}
                    className="w-8 h-8 p-0"
                  >
                    <X size={16} />
                  </Button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-white/8">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/4 border-white/8 focus:border-primary/50"
                    />
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-1 gap-3">
                    {filteredMoreTools.map((tool, index) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        index={index}
                        variant="compact"
                        onClick={() => {
                          navigate(tool.path)
                          setShowMoreModal(false)
                        }}
                      />
                    ))}
                  </div>
                  
                  {filteredMoreTools.length === 0 && searchQuery && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No tools found matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>

                {/* Command Palette Hint */}
                <div className="p-4 border-t border-white/8">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onCommandPaletteOpen?.()
                      setShowMoreModal(false)
                    }}
                    className="w-full justify-center bg-white/4 border-white/8 hover:bg-white/8"
                  >
                    <Search size={16} />
                    <span className="ml-2">Open Command Palette</span>
                    <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-white/10 rounded border border-white/20 font-mono">
                      ⌘K
                    </kbd>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}