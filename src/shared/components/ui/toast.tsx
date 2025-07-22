import { forwardRef, useEffect, useState, type ComponentProps } from 'react'
import { createPortal } from 'react-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/shared/utils/utils'

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        success: "border-green-500/20 bg-green-500/10 text-green-500",
        error: "border-destructive/50 bg-destructive/10 text-destructive",
        warning: "border-yellow-500/50 bg-yellow-500/10 text-yellow-500",
        info: "border-blue-500/50 bg-blue-500/10 text-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ToastProps extends ComponentProps<"div">, VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  action?: React.ReactNode
  onClose?: () => void
  duration?: number
}

interface ToastState {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: React.ReactNode
}

// Toast Manager State
class ToastManager {
  private toasts: ToastState[] = []
  private listeners: Set<() => void> = new Set()

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  getToasts() {
    return this.toasts
  }

  addToast(toast: Omit<ToastState, 'id'>) {
    const id = Math.random().toString(36).substring(2)
    const newToast = { ...toast, id }
    this.toasts = [newToast, ...this.toasts]
    this.emit()

    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        this.removeToast(id)
      }, toast.duration || 5000)
    }

    return id
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id)
    this.emit()
  }

  private emit() {
    this.listeners.forEach(listener => listener())
  }
}

const toastManager = new ToastManager()

// Toast Component
const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, title, description, action, onClose, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
      setIsVisible(true)
    }, [])

    const handleClose = () => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    }

    const getIcon = () => {
      switch (variant) {
        case 'success':
          return <CheckCircle size={20} />
        case 'error':
          return <AlertCircle size={20} />
        case 'warning':
          return <AlertTriangle size={20} />
        case 'info':
          return <Info size={20} />
        default:
          return null
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          toastVariants({ variant }),
          "backdrop-blur-xl transition-all duration-300 ease-out",
          isVisible 
            ? "animate-in slide-in-from-right-full fade-in-0" 
            : "animate-out slide-out-to-right-full fade-out-0",
          className
        )}
        {...props}
      >
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1 space-y-1">
            {title && (
              <div className="text-sm font-semibold leading-none tracking-tight">
                {title}
              </div>
            )}
            {description && (
              <div className="text-sm opacity-90">
                {description}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {action}
          <button
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent opacity-50 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-hover:opacity-100"
            onClick={handleClose}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    )
  }
)
Toast.displayName = "Toast"

// Toast Container
const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastState[]>([])

  useEffect(() => {
    return toastManager.subscribe(() => {
      setToasts(toastManager.getToasts())
    })
  }, [])

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (toasts.length === 0) return null

  return createPortal(
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          action={toast.action}
          onClose={() => toastManager.removeToast(toast.id)}
          className="mb-2"
        />
      ))}
    </div>,
    document.body
  )
}

// Toast API
const toast = {
  success: (title: string, description?: string, options?: { duration?: number; action?: React.ReactNode }) => {
    return toastManager.addToast({
      title,
      description,
      variant: 'success',
      ...options
    })
  },
  error: (title: string, description?: string, options?: { duration?: number; action?: React.ReactNode }) => {
    return toastManager.addToast({
      title,
      description,
      variant: 'error',
      ...options
    })
  },
  warning: (title: string, description?: string, options?: { duration?: number; action?: React.ReactNode }) => {
    return toastManager.addToast({
      title,
      description,
      variant: 'warning',
      ...options
    })
  },
  info: (title: string, description?: string, options?: { duration?: number; action?: React.ReactNode }) => {
    return toastManager.addToast({
      title,
      description,
      variant: 'info',
      ...options
    })
  },
  default: (title: string, description?: string, options?: { duration?: number; action?: React.ReactNode }) => {
    return toastManager.addToast({
      title,
      description,
      variant: 'default',
      ...options
    })
  },
  dismiss: (id: string) => {
    toastManager.removeToast(id)
  }
}

export { Toast, ToastContainer, toast }