"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  FileText,
  Image as ImageIcon,
  Plus,
  RefreshCcw,
  Settings2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MediaLibrary } from "@/components/editor/media-library"
import { defaultLanguage, languages, type Language } from "@/lib/i18n-config"
import type { HomepageContent } from "@/lib/content-config"
import { applyTheme, type ThemeConfig } from "@/lib/theme-config"

type PageSummary = {
  id: string
  slug: string
  title: string
  updatedAt: string
  publishedRevisionId?: string | null
  draftRevisionId?: string | null
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

export function EditorDashboard() {
  const [pages, setPages] = useState<PageSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)

  const loadPages = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/pages", { cache: "no-store" })
      if (!response.ok) throw new Error("Failed to load pages")
      const data = await response.json()
      setPages((data.pages || []) as PageSummary[])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPages()
  }, [])

  useEffect(() => {
    if (!slugTouched) {
      setSlug(slugify(title))
    }
  }, [title, slugTouched])

  const handleCreate = async () => {
    setCreating(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || "Failed to create page")
      }
      const data = await response.json()
      const page = data.page as PageSummary
      window.location.href = `/admin/editor/${page.id}`
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create error")
    } finally {
      setCreating(false)
    }
  }

  return (
    <Tabs defaultValue="pages" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Editor</h1>
          <p className="text-muted-foreground">
            Manage pages, content, and media.
          </p>
        </div>
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="pages" className="data-[state=active]:bg-white/10">
            <FileText className="mr-2 h-4 w-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="global" className="data-[state=active]:bg-white/10">
            <Settings2 className="mr-2 h-4 w-4" />
            Design & Theme
          </TabsTrigger>
          <TabsTrigger value="media" className="data-[state=active]:bg-white/10">
            <ImageIcon className="mr-2 h-4 w-4" />
            Media
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="pages" className="space-y-6">
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Create Page</h2>
                <p className="text-sm text-muted-foreground">
                  Use a slug without spaces for public pages.
                </p>
              </div>
              <Button variant="outline" onClick={loadPages} disabled={loading}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm text-gray-300">Title</Label>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-300">Slug</Label>
                <Input
                  value={slug}
                  onChange={(event) => {
                    setSlug(event.target.value)
                    setSlugTouched(true)
                  }}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
            <Button onClick={handleCreate} disabled={creating || !slug.trim()}>
              <Plus className="mr-2 h-4 w-4" />
              {creating ? "Creating..." : "Create"}
            </Button>
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Pages List</h2>
            <p className="text-sm text-muted-foreground">
              Click a page row or the Edit button to open the editor.
            </p>
            {loading && (
              <div className="text-sm text-gray-400">Loading...</div>
            )}
            {!loading && pages.length === 0 && (
              <div className="text-sm text-gray-400">No pages yet.</div>
            )}
            <div className="space-y-3">
              {pages.map((page) => {
                const isPublished = Boolean(page.publishedRevisionId)
                const editId = page.id || page.slug
                const editHref = editId ? `/admin/editor/${editId}` : "/admin/editor"
                const previewHref = page.slug === "home" ? "/" : `/p/${page.slug}`
                return (
                  <div
                    key={page.id || page.slug}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-white/5 px-4 py-3 cursor-pointer transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      window.location.href = editHref
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        window.location.href = editHref
                      }
                    }}
                    aria-label={`Edit page ${page.title}`}
                  >
                    <div>
                      <p className="text-sm text-white">{page.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {page.slug === "home" ? "/" : `/p/${page.slug}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          isPublished
                            ? "bg-emerald-500/20 text-emerald-200"
                            : "bg-yellow-500/20 text-yellow-200"
                        }`}
                      >
                        {isPublished ? "Published" : "Draft"}
                      </span>
                      <Button
                        asChild
                        variant="default"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Link href={editHref}>Edit</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Link href={previewHref} target="_blank" rel="noreferrer">
                          Preview
                        </Link>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="global">
        <GlobalSettingsEditor />
      </TabsContent>

      <TabsContent value="media">
        <MediaLibrary />
      </TabsContent>
    </Tabs>
  )
}

const clampNumber = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const swatchValue = /^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"

  return (
    <div className="space-y-2">
      <Label className="text-sm text-gray-300">{label}</Label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={swatchValue}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-12 rounded-md border border-white/20 bg-transparent"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="bg-white/5 border-white/10"
        />
      </div>
    </div>
  )
}

