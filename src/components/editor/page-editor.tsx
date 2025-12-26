"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Copy,
  Eye,
  GripVertical,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
  Wand2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { MediaLibrary } from "@/components/editor/media-library"
import { createBlock } from "@/lib/editor/factory"
import { getLocalizedValue, setLocalizedValue } from "@/lib/editor/locales"
import { defaultLanguage, languages, type Language } from "@/lib/i18n-config"
import type {
  LocalizedHtml,
  LocalizedString,
  PageBlock,
} from "@/lib/editor/types"
import { cn } from "@/lib/utils"

const BLOCK_OPTIONS: Array<{ value: PageBlock["type"]; label: string }> = [
  { value: "hero", label: "Hero" },
  { value: "portfolio", label: "Portfolio" },
  { value: "richText", label: "Rich Text" },
  { value: "imageText", label: "Image + Text" },
  { value: "image", label: "Image" },
  { value: "gallery", label: "Gallery" },
  { value: "video", label: "Video" },
  { value: "cta", label: "Call To Action" },
  { value: "faq", label: "FAQ" },
  { value: "contact", label: "Contact" },
  { value: "social", label: "Social Links" },
  { value: "chat", label: "Chat" },
  { value: "divider", label: "Divider" },
  { value: "spacer", label: "Spacer" },
]

const isReadableText = (value: string | undefined) => {
  if (!value) return false
  const trimmed = value.trim()
  if (!trimmed) return false
  if (/^\?+$/.test(trimmed)) return false
  if (/[\u00d0\u00d1]/.test(trimmed)) return false
  return /[\p{L}\p{N}]/u.test(trimmed)
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ")

const isReadableHtml = (value: string | undefined) => {
  if (!value) return false
  return isReadableText(stripHtml(value))
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `block-${Date.now()}-${Math.random().toString(16).slice(2)}`

type PageResponse = {
  id: string
  slug: string
  title: string
  updatedAt: string
  publishedRevisionId?: string | null
  draftRevisionId?: string | null
  publishedRevision?: {
    id: string
    title: string
    blocks: unknown
    createdAt: string
  } | null
  draftRevision?: {
    id: string
    title: string
    blocks: unknown
    createdAt: string
  } | null
}

type RevisionResponse = {
  id: string
  title: string
  createdAt: string
}

type PageEditorProps = {
  pageId: string
}

function SortableBlock({
  block,
  onRemove,
  onDuplicate,
  onTranslate,
  isTranslating,
  children,
}: {
  block: PageBlock
  onRemove: () => void
  onDuplicate: () => void
  onTranslate: () => void
  isTranslating: boolean
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const label =
    BLOCK_OPTIONS.find((option) => option.value === block.type)?.label ||
    block.type

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-2xl border border-white/10 bg-black/30 shadow-lg shadow-black/20",
        isDragging && "opacity-70"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="cursor-grab text-gray-400 hover:text-gray-200"
            {...attributes}
            {...listeners}
            aria-label="Move block"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-white">{label}</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-300">
            {block.type}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onTranslate}
            disabled={isTranslating}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {isTranslating ? "Translating..." : "Translate"}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-red-500/40 text-red-200 hover:bg-red-500/20"
            onClick={onRemove}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
      <div className="space-y-4 px-4 py-4">{children}</div>
    </div>
  )
}

function LocalizedInput({
  label,
  value,
  language,
  onChange,
  onTranslate,
  placeholder,
}: {
  label: string
  value: LocalizedString
  language: Language
  onChange: (value: LocalizedString) => void
  onTranslate?: () => void
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-gray-300">{label}</Label>
        {onTranslate && (
          <Button type="button" size="xs" variant="ghost" onClick={onTranslate}>
            Translate
          </Button>
        )}
      </div>
      <Input
        value={getLocalizedValue(value, language)}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(setLocalizedValue(value, language, event.target.value))
        }
        className="bg-white/5 border-white/10"
      />
    </div>
  )
}

function LocalizedTextarea({
  label,
  value,
  language,
  onChange,
  onTranslate,
  placeholder,
}: {
  label: string
  value: LocalizedString
  language: Language
  onChange: (value: LocalizedString) => void
  onTranslate?: () => void
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-gray-300">{label}</Label>
        {onTranslate && (
          <Button type="button" size="xs" variant="ghost" onClick={onTranslate}>
            Translate
          </Button>
        )}
      </div>
      <Textarea
        value={getLocalizedValue(value, language)}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(setLocalizedValue(value, language, event.target.value))
        }
        className="bg-white/5 border-white/10"
      />
    </div>
  )
}

