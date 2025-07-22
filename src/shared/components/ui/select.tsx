import { useState, useEffect, useRef, forwardRef, type ComponentProps } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/shared/utils/utils'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends Omit<ComponentProps<"button">, "value" | "onChange"> {
  value?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  success?: boolean
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ 
    className,
    value,
    onValueChange,
    options,
    placeholder = "Select an option...",
    disabled = false,
    error = false,
    success = false,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
      options.find(option => option.value === value) || null
    )
    const selectRef = useRef<HTMLDivElement>(null)

    // Update selected option when value prop changes
    useEffect(() => {
      const newSelected = options.find(option => option.value === value) || null
      setSelectedOption(newSelected)
    }, [value, options])

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent): void => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

    // Handle keyboard navigation
    useEffect(() => {
      if (!isOpen) return

      const handleKeyDown = (event: KeyboardEvent): void => {
        switch (event.key) {
          case 'Escape':
            setIsOpen(false)
            break
          case 'ArrowDown':
            event.preventDefault()
            // Focus next option
            break
          case 'ArrowUp':
            event.preventDefault()
            // Focus previous option
            break
          case 'Enter':
          case ' ':
            event.preventDefault()
            // Select focused option
            break
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen])

    const handleSelect = (option: SelectOption): void => {
      if (option.disabled) return

      setSelectedOption(option)
      onValueChange?.(option.value)
      setIsOpen(false)
    }

    const handleToggle = (): void => {
      if (!disabled) {
        setIsOpen(!isOpen)
      }
    }

    return (
      <div ref={selectRef} className="relative">
        <button
          ref={ref}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            // Base styles
            "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-300 ease-out",
            
            // Focus states
            "focus:outline-none focus:ring-2 focus:ring-primary/20",
            "focus:border-primary focus:shadow-lg focus:shadow-primary/10",
            
            // Glass effect
            "backdrop-blur-xl bg-white/5 border-white/10",
            "hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]",
            "active:scale-[0.99]",
            
            // State-based styling
            error && "border-destructive focus:ring-destructive/20 focus:border-destructive",
            success && "border-green-500 focus:ring-green-500/20 focus:border-green-500",
            isOpen && "ring-2 ring-primary/20 border-primary/30",
            
            className
          )}
          {...props}
        >
          <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          
          <div
            className={cn(
              "transition-transform duration-200 ease-out",
              isOpen && "rotate-180"
            )}
          >
            <ChevronDown size={16} />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className={cn(
              "absolute top-full left-0 right-0 z-50 mt-1",
              "max-h-60 overflow-auto rounded-md border",
              "backdrop-blur-xl bg-background/95 border-white/10",
              "shadow-lg shadow-black/20",
              "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
            )}
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className={cn(
                  "flex cursor-pointer items-center px-3 py-2 text-sm transition-all duration-150",
                  "hover:bg-white/10 focus:bg-white/10",
                  "animate-in slide-in-from-left-2 duration-150",
                  option.disabled && "cursor-not-allowed opacity-50",
                  selectedOption?.value === option.value && "bg-primary/20 text-primary"
                )}
                style={{ animationDelay: `${index * 20}ms` }}
              >
                <span className="flex-1">{option.label}</span>
                {selectedOption?.value === option.value && (
                  <div className="animate-in zoom-in-50 duration-200">
                    <Check size={14} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export { Select, type SelectOption }