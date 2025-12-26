"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value
    }
  }, [value])

  const exec = (command: string, arg?: string) => {
    document.execCommand(command, false, arg)
    if (ref.current) {
      onChange(ref.current.innerHTML)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => exec("bold")}>
          Bold
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => exec("italic")}>
          Italic
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => exec("underline")}>
          Underline
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => exec("insertUnorderedList")}>
          List
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => exec("formatBlock", "h2")}>
          H2
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => exec("formatBlock", "h3")}>
          H3
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            const url = prompt("Link URL")
            if (url) exec("createLink", url)
          }}
        >
          Link
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => exec("removeFormat")}>
          Clear
        </Button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => {
          if (ref.current) onChange(ref.current.innerHTML)
        }}
        className="min-h-[120px] rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
        data-placeholder={placeholder}
      />
    </div>
  )
}
