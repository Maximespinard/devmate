import { forwardRef, useRef, useState, useEffect, useCallback, type ComponentProps, type DragEvent } from 'react'
import { Upload, File, Image, X, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/utils/utils'

interface FileUploadProps extends Omit<ComponentProps<"div">, 'onChange' | 'onError'> {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  disabled?: boolean
  onFilesChange?: (files: File[]) => void
  onError?: (error: string) => void
  showPreview?: boolean
  allowedTypes?: string[]
  dragActiveText?: string
  dragInactiveText?: string
}

interface FilePreviewProps {
  file: File
  onRemove: () => void
  error?: string
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) {
    return <Image size={20} />
  }
  return <File size={20} />
}

const FilePreview = ({ file, onRemove, error }: FilePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>('')
  
  useEffect(() => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  return (
    <div className={cn(
      "flex items-center space-x-3 p-3 rounded-lg border border-white/10 bg-white/5",
      error && "border-destructive/50 bg-destructive/10"
    )}>
      <div className="flex-shrink-0">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt={file.name}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
            {getFileIcon(file)}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>
        {error && (
          <p className="text-xs text-destructive mt-1 flex items-center">
            <AlertCircle size={12} className="mr-1" />
            {error}
          </p>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="flex-shrink-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
      >
        <X size={16} />
      </Button>
    </div>
  )
}

const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  ({
    className,
    accept,
    multiple = false,
    maxSize = 10 * 1024 * 1024, // 10MB default
    maxFiles = multiple ? 10 : 1,
    disabled = false,
    onFilesChange,
    onError,
    showPreview = true,
    allowedTypes,
    dragActiveText = "Drop files here...",
    dragInactiveText = "Drag and drop files here, or click to browse",
    ...props
  }, ref) => {
    const [files, setFiles] = useState<File[]>([])
    const [isDragActive, setIsDragActive] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
    const [fileErrors, setFileErrors] = useState<{ [key: string]: string }>({})
    
    const fileInputRef = useRef<HTMLInputElement>(null)

    const validateFile = (file: File): string | null => {
      // Check file size
      if (file.size > maxSize) {
        return `File size exceeds ${formatFileSize(maxSize)}`
      }

      // Check allowed types
      if (allowedTypes && !allowedTypes.some(type => 
        file.type === type || file.name.toLowerCase().endsWith(type.replace('*', ''))
      )) {
        return `File type not allowed. Accepted types: ${allowedTypes.join(', ')}`
      }

      return null
    }

    const processFiles = useCallback((newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles)
      const validFiles: File[] = []
      const errors: { [key: string]: string } = {}

      // Check max files limit
      if (files.length + fileArray.length > maxFiles) {
        onError?.(`Cannot upload more than ${maxFiles} files`)
        return
      }

      // Validate each file
      fileArray.forEach(file => {
        const error = validateFile(file)
        if (error) {
          errors[file.name] = error
        } else {
          validFiles.push(file)
        }
      })

      // Update state
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles.slice(0, 1)
      setFiles(updatedFiles)
      setFileErrors(prev => ({ ...prev, ...errors }))
      onFilesChange?.(updatedFiles)

      // Simulate upload progress
      validFiles.forEach(file => {
        simulateUploadProgress(file.name)
      })
    }, [files, maxFiles, maxSize, allowedTypes, multiple, onFilesChange, onError])

    const simulateUploadProgress = (fileName: string) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          setUploadProgress(prev => ({ ...prev, [fileName]: 100 }))
          clearInterval(interval)
        } else {
          setUploadProgress(prev => ({ ...prev, [fileName]: progress }))
        }
      }, 200)
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files
      if (selectedFiles) {
        processFiles(selectedFiles)
      }
    }

    const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (!disabled) {
        setIsDragActive(true)
      }
    }, [disabled])

    const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragActive(false)
    }, [])

    const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragActive(false)
      
      if (!disabled) {
        const droppedFiles = event.dataTransfer.files
        if (droppedFiles) {
          processFiles(droppedFiles)
        }
      }
    }, [disabled, processFiles])

    const removeFile = (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index)
      setFiles(updatedFiles)
      onFilesChange?.(updatedFiles)
      
      // Remove file error and progress
      const removedFile = files[index]
      setFileErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[removedFile.name]
        return newErrors
      })
      setUploadProgress(prev => {
        const newProgress = { ...prev }
        delete newProgress[removedFile.name]
        return newProgress
      })
    }

    const openFileDialog = () => {
      if (!disabled) {
        fileInputRef.current?.click()
      }
    }

    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {/* Upload Area */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
            "hover:border-primary/50 hover:bg-primary/5",
            isDragActive && "border-primary bg-primary/10 scale-[1.02]",
            disabled && "opacity-50 cursor-not-allowed",
            "border-white/20 bg-white/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="space-y-4">
            <div className={cn(
              "mx-auto w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-200",
              "border-muted-foreground text-muted-foreground",
              isDragActive && "border-primary text-primary scale-110"
            )}>
              <Upload size={24} />
            </div>
            
            <div>
              <p className="text-sm font-medium text-foreground">
                {isDragActive ? dragActiveText : dragInactiveText}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {allowedTypes 
                  ? `Accepts: ${allowedTypes.join(', ')}`
                  : accept 
                    ? `Accepts: ${accept}`
                    : 'All file types accepted'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                Max size: {formatFileSize(maxSize)} • Max files: {maxFiles}
              </p>
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              className="bg-white/5 border-white/10 hover:bg-white/10"
            >
              Browse Files
            </Button>
          </div>
        </div>

        {/* File Previews */}
        {showPreview && files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              Uploaded Files ({files.length}/{maxFiles})
            </h4>
            
            <div className="space-y-2">
              {files.map((file, index) => {
                const progress = uploadProgress[file.name] || 0
                const error = fileErrors[file.name]
                
                return (
                  <div key={`${file.name}-${index}`} className="space-y-2">
                    <FilePreview
                      file={file}
                      onRemove={() => removeFile(index)}
                      error={error}
                    />
                    
                    {/* Progress Bar */}
                    {progress > 0 && progress < 100 && (
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all duration-300 animate-pulse"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
)

FileUpload.displayName = "FileUpload"

export { FileUpload }