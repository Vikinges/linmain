import sanitizeHtml from "sanitize-html"
import type { LocalizedHtml, PageBlock } from "@/lib/editor/types"

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "ul",
    "ol",
    "li",
    "a",
    "h2",
    "h3",
    "blockquote",
    "code",
    "pre",
    "span",
    "div",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  disallowedTagsMode: "discard",
}

const sanitizeValue = (value: string) =>
  sanitizeHtml(value, {
    ...sanitizeOptions,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    },
  })

const sanitizeLocalizedHtml = (value: LocalizedHtml): LocalizedHtml => ({
  en: sanitizeValue(value?.en || ""),
  de: sanitizeValue(value?.de || ""),
  ru: sanitizeValue(value?.ru || ""),
})

export const sanitizeBlocks = (blocks: unknown): PageBlock[] => {
  if (!Array.isArray(blocks)) return []

  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") return null
      const clone =
        typeof structuredClone === "function"
          ? structuredClone(block)
          : JSON.parse(JSON.stringify(block))
      const safeBlock = clone as PageBlock

      switch (safeBlock.type) {
        case "hero":
          safeBlock.data.description = sanitizeLocalizedHtml(safeBlock.data.description)
          return safeBlock
        case "richText":
          safeBlock.data.content = sanitizeLocalizedHtml(safeBlock.data.content)
          return safeBlock
        case "imageText":
          safeBlock.data.content = sanitizeLocalizedHtml(safeBlock.data.content)
          return safeBlock
        case "portfolio":
          safeBlock.data.items = safeBlock.data.items.map((item) => ({
            ...item,
            description: sanitizeLocalizedHtml(item.description),
          }))
          return safeBlock
        case "faq":
          safeBlock.data.items = safeBlock.data.items.map((item) => ({
            ...item,
            answer: sanitizeLocalizedHtml(item.answer),
          }))
          return safeBlock
        default:
          return safeBlock
      }
    })
    .filter(Boolean) as PageBlock[]
}
