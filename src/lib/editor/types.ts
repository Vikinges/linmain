import type { Language } from "@/lib/i18n-config"

export type LocalizedString = Record<Language, string>
export type LocalizedHtml = Record<Language, string>

export type PageBlock =
  | HeroBlock
  | RichTextBlock
  | ImageBlock
  | ImageTextBlock
  | GalleryBlock
  | VideoBlock
  | PortfolioBlock
  | CtaBlock
  | FaqBlock
  | ContactBlock
  | DividerBlock
  | SpacerBlock
  | SocialBlock
  | ChatBlock

export type HeroBlock = {
  id: string
  type: "hero"
  data: {
    badge: LocalizedString
    title: LocalizedString
    subtitle: LocalizedString
    description: LocalizedHtml
    primaryCta: {
      label: LocalizedString
      url: string
    }
    secondaryCta: {
      label: LocalizedString
      url: string
    }
    image: {
      url: string
      alt: LocalizedString
    }
  }
}

export type RichTextBlock = {
  id: string
  type: "richText"
  data: {
    content: LocalizedHtml
    width: "full" | "narrow"
  }
}

export type ImageBlock = {
  id: string
  type: "image"
  data: {
    url: string
    alt: LocalizedString
    caption: LocalizedString
  }
}

export type ImageTextBlock = {
  id: string
  type: "imageText"
  data: {
    image: {
      url: string
      alt: LocalizedString
    }
    content: LocalizedHtml
    align: "left" | "right"
  }
}

export type GalleryBlock = {
  id: string
  type: "gallery"
  data: {
    images: Array<{
      id: string
      url: string
      alt: LocalizedString
      caption: LocalizedString
    }>
  }
}

export type VideoBlock = {
  id: string
  type: "video"
  data: {
    url: string
    title: LocalizedString
  }
}

export type PortfolioBlock = {
  id: string
  type: "portfolio"
  data: {
    title: LocalizedString
    subtitle: LocalizedString
    items: Array<{
      id: string
      kind: "map" | "video" | "locked" | "image"
      title: LocalizedString
      description: LocalizedHtml
      embedUrl: string
      imageUrl: string
      linkLabel: LocalizedString
      linkUrl: string
    }>
  }
}

export type CtaBlock = {
  id: string
  type: "cta"
  data: {
    title: LocalizedString
    description: LocalizedString
    buttonLabel: LocalizedString
    buttonUrl: string
  }
}

export type FaqBlock = {
  id: string
  type: "faq"
  data: {
    title: LocalizedString
    items: Array<{
      id: string
      question: LocalizedString
      answer: LocalizedHtml
    }>
  }
}

export type ContactBlock = {
  id: string
  type: "contact"
  data: {
    title: LocalizedString
    description: LocalizedString
    email: string
    phone: string
    address: LocalizedString
  }
}

export type DividerBlock = {
  id: string
  type: "divider"
  data: {
    style: "line" | "space"
  }
}

export type SpacerBlock = {
  id: string
  type: "spacer"
  data: {
    size: number
  }
}

export type SocialBlock = {
  id: string
  type: "social"
  data: {
    title: LocalizedString
    links: Array<{
      id: string
      label: LocalizedString
      url: string
      icon: string
    }>
  }
}

export type ChatBlock = {
  id: string
  type: "chat"
  data: {
    title: LocalizedString
    description: LocalizedString
  }
}

export type PageDocument = {
  id: string
  slug: string
  title: string
  blocks: PageBlock[]
  updatedAt: string
  publishedAt?: string
}

export const emptyLocalizedString = (): LocalizedString => ({
  en: "",
  de: "",
  ru: "",
})

export const emptyLocalizedHtml = (): LocalizedHtml => ({
  en: "",
  de: "",
  ru: "",
})
