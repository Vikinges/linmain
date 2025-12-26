import { emptyLocalizedHtml, emptyLocalizedString, type PageBlock } from "@/lib/editor/types"

const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `block-${Date.now()}`)

export const createBlock = (type: PageBlock["type"]): PageBlock => {
  const id = newId()

  switch (type) {
    case "hero":
      return {
        id,
        type,
        data: {
          badge: emptyLocalizedString(),
          title: emptyLocalizedString(),
          subtitle: emptyLocalizedString(),
          description: emptyLocalizedHtml(),
          primaryCta: { label: emptyLocalizedString(), url: "" },
          secondaryCta: { label: emptyLocalizedString(), url: "" },
          image: { url: "", alt: emptyLocalizedString() },
        },
      }
    case "richText":
      return {
        id,
        type,
        data: { content: emptyLocalizedHtml(), width: "narrow" },
      }
    case "image":
      return {
        id,
        type,
        data: { url: "", alt: emptyLocalizedString(), caption: emptyLocalizedString() },
      }
    case "imageText":
      return {
        id,
        type,
        data: { image: { url: "", alt: emptyLocalizedString() }, content: emptyLocalizedHtml(), align: "left" },
      }
    case "gallery":
      return {
        id,
        type,
        data: { images: [] },
      }
    case "video":
      return {
        id,
        type,
        data: { url: "", title: emptyLocalizedString() },
      }
    case "portfolio":
      return {
        id,
        type,
        data: {
          title: emptyLocalizedString(),
          subtitle: emptyLocalizedString(),
          items: [],
        },
      }
    case "cta":
      return {
        id,
        type,
        data: {
          title: emptyLocalizedString(),
          description: emptyLocalizedString(),
          buttonLabel: emptyLocalizedString(),
          buttonUrl: "",
        },
      }
    case "faq":
      return {
        id,
        type,
        data: { title: emptyLocalizedString(), items: [] },
      }
    case "contact":
      return {
        id,
        type,
        data: {
          title: emptyLocalizedString(),
          description: emptyLocalizedString(),
          email: "",
          phone: "",
          address: emptyLocalizedString(),
        },
      }
    case "divider":
      return { id, type, data: { style: "line" } }
    case "spacer":
      return { id, type, data: { size: 48 } }
    case "social":
      return { id, type, data: { title: emptyLocalizedString(), links: [] } }
    case "chat":
      return { id, type, data: { title: emptyLocalizedString(), description: emptyLocalizedString() } }
    default:
      return {
        id,
        type: "richText",
        data: { content: emptyLocalizedHtml(), width: "narrow" },
      }
  }
}