function LocalizedRichText({
  label,
  value,
  language,
  onChange,
  onTranslate,
  placeholder,
}: {
  label: string
  value: LocalizedHtml
  language: Language
  onChange: (value: LocalizedHtml) => void
  onTranslate?: () => void
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-gray-300">{label}</Label>
        {onTranslate && (
          <Button type="button" size="xs" variant="ghost" onClick={onTranslate}>
            Translate
          </Button>
        )}
      </div>
      <RichTextEditor
        value={getLocalizedValue(value, language)}
        placeholder={placeholder}
        onChange={(next) => onChange(setLocalizedValue(value, language, next))}
      />
    </div>
  )
}

export function PageEditor({ pageId }: PageEditorProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [page, setPage] = useState<PageResponse | null>(null)
  const [title, setTitle] = useState("")
  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const [revisions, setRevisions] = useState<RevisionResponse[]>([])
  const [language, setLanguage] = useState<Language>(defaultLanguage)
  const [selectedBlockType, setSelectedBlockType] = useState<PageBlock["type"]>(
    "richText"
  )
  const [mediaOpen, setMediaOpen] = useState(false)
  const mediaTargetRef = useRef<((url: string) => void) | null>(null)
  const [translatingBlockId, setTranslatingBlockId] = useState<string | null>(
    null
  )

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const previewUrl = useMemo(() => {
    if (!page?.slug) return "#"
    return page.slug === "home" ? "/" : `/p/${page.slug}`
  }, [page?.slug])

  const openMediaPicker = (onSelect: (url: string) => void) => {
    mediaTargetRef.current = onSelect
    setMediaOpen(true)
  }

  const loadPage = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        cache: "no-store",
      })
      if (!response.ok) {
        throw new Error("Failed to load page")
      }
      const data = await response.json()
      const loadedPage = data.page as PageResponse
      const draftBlocks = (loadedPage.draftRevision?.blocks as PageBlock[]) || []
      const publishedBlocks =
        (loadedPage.publishedRevision?.blocks as PageBlock[]) || []
      const nextBlocks = draftBlocks.length > 0 ? draftBlocks : publishedBlocks
      setPage(loadedPage)
      setTitle(loadedPage.title)
      setBlocks(nextBlocks)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load error")
    } finally {
      setLoading(false)
    }
  }, [pageId])

  const loadRevisions = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/pages/${pageId}/revisions`, {
        cache: "no-store",
      })
      if (!response.ok) return
      const data = await response.json()
      setRevisions((data.revisions || []) as RevisionResponse[])
    } catch {
      // ignore
    }
  }, [pageId])

  useEffect(() => {
    loadPage().then(loadRevisions)
  }, [loadPage, loadRevisions])

  const handleSave = async () => {
    if (!page) return
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, blocks }),
      })
      if (!response.ok) {
        throw new Error("Failed to save draft")
      }
      const data = await response.json()
      setPage(data.page as PageResponse)
      setNotice("Draft saved.")
      await loadRevisions()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save error")
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!page) return
    setPublishing(true)
    setError(null)
    setNotice(null)
    try {
      const response = await fetch(`/api/admin/pages/${pageId}/publish`, {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error("Failed to publish")
      }
      const data = await response.json()
      setPage(data.page as PageResponse)
      setNotice("Published.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish error")
    } finally {
      setPublishing(false)
    }
  }

  const handleDelete = async () => {
    if (!page) return
    if (!confirm("Delete this page? This cannot be undone.")) return
    setSaving(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete page")
      }
      window.location.href = "/admin/editor"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete error")
    } finally {
      setSaving(false)
    }
  }

  const handleRevert = async (revisionId: string) => {
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      const response = await fetch(`/api/admin/pages/${pageId}/revert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revisionId }),
      })
      if (!response.ok) {
        throw new Error("Failed to revert revision")
      }
      const data = await response.json()
      setPage(data.page as PageResponse)
      const draftBlocks = (data.page?.draftRevision?.blocks as PageBlock[]) || []
      setBlocks(draftBlocks)
      setNotice("Revision restored.")
      await loadRevisions()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revert error")
    } finally {
      setSaving(false)
    }
  }

  const handleAddBlock = () => {
    const newBlock = createBlock(selectedBlockType)
    setBlocks((prev) => [...prev, newBlock])
  }

  const updateBlock = (id: string, updater: (block: PageBlock) => PageBlock) => {
    setBlocks((prev) => prev.map((block) => (block.id === id ? updater(block) : block)))
  }

  const handleDuplicateBlock = (block: PageBlock) => {
    const clone =
      typeof structuredClone === "function"
        ? structuredClone(block)
        : JSON.parse(JSON.stringify(block))
    clone.id = newId()
    setBlocks((prev) => [...prev, clone])
  }

  const handleRemoveBlock = (id: string) => {
    if (!confirm("Delete block?")) return
    setBlocks((prev) => prev.filter((block) => block.id !== id))
  }

  const handleDragEnd = (event: { active: { id: string }; over: { id: string } | null }) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setBlocks((prev) => {
      const oldIndex = prev.findIndex((block) => block.id === active.id)
      const newIndex = prev.findIndex((block) => block.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  const translateRequest = async (
    text: string,
    target: Language,
    format: "text" | "html"
  ) => {
    const response = await fetch("/api/admin/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: [text], target, source: "auto", format }),
    })
    if (!response.ok) {
      throw new Error("Translate failed")
    }
    const data = await response.json()
    return (data.translations?.[0] as string) || ""
  }

  const translateLocalized = async <T extends LocalizedString | LocalizedHtml>(
    value: T,
    format: "text" | "html"
  ): Promise<T> => {
    const sourceText = getLocalizedValue(value, language).trim()
    if (!sourceText) return value

    const targets = languages
      .map((lang) => lang.code)
      .filter((code) => code !== language)
      .filter((code) => {
        const existing = value[code]
        return format === "html" ? !isReadableHtml(existing) : !isReadableText(existing)
      })

    if (!targets.length) return value

    const translated = await Promise.all(
      targets.map((target) => translateRequest(sourceText, target, format))
    )

    const next = { ...value }
    targets.forEach((target, index) => {
      next[target] = translated[index]
    })

    return next
  }

  const translateBlock = async (block: PageBlock): Promise<PageBlock> => {
    switch (block.type) {
      case "hero":
        return {
          ...block,
          data: {
            ...block.data,
            badge: await translateLocalized(block.data.badge, "text"),
            title: await translateLocalized(block.data.title, "text"),
            subtitle: await translateLocalized(block.data.subtitle, "text"),
            description: await translateLocalized(block.data.description, "html"),
            primaryCta: {
              ...block.data.primaryCta,
              label: await translateLocalized(block.data.primaryCta.label, "text"),
            },
            secondaryCta: {
              ...block.data.secondaryCta,
              label: await translateLocalized(block.data.secondaryCta.label, "text"),
            },
            image: {
              ...block.data.image,
              alt: await translateLocalized(block.data.image.alt, "text"),
            },
          },
        }
      case "richText":
        return {
          ...block,
          data: {
            ...block.data,
            content: await translateLocalized(block.data.content, "html"),
          },
        }
      case "image":
        return {
          ...block,
          data: {
            ...block.data,
            alt: await translateLocalized(block.data.alt, "text"),
            caption: await translateLocalized(block.data.caption, "text"),
          },
        }
      case "imageText":
        return {
          ...block,
          data: {
            ...block.data,
            content: await translateLocalized(block.data.content, "html"),
            image: {
              ...block.data.image,
              alt: await translateLocalized(block.data.image.alt, "text"),
            },
          },
        }
      case "gallery":
        return {
          ...block,
          data: {
            ...block.data,
            images: await Promise.all(
              block.data.images.map(async (image) => ({
                ...image,
                alt: await translateLocalized(image.alt, "text"),
                caption: await translateLocalized(image.caption, "text"),
              }))
            ),
          },
        }
      case "video":
        return {
          ...block,
          data: {
            ...block.data,
            title: await translateLocalized(block.data.title, "text"),
          },
        }
      case "portfolio":
        return {
          ...block,
          data: {
            ...block.data,
            title: await translateLocalized(block.data.title, "text"),
            subtitle: await translateLocalized(block.data.subtitle, "text"),
            items: await Promise.all(
              block.data.items.map(async (item) => ({
                ...item,
                title: await translateLocalized(item.title, "text"),
                description: await translateLocalized(item.description, "html"),
                linkLabel: await translateLocalized(item.linkLabel, "text"),
              }))
            ),
          },
        }
      case "cta":
        return {
          ...block,
          data: {
            ...block.data,
            title: await translateLocalized(block.data.title, "text"),
            description: await translateLocalized(block.data.description, "text"),
            buttonLabel: await translateLocalized(block.data.buttonLabel, "text"),
          },
        }
      case "faq":
        return {
          ...block,
          data: {
            ...block.data,
            title: await translateLocalized(block.data.title, "text"),
            items: await Promise.all(
              block.data.items.map(async (item) => ({
                ...item,
                question: await translateLocalized(item.question, "text"),
                answer: await translateLocalized(item.answer, "html"),
              }))
            ),
          },
        }
      case "contact":
        return {
          ...block,
          data: {
            ...block.data,
            title: await translateLocalized(block.data.title, "text"),
            description: await translateLocalized(block.data.description, "text"),
            address: await translateLocalized(block.data.address, "text"),
          },
        }
      case "social":
        return {
          ...block,
          data: {
            ...block.data,
            title: await translateLocalized(block.data.title, "text"),
            links: await Promise.all(
              block.data.links.map(async (link) => ({
                ...link,
                label: await translateLocalized(link.label, "text"),
              }))
            ),
          },
        }
      case "chat":
        return {
          ...block,
          data: {
            ...block.data,
            title: await translateLocalized(block.data.title, "text"),
            description: await translateLocalized(block.data.description, "text"),
          },
        }
      default:
        return block
    }
  }

  const handleTranslateBlock = async (block: PageBlock) => {
    setTranslatingBlockId(block.id)
    setError(null)
    try {
      const updated = await translateBlock(block)
      updateBlock(block.id, () => updated)
      setNotice("Translation complete.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation error")
    } finally {
      setTranslatingBlockId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-12 text-gray-300">
        Loading editor...
      </div>
    )
  }

  if (!page) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 p-12 text-gray-300">
        Page not found.
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card className="glass-card border-white/10">
        <CardContent className="pt-6 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Page Title</Label>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="bg-white/5 border-white/10"
              />
              <p className="text-xs text-gray-400">
                URL: {page.slug === "home" ? "/" : `/p/${page.slug}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
              <Button asChild variant="outline">
                <Link href={previewUrl} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  loadPage().then(loadRevisions)
                }}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button type="button" onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handlePublish}
                disabled={publishing}
              >
                {publishing ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </div>
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
              {error}
            </div>
          )}
          {notice && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
              {notice}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-white">Blocks</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={selectedBlockType}
              onValueChange={(value) => setSelectedBlockType(value as PageBlock["type"])}
            >
              <SelectTrigger className="w-[200px] bg-white/5 border-white/10">
                <SelectValue placeholder="Block" />
              </SelectTrigger>
              <SelectContent>
                {BLOCK_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={handleAddBlock}>
              <Plus className="mr-2 h-4 w-4" />
              Add Block
            </Button>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {blocks.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-10 text-center text-gray-400">
                  No blocks yet. Add the first block.
                </div>
              )}
              {blocks.map((block) => (
                <SortableBlock
                  key={block.id}
                  block={block}
                  onRemove={() => handleRemoveBlock(block.id)}
                  onDuplicate={() => handleDuplicateBlock(block)}
                  onTranslate={() => handleTranslateBlock(block)}
                  isTranslating={translatingBlockId === block.id}
                >
                  <BlockFields
                    block={block}
                    language={language}
                    onChange={(next) => updateBlock(block.id, () => next)}
                    openMediaPicker={openMediaPicker}
                  />
                </SortableBlock>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <Card className="glass-card border-white/10">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Revision History</h3>
            <span className="text-xs text-gray-400">Shows up to 10 revisions.</span>
          </div>
          <div className="space-y-3">
            {revisions.length === 0 && (
              <div className="text-sm text-gray-400">No revisions yet.</div>
            )}
            {revisions.map((revision) => (
              <div key={revision.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
                <div>
                  <p className="text-sm text-white">{revision.title}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(revision.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleRevert(revision.id)}
                >
                  Revert
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-red-500/20">
        <CardContent className="pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-red-200">Danger Zone</h3>
          <p className="text-sm text-gray-400">
            Delete the page and all revisions. This cannot be undone.
          </p>
          <Button
            type="button"
            variant="outline"
            className="border-red-500/40 text-red-200 hover:bg-red-500/20"
            onClick={handleDelete}
            disabled={saving}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Page
          </Button>
        </CardContent>
      </Card>

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

function BlockFields({
  block,
  language,
  onChange,
  openMediaPicker,
}: {
  block: PageBlock
  language: Language
  onChange: (block: PageBlock) => void
  openMediaPicker: (onSelect: (url: string) => void) => void
}) {
  const updateData = (data: PageBlock["data"]) => onChange({ ...block, data } as PageBlock)

  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-4">
          <LocalizedInput
            label="Badge"
            value={block.data.badge}
            language={language}
            onChange={(value) => updateData({ ...block.data, badge: value })}
          />
          <LocalizedInput
            label="Title"
            value={block.data.title}
            language={language}
            onChange={(value) => updateData({ ...block.data, title: value })}
          />
          <LocalizedInput
            label="Subtitle"
            value={block.data.subtitle}
            language={language}
            onChange={(value) => updateData({ ...block.data, subtitle: value })}
          />
          <LocalizedRichText
            label="Description"
            value={block.data.description}
            language={language}
            onChange={(value) => updateData({ ...block.data, description: value })}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <LocalizedInput
              label="Primary CTA Label"
              value={block.data.primaryCta.label}
              language={language}
              onChange={(value) =>
                updateData({
                  ...block.data,
                  primaryCta: { ...block.data.primaryCta, label: value },
                })
              }
            />
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Primary CTA URL</Label>
              <Input
                value={block.data.primaryCta.url}
                onChange={(event) =>
                  updateData({
                    ...block.data,
                    primaryCta: {
                      ...block.data.primaryCta,
                      url: event.target.value,
                    },
                  })
                }
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <LocalizedInput
              label="Secondary CTA Label"
              value={block.data.secondaryCta.label}
              language={language}
              onChange={(value) =>
                updateData({
                  ...block.data,
                  secondaryCta: { ...block.data.secondaryCta, label: value },
                })
              }
            />
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Secondary CTA URL</Label>
              <Input
                value={block.data.secondaryCta.url}
                onChange={(event) =>
                  updateData({
                    ...block.data,
                    secondaryCta: {
                      ...block.data.secondaryCta,
                      url: event.target.value,
                    },
                  })
                }
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Hero Image URL</Label>
              <Input
                value={block.data.image.url}
                onChange={(event) =>
                  updateData({
                    ...block.data,
                    image: { ...block.data.image, url: event.target.value },
                  })
                }
                className="bg-white/5 border-white/10"
              />
            </div>
            <Button type="button" variant="outline" onClick={() => openMediaPicker((url) =>
              updateData({
                ...block.data,
                image: { ...block.data.image, url },
              })
            )}
            >
              Choose
            </Button>
          </div>
          <LocalizedInput
            label="Image Alt"
            value={block.data.image.alt}
            language={language}
            onChange={(value) =>
              updateData({ ...block.data, image: { ...block.data.image, alt: value } })
            }
          />
        </div>
      )
    case "richText":
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[200px_1fr]">
            <Label className="text-sm text-gray-300">Width</Label>
            <Select
              value={block.data.width}
              onValueChange={(value) =>
                updateData({
                  ...block.data,
                  width: value as "full" | "narrow",
                })
              }
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="narrow">Narrow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <LocalizedRichText
            label="Content"
            value={block.data.content}
            language={language}
            onChange={(value) => updateData({ ...block.data, content: value })}
          />
        </div>
      )
    case "image":
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Image URL</Label>
              <Input
                value={block.data.url}
                onChange={(event) =>
                  updateData({ ...block.data, url: event.target.value })
                }
                className="bg-white/5 border-white/10"
              />
            </div>
            <Button type="button" variant="outline" onClick={() => openMediaPicker((url) =>
              updateData({ ...block.data, url })
            )}
            >
              Choose
            </Button>
          </div>
          <LocalizedInput
            label="Alt"
            value={block.data.alt}
            language={language}
            onChange={(value) => updateData({ ...block.data, alt: value })}
          />
          <LocalizedTextarea
            label="Caption"
            value={block.data.caption}
            language={language}
            onChange={(value) => updateData({ ...block.data, caption: value })}
          />
        </div>
      )
    case "imageText":
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Image URL</Label>
              <Input
                value={block.data.image.url}
                onChange={(event) =>
                  updateData({
                    ...block.data,
                    image: { ...block.data.image, url: event.target.value },
                  })
                }
                className="bg-white/5 border-white/10"
              />
            </div>
            <Button type="button" variant="outline" onClick={() => openMediaPicker((url) =>
              updateData({
                ...block.data,
                image: { ...block.data.image, url },
              })
            )}
            >
              Choose
            </Button>
          </div>
          <LocalizedInput
            label="Image Alt"
            value={block.data.image.alt}
            language={language}
            onChange={(value) =>
              updateData({ ...block.data, image: { ...block.data.image, alt: value } })
            }
          />
          <div className="grid gap-4 md:grid-cols-[200px_1fr]">
            <Label className="text-sm text-gray-300">Align</Label>
            <Select
              value={block.data.align}
              onValueChange={(value) =>
                updateData({
                  ...block.data,
                  align: value as "left" | "right",
                })
              }
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Align" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <LocalizedRichText
            label="Content"
            value={block.data.content}
            language={language}
            onChange={(value) => updateData({ ...block.data, content: value })}
          />
        </div>
      )
    case "gallery":
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-300">Images</Label>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                updateData({
                  ...block.data,
                  images: [
                    ...block.data.images,
                    {
                      id: newId(),
                      url: "",
                      alt: { en: "", de: "", ru: "" },
                      caption: { en: "", de: "", ru: "" },
                    },
                  ],
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </div>
          <div className="space-y-4">
            {block.data.images.map((image) => (
              <div key={image.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-300">Image</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-red-500/40 text-red-200"
                    onClick={() =>
                      updateData({
                        ...block.data,
                        images: block.data.images.filter((item) => item.id !== image.id),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
                <div className="mt-3 grid gap-4 md:grid-cols-[1fr_auto]">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-300">Image URL</Label>
                    <Input
                      value={image.url}
                      onChange={(event) =>
                        updateData({
                          ...block.data,
                          images: block.data.images.map((item) =>
                            item.id === image.id ? { ...item, url: event.target.value } : item
                          ),
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      openMediaPicker((url) =>
                        updateData({
                          ...block.data,
                          images: block.data.images.map((item) =>
                            item.id === image.id ? { ...item, url } : item
                          ),
                        })
                      )
                    }
                  >
                    Choose
                  </Button>
                </div>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <LocalizedInput
                    label="Alt"
                    value={image.alt}
                    language={language}
                    onChange={(value) =>
                      updateData({
                        ...block.data,
                        images: block.data.images.map((item) =>
                          item.id === image.id ? { ...item, alt: value } : item
                        ),
                      })
                    }
                  />
                  <LocalizedTextarea
                    label="Caption"
                    value={image.caption}
                    language={language}
                    onChange={(value) =>
                      updateData({
                        ...block.data,
                        images: block.data.images.map((item) =>
                          item.id === image.id ? { ...item, caption: value } : item
                        ),
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    case "video":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Video URL</Label>
            <Input
              value={block.data.url}
              onChange={(event) => updateData({ ...block.data, url: event.target.value })}
              className="bg-white/5 border-white/10"
            />
          </div>
          <LocalizedInput
            label="Title"
            value={block.data.title}
            language={language}
            onChange={(value) => updateData({ ...block.data, title: value })}
          />
        </div>
      )
    case "portfolio":
      return (
        <div className="space-y-6">
          <LocalizedInput
            label="Section Title"
            value={block.data.title}
            language={language}
            onChange={(value) => updateData({ ...block.data, title: value })}
          />
          <LocalizedTextarea
            label="Section Subtitle"
            value={block.data.subtitle}
            language={language}
            onChange={(value) => updateData({ ...block.data, subtitle: value })}
          />
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-300">Items</Label>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                updateData({
                  ...block.data,
                  items: [
                    ...block.data.items,
                    {
                      id: newId(),
                      kind: "map",
                      title: { en: "", de: "", ru: "" },
                      description: { en: "", de: "", ru: "" },
                      embedUrl: "",
                      imageUrl: "",
                      linkLabel: { en: "", de: "", ru: "" },
                      linkUrl: "",
                    },
                  ],
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          <div className="space-y-4">
            {block.data.items.map((item) => (
              <div key={item.id} className="rounded-lg border border-white/10 bg-black/20 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-300">Portfolio Item</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-red-500/40 text-red-200"
                    onClick={() =>
                      updateData({
                        ...block.data,
                        items: block.data.items.filter((entry) => entry.id !== item.id),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-[200px_1fr]">
                  <Label className="text-sm text-gray-300">Type</Label>
                  <Select
                    value={item.kind}
                    onValueChange={(value) =>
                      updateData({
                        ...block.data,
                        items: block.data.items.map((entry) =>
                          entry.id === item.id ? { ...entry, kind: value as typeof item.kind } : entry
                        ),
                      })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="map">Map</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <LocalizedInput
                  label="Title"
                  value={item.title}
                  language={language}
                  onChange={(value) =>
                    updateData({
                      ...block.data,
                      items: block.data.items.map((entry) =>
                        entry.id === item.id ? { ...entry, title: value } : entry
                      ),
                    })
                  }
                />
                <LocalizedRichText
                  label="Description"
                  value={item.description}
                  language={language}
                  onChange={(value) =>
                    updateData({
                      ...block.data,
                      items: block.data.items.map((entry) =>
                        entry.id === item.id ? { ...entry, description: value } : entry
                      ),
                    })
                  }
                />
                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-300">Embed URL</Label>
                    <Input
                      value={item.embedUrl}
                      onChange={(event) =>
                        updateData({
                          ...block.data,
                          items: block.data.items.map((entry) =>
                            entry.id === item.id ? { ...entry, embedUrl: event.target.value } : entry
                          ),
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      openMediaPicker((url) =>
                        updateData({
                          ...block.data,
                          items: block.data.items.map((entry) =>
                            entry.id === item.id ? { ...entry, embedUrl: url } : entry
                          ),
                        })
                      )
                    }
                  >
                    Choose
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-300">Image URL</Label>
                    <Input
                      value={item.imageUrl}
                      onChange={(event) =>
                        updateData({
                          ...block.data,
                          items: block.data.items.map((entry) =>
                            entry.id === item.id ? { ...entry, imageUrl: event.target.value } : entry
                          ),
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      openMediaPicker((url) =>
                        updateData({
                          ...block.data,
                          items: block.data.items.map((entry) =>
                            entry.id === item.id ? { ...entry, imageUrl: url } : entry
                          ),
                        })
                      )
                    }
                  >
                    Choose
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <LocalizedInput
                    label="Button Label"
                    value={item.linkLabel}
                    language={language}
                    onChange={(value) =>
                      updateData({
                        ...block.data,
                        items: block.data.items.map((entry) =>
                          entry.id === item.id ? { ...entry, linkLabel: value } : entry
                        ),
                      })
                    }
                  />
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-300">Button URL</Label>
                    <Input
                      value={item.linkUrl}
                      onChange={(event) =>
                        updateData({
                          ...block.data,
                          items: block.data.items.map((entry) =>
                            entry.id === item.id ? { ...entry, linkUrl: event.target.value } : entry
                          ),
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    case "cta":
      return (
        <div className="space-y-4">
          <LocalizedInput
            label="Title"
            value={block.data.title}
            language={language}
            onChange={(value) => updateData({ ...block.data, title: value })}
          />
          <LocalizedTextarea
            label="Description"
            value={block.data.description}
            language={language}
            onChange={(value) => updateData({ ...block.data, description: value })}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <LocalizedInput
              label="Button Label"
              value={block.data.buttonLabel}
              language={language}
              onChange={(value) => updateData({ ...block.data, buttonLabel: value })}
            />
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Button URL</Label>
              <Input
                value={block.data.buttonUrl}
                onChange={(event) => updateData({ ...block.data, buttonUrl: event.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
        </div>
      )
    case "faq":
      return (
        <div className="space-y-4">
          <LocalizedInput
            label="Title"
            value={block.data.title}
            language={language}
            onChange={(value) => updateData({ ...block.data, title: value })}
          />
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-300">Items</Label>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                updateData({
                  ...block.data,
                  items: [
                    ...block.data.items,
                    {
                      id: newId(),
                      question: { en: "", de: "", ru: "" },
                      answer: { en: "", de: "", ru: "" },
                    },
                  ],
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          <div className="space-y-4">
            {block.data.items.map((item) => (
              <div key={item.id} className="rounded-lg border border-white/10 bg-black/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-300">FAQ Item</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-red-500/40 text-red-200"
                    onClick={() =>
                      updateData({
                        ...block.data,
                        items: block.data.items.filter((entry) => entry.id !== item.id),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
                <LocalizedInput
                  label="Question"
                  value={item.question}
                  language={language}
                  onChange={(value) =>
                    updateData({
                      ...block.data,
                      items: block.data.items.map((entry) =>
                        entry.id === item.id ? { ...entry, question: value } : entry
                      ),
                    })
                  }
                />
                <LocalizedRichText
                  label="Answer"
                  value={item.answer}
                  language={language}
                  onChange={(value) =>
                    updateData({
                      ...block.data,
                      items: block.data.items.map((entry) =>
                        entry.id === item.id ? { ...entry, answer: value } : entry
                      ),
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )
    case "contact":
      return (
        <div className="space-y-4">
          <LocalizedInput
            label="Title"
            value={block.data.title}
            language={language}
            onChange={(value) => updateData({ ...block.data, title: value })}
          />
          <LocalizedTextarea
            label="Description"
            value={block.data.description}
            language={language}
            onChange={(value) => updateData({ ...block.data, description: value })}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Email</Label>
              <Input
                value={block.data.email}
                onChange={(event) => updateData({ ...block.data, email: event.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Phone</Label>
              <Input
                value={block.data.phone}
                onChange={(event) => updateData({ ...block.data, phone: event.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
          <LocalizedTextarea
            label="Address"
            value={block.data.address}
            language={language}
            onChange={(value) => updateData({ ...block.data, address: value })}
          />
        </div>
      )
    case "social":
      return (
        <div className="space-y-4">
          <LocalizedInput
            label="Title"
            value={block.data.title}
            language={language}
            onChange={(value) => updateData({ ...block.data, title: value })}
          />
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-300">Links</Label>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                updateData({
                  ...block.data,
                  links: [
                    ...block.data.links,
                    {
                      id: newId(),
                      label: { en: "", de: "", ru: "" },
                      url: "",
                      icon: "globe",
                    },
                  ],
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </div>
          <div className="space-y-4">
            {block.data.links.map((link) => (
              <div key={link.id} className="rounded-lg border border-white/10 bg-black/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-300">Social Link</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-red-500/40 text-red-200"
                    onClick={() =>
                      updateData({
                        ...block.data,
                        links: block.data.links.filter((entry) => entry.id !== link.id),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
                <LocalizedInput
                  label="Label"
                  value={link.label}
                  language={language}
                  onChange={(value) =>
                    updateData({
                      ...block.data,
                      links: block.data.links.map((entry) =>
                        entry.id === link.id ? { ...entry, label: value } : entry
                      ),
                    })
                  }
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-300">URL</Label>
                    <Input
                      value={link.url}
                      onChange={(event) =>
                        updateData({
                          ...block.data,
                          links: block.data.links.map((entry) =>
                            entry.id === link.id ? { ...entry, url: event.target.value } : entry
                          ),
                        })
                      }
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-300">Icon</Label>
                    <Select
                      value={link.icon}
                      onValueChange={(value) =>
                        updateData({
                          ...block.data,
                          links: block.data.links.map((entry) =>
                            entry.id === link.id ? { ...entry, icon: value } : entry
                          ),
                        })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="globe">Website</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    case "chat":
      return (
        <div className="space-y-4">
          <LocalizedInput
            label="Title"
            value={block.data.title}
            language={language}
            onChange={(value) => updateData({ ...block.data, title: value })}
          />
          <LocalizedTextarea
            label="Description"
            value={block.data.description}
            language={language}
            onChange={(value) => updateData({ ...block.data, description: value })}
          />
        </div>
      )
    case "divider":
      return (
        <div className="grid gap-4 md:grid-cols-[200px_1fr]">
          <Label className="text-sm text-gray-300">Style</Label>
          <Select
            value={block.data.style}
            onValueChange={(value) =>
              updateData({
                ...block.data,
                style: value as "line" | "space",
              })
            }
          >
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="space">Space</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    case "spacer":
      return (
        <div className="grid gap-4 md:grid-cols-[200px_1fr]">
          <Label className="text-sm text-gray-300">Height (px)</Label>
          <Input
            type="number"
            value={block.data.size}
            onChange={(event) =>
              updateData({ ...block.data, size: Number(event.target.value) })
            }
            className="bg-white/5 border-white/10"
          />
        </div>
      )
    default:
      return (
        <div className="text-sm text-gray-400">
          This block type is not editable yet.
        </div>
      )
  }
}
