import { useState, useRef, useEffect } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import Prism from 'prismjs'
import { CopyButton } from './CopyButton'
import { cn } from '@/shared/utils/utils'

// Import Prism languages and themes
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language?: string
  readOnly?: boolean
  showLineNumbers?: boolean
  showCopyButton?: boolean
  allowFullscreen?: boolean
  placeholder?: string
  className?: string
  height?: number
  maxHeight?: number
  minHeight?: number
  theme?: 'dark' | 'light'
  title?: string
  onFocus?: () => void
  onBlur?: () => void
}

export function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  readOnly = false,
  showLineNumbers = true,
  showCopyButton = true,
  allowFullscreen = true,
  placeholder = 'Enter your code here...',
  className,
  height,
  maxHeight = 500,
  minHeight = 200,
  theme = 'dark',
  title,
  onFocus,
  onBlur,
}: CodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  
  const lines = value.split('\n')
  const lineCount = lines.length

  // Highlight code when value changes
  useEffect(() => {
    if (highlightRef.current && language) {
      try {
        const highlighted = Prism.highlight(
          value || '',
          Prism.languages[language] || Prism.languages.plaintext,
          language
        )
        highlightRef.current.innerHTML = highlighted
      } catch {
        // Fallback to plain text if highlighting fails
        highlightRef.current.textContent = value || ''
      }
    }
  }, [value, language])

  // Sync scroll between textarea and highlight layer
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>): void => {
    if (highlightRef.current && e.currentTarget) {
      highlightRef.current.scrollTop = e.currentTarget.scrollTop
      highlightRef.current.scrollLeft = e.currentTarget.scrollLeft
    }
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    if (onChange && !readOnly) {
      onChange(e.target.value)
    }
  }

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Tab') {
      e.preventDefault()
      
      if (!textareaRef.current || readOnly) return
      
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const currentValue = textarea.value

      // Insert tab character(s)
      const newValue = currentValue.substring(0, start) + '  ' + currentValue.substring(end)
      
      if (onChange) {
        onChange(newValue)
      }

      // Set cursor position after the inserted tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  const toggleFullscreen = (): void => {
    setIsFullscreen(!isFullscreen)
  }

  const handleFocus = (): void => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = (): void => {
    setIsFocused(false)
    onBlur?.()
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      {(title || showCopyButton || allowFullscreen) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {title && (
              <h3 className="text-sm font-medium text-muted-foreground">
                {title}
              </h3>
            )}
            {showLineNumbers && (
              <span className="text-xs text-muted-foreground/60">
                {lineCount} {lineCount === 1 ? 'line' : 'lines'}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {showCopyButton && value && (
              <CopyButton
                text={value}
                size="sm"
                variant="ghost"
                showText={false}
                keyboardShortcut="cmd+c"
              />
            )}
            
            {allowFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded hover:bg-white/10 hover:scale-110 active:scale-90 text-muted-foreground hover:text-foreground transition-all duration-200"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div
        className={cn(
          "relative rounded-md border border-white/10 overflow-hidden",
          "backdrop-blur-xl bg-black/20 transition-all duration-300",
          theme === 'dark' ? 'text-white' : 'text-black',
          isFocused && "ring-2 ring-primary/20 border-primary/30 shadow-lg shadow-primary/10",
          isFullscreen && "fixed inset-4 z-50 bg-background/95 backdrop-blur-xl border-white/20 rounded-lg"
        )}
        style={{
          height: isFullscreen ? 'calc(100vh - 2rem)' : height,
          maxHeight: isFullscreen ? 'none' : maxHeight,
          minHeight: isFullscreen ? 'none' : minHeight,
        }}
      >
        <div className="flex h-full">
          {/* Line Numbers */}
          {showLineNumbers && (
            <div className={cn(
              "select-none text-xs text-muted-foreground/40 px-3 py-4",
              "border-r border-white/10 bg-white/5",
              "font-mono leading-6 text-right",
              "overflow-hidden"
            )}>
              {lines.map((_, index) => (
                <div key={index} className="h-6">
                  {index + 1}
                </div>
              ))}
            </div>
          )}

          {/* Editor Area */}
          <div className="flex-1 relative">
            {/* Syntax Highlighted Code (Background) */}
            <div
              ref={highlightRef}
              className={cn(
                "absolute inset-0 p-4 font-mono text-sm leading-6",
                "pointer-events-none select-none",
                "whitespace-pre overflow-auto",
                "prism-theme-tomorrow"
              )}
              style={{ 
                color: 'transparent',
                background: 'transparent'
              }}
            />

            {/* Textarea (Foreground) */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={readOnly ? '' : placeholder}
              readOnly={readOnly}
              className={cn(
                "absolute inset-0 w-full h-full p-4 resize-none",
                "font-mono text-sm leading-6 text-transparent",
                "bg-transparent border-none outline-none",
                "caret-white selection:bg-primary/30",
                "placeholder:text-muted-foreground/50",
                readOnly && "cursor-default",
                className
              )}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
            />

            {/* Empty state */}
            {!value && !readOnly && (
              <div className="absolute inset-0 p-4 pointer-events-none">
                <div className="text-muted-foreground/50 font-mono text-sm">
                  {placeholder}
                </div>
              </div>
            )}

            {/* Focus indicator */}
            {isFocused && (
              <div className="absolute inset-0 border-2 border-primary/30 rounded-[inherit] pointer-events-none animate-in fade-in-0 duration-200" />
            )}
          </div>
        </div>

        {/* Language indicator */}
        {language && (
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-1 text-xs bg-white/10 rounded text-muted-foreground font-mono">
              {language}
            </span>
          </div>
        )}
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in-0 duration-200"
          onClick={toggleFullscreen}
        />
      )}
    </div>
  )
}