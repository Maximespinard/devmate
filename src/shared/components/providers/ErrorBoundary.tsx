import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError && this.state.error && this.state.errorInfo) {
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error,
          this.state.errorInfo,
          this.resetError
        )
      }

      return <ErrorFallback 
        error={this.state.error} 
        errorInfo={this.state.errorInfo}
        reset={this.resetError}
      />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error
  errorInfo: ErrorInfo
  reset: () => void
}

const ErrorFallback = ({ error, errorInfo, reset }: ErrorFallbackProps) => {
  const isDevelopment = import.meta.env.DEV

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="glass-panel max-w-2xl w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            An unexpected error occurred. Please try refreshing the page.
          </p>
        </div>

        {isDevelopment && (
          <div className="mt-6 space-y-4">
            <details className="text-left">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Error Details
              </summary>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm font-mono text-destructive">
                    {error.toString()}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 max-h-64 overflow-auto">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        )}

        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={reset}
            className="button-secondary inline-flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="button-primary inline-flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}