function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
}) {
  const clampedValue = clampNumber(value, min, max)

  return (
    <div className="space-y-2">
      <Label className="text-sm text-gray-300">{label}</Label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clampedValue}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full accent-primary"
        />
        <Input
          type="number"
          min={min}
          max={max}
          step={step}
          value={clampedValue}
          onChange={(event) =>
            onChange(clampNumber(Number(event.target.value), min, max))
          }
          className="w-24 bg-white/5 border-white/10"
        />
      </div>
    </div>
  )
}

function GlobalSettingsEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [content, setContent] = useState<HomepageContent | null>(null)
  const [theme, setTheme] = useState<ThemeConfig | null>(null)
  const [language, setLanguage] = useState<Language>(defaultLanguage)
  const [mediaOpen, setMediaOpen] = useState(false)
  const mediaTargetRef = useRef<((url: string) => void) | null>(null)

  useEffect(() => {
    const loadConfig = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/site-config", { cache: "no-store" })
        if (!response.ok) throw new Error("Failed to load settings")
        const data = await response.json()
        setContent(data.content as HomepageContent)
        setTheme(data.theme as ThemeConfig)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Load error")
      } finally {
        setLoading(false)
      }
    }
    loadConfig()
  }, [])

  useEffect(() => {
    if (theme) {
      applyTheme(theme)
    }
  }, [theme])

  const updateContent = (updater: (value: HomepageContent) => HomepageContent) => {
    setContent((prev) => (prev ? updater(prev) : prev))
  }

  const updateTheme = (updater: (value: ThemeConfig) => ThemeConfig) => {
    setTheme((prev) => (prev ? updater(prev) : prev))
  }

  const handleSave = async () => {
    if (!content || !theme) return
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      const response = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, theme }),
      })
      if (!response.ok) throw new Error("Failed to save settings")
      setNotice("Settings saved.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save error")
    } finally {
      setSaving(false)
    }
  }

  const openMediaPicker = (onSelect: (url: string) => void) => {
    mediaTargetRef.current = onSelect
    setMediaOpen(true)
  }

  if (loading || !content || !theme) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-gray-300">
        Loading settings...
      </div>
    )
  }

  const localeOverrides = content.locales?.[language]

  return (
    <div className="space-y-6">
      <Card className="glass-card border-white/10">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Navigation & Footer</h2>
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Nav Button Label</Label>
              <Input
                value={localeOverrides?.nav?.getStarted || ""}
                onChange={(event) =>
                  updateContent((prev) => {
                    const next = { ...prev }
                    next.locales = { ...prev.locales }
                    next.locales[language] = {
                      ...prev.locales?.[language],
                      nav: {
                        ...(prev.locales?.[language]?.nav || {}),
                        getStarted: event.target.value,
                      },
                    }
                    if (language === "en") {
                      next.nav = { ...prev.nav, getStarted: event.target.value }
                    }
                    return next
                  })
                }
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Copyright Text</Label>
              <Input
                value={localeOverrides?.footer?.copyright || ""}
                onChange={(event) =>
                  updateContent((prev) => {
                    const next = { ...prev }
                    next.locales = { ...prev.locales }
                    next.locales[language] = {
                      ...prev.locales?.[language],
                      footer: {
                        ...(prev.locales?.[language]?.footer || {}),
                        copyright: event.target.value,
                      },
                    }
                    if (language === "en") {
                      next.footer = { ...prev.footer, copyright: event.target.value }
                    }
                    return next
                  })
                }
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/10">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Logo & Social</h2>
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Logo URL</Label>
              <Input
                value={content.media?.logoUrl || ""}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    media: { ...prev.media, logoUrl: event.target.value },
                  }))
                }
                className="bg-white/5 border-white/10"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                openMediaPicker((url) =>
                  updateContent((prev) => ({
                    ...prev,
                    media: { ...prev.media, logoUrl: url },
                  }))
                )
              }
            >
              Choose
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">LinkedIn URL</Label>
              <Input
                value={content.social?.linkedinUrl || ""}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    social: { ...prev.social, linkedinUrl: event.target.value },
                  }))
                }
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">YouTube URL</Label>
              <Input
                value={content.social?.youtubeUrl || ""}
                onChange={(event) =>
                  updateContent((prev) => ({
                    ...prev,
                    social: { ...prev.social, youtubeUrl: event.target.value },
                  }))
                }
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/10">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Theme & Colors</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <ColorField
              label="Primary"
              value={theme.colors.primary}
              onChange={(value) =>
                updateTheme((prev) => ({
                  ...prev,
                  colors: { ...prev.colors, primary: value },
                }))
              }
            />
            <ColorField
              label="Secondary"
              value={theme.colors.secondary}
              onChange={(value) =>
                updateTheme((prev) => ({
                  ...prev,
                  colors: { ...prev.colors, secondary: value },
                }))
              }
            />
            <ColorField
              label="Accent"
              value={theme.colors.accent}
              onChange={(value) =>
                updateTheme((prev) => ({
                  ...prev,
                  colors: { ...prev.colors, accent: value },
                }))
              }
            />
            <ColorField
              label="Background"
              value={theme.colors.background}
              onChange={(value) =>
                updateTheme((prev) => ({
                  ...prev,
                  colors: { ...prev.colors, background: value },
                }))
              }
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <RangeField
              label="Base font size"
              value={theme.typography.fontSize}
              min={12}
              max={20}
              step={1}
              onChange={(value) =>
                updateTheme((prev) => ({
                  ...prev,
                  typography: { ...prev.typography, fontSize: value },
                }))
              }
            />
            <RangeField
              label="Corner radius"
              value={theme.borders.radius}
              min={6}
              max={20}
              step={1}
              onChange={(value) =>
                updateTheme((prev) => ({
                  ...prev,
                  borders: { ...prev.borders, radius: value },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/10">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Background</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Video URL</Label>
              <Input
                value={theme.background.videoUrl || ""}
                onChange={(event) =>
                  updateTheme((prev) => ({
                    ...prev,
                    background: { ...prev.background, videoUrl: event.target.value },
                  }))
                }
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Fallback Image</Label>
              <Input
                value={theme.background.fallbackImage || ""}
                onChange={(event) =>
                  updateTheme((prev) => ({
                    ...prev,
                    background: { ...prev.background, fallbackImage: event.target.value },
                  }))
                }
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <RangeField
                label="Blur (px)"
                value={theme.background.blurAmount}
                min={0}
                max={60}
                step={1}
                onChange={(value) =>
                  updateTheme((prev) => ({
                    ...prev,
                    background: { ...prev.background, blurAmount: value },
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <RangeField
                label="Opacity (0-100)"
                value={theme.background.opacity}
                min={0}
                max={100}
                step={1}
                onChange={(value) =>
                  updateTheme((prev) => ({
                    ...prev,
                    background: { ...prev.background, opacity: value },
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        {notice && <p className="text-sm text-emerald-200">{notice}</p>}
        {error && <p className="text-sm text-red-200">{error}</p>}
      </div>

      <Dialog open={mediaOpen} onOpenChange={setMediaOpen}>
        <DialogContent className="max-w-5xl bg-gray-950 text-white">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
          </DialogHeader>
          <MediaLibrary
            onSelect={(url) => {
              mediaTargetRef.current?.(url)
              setMediaOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
