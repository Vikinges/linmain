"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MediaUploader } from "@/components/admin/media-uploader"
import { uploadFile } from "@/lib/actions/upload"

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

      <MediaUploader
        label="Upload Media"
        accept="image/*,video/mp4,video/webm"
        maxSize={150}
        type="image"
        uploadAction={uploadFile}
        onUrlChange={() => loadAssets(query)}
      />

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
