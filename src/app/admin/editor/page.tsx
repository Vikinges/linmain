"use client"

import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { EditorDashboard } from "@/components/editor/editor-dashboard"
import { PageEditor } from "@/components/editor/page-editor"

export default function AdminEditorPage() {
  const searchParams = useSearchParams()
  const raw = searchParams.get("open")?.trim() || ""
  const pageId = useMemo(() => {
    if (!raw) return ""
    try {
      return decodeURIComponent(raw)
    } catch {
      return raw
    }
  }, [raw])

  if (pageId && pageId !== "undefined" && pageId !== "null") {
    return <PageEditor pageId={pageId} />
  }
  return <EditorDashboard />
}
