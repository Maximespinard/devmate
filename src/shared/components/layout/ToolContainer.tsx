import { type ReactNode } from 'react';
import { cn } from '@/shared/utils/utils';

interface ToolContainerProps {
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
}

export function ToolContainer({
  children,
  className,
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyTitle = "Get started",
  emptyDescription = "Enter your data to see results",
  onRetry,
}: ToolContainerProps) {
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isEmpty) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div 
      className={cn(
        // Glass morphism effect
        "backdrop-blur-xl bg-white/5 border border-white/10",
        // Hover states
        "hover:bg-white/[0.07] hover:border-white/20",
        // Transitions
        "transition-all duration-200 ease-out",
        // Layout
        "rounded-xl p-6 md:p-8",
        // Shadows
        "shadow-xl shadow-black/5",
        // Mobile optimizations
        "mx-4 md:mx-0",
        className
      )}
    >
      {children}
    </div>
  );
}

interface LoadingStateProps {
  className?: string;
}

function LoadingState({ className }: LoadingStateProps) {
  return (
    <div 
      className={cn(
        "backdrop-blur-xl bg-white/5 border border-white/10",
        "rounded-xl p-6 md:p-8 mx-4 md:mx-0",
        "shadow-xl shadow-black/5",
        className
      )}
    >
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="h-32 bg-white/10 rounded-lg animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-white/5 rounded animate-pulse" />
            <div className="h-10 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
        
        {/* Footer skeleton */}
        <div className="h-16 bg-white/5 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  className?: string;
}

function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "backdrop-blur-xl bg-white/5 border border-white/10",
        "rounded-xl p-6 md:p-8 mx-4 md:mx-0",
        "shadow-xl shadow-black/5",
        className
      )}
    >
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-white/90 mb-2">
          {title}
        </h3>
        
        <p className="text-white/60 max-w-sm mx-auto">
          {description}
        </p>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  return (
    <div 
      className={cn(
        "backdrop-blur-xl bg-red-500/5 border border-red-500/20",
        "rounded-xl p-6 md:p-8 mx-4 md:mx-0",
        "shadow-xl shadow-black/5",
        className
      )}
    >
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-red-400 mb-2">
          Something went wrong
        </h3>
        
        <p className="text-red-300/80 max-w-sm mx-auto mb-4">
          {error}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}