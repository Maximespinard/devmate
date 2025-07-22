import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/utils'

interface RootLayoutProps {
  children: ReactNode
  className?: string
}

export const RootLayout = ({ children, className }: RootLayoutProps) => {
  return (
    <div className={cn(
      'relative min-h-screen w-full overflow-x-hidden',
      'bg-background text-foreground',
      className
    )}>
      {/* Gradient Mesh Background */}
      <div className="fixed inset-0 -z-10 h-full w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95" />
        <div className="absolute top-0 -left-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 -right-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-secondary/20 via-secondary/10 to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 blur-3xl" />
      </div>

      {/* Glass Morphism Overlay */}
      <div className="fixed inset-0 -z-10 backdrop-blur-[100px]" />
      
      {/* Noise Texture */}
      <div className="fixed inset-0 -z-10 opacity-[0.015]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} 
      />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  )
}