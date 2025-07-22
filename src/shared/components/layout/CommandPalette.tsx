import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/utils/utils';

// Tool configuration
const TOOLS = [
  { id: 'json', name: 'JSON Formatter', path: '/json', shortcut: '⌘1', description: 'Format and validate JSON data' },
  { id: 'base64', name: 'Base64 Encoder/Decoder', path: '/base64', shortcut: '⌘2', description: 'Encode and decode Base64 strings' },
  { id: 'jwt', name: 'JWT Decoder', path: '/jwt', shortcut: '⌘3', description: 'Decode and inspect JWT tokens' },
  { id: 'url', name: 'URL Tools', path: '/url', shortcut: '⌘4', description: 'Encode, decode, and parse URLs' },
  { id: 'hash', name: 'Hash Generator', path: '/hash', shortcut: '⌘5', description: 'Generate MD5, SHA256, and other hashes' },
  { id: 'timestamp', name: 'Timestamp Converter', path: '/timestamp', shortcut: '⌘6', description: 'Convert between timestamp formats' },
  { id: 'regex', name: 'Regex Tester', path: '/regex', shortcut: '⌘7', description: 'Test regular expressions' },
  { id: 'diff', name: 'Diff Viewer', path: '/diff', shortcut: '⌘8', description: 'Compare text differences' },
  { id: 'color', name: 'Color Tools', path: '/color', shortcut: '⌘9', description: 'Convert colors and check contrast' },
  { id: 'generators', name: 'Generators', path: '/generators', shortcut: '⌘0', description: 'Generate UUIDs, passwords, and more' },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [recentTools, setRecentTools] = useState<string[]>([]);
  const navigate = useNavigate();

  // Load recent tools from localStorage on mount
  useEffect(() => {
    const recent = localStorage.getItem('devmate-recent-tools');
    if (recent) {
      setRecentTools(JSON.parse(recent));
    }
  }, []);

  // Handle tool selection
  const handleSelect = (toolPath: string, toolId: string) => {
    navigate(toolPath);
    addToRecent(toolId);
    onClose();
    setSearch('');
  };

  // Add tool to recent list
  const addToRecent = (toolId: string) => {
    const updated = [toolId, ...recentTools.filter(id => id !== toolId)].slice(0, 5);
    setRecentTools(updated);
    localStorage.setItem('devmate-recent-tools', JSON.stringify(updated));
  };

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  // Get recent tool objects
  const getRecentTools = () => {
    return recentTools
      .map(id => TOOLS.find(tool => tool.id === id))
      .filter(Boolean) as typeof TOOLS;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-lg mx-4 z-50"
          >
            <Command
              className={cn(
                "backdrop-blur-xl bg-white/10 border border-white/20",
                "rounded-xl shadow-2xl shadow-black/20",
                "overflow-hidden"
              )}
              shouldFilter={false} // We'll handle filtering ourselves for better control
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <svg
                  className="w-5 h-5 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search tools..."
                  className={cn(
                    "flex-1 bg-transparent text-white placeholder-white/60",
                    "border-0 outline-none text-lg"
                  )}
                />
                
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white/60 bg-white/10 rounded border border-white/20">
                  Esc
                </kbd>
              </div>

              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-white/60 text-sm">
                  No tools found
                </Command.Empty>

                {/* Recent Tools Section */}
                {!search && getRecentTools().length > 0 && (
                  <Command.Group>
                    <div className="px-3 py-2 text-xs font-medium text-white/60 uppercase tracking-wider">
                      Recent
                    </div>
                    {getRecentTools().map((tool) => (
                      <Command.Item
                        key={`recent-${tool.id}`}
                        value={`recent-${tool.name}`}
                        onSelect={() => handleSelect(tool.path, tool.id)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer",
                          "hover:bg-white/10 data-[selected]:bg-white/10",
                          "transition-colors duration-150"
                        )}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-white/80">
                            {tool.name.charAt(0)}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white/90">{tool.name}</div>
                          <div className="text-sm text-white/60 truncate">{tool.description}</div>
                        </div>
                        
                        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white/60 bg-white/5 rounded border border-white/10">
                          {tool.shortcut}
                        </kbd>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {/* All Tools Section */}
                <Command.Group>
                  {(!search || getRecentTools().length === 0) && (
                    <div className="px-3 py-2 text-xs font-medium text-white/60 uppercase tracking-wider">
                      {search ? 'Results' : 'All Tools'}
                    </div>
                  )}
                  
                  {TOOLS
                    .filter(tool => 
                      !search || 
                      tool.name.toLowerCase().includes(search.toLowerCase()) ||
                      tool.description.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((tool) => (
                      <Command.Item
                        key={tool.id}
                        value={tool.name}
                        onSelect={() => handleSelect(tool.path, tool.id)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer",
                          "hover:bg-white/10 data-[selected]:bg-white/10",
                          "transition-colors duration-150"
                        )}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-white/80">
                            {tool.name.charAt(0)}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white/90">{tool.name}</div>
                          <div className="text-sm text-white/60 truncate">{tool.description}</div>
                        </div>
                        
                        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white/60 bg-white/5 rounded border border-white/10">
                          {tool.shortcut}
                        </kbd>
                      </Command.Item>
                    ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

