import { forwardRef, type ComponentProps } from 'react'
import { cn } from '@/shared/utils/utils'

interface CardProps extends ComponentProps<"div"> {
  hover?: boolean
  interactive?: boolean
  glass?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, interactive = false, glass = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "rounded-lg border text-card-foreground shadow-sm",
          
          // Glass effect
          glass && "backdrop-blur-xl bg-white/5 border-white/10",
          !glass && "bg-card border-border",
          
          // Interactive states
          interactive && "cursor-pointer",
          
          // Hover effects
          hover && [
            "transition-all duration-300 ease-out",
            "hover:shadow-lg hover:shadow-primary/10",
            glass ? "hover:bg-white/10 hover:border-white/20" : "hover:bg-accent/50",
            interactive && "hover:scale-[1.02] hover:-translate-y-0.5",
          ],
          
          // Focus effects for interactive cards
          interactive && [
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "focus:shadow-lg focus:shadow-primary/20",
            glass ? "focus:bg-white/10 focus:border-primary/30" : "focus:bg-accent",
          ],
          
          // Mobile touch feedback
          interactive && "active:scale-[0.98] touch-manipulation",
          
          className
        )}
        tabIndex={interactive ? 0 : -1}
        {...props}
      />
    )
  }
)

Card.displayName = "Card"

const CardHeader = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef<HTMLParagraphElement, ComponentProps<"h3">>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef<HTMLParagraphElement, ComponentProps<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}