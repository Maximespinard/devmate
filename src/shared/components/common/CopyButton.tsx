import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      <AnimatePresence>
        {isCopied && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 bg-green-500 rounded-[inherit]"
          />
        )}
      </AnimatePresence>

      {/* Icon with smooth transition */}
      <motion.div
        animate={{
          scale: isCopied ? [1, 1.2, 1] : 1,
          rotate: isCopied ? [0, -10, 10, 0] : 0,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex items-center gap-2"
      >
        <AnimatePresence mode="wait">
          {isCopied ? (
            <motion.div
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Check 
                size={16} 
                className="text-green-500"
              />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Copy 
                size={16}
                className={cn(
                  "transition-transform duration-200",
                  isHovering && "scale-110"
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text with animation */}
        {showText && (
          <AnimatePresence mode="wait">
            <motion.span
              key={isCopied ? 'copied' : 'copy'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "text-sm font-medium",
                isCopied && "text-green-500"
              )}
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </motion.span>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Keyboard shortcut hint */}
      {keyboardShortcut && isHovering && !isCopied && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap z-10"
        >
          {keyboardShortcut}
        </motion.div>
      )}

      {/* Ripple effect on copy */}
      <AnimatePresence>
        {isCopied && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 border-2 border-green-500 rounded-[inherit]"
          />
        )}
      </AnimatePresence>
    </Button>
  )
}