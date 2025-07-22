import { forwardRef, type ComponentProps, type ReactNode } from 'react'
import { FileText, Search, Zap, Code, Settings, Plus, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/utils/utils'

type EmptyStateVariant = 'default' | 'search' | 'upload' | 'error' | 'success'
type EmptyStateSize = 'sm' | 'md' | 'lg'

interface EmptyStateProps extends ComponentProps<"div"> {
  variant?: EmptyStateVariant
  size?: EmptyStateSize
  icon?: ReactNode
  title?: string
  description?: string
  action?: ReactNode
  illustration?: ReactNode
  showDefaultIcon?: boolean
}

const getDefaultIcon = (variant: EmptyStateVariant) => {
  switch (variant) {
    case 'search':
      return <Search />
    case 'upload':
      return <Upload />
    case 'error':
      return <Trash2 />
    case 'success':
      return <Zap />
    default:
      return <FileText />
  }
}

const getSizeClasses = (size: EmptyStateSize) => {
  switch (size) {
    case 'sm':
      return {
        container: 'py-8',
        icon: 'w-8 h-8',
        iconContainer: 'w-12 h-12',
        title: 'text-base',
        description: 'text-sm',
      }
    case 'lg':
      return {
        container: 'py-16',
        icon: 'w-10 h-10',
        iconContainer: 'w-20 h-20',
        title: 'text-2xl',
        description: 'text-base',
      }
    default: // md
      return {
        container: 'py-12',
        icon: 'w-8 h-8',
        iconContainer: 'w-16 h-16',
        title: 'text-xl',
        description: 'text-sm',
      }
  }
}

const getVariantClasses = (variant: EmptyStateVariant) => {
  switch (variant) {
    case 'search':
      return {
        iconContainer: 'bg-blue-500/10 border-blue-500/20',
        icon: 'text-blue-500',
        title: 'text-foreground',
      }
    case 'upload':
      return {
        iconContainer: 'bg-green-500/10 border-green-500/20',
        icon: 'text-green-500',
        title: 'text-foreground',
      }
    case 'error':
      return {
        iconContainer: 'bg-destructive/10 border-destructive/20',
        icon: 'text-destructive',
        title: 'text-foreground',
      }
    case 'success':
      return {
        iconContainer: 'bg-green-500/10 border-green-500/20',
        icon: 'text-green-500',
        title: 'text-foreground',
      }
    default:
      return {
        iconContainer: 'bg-white/5 border-white/10',
        icon: 'text-muted-foreground',
        title: 'text-foreground',
      }
  }
}

// Pre-built common empty states
const EmptyStates = {
  noResults: (onReset?: () => void) => ({
    variant: 'search' as const,
    icon: <Search />,
    title: 'No results found',
    description: 'Try adjusting your search or filter criteria',
    action: onReset && (
      <Button variant="outline" onClick={onReset}>
        Clear filters
      </Button>
    ),
  }),

  noData: (onCreate?: () => void, actionText = 'Get started') => ({
    variant: 'default' as const,
    icon: <FileText />,
    title: 'No data yet',
    description: 'Start by creating your first item',
    action: onCreate && (
      <Button onClick={onCreate}>
        <Plus className="w-4 h-4 mr-2" />
        {actionText}
      </Button>
    ),
  }),

  uploadFiles: (onUpload?: () => void) => ({
    variant: 'upload' as const,
    icon: <Upload />,
    title: 'Upload your files',
    description: 'Drag and drop files here or click to browse',
    action: onUpload && (
      <Button onClick={onUpload}>
        <Upload className="w-4 h-4 mr-2" />
        Choose files
      </Button>
    ),
  }),

  error: (onRetry?: () => void, message = 'Something went wrong') => ({
    variant: 'error' as const,
    icon: <Trash2 />,
    title: 'Oops! Something went wrong',
    description: message,
    action: onRetry && (
      <Button variant="outline" onClick={onRetry}>
        Try again
      </Button>
    ),
  }),

  success: (onContinue?: () => void, title = 'All done!', description = 'Your task has been completed successfully') => ({
    variant: 'success' as const,
    icon: <Zap />,
    title,
    description,
    action: onContinue && (
      <Button onClick={onContinue}>
        Continue
      </Button>
    ),
  }),

  comingSoon: () => ({
    variant: 'default' as const,
    icon: <Settings />,
    title: 'Coming Soon',
    description: 'This feature is currently under development',
  }),

  noTool: (toolName: string) => ({
    variant: 'default' as const,
    icon: <Code />,
    title: `${toolName} Tool`,
    description: 'This developer tool will help you process and transform your data',
    illustration: (
      <div className="w-24 h-24 mx-auto mb-6 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <Code className="w-10 h-10 text-primary" />
      </div>
    ),
  }),
}

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    icon,
    title,
    description,
    action,
    illustration,
    showDefaultIcon = true,
    ...props
  }, ref) => {
    const sizeClasses = getSizeClasses(size)
    const variantClasses = getVariantClasses(variant)
    const defaultIcon = showDefaultIcon ? getDefaultIcon(variant) : null
    const displayIcon = icon || defaultIcon

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center",
          sizeClasses.container,
          className
        )}
        {...props}
      >
        {/* Custom Illustration */}
        {illustration}
        
        {/* Icon */}
        {displayIcon && !illustration && (
          <div
            className={cn(
              "flex items-center justify-center rounded-full border transition-all duration-200",
              "animate-in zoom-in-50 duration-300",
              sizeClasses.iconContainer,
              variantClasses.iconContainer
            )}
          >
            <div className={cn(sizeClasses.icon, variantClasses.icon)}>
              {displayIcon}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={cn("space-y-2", illustration || displayIcon ? "mt-6" : "")}>
          {title && (
            <h3
              className={cn(
                "font-semibold tracking-tight animate-in slide-in-from-bottom-2 duration-300 delay-100",
                sizeClasses.title,
                variantClasses.title
              )}
            >
              {title}
            </h3>
          )}
          
          {description && (
            <p
              className={cn(
                "text-muted-foreground max-w-sm mx-auto leading-relaxed animate-in slide-in-from-bottom-2 duration-300 delay-200",
                sizeClasses.description
              )}
            >
              {description}
            </p>
          )}
        </div>

        {/* Action */}
        {action && (
          <div className="mt-6 animate-in slide-in-from-bottom-2 duration-300 delay-300">
            {action}
          </div>
        )}
      </div>
    )
  }
)

EmptyState.displayName = "EmptyState"

export { EmptyState, EmptyStates }