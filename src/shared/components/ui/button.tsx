import { type ComponentProps } from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"
import { buttonVariants } from "./button-variants"
import { cn } from "@/shared/utils/utils"

interface ButtonProps extends ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  const isDisabled = disabled || loading

  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size }),
        // Premium animations and effects
        "group relative overflow-hidden",
        "transition-all duration-200 ease-out",
        "hover:scale-105 active:scale-95",
        "hover:shadow-lg hover:shadow-primary/25",
        "focus-visible:scale-105 focus-visible:shadow-lg focus-visible:shadow-primary/25",
        // Loading state
        loading && "cursor-not-allowed",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          {loadingText && <span>{loadingText}</span>}
        </div>
      )}
      
      {/* Button content with opacity animation during loading */}
      <div className={cn(
        "flex items-center justify-center gap-2",
        loading && "opacity-0"
      )}>
        {children}
      </div>

      {/* Glassmorphism hover effect */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      
      {/* Ripple effect container */}
      <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </div>
    </Comp>
  )
}

export { Button }
