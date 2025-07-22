import { motion } from 'framer-motion'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/utils/utils'
import { badgeConfig, type Tool } from '@/shared/constants/tools'

interface ToolCardProps {
  tool: Tool
  index: number
  onClick: () => void
  variant?: 'default' | 'compact'
}

export function ToolCard({ tool, index, onClick, variant = 'default' }: ToolCardProps) {
  const IconComponent = tool.icon
  const badgeInfo = tool.badge ? badgeConfig[tool.badge] : null
  const BadgeIcon = badgeInfo?.icon

  const isCompact = variant === 'compact'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: 'easeOut',
      }}
      className={cn(
        'group relative overflow-hidden rounded-xl border backdrop-blur-xl cursor-pointer',
        'border-white/8 bg-white/4 hover:border-white/12 hover:bg-white/8',
        'transition-all duration-300 hover:scale-105',
        isCompact ? 'p-4' : 'p-6'
      )}
      onClick={onClick}
    >
      {/* Badge */}
      {tool.badge && badgeInfo && BadgeIcon && !isCompact && (
        <div className="absolute top-3 right-3 z-10">
          <Badge
            className={cn('text-xs px-1.5 py-0.5 border', badgeInfo.color)}
          >
            <BadgeIcon size={8} className="mr-1" />
            {tool.badge}
          </Badge>
        </div>
      )}

      {/* Card content */}
      <div className={cn(
        'relative flex items-center text-center',
        isCompact ? 'flex-row gap-3' : 'flex-col'
      )}>
        {/* Icon container */}
        <div className={isCompact ? 'mb-0' : 'mb-4'}>
          <div
            className={cn(
              'rounded-xl flex items-center justify-center transition-all duration-300',
              'bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/8',
              'group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20',
              isCompact ? 'w-10 h-10' : 'w-16 h-16'
            )}
          >
            <IconComponent
              size={isCompact ? 20 : 28}
              className="text-white group-hover:text-white transition-colors duration-300"
            />
          </div>
        </div>

        {/* Tool name */}
        <h3 className={cn(
          'font-semibold text-foreground group-hover:text-primary transition-colors duration-300',
          isCompact ? 'text-sm text-left flex-1' : 'text-lg'
        )}>
          {tool.name}
        </h3>
      </div>

      {/* Hover shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </div>
    </motion.div>
  )
}