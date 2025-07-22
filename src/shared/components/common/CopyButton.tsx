import { useState, useRef, useEffect, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/utils/utils'

interface CopyButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'default' | 'lg' | 'icon'
  variant?: 'default' | 'ghost' | 'outline' | 'secondary'
  showText?: boolean
  successMessage?: string
  errorMessage?: string
  keyboardShortcut?: string
  disabled?: boolean
  onCopy?: () => void
  onError?: (error: Error) => void
}

export function CopyButton({
  text,
  className,
  size = 'default',
  variant = 'ghost',
  showText = true,
  successMessage = 'Copied to clipboard!',
  errorMessage = 'Failed to copy',
  keyboardShortcut,
  disabled = false,
  onCopy,
  onError,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCopy = useCallback(async (): Promise<void> => {
    if (disabled || !text) return

    try {
      await navigator.clipboard.writeText(text)
      
      setIsCopied(true)
      
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      // Reset state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false)
      }, 2000)

      // Show success toast
      toast.success(successMessage, {
        duration: 2000,
        position: 'bottom-right',
      })

      // Call success callback
      onCopy?.()
      
    } catch (error) {
      const copyError = error as Error
      
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        
        setIsCopied(true)
        timeoutRef.current = setTimeout(() => setIsCopied(false), 2000)
        toast.success(successMessage)
        onCopy?.()
        
      } catch {
        toast.error(errorMessage)
        onError?.(copyError)
      }
    }
  }, [disabled, text, successMessage, errorMessage, onCopy, onError])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!keyboardShortcut) return

    const handleKeyboard = (event: KeyboardEvent): void => {
      // Parse keyboard shortcut (e.g., "cmd+c", "ctrl+shift+c")
      const parts = keyboardShortcut.toLowerCase().split('+')
      const key = parts[parts.length - 1]
      const modifiers = parts.slice(0, -1)

      const hasCtrl = modifiers.includes('ctrl') || modifiers.includes('cmd')
      const hasShift = modifiers.includes('shift')
      const hasAlt = modifiers.includes('alt')

      const matchesModifiers = 
        (!hasCtrl || (event.ctrlKey || event.metaKey)) &&
        (!hasShift || event.shiftKey) &&
        (!hasAlt || event.altKey)

      if (matchesModifiers && event.key.toLowerCase() === key) {
        event.preventDefault()
        void handleCopy()
      }
    }

    document.addEventListener('keydown', handleKeyboard)
    return () => document.removeEventListener('keydown', handleKeyboard)
  }, [keyboardShortcut, handleCopy])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      disabled={disabled}
      className={cn(
        "group relative overflow-hidden",
        "transition-all duration-300 ease-out",
        isCopied && "scale-110 shadow-lg shadow-green-500/25",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      title={keyboardShortcut ? `Copy (${keyboardShortcut})` : "Copy to clipboard"}
    >
      {/* Success animation overlay */}
      {isCopied && (
        <div className="absolute inset-0 bg-green-500 rounded-[inherit] opacity-10 animate-in zoom-in-50 duration-500" />
      )}

      {/* Icon with smooth transition */}
      <div
        className={cn(
          "flex items-center gap-2 transition-all duration-500 ease-in-out",
          isCopied && "animate-bounce"
        )}
      >
        {isCopied ? (
          <div className="animate-in zoom-in-50 duration-200">
            <Check 
              size={16} 
              className="text-green-500"
            />
          </div>
        ) : (
          <div className="animate-in zoom-in-50 duration-200">
            <Copy 
              size={16}
              className={cn(
                "transition-transform duration-200",
                isHovering && "scale-110"
              )}
            />
          </div>
        )}

        {/* Text with animation */}
        {showText && (
          <span
            className={cn(
              "text-sm font-medium transition-all duration-200",
              "animate-in slide-in-from-bottom-1",
              isCopied && "text-green-500"
            )}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </span>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      {keyboardShortcut && isHovering && !isCopied && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap z-10 animate-in zoom-in-50 duration-200">
          {keyboardShortcut}
        </div>
      )}

      {/* Ripple effect on copy */}
      {isCopied && (
        <div className="absolute inset-0 border-2 border-green-500 rounded-[inherit] animate-ping" />
      )}
    </Button>
  )
}