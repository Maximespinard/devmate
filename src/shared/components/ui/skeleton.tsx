import { forwardRef, type ComponentProps } from 'react'
import { cn } from '@/shared/utils/utils'

interface SkeletonProps extends ComponentProps<"div"> {
  variant?: 'default' | 'text' | 'circular' | 'rectangular'
  animation?: 'pulse' | 'wave' | 'none'
  lines?: number
  width?: string | number
  height?: string | number
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ 
    className, 
    variant = 'default', 
    animation = 'pulse',
    lines = 1,
    width,
    height,
    ...props 
  }, ref) => {
    const skeletonClass = cn(
      "bg-gradient-to-r from-white/5 via-white/10 to-white/5",
      animation === 'pulse' && "animate-pulse",
      animation === 'wave' && "animate-shimmer",
      variant === 'circular' && "rounded-full",
      variant === 'rectangular' && "rounded-md",
      variant === 'text' && "rounded-sm h-4",
      variant === 'default' && "rounded-md",
      className
    )

    const skeletonStyle = {
      width: width || (variant === 'circular' ? height : undefined),
      height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? '2rem' : '1.25rem'),
    }

    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className="space-y-2" {...props}>
          {Array.from({ length: lines }, (_, i) => (
            <div
              key={i}
              className={cn(
                skeletonClass,
                "animate-in fade-in-0 slide-in-from-left-2 duration-300",
                i === lines - 1 && "w-3/4", // Last line is shorter
              )}
              style={{ 
                ...skeletonStyle,
                width: i === lines - 1 ? '75%' : width || '100%',
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          skeletonClass,
          "animate-in fade-in-0 zoom-in-95 duration-300"
        )}
        style={skeletonStyle}
        {...props}
      />
    )
  }
)

Skeleton.displayName = "Skeleton"

// Preset skeleton components for common use cases
const SkeletonText = forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  ({ lines = 3, ...props }, ref) => (
    <Skeleton ref={ref} variant="text" lines={lines} {...props} />
  )
)
SkeletonText.displayName = "SkeletonText"

const SkeletonCard = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4 p-4", className)} {...props}>
      <Skeleton variant="rectangular" height="12rem" />
      <div className="space-y-2">
        <Skeleton variant="text" height="1.25rem" width="75%" />
        <Skeleton variant="text" lines={2} />
      </div>
      <div className="flex space-x-2">
        <Skeleton variant="rectangular" height="2rem" width="5rem" />
        <Skeleton variant="rectangular" height="2rem" width="5rem" />
      </div>
    </div>
  )
)
SkeletonCard.displayName = "SkeletonCard"

const SkeletonAvatar = forwardRef<HTMLDivElement, Omit<SkeletonProps, 'variant'>>(
  ({ width = "2.5rem", height = "2.5rem", ...props }, ref) => (
    <Skeleton ref={ref} variant="circular" width={width} height={height} {...props} />
  )
)
SkeletonAvatar.displayName = "SkeletonAvatar"

export { 
  Skeleton, 
  SkeletonText, 
  SkeletonCard, 
  SkeletonAvatar 
}