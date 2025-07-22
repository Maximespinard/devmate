import { forwardRef, useEffect, useState, type ComponentProps, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/shared/utils/utils'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

interface DialogContentProps extends ComponentProps<"div"> {
  children: ReactNode
  showClose?: boolean
  onClose?: () => void
}

interface DialogHeaderProps extends ComponentProps<"div"> {
  children: ReactNode
}

interface DialogTitleProps extends ComponentProps<"h2"> {
  children: ReactNode
}

interface DialogDescriptionProps extends ComponentProps<"p"> {
  children: ReactNode
}

interface DialogFooterProps extends ComponentProps<"div"> {
  children: ReactNode
}

// Dialog Root Component
const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <DialogProvider open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogProvider>
  )
}

// Context for sharing state between components
import { createContext, useContext } from 'react'

interface DialogContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = createContext<DialogContextType | null>(null)

const DialogProvider = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

const useDialog = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('Dialog components must be used within Dialog')
  }
  return context
}

// Dialog Trigger
const DialogTrigger = forwardRef<HTMLButtonElement, ComponentProps<"button">>(
  ({ children, onClick, ...props }, ref) => {
    const { onOpenChange } = useDialog()
    
    return (
      <button
        ref={ref}
        onClick={(e) => {
          onOpenChange(true)
          onClick?.(e)
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DialogTrigger.displayName = "DialogTrigger"

// Dialog Content
const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, showClose = true, onClose, ...props }, ref) => {
    const { open, onOpenChange } = useDialog()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
      return () => setMounted(false)
    }, [])

    useEffect(() => {
      if (!open) return

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onOpenChange(false)
          onClose?.()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [open, onOpenChange, onClose])

    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }

      return () => {
        document.body.style.overflow = ''
      }
    }, [open])

    if (!mounted) return null

    if (!open) return null

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
          onClick={() => {
            onOpenChange(false)
            onClose?.()
          }}
        />
        
        {/* Dialog */}
        <div
          ref={ref}
          className={cn(
            "relative z-50 w-full max-w-lg mx-auto",
            "bg-background/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl",
            "animate-in zoom-in-95 slide-in-from-bottom-2 duration-300",
            "max-h-[90vh] overflow-y-auto",
            className
          )}
          {...props}
        >
          {showClose && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => {
                onOpenChange(false)
                onClose?.()
              }}
            >
              <X size={16} />
              <span className="sr-only">Close</span>
            </Button>
          )}
          {children}
        </div>
      </div>,
      document.body
    )
  }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0",
        className
      )}
      {...props}
    />
  )
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0",
        className
      )}
      {...props}
    />
  )
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
)
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}