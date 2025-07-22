import { useState, type ReactNode } from 'react'
import { Share2, Keyboard, BookOpen, ChevronDown, Copy, Twitter, Facebook, Linkedin } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog'
import { Tooltip } from '@/shared/components/ui/tooltip'
import { cn } from '@/shared/utils/utils'

interface KeyboardShortcut {
  key: string
  description: string
  action?: string
}

interface Example {
  title: string
  description?: string
  data: string
  category?: string
}

interface ToolHeaderProps {
  title: string
  description: string
  className?: string
  shortcuts?: KeyboardShortcut[]
  examples?: Example[]
  shareUrl?: string
  shareTitle?: string
  children?: ReactNode
}

interface ShareButtonProps {
  url: string
  title: string
  description: string
}

const ShareButton = ({ url, title, description }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const shareLinks = [
    {
      name: 'Copy Link',
      icon: <Copy className="w-4 h-4" />,
      action: async () => {
        try {
          await navigator.clipboard.writeText(url)
          // Could show toast here
          setIsOpen(false)
        } catch (err) {
          console.error('Failed to copy link:', err)
        }
      }
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-4 h-4" />,
      action: () => {
        const tweetText = `Check out this ${title} tool - ${description}`
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`, '_blank')
        setIsOpen(false)
      }
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-4 h-4" />,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        setIsOpen(false)
      }
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-4 h-4" />,
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        setIsOpen(false)
      }
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Tooltip content="Share this tool">
          <Button variant="ghost" size="sm" className="h-8">
            <Share2 className="w-4 h-4" />
          </Button>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Share this {title.toLowerCase()} tool with others
          </p>
          <div className="grid grid-cols-2 gap-2">
            {shareLinks.map((link) => (
              <Button
                key={link.name}
                variant="outline"
                onClick={link.action}
                className="justify-start"
              >
                {link.icon}
                <span className="ml-2">{link.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const KeyboardShortcutsDialog = ({ shortcuts }: { shortcuts: KeyboardShortcut[] }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Tooltip content="View keyboard shortcuts">
          <Button variant="ghost" size="sm" className="h-8">
            <Keyboard className="w-4 h-4" />
          </Button>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use these keyboard shortcuts to work more efficiently
          </p>
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{shortcut.description}</p>
                  {shortcut.action && (
                    <p className="text-xs text-muted-foreground">{shortcut.action}</p>
                  )}
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {shortcut.key}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ExamplesDropdown = ({ examples, onExampleSelect }: { 
  examples: Example[]
  onExampleSelect?: (example: Example) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  // Group examples by category
  const groupedExamples = examples.reduce((acc, example) => {
    const category = example.category || 'Examples'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(example)
    return acc
  }, {} as Record<string, Example[]>)

  const handleExampleSelect = (example: Example) => {
    onExampleSelect?.(example)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Tooltip content="View examples">
          <Button variant="ghost" size="sm" className="h-8">
            <BookOpen className="w-4 h-4" />
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Examples</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 space-y-4">
          {Object.entries(groupedExamples).map(([category, categoryExamples]) => (
            <div key={category} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {category}
              </h3>
              <div className="grid gap-2">
                {categoryExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleSelect(example)}
                    className="text-left p-3 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200 group"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {example.title}
                      </h4>
                      {example.description && (
                        <p className="text-xs text-muted-foreground">
                          {example.description}
                        </p>
                      )}
                      <pre className="text-xs bg-black/20 p-2 rounded border overflow-x-auto">
                        <code className="text-muted-foreground whitespace-pre-wrap">
                          {example.data.length > 100 
                            ? `${example.data.substring(0, 100)}...` 
                            : example.data
                          }
                        </code>
                      </pre>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ToolHeader({ 
  title, 
  description, 
  className = '', 
  shortcuts = [],
  examples = [],
  shareUrl,
  shareTitle,
  children
}: ToolHeaderProps) {
  const currentUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '')
  const currentTitle = shareTitle || title

  return (
    <div
      className={cn(
        "text-center space-y-6 mb-8",
        "animate-in fade-in-0 slide-in-from-top-2 duration-300",
        className
      )}
    >
      {/* Main Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Action Bar */}
      {(shortcuts.length > 0 || examples.length > 0 || shareUrl) && (
        <div className="flex items-center justify-center space-x-2 animate-in slide-in-from-bottom-2 duration-300 delay-100">
          {shortcuts.length > 0 && (
            <KeyboardShortcutsDialog shortcuts={shortcuts} />
          )}
          
          {examples.length > 0 && (
            <ExamplesDropdown 
              examples={examples} 
              onExampleSelect={(example) => {
                // Dispatch custom event that tools can listen to
                window.dispatchEvent(new CustomEvent('tool-example-selected', {
                  detail: { example }
                }))
              }}
            />
          )}
          
          {shareUrl && (
            <ShareButton 
              url={currentUrl}
              title={currentTitle}
              description={description}
            />
          )}
        </div>
      )}

      {/* Custom children */}
      {children && (
        <div className="animate-in slide-in-from-bottom-2 duration-300 delay-200">
          {children}
        </div>
      )}
    </div>
  )
}

export type { KeyboardShortcut, Example }