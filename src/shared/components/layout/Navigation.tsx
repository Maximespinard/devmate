import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/utils';

// Tool configuration
const TOOLS = [
  { id: 'json', name: 'JSON', path: '/json', shortcut: '1' },
  { id: 'base64', name: 'Base64', path: '/base64', shortcut: '2' },
  { id: 'jwt', name: 'JWT', path: '/jwt', shortcut: '3' },
  { id: 'url', name: 'URL', path: '/url', shortcut: '4' },
  { id: 'hash', name: 'Hash', path: '/hash', shortcut: '5' },
  { id: 'timestamp', name: 'Time', path: '/timestamp', shortcut: '6' },
  { id: 'regex', name: 'Regex', path: '/regex', shortcut: '7' },
  { id: 'diff', name: 'Diff', path: '/diff', shortcut: '8' },
  { id: 'color', name: 'Color', path: '/color', shortcut: '9' },
  { id: 'generate', name: 'Generate', path: '/generate', shortcut: '0' },
] as const;

interface NavigationProps {
  onCommandPaletteOpen?: () => void;
}

export function Navigation({ onCommandPaletteOpen }: NavigationProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const currentTool = TOOLS.find(tool => location.pathname.startsWith(tool.path));

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-sm">DM</span>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:inline">
                DevMate
              </span>
            </Link>
          </motion.div>

          {/* Desktop Tool Switcher */}
          <div className="hidden lg:flex items-center space-x-1">
            {TOOLS.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onHoverStart={() => setShowShortcuts(true)}
                onHoverEnd={() => setShowShortcuts(false)}
              >
                <Link to={tool.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'relative px-3 py-1.5 text-sm transition-all duration-200',
                      'hover:bg-white/10 hover:scale-105',
                      currentTool?.id === tool.id &&
                        'bg-primary/20 text-primary shadow-lg shadow-primary/20'
                    )}
                  >
                    {tool.name}
                    
                    {/* Active indicator */}
                    {currentTool?.id === tool.id && (
                      <motion.div
                        layoutId="activeToolIndicator"
                        className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full"
                        style={{ x: '-50%' }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    {/* Keyboard shortcut hint */}
                    <AnimatePresence>
                      {showShortcuts && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded pointer-events-none"
                        >
                          {tool.shortcut}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Command Palette Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCommandPaletteOpen}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 text-sm hover:bg-white/10 transition-all duration-200"
            >
              <span className="text-muted-foreground">Search</span>
              <div className="flex space-x-0.5">
                <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded border border-white/20">
                  ⌘
                </kbd>
                <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded border border-white/20">
                  K
                </kbd>
              </div>
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="w-9 h-9 hover:bg-white/10 transition-all duration-200 hover:scale-105"
              title="Toggle theme"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden w-9 h-9 hover:bg-white/10 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-white/10 py-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TOOLS.map((tool) => (
                  <Link key={tool.id} to={tool.path}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start text-left px-4 py-3 h-auto',
                        'hover:bg-white/10 transition-all duration-200',
                        currentTool?.id === tool.id &&
                          'bg-primary/20 text-primary shadow-lg shadow-primary/10'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{tool.name}</span>
                        <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded">
                          {tool.shortcut}
                        </kbd>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Mobile search */}
              <Button
                variant="ghost"
                onClick={() => {
                  onCommandPaletteOpen?.();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start mt-4 px-4 py-3 h-auto hover:bg-white/10"
              >
                <div className="flex items-center justify-between w-full">
                  <span>Search Tools</span>
                  <div className="flex space-x-0.5">
                    <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 text-xs bg-white/10 rounded">K</kbd>
                  </div>
                </div>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}