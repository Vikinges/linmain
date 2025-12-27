import { prisma } from "@/lib/db"
import { defaultContent, type HomepageContent } from "@/lib/content-config"
import { getTranslations } from "@/lib/translations"
import type { Language } from "@/lib/i18n-config"
import { emptyLocalizedString, type PageBlock } from "@/lib/editor/types"

const LANGS: Language[] = ["en", "de", "ru"]

const isReadableText = (value: string | undefined) => {
  if (!value) return false
  const trimmed = value.trim()
  if (!trimmed) return false
  if (/^\?+$/.test(trimmed)) return false
  if (/[\u00d0\u00d1]/.test(trimmed)) return false
  return /[\p{L}\p{N}]/u.test(trimmed)
}

const pickText = (value: string | undefined, fallback: string) =>
  isReadableText(value) ? value!.trim() : fallback

const emptyLocalized = () => ({
  en: "",
  de: "",
  ru: "",
})

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function deepMerge<T>(base: T, override: Partial<T>): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override as T) ?? base
  }

  const result = { ...(base as Record<string, unknown>) }
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue
    const baseValue = result[key]
    result[key] = isPlainObject(baseValue) && isPlainObject(value)
      ? deepMerge(baseValue, value)
      : value
  }
  return result as T
}

const buildLocalized = (
  getter: (lang: Language) => string
) => {
  const result = emptyLocalized()
  for (const lang of LANGS) {
    result[lang] = getter(lang)
  }
  return result
}

function readContent(value?: unknown): HomepageContent {
  if (!isPlainObject(value)) return defaultContent
  return deepMerge(defaultContent, value as Partial<HomepageContent>)
}

