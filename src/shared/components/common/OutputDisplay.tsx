import { forwardRef, type ComponentProps, type ReactNode } from 'react'
import { Download, AlertCircle } from 'lucide-react'
import { CopyButton } from './CopyButton'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/utils/utils'

interface OutputDisplayProps extends Omit<ComponentProps<"div">, "content"> {
  content: string | ReactNode
  rawContent?: string
  title?: string
  language?: string
  isLoading?: boolean
  error?: string | null
  isEmpty?: boolean
  emptyMessage?: string
  showCopy?: boolean
  showDownload?: boolean
  downloadFileName?: string
  downloadMimeType?: string
  maxHeight?: number
  format?: 'text' | 'code' | 'json' | 'html' | 'custom'
}

const OutputDisplay = forwardRef<HTMLDivElement, OutputDisplayProps>(
  ({ 
    className,
    content,
    rawContent,
    title,
    language = 'text',
    isLoading = false,
    error = null,
    isEmpty = false,
    emptyMessage = 'No output to display',
    showCopy = true,
    showDownload = true,
    downloadFileName = 'output.txt',
    downloadMimeType = 'text/plain',
    maxHeight = 400,
    format = 'text',
    ...props
  }, ref) => {
    const displayContent = rawContent || (typeof content === 'string' ? content : '')

    const handleDownload = (): void => {
      if (!displayContent) return

      const blob = new Blob([displayContent], { type: downloadMimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = downloadFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    // Loading state
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn(
            "space-y-4 p-6 rounded-lg border backdrop-blur-xl bg-white/5 border-white/10",
            className
          )}
          {...props}
        >
          {title && (
            <div className="flex items-center justify-between">
              <Skeleton width="8rem" height="1.25rem" />
              <div className="flex gap-2">
                <Skeleton width="2.5rem" height="2rem" />
                <Skeleton width="2.5rem" height="2rem" />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Skeleton variant="text" lines={6} />
          </div>
        </div>
      )
    }

    // Error state
    if (error) {
      return (
        <div
          ref={ref}
          className={cn(
            "p-6 rounded-lg border backdrop-blur-xl",
            "bg-destructive/5 border-destructive/20 text-destructive",
            "animate-in fade-in-0 zoom-in-95 duration-300",
            className
          )}
          {...props}
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">Error</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        </div>
      )
    }

    // Empty state
    if (isEmpty || !displayContent) {
      return (
        <div
          ref={ref}
          className={cn(
            "p-8 rounded-lg border backdrop-blur-xl bg-white/5 border-white/10",
            "text-center text-muted-foreground",
            "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
            className
          )}
          {...props}
        >
          <div className="max-w-sm mx-auto space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-xl">📄</span>
            </div>
            <p className="font-medium">No Output</p>
            <p className="text-sm opacity-75">{emptyMessage}</p>
          </div>
        </div>
      )
    }

    // Success state with content
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border backdrop-blur-xl bg-white/5 border-white/10",
          "overflow-hidden",
          "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
          className
        )}
        {...props}
      >
        {/* Header */}
        {(title || showCopy || showDownload) && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="font-medium text-sm text-foreground">{title}</h3>
              )}
              {language && language !== 'text' && (
                <span className="px-2 py-1 text-xs bg-white/10 rounded text-muted-foreground font-mono">
                  {language}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {showCopy && displayContent && (
                <CopyButton
                  text={displayContent}
                  size="sm"
                  variant="ghost"
                  showText={false}
                  successMessage="Output copied!"
                />
              )}
              
              {showDownload && displayContent && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDownload}
                  className="p-2"
                  title="Download output"
                >
                  <Download size={14} />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div 
          className={cn(
            "overflow-auto",
            "scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          )}
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {format === 'code' || format === 'json' ? (
            <pre className={cn(
              "p-4 text-sm font-mono leading-relaxed",
              "text-foreground whitespace-pre-wrap break-words"
            )}>
              {typeof content === 'string' ? content : displayContent}
            </pre>
          ) : format === 'html' ? (
            <div 
              className="p-4 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: typeof content === 'string' ? content : displayContent 
              }} 
            />
          ) : format === 'custom' ? (
            <div className="p-4">
              {content}
            </div>
          ) : (
            <div className={cn(
              "p-4 text-sm leading-relaxed",
              "text-foreground whitespace-pre-wrap break-words"
            )}>
              {typeof content === 'string' ? content : displayContent}
            </div>
          )}
        </div>
      </div>
    )
  }
)

OutputDisplay.displayName = "OutputDisplay"

export { OutputDisplay }