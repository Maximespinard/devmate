import { forwardRef, useState, useEffect, type ComponentProps } from "react"
import { X } from "lucide-react"
import { cn } from "@/shared/utils/utils"

interface InputProps extends ComponentProps<"input"> {
  label?: string
  description?: string
  error?: string
  success?: boolean
  showCharacterCount?: boolean
  maxLength?: number
  clearable?: boolean
  onClear?: () => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text", 
    label, 
    description, 
    error, 
    success,
    showCharacterCount = false,
    maxLength,
    clearable = false,
    onClear,
    value,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [isShaking, setIsShaking] = useState(false)
    
    const hasValue = Boolean(value && String(value).length > 0)
    const characterCount = value ? String(value).length : 0

    // Trigger shake animation on error change
    useEffect(() => {
      if (error) {
        setIsShaking(true)
        const timer = setTimeout(() => setIsShaking(false), 600)
        return () => clearTimeout(timer)
      }
    }, [error])

    const handleClear = (): void => {
      if (onClear) {
        onClear()
      }
    }

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}

        {/* Input container with animations */}
        <div 
          className={cn(
            "relative transition-all duration-300",
            isShaking && "animate-shake"
          )}
        >
          <input
            ref={ref}
            type={type}
            value={value}
            className={cn(
              // Base styles
              "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-300 ease-out",
              
              // Focus states with premium effects
              "focus:outline-none focus:ring-2 focus:ring-primary/20",
              "focus:border-primary focus:shadow-lg focus:shadow-primary/10",
              
              // Glass effect
              "backdrop-blur-xl bg-white/5 border-white/10",
              "hover:bg-white/10 hover:border-white/20",
              
              // State-based styling
              isFocused && "scale-[1.02] shadow-lg shadow-primary/10",
              error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
              success && "border-green-500 focus:ring-green-500/20 focus:border-green-500",
              
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

          {/* Clear button */}
          {clearable && hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                "p-1 rounded-full hover:bg-white/10",
                "text-muted-foreground hover:text-foreground",
                "transition-all duration-200",
                "animate-in zoom-in-50 duration-200"
              )}
            >
              <X size={14} />
            </button>
          )}

          {/* Focus border animation */}
          <div
            className={cn(
              "absolute inset-0 rounded-md border-2 border-primary/50 pointer-events-none",
              "transition-all duration-200",
              isFocused ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          />
        </div>

        {/* Description, Error, and Character Count */}
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

        {/* Success indicator */}
        {success && (
          <div className="flex items-center text-green-500 text-sm animate-in zoom-in-50 duration-300">
            <div className="w-4 h-4 mr-2 animate-spin">
              ✓
            </div>
            Valid input
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }