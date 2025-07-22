import { useState, useEffect, forwardRef, type ComponentProps, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/shared/utils/utils'

interface Tab {
  value: string
  label: string
  content: ReactNode
  disabled?: boolean
  badge?: string | number
}

interface TabsProps extends Omit<ComponentProps<"div">, "value" | "onChange"> {
  value?: string
  onValueChange?: (value: string) => void
  tabs: Tab[]
  variant?: 'default' | 'pills' | 'underline'
  orientation?: 'horizontal' | 'vertical'
  activateOnHover?: boolean
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ 
    className,
    value,
    onValueChange,
    tabs,
    variant = 'default',
    orientation = 'horizontal',
    activateOnHover = false,
    ...props
  }, ref) => {
    const [activeTab, setActiveTab] = useState(value || tabs[0]?.value || '')

    // Update active tab when value prop changes
    useEffect(() => {
      if (value && value !== activeTab) {
        setActiveTab(value)
      }
    }, [value, activeTab])

    const handleTabChange = (tabValue: string): void => {
      const tab = tabs.find(t => t.value === tabValue)
      if (!tab || tab.disabled) return

      setActiveTab(tabValue)
      onValueChange?.(tabValue)
    }

    const activeTabContent = tabs.find(tab => tab.value === activeTab)?.content

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          orientation === 'vertical' && "flex gap-4",
          className
        )}
        {...props}
      >
        {/* Tab List */}
        <div
          className={cn(
            "flex",
            orientation === 'horizontal' && "w-full border-b border-white/10",
            orientation === 'vertical' && "flex-col min-w-[200px] border-r border-white/10 pr-4",
            variant === 'pills' && "p-1 bg-white/5 rounded-lg backdrop-blur-xl",
            variant === 'underline' && "space-x-6"
          )}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.value}
              type="button"
              onClick={() => handleTabChange(tab.value)}
              onMouseEnter={activateOnHover ? () => handleTabChange(tab.value) : undefined}
              disabled={tab.disabled}
              className={cn(
                // Base styles
                "relative px-4 py-2 text-sm font-medium transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md",
                
                // Layout
                orientation === 'vertical' && "w-full justify-start text-left",
                orientation === 'horizontal' && "whitespace-nowrap",
                
                // Variant-specific styles
                variant === 'default' && [
                  activeTab === tab.value
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground",
                  "border-b-2 border-transparent hover:border-white/20",
                  "pb-3 -mb-px"
                ],
                
                variant === 'pills' && [
                  "rounded-md",
                  activeTab === tab.value
                    ? "bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                ],
                
                variant === 'underline' && [
                  "relative",
                  activeTab === tab.value
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                ]
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.badge && (
                  <span className="px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                    {tab.badge}
                  </span>
                )}
              </span>

              {/* Active indicator for underline variant */}
              {variant === 'underline' && activeTab === tab.value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                />
              )}

              {/* Active background for pills variant */}
              {variant === 'pills' && activeTab === tab.value && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-white/10 rounded-md -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={cn(
          "mt-4",
          orientation === 'vertical' && "flex-1 mt-0"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeTabContent}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }
)

Tabs.displayName = "Tabs"

export { Tabs, type Tab }