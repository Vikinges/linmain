"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Cpu,
  Lock,
  Mail,
  Phone,
  Server,
  Sparkles,
  Linkedin,
  Youtube,
  Globe,
} from "lucide-react"
import type { Language } from "@/lib/i18n-config"
import type { PageBlock } from "@/lib/editor/types"
import { getLocalizedValue } from "@/lib/editor/locales"
import { getTranslations } from "@/lib/translations"
import { defaultStyles, type TextStyles } from "@/lib/content-config"
import { ChatBox } from "@/components/chat/chat-box"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const getYoutubeEmbedUrl = (url: string) => {
  const trimmed = url.trim()
  if (!trimmed) return ""

  try {
    const parsed = new URL(trimmed)
    const hostname = parsed.hostname.replace(/^www\./, "")

    if (hostname === "youtu.be") {
      const id = parsed.pathname.replace("/", "")
      return id ? `https://www.youtube.com/embed/${id}` : ""
    }

    if (hostname.endsWith("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return trimmed
      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/")[2]
        return id ? `https://www.youtube.com/embed/${id}` : ""
      }
      if (parsed.pathname.startsWith("/channel/")) {
        const channelId = parsed.pathname.split("/")[2]
        return channelId ? `https://www.youtube.com/embed?listType=channel&list=${channelId}` : ""
      }
      if (parsed.pathname.startsWith("/@")) {
        const handle = parsed.pathname.replace("/@", "").trim()
        return handle ? `https://www.youtube.com/embed?listType=user&list=${handle}` : ""
      }
      if (parsed.pathname.startsWith("/playlist")) {
        const list = parsed.searchParams.get("list")
        return list ? `https://www.youtube.com/embed?list=${list}` : ""
      }
      const id = parsed.searchParams.get("v")
      return id ? `https://www.youtube.com/embed/${id}` : ""
    }
  } catch {
    return ""
  }

  return ""
}

type PageRendererProps = {
  blocks: PageBlock[]
  language: Language
  styles?: TextStyles
}

