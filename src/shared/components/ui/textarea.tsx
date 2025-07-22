import { forwardRef, useState, useEffect, useRef, useImperativeHandle, type ComponentProps } from "react"
import { X, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/shared/utils/utils"

interface TextareaProps extends ComponentProps<"textarea"> {
  label?: string
  description?: string
  error?: string
  success?: boolean
  showCharacterCount?: boolean
  maxLength?: number
  clearable?: boolean
  onClear?: () => void
  autoResize?: boolean
  showLineNumbers?: boolean
  maxHeight?: number
  minHeight?: number
  resizable?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label, 
    description, 
    error, 
    success,
    showCharacterCount = false,
    maxLength,
    clearable = false,
    onClear,
    autoResize = true,
    showLineNumbers = false,
    maxHeight = 300,
    minHeight = 100,
    resizable = true,
    value,
    onChange,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [isShaking, setIsShaking] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    
    const hasValue = Boolean(value && String(value).length > 0)
    const characterCount = value ? String(value).length : 0
    const lines = value ? String(value).split('\n') : ['']
    const lineCount = lines.length

    // Trigger shake animation on error change
    useEffect(() => {
      if (error) {
        setIsShaking(true)
        const timer = setTimeout(() => setIsShaking(false), 600)
        return () => clearTimeout(timer)
      }
    }, [error])

    // Auto-resize functionality
    useEffect(() => {
      const textarea = textareaRef.current
      if (!textarea || !autoResize) return

      const adjustHeight = (): void => {
        textarea.style.height = 'auto'
        const scrollHeight = Math.max(textarea.scrollHeight, minHeight)
        const finalHeight = Math.min(scrollHeight, maxHeight)
        textarea.style.height = `${finalHeight}px`
      }

      adjustHeight()
      textarea.addEventListener('input', adjustHeight)
      
      return () => {
        textarea.removeEventListener('input', adjustHeight)
      }
    }, [value, autoResize, minHeight, maxHeight])

    const handleClear = (): void => {
      if (onClear) {
        onClear()
      }
    }

    const toggleFullscreen = (): void => {
      setIsFullscreen(!isFullscreen)
    }

    // Combine refs
    useImperativeHandle(ref, () => textareaRef.current!)

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </label>
            {showLineNumbers && (
              <span className="text-xs text-muted-foreground">
                {lineCount} {lineCount === 1 ? 'line' : 'lines'}
              </span>
            )}
          </div>
        )}

        {/* Textarea container with animations */}
        <div
          className={cn(
            "relative transition-all duration-300",
            isShaking && "animate-shake",
            isFullscreen && "fixed inset-4 z-50 bg-background/95 backdrop-blur-xl border border-white/10 rounded-lg p-4"
          )}
        >
          <div className="flex">
            {/* Line numbers */}
            {showLineNumbers && (
              <div className={cn(
                "select-none text-xs text-muted-foreground/60 pr-4 pt-2",
                "border-r border-white/10 mr-3",
                "font-mono leading-6"
              )}>
                {lines.map((_, index) => (
                  <div key={index} className="text-right">
                    {index + 1}
                  </div>
                ))}
              </div>
            )}

            {/* Textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                className={cn(
                  // Base styles
                  "flex w-full rounded-md border px-3 py-2 text-sm",
                  "placeholder:text-muted-foreground",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "transition-all duration-300 ease-out",
                  "font-mono leading-6",
                  
                  // Auto-resize styles
                  autoResize && "resize-none overflow-hidden",
                  !autoResize && resizable && "resize-y",
                  !resizable && "resize-none",
                  
                  // Scrolling
                  `max-h-[${maxHeight}px] overflow-y-auto`,
                  `min-h-[${minHeight}px]`,
                  
                  // Focus states with premium effects
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "focus:border-primary focus:shadow-lg focus:shadow-primary/10",
                  
                  // Glass effect
                  "backdrop-blur-xl bg-white/5 border-white/10",
                  "hover:bg-white/10 hover:border-white/20",
                  
                  // State-based styling
                  isFocused && "scale-[1.01] shadow-lg shadow-primary/10",
                  error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
                  success && "border-green-500 focus:ring-green-500/20 focus:border-green-500",
                  
                  // Fullscreen styles
                  isFullscreen && "h-full min-h-0 max-h-none",
                  
                  className
                )}
                onFocus={(e) => {
                  setIsFocused(true)
                  props.onFocus?.(e)
                }}
                onBlur={(e) => {
                  setIsFocused(false)
                  props.onBlur?.(e)
                }}
                {...props}
              />

              {/* Action buttons */}
              <div className="absolute top-2 right-2 flex items-center gap-1">
                {/* Fullscreen toggle */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className={cn(
                    "p-1.5 rounded hover:bg-white/10 hover:scale-110 active:scale-90",
                    "text-muted-foreground hover:text-foreground",
                    "transition-all duration-200 animate-in zoom-in-50"
                  )}
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>

                {/* Clear button */}
                {clearable && hasValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className={cn(
                      "p-1.5 rounded hover:bg-white/10 hover:scale-110 active:scale-90",
                      "text-muted-foreground hover:text-foreground",
                      "transition-all duration-200 animate-in zoom-in-50"
                    )}
                    title="Clear content"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Focus border animation */}
              <div
                className={cn(
                  "absolute inset-0 rounded-md border-2 border-primary/50 pointer-events-none",
                  "transition-all duration-200",
                  isFocused ? "opacity-100 scale-100" : "opacity-0 scale-95"
                )}
              />
            </div>
          </div>
        </div>

        {/* Description, Error, and Character Count */}
        {!isFullscreen && (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              {/* Description */}
              {description && !error && (
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              )}

              {/* Error message */}
              {error && (
                <p className="text-sm text-destructive font-medium animate-in fade-in-0 slide-in-from-top-1 duration-200">
                  {error}
                </p>
              )}
            </div>

            {/* Character count */}
            {showCharacterCount && maxLength && (
              <div 
                className={cn(
                  "text-xs transition-all duration-200",
                  characterCount > maxLength * 0.9 ? "text-warning" : "text-muted-foreground",
                  characterCount >= maxLength && "text-destructive font-medium animate-pulse"
                )}
              >
                {characterCount}/{maxLength}
              </div>
            )}
          </div>
        )}

        {/* Success indicator */}
        {success && (
          <div className="flex items-center text-green-500 text-sm animate-in zoom-in-50 duration-300">
            <div className="w-4 h-4 mr-2 animate-spin">
              ✓
            </div>
            Valid input
          </div>
        )}

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
)

Textarea.displayName = "Textarea"

export { Textarea }