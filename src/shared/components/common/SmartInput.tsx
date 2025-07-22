import { forwardRef, useState, useEffect, useCallback, type ComponentProps } from 'react'
import { Code, FileText, Globe, Hash, Zap, ArrowRight, Lightbulb } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Textarea } from '@/shared/components/ui/textarea'
import { Tooltip } from '@/shared/components/ui/tooltip'
import { cn } from '@/shared/utils/utils'

type ContentType = 'json' | 'base64' | 'url' | 'jwt' | 'hash' | 'css' | 'html' | 'xml' | 'yaml' | 'sql' | 'markdown' | 'regex' | 'text'

interface DetectionResult {
  type: ContentType
  confidence: number
  suggestion?: string
  toolRoute?: string
  formatPreview?: string
}

interface SmartInputProps extends Omit<ComponentProps<typeof Textarea>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  onContentTypeChange?: (type: ContentType, suggestion: string) => void
  onFormatSuggestion?: (formatted: string) => void
  autoDetect?: boolean
  showSuggestions?: boolean
  showFormatOnPaste?: boolean
  placeholder?: string
}

// Content type detection patterns and logic
const detectContentType = (content: string): DetectionResult => {
  const trimmed = content.trim()
  
  if (!trimmed) {
    return { type: 'text', confidence: 0 }
  }

  // JSON detection
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed)
      const formatted = JSON.stringify(JSON.parse(trimmed), null, 2)
      return {
        type: 'json',
        confidence: 0.9,
        suggestion: 'Use JSON Formatter to beautify and validate',
        toolRoute: '/json-formatter',
        formatPreview: formatted !== trimmed ? formatted : undefined
      }
    } catch {
      // Could be malformed JSON
      if (trimmed.includes('"') && (trimmed.includes('{') || trimmed.includes('['))) {
        return {
          type: 'json',
          confidence: 0.6,
          suggestion: 'Looks like JSON - use JSON Formatter to validate and fix',
          toolRoute: '/json-formatter'
        }
      }
    }
  }

  // Base64 detection
  const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/
  if (base64Pattern.test(trimmed) && trimmed.length > 20 && trimmed.length % 4 === 0) {
    try {
      atob(trimmed)
      return {
        type: 'base64',
        confidence: 0.85,
        suggestion: 'Use Base64 tool to encode/decode',
        toolRoute: '/base64'
      }
    } catch {
      // Invalid base64
    }
  }

  // JWT detection
  const jwtPattern = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]*$/
  if (jwtPattern.test(trimmed)) {
    return {
      type: 'jwt',
      confidence: 0.9,
      suggestion: 'Use JWT Decoder to inspect token',
      toolRoute: '/jwt-decoder'
    }
  }

  // URL detection
  const urlPattern = /^https?:\/\/.+/
  if (urlPattern.test(trimmed)) {
    return {
      type: 'url',
      confidence: 0.9,
      suggestion: 'Use URL tools to encode/decode and parse',
      toolRoute: '/url-tools'
    }
  }

  // Hash detection (hex patterns)
  const hashPatterns = [
    { pattern: /^[a-fA-F0-9]{32}$/, type: 'MD5' },
    { pattern: /^[a-fA-F0-9]{40}$/, type: 'SHA-1' },
    { pattern: /^[a-fA-F0-9]{64}$/, type: 'SHA-256' },
    { pattern: /^[a-fA-F0-9]{128}$/, type: 'SHA-512' }
  ]
  
  for (const { pattern, type } of hashPatterns) {
    if (pattern.test(trimmed)) {
      return {
        type: 'hash',
        confidence: 0.8,
        suggestion: `Looks like ${type} hash - use Hash Generator to verify or generate`,
        toolRoute: '/hash-generator'
      }
    }
  }

  // HTML/XML detection
  if (trimmed.startsWith('<') && trimmed.includes('>')) {
    const hasHtmlTags = /<(html|head|body|div|span|p|h[1-6]|a|img)/i.test(trimmed)
    if (hasHtmlTags) {
      return {
        type: 'html',
        confidence: 0.85,
        suggestion: 'HTML detected - format and validate structure',
        toolRoute: '/html-formatter'
      }
    } else if (trimmed.includes('<?xml') || /^<[^>]+>/.test(trimmed)) {
      return {
        type: 'xml',
        confidence: 0.8,
        suggestion: 'XML detected - format and validate structure',
        toolRoute: '/xml-formatter'
      }
    }
  }

  // CSS detection
  if (trimmed.includes('{') && trimmed.includes('}') && trimmed.includes(':')) {
    const cssPattern = /[a-zA-Z-]+\s*:\s*[^;]+;/
    if (cssPattern.test(trimmed)) {
      return {
        type: 'css',
        confidence: 0.7,
        suggestion: 'CSS detected - format and optimize styles',
        toolRoute: '/css-formatter'
      }
    }
  }

  // YAML detection
  if (trimmed.includes(':') && !trimmed.includes('{') && !trimmed.includes('<')) {
    const yamlPattern = /^[a-zA-Z_][a-zA-Z0-9_]*:\s*.+/m
    if (yamlPattern.test(trimmed)) {
      return {
        type: 'yaml',
        confidence: 0.6,
        suggestion: 'YAML detected - validate and format structure',
        toolRoute: '/yaml-formatter'
      }
    }
  }

  // Markdown detection
  if (trimmed.includes('#') || trimmed.includes('**') || trimmed.includes('```')) {
    return {
      type: 'markdown',
      confidence: 0.6,
      suggestion: 'Markdown detected - preview and format',
      toolRoute: '/markdown-preview'
    }
  }

  // Regex detection
  const regexPattern = /^\/.*\/[gimuy]*$|^\^.*\$$|\\.+\*|\[.*\]|\{.*\}/
  if (regexPattern.test(trimmed)) {
    return {
      type: 'regex',
      confidence: 0.7,
      suggestion: 'Regex pattern detected - test and validate',
      toolRoute: '/regex-tester'
    }
  }

  // SQL detection
  const sqlKeywords = /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|CREATE|DROP|ALTER)\b/i
  if (sqlKeywords.test(trimmed)) {
    return {
      type: 'sql',
      confidence: 0.6,
      suggestion: 'SQL detected - format and validate queries',
      toolRoute: '/sql-formatter'
    }
  }

  return {
    type: 'text',
    confidence: 0.3,
    suggestion: 'Plain text detected'
  }
}