export function PageRenderer({ blocks, language, styles }: PageRendererProps) {
  const palette = styles || defaultStyles
  const translations = getTranslations(language)
  return (
    <div className="space-y-24">
      {blocks.map((block) => {
        switch (block.type) {
          case "hero": {
            const badge = getLocalizedValue(block.data.badge, language)
            const title = getLocalizedValue(block.data.title, language)
            const subtitle = getLocalizedValue(block.data.subtitle, language)
            const description = getLocalizedValue(block.data.description, language)
            const primaryLabel = getLocalizedValue(block.data.primaryCta.label, language)
            const secondaryLabel = getLocalizedValue(block.data.secondaryCta.label, language)
            const alt = getLocalizedValue(block.data.image.alt, language)

            return (
              <section
                key={block.id}
                className="relative z-10 flex items-center justify-center px-4 py-20"
              >
                <div className="container mx-auto max-w-6xl">
                  <div className="text-center space-y-8">
                    <div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm"
                      style={{
                        color: palette.badge.textColor,
                        backgroundColor: palette.badge.backgroundColor,
                        borderColor: palette.badge.borderColor,
                      }}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">{badge}</span>
                    </div>

                    {block.data.image.url && (
                      <div className="flex justify-center">
                        <div className="relative h-28 w-28 rounded-full border border-white/20 bg-black/30 shadow-xl shadow-black/40 overflow-hidden">
                          <Image
                            src={block.data.image.url}
                            alt={alt}
                            fill
                            className="object-cover"
                            sizes="112px"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h1 className="text-5xl md:text-7xl font-bold">
                        <span
                          className="block mb-2"
                          style={{
                            color: palette.hero.nameColor,
                            WebkitTextStroke:
                              palette.hero.nameOutlineWidth > 0
                                ? `${palette.hero.nameOutlineWidth}px ${palette.hero.nameOutline}`
                                : "none",
                            textShadow:
                              palette.hero.nameGlowIntensity > 0
                                ? `0 0 ${palette.hero.nameGlowIntensity}px ${palette.hero.nameGlow}`
                                : "none",
                          }}
                        >
                          {title}
                        </span>
                        <span
                          className="block bg-clip-text text-transparent"
                          style={{
                            backgroundImage: `linear-gradient(to right, ${palette.hero.subtitleGradientFrom}, ${palette.hero.subtitleGradientTo})`,
                          }}
                        >
                          {subtitle}
                        </span>
                      </h1>
                      <div
                        className="text-xl md:text-2xl max-w-3xl mx-auto"
                        style={{ color: palette.description.textColor }}
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                      {block.data.primaryCta.url && (
                        <Button
                          size="lg"
                          asChild
                          className="bg-gray-700 hover:bg-gray-600 shadow-lg shadow-gray-900/50 text-lg h-14 px-8 text-white"
                        >
                          <a href={block.data.primaryCta.url}>
                            {primaryLabel}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </a>
                        </Button>
                      )}
                      {block.data.secondaryCta.url && (
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-gray-600 hover:bg-gray-800/50 text-lg h-14 px-8 text-gray-300"
                          asChild
                        >
                          <a href={block.data.secondaryCta.url}>
                            <Mail className="mr-2 h-5 w-5" />
                            {secondaryLabel}
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )
          }
          case "portfolio": {
            const title = getLocalizedValue(block.data.title, language)
            const subtitle = getLocalizedValue(block.data.subtitle, language)
            const placeholders = translations.portfolio.placeholders
            const cardBackground =
              palette.pillars.backgroundColor || "rgba(17, 24, 39, 0.5)"
            return (
              <section
                key={block.id}
                id="projects"
                className="relative z-10 px-4 py-20 bg-gradient-to-b from-transparent to-black/60 scroll-mt-24"
              >
                <div className="container mx-auto max-w-6xl space-y-10">
                  <div className="text-center space-y-3">
                    <h2
                      className="text-4xl font-bold"
                      style={{ color: palette.pillars.titleColor }}
                    >
                      {title}
                    </h2>
                    {subtitle && (
                      <p
                        className="text-lg max-w-3xl mx-auto"
                        style={{ color: palette.pillars.descriptionColor }}
                      >
                        {subtitle}
                      </p>
                    )}
                  </div>
                  <div className="space-y-6">
                    {block.data.items.map((item) => {
                      const itemTitle = getLocalizedValue(item.title, language)
                      const itemDescription = getLocalizedValue(item.description, language)
                      const itemLabel = getLocalizedValue(item.linkLabel, language)
                      const embedUrl =
                        item.kind === "video" ? getYoutubeEmbedUrl(item.embedUrl) : item.embedUrl
                      const placeholderText =
                        item.kind === "video"
                          ? placeholders.videoMissing
                          : item.kind === "map"
                            ? placeholders.mapMissing
                            : item.kind === "locked"
                              ? placeholders.lockedHint
                              : placeholders.mediaMissing || placeholders.mapMissing
                      return (
                        <Card
                          key={item.id}
                          className="group border-gray-700/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2"
                          style={{ backgroundColor: cardBackground }}
                        >
                          <CardContent className="p-6">
                            <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
                              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 h-[240px] md:h-[280px] lg:h-[320px]">
                                {item.kind === "locked" ? (
                                  <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-gray-400">
                                    <Lock className="h-8 w-8 text-gray-200" />
                                    <p className="text-sm">{placeholderText}</p>
                                  </div>
                                ) : embedUrl ? (
                                  <iframe
                                    src={embedUrl}
                                    style={{ border: "none" }}
                                    className="h-full w-full"
                                    loading="lazy"
                                    allowFullScreen
                                    title={itemTitle}
                                  />
                                ) : item.imageUrl ? (
                                  <Image
                                    src={item.imageUrl}
                                    alt={itemTitle}
                                    width={1200}
                                    height={800}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-gray-400">
                                    <Server className="h-8 w-8 text-gray-200" />
                                    <p className="text-sm">{placeholderText}</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex h-full flex-col gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-lg shadow-gray-900/50">
                                    {item.kind === "video" ? (
                                      <Cpu className="w-6 h-6 text-gray-200" />
                                    ) : item.kind === "locked" ? (
                                      <Lock className="w-6 h-6 text-gray-200" />
                                    ) : (
                                      <Server className="w-6 h-6 text-gray-200" />
                                    )}
                                  </div>
                                  <h3
                                    className="text-xl font-bold"
                                    style={{ color: palette.pillars.titleColor }}
                                  >
                                    {itemTitle}
                                  </h3>
                                </div>
                                <div
                                  className="leading-relaxed"
                                  style={{ color: palette.pillars.descriptionColor }}
                                  dangerouslySetInnerHTML={{ __html: itemDescription }}
                                />
                                {item.linkUrl && (
                                  <div className="pt-2 mt-auto">
                                    <Button
                                      asChild
                                      variant="outline"
                                      className="border-gray-600/70 text-gray-200 hover:bg-gray-800/60"
                                    >
                                      <a href={item.linkUrl} target="_blank" rel="noopener noreferrer">
                                        {itemLabel}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                      </a>
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </section>
            )
          }
          case "richText": {
            const html = getLocalizedValue(block.data.content, language)
            return (
              <section key={block.id} className="px-4">
                <div className={block.data.width === "full" ? "mx-auto max-w-6xl" : "mx-auto max-w-3xl"}>
                  <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              </section>
            )
          }
          case "image": {
            const alt = getLocalizedValue(block.data.alt, language)
            const caption = getLocalizedValue(block.data.caption, language)
            return (
              <section key={block.id} className="px-4">
                <div className="mx-auto max-w-5xl space-y-3">
                  {block.data.url && (
                    <Image src={block.data.url} alt={alt} width={1600} height={900} className="rounded-2xl w-full object-cover" />
                  )}
                  {caption && <p className="text-sm text-gray-400 text-center">{caption}</p>}
                </div>
              </section>
            )
          }
          case "imageText": {
            const html = getLocalizedValue(block.data.content, language)
            const alt = getLocalizedValue(block.data.image.alt, language)
            return (
              <section key={block.id} className="px-4">
                <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-2 items-center">
                  {block.data.align === "left" && block.data.image.url && (
                    <Image
                      src={block.data.image.url}
                      alt={alt}
                      width={1200}
                      height={900}
                      className="rounded-2xl w-full object-cover"
                    />
                  )}
                  <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
                  {block.data.align === "right" && block.data.image.url && (
                    <Image
                      src={block.data.image.url}
                      alt={alt}
                      width={1200}
                      height={900}
                      className="rounded-2xl w-full object-cover"
                    />
                  )}
                </div>
              </section>
            )
          }
          case "gallery": {
            return (
              <section key={block.id} className="px-4">
                <div className="mx-auto max-w-6xl grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {block.data.images.map((image) => {
                    const alt = getLocalizedValue(image.alt, language)
                    const caption = getLocalizedValue(image.caption, language)
                    return (
                      <div key={image.id} className="space-y-2">
                        <Image src={image.url} alt={alt} width={1200} height={900} className="rounded-2xl w-full object-cover" />
                        {caption && <p className="text-xs text-gray-400">{caption}</p>}
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          }
          case "video": {
            const title = getLocalizedValue(block.data.title, language)
            const embedUrl = getYoutubeEmbedUrl(block.data.url)
            return (
              <section key={block.id} className="px-4">
                <div className="mx-auto max-w-5xl space-y-4">
                  {title && <h3 className="text-2xl font-semibold text-white">{title}</h3>}
                  {embedUrl ? (
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 h-[320px] md:h-[420px]">
                      <iframe
                        src={embedUrl}
                        style={{ border: "none" }}
                        className="h-full w-full"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title={title || "Video"}
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-black/40 h-[320px] md:h-[420px] flex items-center justify-center text-gray-400">
                      {translations.portfolio.placeholders.videoMissing}
                    </div>
                  )}
                </div>
              </section>
            )
          }
          case "cta": {
            const title = getLocalizedValue(block.data.title, language)
            const description = getLocalizedValue(block.data.description, language)
            const buttonLabel = getLocalizedValue(block.data.buttonLabel, language)
            return (
              <section key={block.id} className="relative py-16 px-4">
                <Card
                  className="glass-card border-white/20 max-w-3xl mx-auto"
                  style={{
                    backgroundColor:
                      palette.callout.backgroundColor || "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <CardContent className="pt-10 pb-10 text-center space-y-4">
                    <h3
                      className="text-3xl font-bold"
                      style={{ color: palette.callout.titleColor }}
                    >
                      {title}
                    </h3>
                    <p style={{ color: palette.callout.descriptionColor }}>{description}</p>
                    {block.data.buttonUrl && (
                      <Button
                        asChild
                        className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white"
                      >
                        <a href={block.data.buttonUrl}>
                          {buttonLabel}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </section>
            )
          }
          case "faq": {
            const title = getLocalizedValue(block.data.title, language)
            return (
              <section key={block.id} className="px-4">
                <div className="mx-auto max-w-4xl space-y-6">
                  {title && <h3 className="text-3xl font-bold text-white">{title}</h3>}
                  <div className="space-y-4">
                    {block.data.items.map((item) => (
                      <Card key={item.id} className="glass-card border-white/10">
                        <CardContent className="pt-4 pb-4">
                          <h4 className="text-lg font-semibold text-white">
                            {getLocalizedValue(item.question, language)}
                          </h4>
                          <div
                            className="prose prose-invert max-w-none text-gray-300"
                            dangerouslySetInnerHTML={{ __html: getLocalizedValue(item.answer, language) }}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            )
          }
          case "contact": {
            const title = getLocalizedValue(block.data.title, language)
            const description = getLocalizedValue(block.data.description, language)
            const address = getLocalizedValue(block.data.address, language)
            return (
              <section key={block.id} id="contact" className="px-4">
                <div className="mx-auto max-w-4xl space-y-6 text-center">
                  {title && <h3 className="text-3xl font-bold text-white">{title}</h3>}
                  {description && <p className="text-gray-300">{description}</p>}
                  <div className="grid gap-4 sm:grid-cols-3">
                    {block.data.email && (
                      <Card className="glass-card border-white/10">
                        <CardContent className="pt-6 pb-6 text-center space-y-2">
                          <Mail className="h-5 w-5 mx-auto text-gray-200" />
                          <a className="text-sm text-gray-300" href={`mailto:${block.data.email}`}>
                            {block.data.email}
                          </a>
                        </CardContent>
                      </Card>
                    )}
                    {block.data.phone && (
                      <Card className="glass-card border-white/10">
                        <CardContent className="pt-6 pb-6 text-center space-y-2">
                          <Phone className="h-5 w-5 mx-auto text-gray-200" />
                          <a className="text-sm text-gray-300" href={`tel:${block.data.phone}`}>
                            {block.data.phone}
                          </a>
                        </CardContent>
                      </Card>
                    )}
                    {address && (
                      <Card className="glass-card border-white/10">
                        <CardContent className="pt-6 pb-6 text-center space-y-2">
                          <Globe className="h-5 w-5 mx-auto text-gray-200" />
                          <p className="text-sm text-gray-300">{address}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </section>
            )
          }
          case "chat": {
            const title = getLocalizedValue(block.data.title, language)
            const description = getLocalizedValue(block.data.description, language)
            return (
              <section key={block.id} className="px-4">
                <div className="mx-auto max-w-5xl space-y-6">
                  {title && <h3 className="text-3xl font-bold text-white">{title}</h3>}
                  {description && <p className="text-gray-300">{description}</p>}
                  <ChatBox className="h-[640px]" />
                </div>
              </section>
            )
          }
          case "divider":
            return (
              <div key={block.id} className="px-4">
                {block.data.style === "line" ? (
                  <div className="mx-auto max-w-5xl h-px bg-white/10" />
                ) : (
                  <div className="h-8" />
                )}
              </div>
            )
          case "spacer":
            return <div key={block.id} style={{ height: `${block.data.size}px` }} />
          case "social": {
            const title = getLocalizedValue(block.data.title, language)
            return (
              <section key={block.id} className="px-4">
                <div className="mx-auto max-w-4xl text-center space-y-4">
                  {title && <h3 className="text-2xl font-semibold text-white">{title}</h3>}
                  <div className="flex flex-wrap justify-center gap-4">
                    {block.data.links.map((link) => {
                      const label = getLocalizedValue(link.label, language)
                      const icon =
                        link.icon === "linkedin" ? (
                          <Linkedin className="w-5 h-5" />
                        ) : link.icon === "youtube" ? (
                          <Youtube className="w-5 h-5" />
                        ) : (
                          <Globe className="w-5 h-5" />
                        )
                      return (
                        <Link
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                        >
                          {icon}
                          {label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </section>
            )
          }
          default:
            return null
        }
      })}
    </div>
  )
}
