"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, X, Video, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MediaUploaderProps {
    accept?: string
    maxSize?: number // in MB
    onUpload?: (file: File) => void
    onUrlChange?: (url: string) => void
    currentUrl?: string
    label?: string
    type?: 'video' | 'image'
    uploadAction?: (formData: FormData) => Promise<{ success: boolean, url?: string, error?: string }>
}

export function MediaUploader({
    accept = "video/*",
    maxSize = 50,
    onUpload,
    onUrlChange,
    currentUrl = "",
    label = "Upload Media",
    type = 'video',
    uploadAction
}: MediaUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [preview, setPreview] = useState<string>(currentUrl)
    const [error, setError] = useState<string>("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            handleFile(files[0])
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFile(files[0])
        }
    }

    const handleFile = async (file: File) => {
        setError("")

        // Check file size
        const fileSizeMB = file.size / (1024 * 1024)
        if (fileSizeMB > maxSize) {
            setError(`File size must be less than ${maxSize}MB`)
            return
        }

        // Check file type
        const acceptedTypes = accept.split(',').map(t => t.trim())
        const isAccepted = acceptedTypes.some(type => {
            if (type.endsWith('/*')) {
                const prefix = type.split('/')[0]
                return file.type.startsWith(prefix + '/')
            }
            return file.type === type
        })

        if (!isAccepted) {
            setError(`Invalid file type. Accepted: ${accept}`)
            return
        }

        // Create object URL for immediate preview
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        // If uploadAction is provided, perform the upload
        if (uploadAction) {
            setIsUploading(true)
            try {
                const formData = new FormData()
                formData.append('file', file)

                const result = await uploadAction(formData)

                if (result.success && result.url) {
                    setPreview(result.url)
                    if (onUrlChange) {
                        onUrlChange(result.url)
                    }
                } else {
                    setError(result.error || "Upload failed")
                    // Revert preview if upload failed
                    setPreview(currentUrl)
                }
            } catch (err) {
                console.error("Upload error:", err)
                setError("An unexpected error occurred during upload")
            } finally {
                setIsUploading(false)
            }
        } else {
            // Fallback for local-only handling (e.g. blobs)
            if (onUrlChange) {
                onUrlChange(objectUrl)
            }
        }

        if (onUpload) {
            onUpload(file)
        }
    }

    const handleClear = () => {
        setPreview("")
        setError("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        if (onUrlChange) {
            onUrlChange("")
        }
    }

    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}

            <Card
                className={cn(
                    "border-2 border-dashed transition-colors cursor-pointer relative overflow-hidden",
                    isDragging ? "border-primary bg-primary/5" : "border-white/20 hover:border-white/30",
                    error && "border-red-500"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
            >
                <CardContent className="p-6">
                    {/* Loading Overlay */}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                            <p className="text-sm font-medium">Uploading...</p>
                        </div>
                    )}

                    {preview ? (
                        <div className="space-y-4">
                            <div className="relative rounded-lg overflow-hidden bg-black/20">
                                {type === 'video' ? (
                                    <video
                                        src={preview}
                                        className="w-full h-40 object-cover"
                                        controls
                                        muted
                                    />
                                ) : (
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        width={640}
                                        height={160}
                                        unoptimized
                                        className="w-full h-40 object-cover"
                                    />
                                )}
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute top-2 right-2 z-10"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleClear()
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-center text-muted-foreground">
                                Click or drag to replace
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                            <div className="p-3 rounded-full bg-primary/10">
                                {type === 'video' ? (
                                    <Video className="h-6 w-6 text-primary" />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-primary" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    Drop your {type} here or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Max size: {maxSize}MB
                                </p>
                            </div>
                            <Upload className="h-4 w-4 text-muted-foreground" />
                        </div>
                    )}
                </CardContent>
            </Card>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
            />
        </div>
    )
}
