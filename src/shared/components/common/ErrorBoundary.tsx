import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw, Bug, ChevronDown, ChevronUp, Copy } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (props: ErrorFallbackProps) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showReport?: boolean
  resetKeys?: Array<string | number>
  resetOnPropsChange?: boolean
}

interface ErrorFallbackProps {
  error: Error
  errorInfo: ErrorInfo
  resetError: () => void
  showDetails: boolean
  toggleDetails: () => void
  reportError: () => void
}

const formatErrorForReport = (error: Error, errorInfo: ErrorInfo): string => {
  return `**Error Report**

**Error**: ${error.name}
**Message**: ${error.message}

**Stack Trace**:
\`\`\`
${error.stack || 'No stack trace available'}
\`\`\`

**Component Stack**:
\`\`\`
${errorInfo.componentStack}
\`\`\`

**User Agent**: ${navigator.userAgent}
**URL**: ${window.location.href}
**Timestamp**: ${new Date().toISOString()}
`
}

const DefaultErrorFallback = ({ 
  error, 
  errorInfo, 
  resetError, 
  showDetails, 
  toggleDetails, 
  reportError 
}: ErrorFallbackProps) => {
  const copyErrorInfo = async () => {
    const errorReport = formatErrorForReport(error, errorInfo)
    try {
      await navigator.clipboard.writeText(errorReport)
      // Could show a toast here if toast system is available
    } catch (err) {
      console.error('Failed to copy error info:', err)
    }
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <p className="text-sm text-muted-foreground">
            An unexpected error occurred. Please try refreshing the page.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error Summary */}
          <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <div className="flex items-start space-x-2">
              <Bug className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-destructive">
                  {error.name}
                </p>
                <p className="text-sm text-destructive/80 break-words">
                  {error.message}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button onClick={resetError} className="flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button variant="outline" onClick={reportError}>
              <Bug className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleDetails}
              className="flex items-center"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show Details
                </>
              )}
            </Button>
          </div>

          {/* Error Details */}
          {showDetails && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <Badge variant="outline">Error Details</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyErrorInfo}
                  className="h-7 px-2 text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              
              {/* Stack Trace */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Stack Trace</h4>
                <pre className="text-xs bg-black/20 p-3 rounded border overflow-x-auto">
                  <code className="text-muted-foreground whitespace-pre-wrap">
                    {error.stack || 'No stack trace available'}
                  </code>
                </pre>
              </div>

              {/* Component Stack */}
              {errorInfo.componentStack && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Component Stack</h4>
                  <pre className="text-xs bg-black/20 p-3 rounded border overflow-x-auto">
                    <code className="text-muted-foreground whitespace-pre-wrap">
                      {errorInfo.componentStack}
                    </code>
                  </pre>
                </div>
              )}

              {/* Environment Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Environment</h4>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <p><span className="font-medium">URL:</span> {window.location.href}</p>
                  <p><span className="font-medium">User Agent:</span> {navigator.userAgent}</p>
                  <p><span className="font-medium">Timestamp:</span> {new Date().toISOString()}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo)

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught an Error')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.groupEnd()
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    // Reset error state if resetKeys have changed
    if (hasError && resetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) => 
        prevProps.resetKeys?.[index] !== key
      )
      if (hasResetKeyChanged) {
        this.resetError()
      }
    }

    // Reset on any prop change if enabled
    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetError()
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    })
  }

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }))
  }

  reportError = () => {
    const { error, errorInfo } = this.state
    if (!error || !errorInfo) return

    const errorReport = formatErrorForReport(error, errorInfo)
    const subject = encodeURIComponent(`Error Report: ${error.name}`)
    const body = encodeURIComponent(errorReport)
    
    // Open default email client or could integrate with error reporting service
    const mailtoUrl = `mailto:support@devmate.dev?subject=${subject}&body=${body}`
    window.open(mailtoUrl, '_blank')
  }

  render() {
    const { hasError, error, errorInfo, showDetails } = this.state
    const { children, fallback: Fallback, showReport = true } = this.props

    if (hasError && error && errorInfo) {
      if (Fallback) {
        return (
          <Fallback
            error={error}
            errorInfo={errorInfo}
            resetError={this.resetError}
            showDetails={showDetails}
            toggleDetails={this.toggleDetails}
            reportError={showReport ? this.reportError : () => {}}
          />
        )
      }

      return (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo}
          resetError={this.resetError}
          showDetails={showDetails}
          toggleDetails={this.toggleDetails}
          reportError={showReport ? this.reportError : () => {}}
        />
      )
    }

    return children
  }
}

// Hook for functional components to reset error boundary
const useErrorBoundary = () => {
  return (error: Error) => {
    throw error
  }
}

export { ErrorBoundary, useErrorBoundary, type ErrorFallbackProps }