export async function ensureDefaultPages() {
  const count = await prisma.page.count()
  if (count > 0) return

  const contentRow = await prisma.siteConfig.findUnique({ where: { key: "content" } })
  const content = readContent(contentRow?.value)

  const heroText = {
    badge: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.hero?.badge
      const legacy = lang === "en" ? content.hero.badge : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).hero.badge))
    }),
    name: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.hero?.name
      const legacy = lang === "en" ? content.hero.name : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).hero.name))
    }),
    subtitle: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.hero?.subtitle
      const legacy = lang === "en" ? content.hero.subtitle : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).hero.subtitle))
    }),
    description: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.hero?.description
      const legacy = lang === "en" ? content.hero.description : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).hero.description))
    }),
  }

  const ctaText = {
    primaryButton: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.cta?.primaryButton
      const legacy = lang === "en" ? content.cta.primaryButton : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).cta.primary))
    }),
    secondaryButton: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.cta?.secondaryButton
      const legacy = lang === "en" ? content.cta.secondaryButton : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).cta.secondary))
    }),
  }

  const calloutText = {
    title: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.callout?.title
      const legacy = lang === "en" ? content.callout.title : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).callout.title))
    }),
    description: buildLocalized((lang) => {
      const overrides = content.locales?.[lang]?.callout?.description
      const legacy = lang === "en" ? content.callout.description : undefined
      return pickText(overrides, pickText(legacy, getTranslations(lang).callout.description))
    }),
  }

  const chatText = {
    title: buildLocalized((lang) => getTranslations(lang).chat.title),
    description: buildLocalized((lang) => getTranslations(lang).chat.description),
  }

  const portfolioText = {
    title: buildLocalized((lang) => {
      const overrides = content.portfolio?.locales?.[lang]?.title
      return pickText(overrides, getTranslations(lang).portfolio.title)
    }),
    subtitle: buildLocalized((lang) => {
      const overrides = content.portfolio?.locales?.[lang]?.subtitle
      return pickText(overrides, getTranslations(lang).portfolio.subtitle)
    }),
    minecraft: {
      title: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.minecraft?.title
        return pickText(overrides, getTranslations(lang).portfolio.minecraft.title)
      }),
      description: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.minecraft?.description
        return pickText(overrides, getTranslations(lang).portfolio.minecraft.description)
      }),
      linkLabel: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.minecraft?.linkLabel
        return pickText(overrides, getTranslations(lang).portfolio.minecraft.linkLabel)
      }),
    },
    sensorHub: {
      title: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.sensorHub?.title
        return pickText(overrides, getTranslations(lang).portfolio.sensorHub.title)
      }),
      description: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.sensorHub?.description
        return pickText(overrides, getTranslations(lang).portfolio.sensorHub.description)
      }),
      linkLabel: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.sensorHub?.linkLabel
        return pickText(overrides, getTranslations(lang).portfolio.sensorHub.linkLabel)
      }),
    },
    commercial: {
      title: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.commercial?.title
        return pickText(overrides, getTranslations(lang).portfolio.commercial.title)
      }),
      description: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.commercial?.description
        return pickText(overrides, getTranslations(lang).portfolio.commercial.description)
      }),
      linkLabel: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.commercial?.linkLabel
        return pickText(overrides, getTranslations(lang).portfolio.commercial.linkLabel)
      }),
    },
  }

  const blocks: PageBlock[] = [
    {
      id: "hero",
      type: "hero",
      data: {
        badge: heroText.badge,
        title: heroText.name,
        subtitle: heroText.subtitle,
        description: heroText.description,
        primaryCta: { label: ctaText.primaryButton, url: "#projects" },
        secondaryCta: { label: ctaText.secondaryButton, url: "#contact" },
        image: {
          url: content.media?.heroImageUrl || "",
          alt: {
            en: content.media?.heroImageAlt || heroText.name.en,
            de: content.media?.heroImageAlt || heroText.name.de,
            ru: content.media?.heroImageAlt || heroText.name.ru,
          },
        },
      },
    },
    {
      id: "portfolio",
      type: "portfolio",
      data: {
        title: portfolioText.title,
        subtitle: portfolioText.subtitle,
        items: [
          {
            id: "minecraft",
            kind: "map",
            title: portfolioText.minecraft.title,
            description: portfolioText.minecraft.description,
            embedUrl: content.portfolio?.minecraft?.mapUrl || "",
            imageUrl: "",
            linkLabel: portfolioText.minecraft.linkLabel,
            linkUrl: content.portfolio?.minecraft?.linkUrl || "",
          },
          {
            id: "sensorhub",
            kind: "video",
            title: portfolioText.sensorHub.title,
            description: portfolioText.sensorHub.description,
            embedUrl: content.portfolio?.sensorHub?.videoUrl || "",
            imageUrl: "",
            linkLabel: portfolioText.sensorHub.linkLabel,
            linkUrl: content.portfolio?.sensorHub?.linkUrl || "",
          },
          {
            id: "commercial",
            kind: "locked",
            title: portfolioText.commercial.title,
            description: portfolioText.commercial.description,
            embedUrl: "",
            imageUrl: "",
            linkLabel: portfolioText.commercial.linkLabel,
            linkUrl: content.portfolio?.commercial?.linkUrl || "",
          },
        ],
      },
    },
    {
      id: "chat",
      type: "chat",
      data: {
        title: chatText.title,
        description: chatText.description,
      },
    },
    {
      id: "callout",
      type: "cta",
      data: {
        title: calloutText.title,
        description: calloutText.description,
        buttonLabel: buildLocalized((lang) => getTranslations(lang).cta.primary),
        buttonUrl: "#contact",
      },
    },
    {
      id: "contact",
      type: "contact",
      data: {
        title: emptyLocalizedString(),
        description: emptyLocalizedString(),
        email: "",
        phone: "",
        address: emptyLocalizedString(),
      },
    },
  ]

  const page = await prisma.page.create({
    data: {
      slug: "home",
      title: "Home",
    },
  })

  const revision = await prisma.pageRevision.create({
    data: {
      pageId: page.id,
      title: "Home",
      blocks,
    },
  })

  await prisma.page.update({
    where: { id: page.id },
    data: {
      draftRevisionId: revision.id,
      publishedRevisionId: revision.id,
    },
  })
}
