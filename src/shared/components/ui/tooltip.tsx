import { forwardRef, useState, useRef, useEffect, type ComponentProps, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/utils/utils'

type TooltipSide = 'top' | 'right' | 'bottom' | 'left'
type TooltipAlign = 'start' | 'center' | 'end'

interface TooltipProps {
  children: ReactNode
  content: ReactNode
  side?: TooltipSide
  align?: TooltipAlign
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

interface TooltipContentProps extends ComponentProps<"div"> {
  side?: TooltipSide
  align?: TooltipAlign
  sideOffset?: number
  alignOffset?: number
}

const getTooltipPosition = (
  triggerRect: DOMRect,
  contentRect: DOMRect,
  side: TooltipSide,
  align: TooltipAlign,
  sideOffset: number = 4,
  alignOffset: number = 0
) => {
  let x = 0
  let y = 0

  // Calculate position based on side
  switch (side) {
    case 'top':
      x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
      y = triggerRect.top - contentRect.height - sideOffset
      break
    case 'bottom':
      x = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
      y = triggerRect.bottom + sideOffset
      break
    case 'left':
      x = triggerRect.left - contentRect.width - sideOffset
      y = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
      break
    case 'right':
      x = triggerRect.right + sideOffset
      y = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
      break
  }

  // Adjust for alignment
  if (side === 'top' || side === 'bottom') {
    switch (align) {
      case 'start':
        x = triggerRect.left + alignOffset
        break
      case 'end':
        x = triggerRect.right - contentRect.width - alignOffset
        break
    }
  } else {
    switch (align) {
      case 'start':
        y = triggerRect.top + alignOffset
        break
      case 'end':
        y = triggerRect.bottom - contentRect.height - alignOffset
        break
    }
  }

  // Keep tooltip within viewport
  const padding = 8
  x = Math.max(padding, Math.min(x, window.innerWidth - contentRect.width - padding))
  y = Math.max(padding, Math.min(y, window.innerHeight - contentRect.height - padding))

  return { x, y }
}

const Tooltip = ({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 700,
  skipDelayDuration = 300,
  disableHoverableContent = false,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange
}: TooltipProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const triggerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const openTimeoutRef = useRef<number>(0)
  const closeTimeoutRef = useRef<number>(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  const updatePosition = () => {
    if (!triggerRef.current || !contentRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const contentRect = contentRef.current.getBoundingClientRect()
    
    const newPosition = getTooltipPosition(
      triggerRect,
      contentRect,
      side,
      align
    )
    
    setPosition(newPosition)
  }

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }

    openTimeoutRef.current = window.setTimeout(() => {
      handleOpenChange(true)
      setIsVisible(true)
    }, delayDuration)
  }

  const handleMouseLeave = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current)
    }

    if (!disableHoverableContent) {
      closeTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => handleOpenChange(false), 150)
      }, skipDelayDuration)
    } else {
      setIsVisible(false)
      setTimeout(() => handleOpenChange(false), 150)
    }
  }

  const handleContentMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
  }

  const handleContentMouseLeave = () => {
    setIsVisible(false)
    setTimeout(() => handleOpenChange(false), 150)
  }

  useEffect(() => {
    if (open && triggerRef.current) {
      updatePosition()
      
      const handleScroll = () => updatePosition()
      const handleResize = () => updatePosition()
      
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [open, side, align, updatePosition])

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current)
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const trigger = (
    <span
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => {
        handleOpenChange(true)
        setIsVisible(true)
      }}
      onBlur={() => {
        setIsVisible(false)
        setTimeout(() => handleOpenChange(false), 150)
      }}
      className="inline-block"
    >
      {children}
    </span>
  )

  if (!mounted || !open) {
    return trigger
  }

  return (
    <>
      {trigger}
      {createPortal(
        <div
          ref={contentRef}
          className={cn(
            "absolute z-50 overflow-hidden rounded-md border border-white/10 bg-background/95 backdrop-blur-xl px-3 py-1.5 text-sm shadow-md",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            !isVisible && "animate-out fade-out-0 zoom-out-95 duration-150",
            side === 'top' && "slide-in-from-bottom-2",
            side === 'bottom' && "slide-in-from-top-2",
            side === 'left' && "slide-in-from-right-2",
            side === 'right' && "slide-in-from-left-2"
          )}
          style={{
            left: position.x,
            top: position.y,
          }}
          onMouseEnter={disableHoverableContent ? undefined : handleContentMouseEnter}
          onMouseLeave={disableHoverableContent ? undefined : handleContentMouseLeave}
        >
          <div className="text-foreground">
            {content}
          </div>
          
          {/* Arrow */}
          <div
            className={cn(
              "absolute h-2 w-2 rotate-45 border border-white/10 bg-background/95 backdrop-blur-xl",
              side === 'top' && "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-transparent border-l-transparent",
              side === 'bottom' && "top-[-4px] left-1/2 -translate-x-1/2 border-b-transparent border-r-transparent",
              side === 'left' && "right-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-l-transparent",
              side === 'right' && "left-[-4px] top-1/2 -translate-y-1/2 border-b-transparent border-r-transparent"
            )}
          />
        </div>,
        document.body
      )}
    </>
  )
}

const TooltipProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

const TooltipTrigger = forwardRef<HTMLButtonElement, ComponentProps<"button">>(
  ({ children, ...props }, ref) => (
    <button ref={ref} {...props}>
      {children}
    </button>
  )
)
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "z-50 overflow-hidden rounded-md border border-white/10 bg-background/95 backdrop-blur-xl px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 zoom-in-95 duration-200",
        className
      )}
      {...props}
    />
  )
)
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent }