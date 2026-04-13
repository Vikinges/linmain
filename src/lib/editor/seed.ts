import { prisma } from "@/lib/db"
import { defaultContent, type HomepageContent } from "@/lib/content-config"
import { getTranslations } from "@/lib/translations"
import type { Language } from "@/lib/i18n-config"
import { emptyLocalizedString, type PageBlock, type PortfolioBlock } from "@/lib/editor/types"

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
    qrGenerator: {
      title: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.qrGenerator?.title
        return pickText(overrides, getTranslations(lang).portfolio.qrGenerator.title)
      }),
      description: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.qrGenerator?.description
        return pickText(overrides, getTranslations(lang).portfolio.qrGenerator.description)
      }),
      linkLabel: buildLocalized((lang) => {
        const overrides = content.portfolio?.locales?.[lang]?.qrGenerator?.linkLabel
        return pickText(overrides, getTranslations(lang).portfolio.qrGenerator.linkLabel)
      }),
    },
    hostLinart: {
      title: buildLocalized((lang) => getTranslations(lang).portfolio.hostLinart.title),
      description: buildLocalized((lang) => getTranslations(lang).portfolio.hostLinart.description),
      linkLabel: buildLocalized((lang) => getTranslations(lang).portfolio.hostLinart.linkLabel),
    },
    crmIot: {
      title: buildLocalized((lang) => getTranslations(lang).portfolio.crmIot.title),
      description: buildLocalized((lang) => getTranslations(lang).portfolio.crmIot.description),
      ctaTitle: buildLocalized((lang) => getTranslations(lang).portfolio.crmIot.ctaTitle),
      ctaDescription: buildLocalized((lang) => getTranslations(lang).portfolio.crmIot.ctaDescription),
      ctaButton: buildLocalized((lang) => getTranslations(lang).portfolio.crmIot.ctaButton),
      linkLabel: buildLocalized((lang) => getTranslations(lang).portfolio.crmIot.linkLabel),
    },
    entertainment: {
      title: buildLocalized((lang) => getTranslations(lang).portfolio.entertainment.title),
      subtitle: buildLocalized((lang) => getTranslations(lang).portfolio.entertainment.subtitle),
    },
    cloud: {
      title: buildLocalized((lang) => getTranslations(lang).portfolio.cloud.title),
      description: buildLocalized((lang) => getTranslations(lang).portfolio.cloud.description),
    },
  }

  const blocks: PageBlock[] = [
    // 1. Hero
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
    // 2. IoT Private Server — featured first
    {
      id: "iot-server",
      type: "project",
      data: {
        title: portfolioText.hostLinart.title,
        description: portfolioText.hostLinart.description,
        image: { url: "", alt: emptyLocalized() },
        linkLabel: portfolioText.hostLinart.linkLabel,
        linkUrl: "https://host.linart.club/",
        align: "left",
      },
    },
    // 3. CRM-IoT — second, same style as IoT server
    {
      id: "crm-iot",
      type: "project",
      data: {
        title: portfolioText.crmIot.title,
        description: portfolioText.crmIot.description,
        image: { url: "", alt: emptyLocalized() },
        linkLabel: portfolioText.crmIot.linkLabel,
        linkUrl: "mailto:info@linart.club?subject=Smart%20Lock%20Request",
        align: "left",
      },
    },
    // 4. Private cloud — same style as IoT server
    {
      id: "cloud-services",
      type: "project",
      data: {
        title: portfolioText.cloud.title,
        description: portfolioText.cloud.description,
        image: { url: "", alt: emptyLocalized() },
        linkLabel: buildLocalized((lang) =>
          lang === "ru" ? "Запросить доступ" : lang === "de" ? "Zugang anfragen" : "Request Access"
        ),
        linkUrl: "mailto:info@linart.club?subject=Cloud%20Access%20Request",
        align: "left",
      },
    },
    // 6. Main portfolio — other projects
    {
      id: "portfolio",
      type: "portfolio",
      data: {
        title: portfolioText.title,
        subtitle: portfolioText.subtitle,
        items: [
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
            id: "qr-generator",
            kind: "image",
            title: portfolioText.qrGenerator.title,
            description: portfolioText.qrGenerator.description,
            embedUrl: "",
            imageUrl:
              content.portfolio?.qrGenerator?.imageUrl ||
              "/assets/qr-generator-cover.svg",
            linkLabel: portfolioText.qrGenerator.linkLabel,
            linkUrl:
              content.portfolio?.qrGenerator?.linkUrl ||
              "https://qr.linart.club/",
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
    // 7. Entertainment section — Minecraft map
    {
      id: "entertainment",
      type: "portfolio",
      data: {
        title: portfolioText.entertainment.title,
        subtitle: portfolioText.entertainment.subtitle,
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
        ],
      },
    },
    // 8. Community chat
    {
      id: "chat",
      type: "chat",
      data: {
        title: chatText.title,
        description: chatText.description,
      },
    },
    // 9. Callout
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
    // 10. Contact
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

  if (count > 0) {
    const page = await prisma.page.findUnique({ where: { slug: "home" } })
    if (page) {
      const revision = await prisma.pageRevision.create({
        data: {
          pageId: page.id,
          title: "Home",
          blocks,
        },
      })
      await prisma.page.update({
        where: { id: page.id },
        data: { draftRevisionId: revision.id, publishedRevisionId: revision.id },
      })
    }
    return
  }

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

const normalizeUrl = (value: string | undefined) =>
  (value || "").trim().replace(/\/+$/, "")

async function ensureHomeHasQrProject(
  content: HomepageContent,
  portfolioText: {
    title: ReturnType<typeof buildLocalized>
    subtitle: ReturnType<typeof buildLocalized>
    minecraft: {
      title: ReturnType<typeof buildLocalized>
      description: ReturnType<typeof buildLocalized>
      linkLabel: ReturnType<typeof buildLocalized>
    }
    sensorHub: {
      title: ReturnType<typeof buildLocalized>
      description: ReturnType<typeof buildLocalized>
      linkLabel: ReturnType<typeof buildLocalized>
    }
    commercial: {
      title: ReturnType<typeof buildLocalized>
      description: ReturnType<typeof buildLocalized>
      linkLabel: ReturnType<typeof buildLocalized>
    }
    qrGenerator: {
      title: ReturnType<typeof buildLocalized>
      description: ReturnType<typeof buildLocalized>
      linkLabel: ReturnType<typeof buildLocalized>
    }
  }
) {
  const page = await prisma.page.findUnique({
    where: { slug: "home" },
    include: {
      publishedRevision: true,
      draftRevision: true,
    },
  })

  if (!page) return

  const sourceRevision = page.draftRevision || page.publishedRevision
  if (!sourceRevision || !Array.isArray(sourceRevision.blocks)) return

  const blocks = sourceRevision.blocks as PageBlock[]
  const targetUrl = normalizeUrl(
    content.portfolio?.qrGenerator?.linkUrl || "https://qr.linart.club/"
  )
  let nextBlocks = [...blocks]
  let updated = false

  nextBlocks = nextBlocks.filter((block) => {
    if (block.type !== "project") return true
    const link = normalizeUrl(block.data.linkUrl)
    const isQr = block.id === "qr-highlight" || link === targetUrl
    if (isQr) updated = true
    return !isQr
  })

  const portfolioIndex = nextBlocks.findIndex((block) => block.type === "portfolio")
  if (portfolioIndex >= 0) {
    const portfolioBlock = nextBlocks[portfolioIndex] as PortfolioBlock
    const items = Array.isArray(portfolioBlock.data.items) ? portfolioBlock.data.items : []
    const alreadyExists = items.some((item) => {
      if (item.id === "qr-generator") return true
      const link = normalizeUrl(item.linkUrl)
      return link === targetUrl
    })

    if (!alreadyExists) {
      const nextItem = {
        id: "qr-generator",
        kind: "image" as const,
        title: portfolioText.qrGenerator.title,
        description: portfolioText.qrGenerator.description,
        embedUrl: "",
        imageUrl:
          content.portfolio?.qrGenerator?.imageUrl ||
          "/assets/qr-generator-cover.svg",
        linkLabel: portfolioText.qrGenerator.linkLabel,
        linkUrl:
          content.portfolio?.qrGenerator?.linkUrl ||
          "https://qr.linart.club/",
      }

      const nextBlock: PortfolioBlock = {
        ...portfolioBlock,
        data: {
          ...portfolioBlock.data,
          items: [...items, nextItem],
        },
      }

      nextBlocks = nextBlocks.map((block, index) =>
        index === portfolioIndex ? nextBlock : block
      )
      updated = true
    }
  }

  if (!updated) return

  const revision = await prisma.pageRevision.create({
    data: {
      pageId: page.id,
      title: sourceRevision.title || page.title,
      blocks: nextBlocks,
    },
  })

  const update: {
    draftRevisionId: string
    publishedRevisionId?: string | null
  } = {
    draftRevisionId: revision.id,
  }

  if (!page.draftRevisionId || page.draftRevisionId === page.publishedRevisionId) {
    update.publishedRevisionId = revision.id
  }

  await prisma.page.update({
    where: { id: page.id },
    data: update,
  })
}
