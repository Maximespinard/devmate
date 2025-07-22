import { forwardRef, type ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/utils'

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-500/80 shadow-sm",
        warning:
          "border-transparent bg-yellow-500 text-black hover:bg-yellow-500/80 shadow-sm",
        outline:
          "text-foreground border-current bg-transparent hover:bg-accent hover:text-accent-foreground",
        glass:
          "border-white/10 bg-white/5 text-foreground hover:bg-white/10 backdrop-blur-xl",
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface BadgeProps extends ComponentProps<"div">,
  VariantProps<typeof badgeVariants> {
  animate?: boolean
  pulse?: boolean
  dot?: boolean
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, animate = false, pulse = false, dot = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, size }),
          pulse && "animate-pulse",
          animate && "animate-in zoom-in-95 duration-200 hover:scale-105 transition-transform",
          className
        )}
        {...props}
      >
        {dot && (
          <span 
            className={cn(
              "w-1.5 h-1.5 rounded-full mr-1.5",
              variant === 'default' && "bg-primary-foreground",
              variant === 'secondary' && "bg-secondary-foreground",
              variant === 'destructive' && "bg-destructive-foreground",
              variant === 'success' && "bg-white",
              variant === 'warning' && "bg-black",
              variant === 'outline' && "bg-current",
              variant === 'glass' && "bg-current",
            )}
          />
        )}
        {children}
      </div>
    )
  }
)

Badge.displayName = "Badge"

export { Badge }