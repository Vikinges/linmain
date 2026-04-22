"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type MediaAsset = {
  id: string
  url: string
  originalName: string
  mimeType: string
  size: number
  createdAt: string
}

type MediaLibraryProps = {
  onSelect?: (url: string) => void
}

/* ── Upload widget that uses fetch() to an API route ── */
function MediaUploadArea({ onUploaded }: { onUploaded: () => void }) {
  const MAX_SIZE_MB = 150
  const ACCEPT = "image/*,video/mp4,video/webm"

  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState("")
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError("")

    if (file.size / (1024 * 1024) > MAX_SIZE_MB) {
      setError(`File size must be less than ${MAX_SIZE_MB}MB`)
      return
    }

    const acceptedTypes = ACCEPT.split(",").map((t) => t.trim())
    const ok = acceptedTypes.some((t) => {
      if (t.endsWith("/*")) return file.type.startsWith(t.split("/")[0] + "/")
      return file.type === t
    })
    if (!ok) {
      setError(`Invalid file type. Accepted: ${ACCEPT}`)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      })

      const result = await res.json()

      if (result.success && result.url) {
        setPreview(result.url)
        onUploaded()
      } else {
        setError(result.error || "Upload failed")
        setPreview("")
      }
    } catch (err) {
      console.error("Upload error:", err)
      setError("An unexpected error occurred during upload")
      setPreview("")
    } finally {
      setIsUploading(false)
    }
  }

  const handleClear = () => {
    setPreview("")
    setError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-2">
      <Label>Upload Media</Label>
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer relative overflow-hidden",
          isDragging ? "border-primary bg-primary/5" : "border-white/20 hover:border-white/30",
          error && "border-red-500"
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <CardContent className="p-6">
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-sm font-medium">Uploading...</p>
            </div>
          )}

          {preview ? (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black/20">
                <Image src={preview} alt="Preview" width={640} height={160} unoptimized className="w-full h-40 object-cover" />
                <Button
                  size="icon" variant="destructive"
                  className="absolute top-2 right-2 z-10"
                  onClick={(e) => { e.stopPropagation(); handleClear() }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">Click or drag to replace</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Drop your image here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Max size: {MAX_SIZE_MB}MB</p>
              </div>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  )
}

export function MediaLibrary({ onSelect }: MediaLibraryProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  const loadAssets = async (q = "") => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (q) params.set("q", q)
      const response = await fetch(`/api/admin/media?${params.toString()}`, { cache: "no-store" })
      if (!response.ok) return
      const data = await response.json()
      setAssets(data.assets || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssets()
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return assets
    const q = query.trim().toLowerCase()
    return assets.filter((asset) =>
      asset.originalName.toLowerCase().includes(q) || asset.url.toLowerCase().includes(q)
    )
  }, [assets, query])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-white">Media Library</h3>
          <p className="text-sm text-muted-foreground">Upload and reuse images and videos.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search media..."
            className="w-64 bg-white/5 border-white/10"
          />
          <Button variant="outline" onClick={() => loadAssets(query)} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      <MediaUploadArea onUploaded={() => loadAssets(query)} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((asset) => (
          <Card key={asset.id} className="glass-card border-white/10">
            <CardContent className="pt-4 space-y-3">
              {asset.mimeType.startsWith("image/") ? (
                <Image
                  src={asset.url}
                  alt={asset.originalName}
                  width={600}
                  height={400}
                  className="w-full h-40 rounded-lg object-cover"
                />
              ) : (
                <video src={asset.url} className="w-full h-40 rounded-lg object-cover" muted controls />
              )}
              <div className="space-y-1">
                <p className="text-sm text-white truncate">{asset.originalName}</p>
                <p className="text-xs text-muted-foreground">{asset.url}</p>
              </div>
              <div className="flex items-center gap-2">
                {onSelect && (
                  <Button size="sm" onClick={() => onSelect(asset.url)}>
                    Use
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(asset.url)}
                >
                  Copy URL
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
