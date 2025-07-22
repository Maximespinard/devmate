import { 
  Braces, 
  FileText, 
  Key, 
  Link, 
  Hash, 
  Clock, 
  Search, 
  GitCompare, 
  Palette, 
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react'

export interface Tool {
  id: string
  name: string
  shortName?: string // For mobile navigation
  path: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  badge?: 'new' | 'popular' | 'trending'
  isPopular?: boolean // For mobile bottom nav
}

export const tools: Tool[] = [
  { 
    id: 'json-formatter', 
    name: 'JSON Formatter',
    shortName: 'JSON',
    path: '/json-formatter', 
    icon: Braces,
    badge: 'popular',
    isPopular: true
  },
  { 
    id: 'base64', 
    name: 'Base64 Tools',
    shortName: 'Base64',
    path: '/base64', 
    icon: FileText,
    isPopular: true
  },
  { 
    id: 'jwt-decoder', 
    name: 'JWT Decoder',
    shortName: 'JWT',
    path: '/jwt-decoder', 
    icon: Key,
    badge: 'trending',
    isPopular: true
  },
  { 
    id: 'url-tools', 
    name: 'URL Tools', 
    path: '/url-tools', 
    icon: Link
  },
  { 
    id: 'hash-generator', 
    name: 'Hash Generator', 
    path: '/hash-generator', 
    icon: Hash
  },
  { 
    id: 'timestamp', 
    name: 'Timestamp Tools', 
    path: '/timestamp', 
    icon: Clock
  },
  { 
    id: 'regex-tester', 
    name: 'Regex Tester', 
    path: '/regex-tester', 
    icon: Search
  },
  { 
    id: 'diff-viewer', 
    name: 'Diff Viewer', 
    path: '/diff-viewer', 
    icon: GitCompare,
    badge: 'new'
  },
  { 
    id: 'color-tools', 
    name: 'Color Tools', 
    path: '/color-tools', 
    icon: Palette
  },
  { 
    id: 'generators', 
    name: 'Generators', 
    path: '/generators', 
    icon: Sparkles
  },
]

export const badgeConfig = {
  new: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: Sparkles },
  popular: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: TrendingUp },
  trending: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: Zap },
} as const

// Tools for mobile bottom navigation (most popular)
export const popularTools = tools.filter(tool => tool.isPopular)

// Tools for "More" modal (everything else)
export const moreTools = tools.filter(tool => !tool.isPopular)

// Most used tool (default redirect)
export const defaultTool = tools.find(tool => tool.id === 'json-formatter')!