const getContentTypeIcon = (type: ContentType) => {
  switch (type) {
    case 'json': return <Code className="w-4 h-4" />
    case 'base64': return <Hash className="w-4 h-4" />
    case 'jwt': return <Zap className="w-4 h-4" />
    case 'url': return <Globe className="w-4 h-4" />
    case 'hash': return <Hash className="w-4 h-4" />
    case 'html':
    case 'xml':
    case 'css':
    case 'yaml':
    case 'markdown':
    case 'sql': return <Code className="w-4 h-4" />
    default: return <FileText className="w-4 h-4" />
  }
}

const SmartInput = forwardRef<HTMLTextAreaElement, SmartInputProps>(
  ({
    className,
    value,
    onChange,
    onContentTypeChange,
    onFormatSuggestion,
    autoDetect = true,
    showSuggestions = true,
    showFormatOnPaste = true,
    placeholder = "Paste or type your content here. SmartInput will auto-detect the format...",
    ...props
  }, ref) => {
    const [detection, setDetection] = useState<DetectionResult>({ type: 'text', confidence: 0 })
    const [showFormatSuggestion, setShowFormatSuggestion] = useState(false)
    const [lastValue, setLastValue] = useState(value)

    const detectAndUpdate = useCallback((content: string) => {
      if (!autoDetect) return

      const result = detectContentType(content)
      setDetection(result)
      
      if (result.confidence > 0.6 && result.suggestion) {
        onContentTypeChange?.(result.type, result.suggestion)
      }

      // Show format suggestion for JSON and other formattable content
      if (showFormatOnPaste && result.formatPreview && result.formatPreview !== content) {
        setShowFormatSuggestion(true)
      } else {
        setShowFormatSuggestion(false)
      }
    }, [autoDetect, onContentTypeChange, showFormatOnPaste])

    useEffect(() => {
      if (value !== lastValue) {
        detectAndUpdate(value)
        setLastValue(value)
      }
    }, [value, lastValue, detectAndUpdate])

    const handleChange = (newValue: string) => {
      onChange(newValue)
      detectAndUpdate(newValue)
    }

    const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const pastedContent = event.clipboardData.getData('text')
      const newValue = value + pastedContent
      
      // Immediate detection on paste
      setTimeout(() => {
        detectAndUpdate(newValue)
      }, 0)
      
      props.onPaste?.(event)
    }

    const applyFormat = () => {
      if (detection.formatPreview) {
        onChange(detection.formatPreview)
        onFormatSuggestion?.(detection.formatPreview)
        setShowFormatSuggestion(false)
      }
    }

    const navigateToTool = () => {
      if (detection.toolRoute) {
        window.location.href = detection.toolRoute
      }
    }

    return (
      <div className="space-y-3">
        {/* Smart Input */}
        <div className="relative">
          <Textarea
            ref={ref}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onPaste={handlePaste}
            placeholder={placeholder}
            className={cn(
              "min-h-[120px] transition-all duration-200",
              detection.confidence > 0.6 && "ring-1 ring-primary/20 border-primary/30",
              className
            )}
            {...props}
          />

          {/* Content Type Badge */}
          {detection.confidence > 0.5 && (
            <div className="absolute top-3 right-3">
              <Badge 
                variant="secondary" 
                className="text-xs bg-white/10 border-white/20 animate-in zoom-in-50"
              >
                {getContentTypeIcon(detection.type)}
                <span className="ml-1 capitalize">{detection.type}</span>
              </Badge>
            </div>
          )}
        </div>

        {/* Smart Suggestions */}
        {showSuggestions && detection.confidence > 0.6 && detection.suggestion && (
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-primary/5 border border-primary/20 animate-in slide-in-from-bottom-2">
            <Lightbulb className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <p className="text-sm text-foreground">
                <strong>Smart suggestion:</strong> {detection.suggestion}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {/* Format Button */}
                {showFormatSuggestion && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={applyFormat}
                    className="text-xs h-7"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Auto Format
                  </Button>
                )}

                {/* Switch Tool Button */}
                {detection.toolRoute && (
                  <Tooltip content={`Go to ${detection.type.toUpperCase()} tool`}>
                    <Button 
                      size="sm"
                      onClick={navigateToTool}
                      className="text-xs h-7"
                    >
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Switch Tool
                    </Button>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Detection Info */}
        {process.env.NODE_ENV === 'development' && detection.confidence > 0 && (
          <div className="text-xs text-muted-foreground">
            Detected: {detection.type} (confidence: {Math.round(detection.confidence * 100)}%)
          </div>
        )}
      </div>
    )
  }
)

SmartInput.displayName = "SmartInput"

export { SmartInput, detectContentType, type ContentType, type DetectionResult }