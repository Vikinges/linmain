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
  ShieldCheck,
  Cloud,
  MapPin,
} from "lucide-react"
import type { Language } from "@/lib/i18n-config"
import type { PageBlock } from "@/lib/editor/types"
import { getLocalizedValue } from "@/lib/editor/locales"
import { getTranslations } from "@/lib/translations"
import { defaultStyles, type TextStyles } from "@/lib/content-config"
import { ChatBox } from "@/components/chat/chat-box"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Reveal, RevealItem } from "@/components/editor/reveal"
import type { HeroHighlightIcon, ProjectBadgeTone } from "@/lib/editor/types"

const HIGHLIGHT_ICONS: Record<HeroHighlightIcon, typeof Server> = {
  server: Server,
  shield: ShieldCheck,
  cloud: Cloud,
  cpu: Cpu,
  lock: Lock,
  map: MapPin,
  sparkles: Sparkles,
}

/** Status pill styles for project blocks. Legacy blocks without a badge keep the green "Live". */
const BADGE_TONES: Record<Exclude<ProjectBadgeTone, "none">, { ring: string; dot: string }> = {
  live: { ring: "border-green-500/30 bg-green-500/10 text-green-400", dot: "bg-green-400 animate-pulse" },
  pilot: { ring: "border-sky-500/30 bg-sky-500/10 text-sky-300", dot: "bg-sky-400" },
  dev: { ring: "border-orange-500/40 bg-orange-500/10 text-orange-300", dot: "bg-orange-400 animate-pulse" },
  soon: { ring: "border-violet-500/30 bg-violet-500/10 text-violet-300", dot: "bg-violet-400" },
}

/** Anchor used by the hero/nav "View Projects" buttons: the first product block gets id="projects". */
const PROJECTS_ANCHOR = "projects"

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
  const firstProductBlock = blocks.find(
    (block) =>
      block.type === "project" ||
      (block.type === "portfolio" && Array.isArray(block.data.items) && block.data.items.length > 0)
  )
  const anchorFor = (block: PageBlock) =>
    block === firstProductBlock ? PROJECTS_ANCHOR : block.id

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
              <Reveal
                key={block.id}
                id={block.id}
                className="relative z-10 flex items-center justify-center px-4 py-20"
              >
                <div className="container mx-auto max-w-6xl">
                  <div className="text-center space-y-8">
                    <RevealItem index={0}>
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
                    </RevealItem>

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

                    <RevealItem index={1} className="space-y-4">
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
                    </RevealItem>

                    <RevealItem index={2} className="flex flex-wrap items-center justify-center gap-4">
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
                    </RevealItem>

                    {Array.isArray(block.data.highlights) && block.data.highlights.length > 0 && (
                      <RevealItem index={3}>
                        <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-4">
                          {block.data.highlights.map((item, index) => {
                            const Icon = HIGHLIGHT_ICONS[item.icon] || ShieldCheck
                            const label = getLocalizedValue(item.label, language)
                            if (!label) return null
                            return (
                              <li key={index} className="flex items-center gap-2 text-sm text-gray-300 md:text-base">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-300">
                                  <Icon className="h-4 w-4" />
                                </span>
                                {label}
                              </li>
                            )
                          })}
                        </ul>
                      </RevealItem>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          }
          case "portfolio": {
            // An empty section (title + subtitle, no cards) only adds a dead heading — skip it.
            if (!Array.isArray(block.data.items) || block.data.items.length === 0) return null
            const title = getLocalizedValue(block.data.title, language)
            const subtitle = getLocalizedValue(block.data.subtitle, language)
            const placeholders = translations.portfolio.placeholders
            const cardBackground =
              palette.pillars.backgroundColor || "rgba(17, 24, 39, 0.5)"
            return (
              <Reveal
                key={block.id}
                id={anchorFor(block)}
                className="relative z-10 px-4 scroll-mt-24"
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
                    {block.data.items.map((item, itemIndex) => {
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
                        <RevealItem key={item.id} index={Math.min(itemIndex, 4)}>
                        <Card
                          className="group border-gray-700/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:shadow-2xl hover:shadow-black/40"
                          style={{ backgroundColor: cardBackground }}
                        >
                          <CardContent className="p-6">
                            <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
                              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40" style={{ height: `${item.imageHeight || 300}px` }}>
                                {item.kind === "locked" ? (
                                  <div className="relative flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-gray-400">
                                    {item.imageUrl && (
                                      <Image
                                        src={item.imageUrl}
                                        alt={itemTitle}
                                        fill
                                        sizes="(min-width: 768px) 55vw, 100vw"
                                        className="object-cover blur-sm scale-105 opacity-60"
                                      />
                                    )}
                                    <Lock className="relative h-8 w-8 text-gray-200" />
                                    <p className="relative text-sm">{placeholderText}</p>
                                  </div>
                                ) : embedUrl ? (
                                  <div className="relative h-full w-full overflow-hidden">
                                    <iframe
                                      src={embedUrl}
                                      scrolling="no"
                                      style={{
                                        border: "none",
                                        width: "200%",
                                        height: "200%",
                                        transform: "scale(0.5)",
                                        transformOrigin: "top left",
                                        pointerEvents: "none",
                                      }}
                                      loading="lazy"
                                      title={itemTitle}
                                    />
                                  </div>
                                ) : item.imageUrl ? (
                                  <Image
                                    src={item.imageUrl}
                                    alt={itemTitle}
                                    width={item.imageWidth || 1200}
                                    height={item.imageHeight || 800}
                                    sizes="(min-width: 768px) 55vw, 100vw"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                  />
                                ) : item.kind === "image" ? (
                                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-900/40 via-gray-900/60 to-violet-900/40">
                                    <Sparkles className="h-16 w-16 text-sky-300/60" />
                                  </div>
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
                                  className="leading-relaxed space-y-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-0.5 [&_a]:text-sky-300 hover:[&_a]:underline"
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
                        </RevealItem>
                      )
                    })}
                  </div>
                </div>
              </Reveal>
            )
          }
          case "project": {
            const title = getLocalizedValue(block.data.title, language)
            const description = getLocalizedValue(block.data.description, language)
            const linkLabel = getLocalizedValue(block.data.linkLabel, language)
            const alt = getLocalizedValue(block.data.image.alt, language)
            const badgeTone: ProjectBadgeTone = block.data.badge?.tone ?? "live"
            const badgeLabel = block.data.badge
              ? getLocalizedValue(block.data.badge.label, language)
              : "Live"
            const badgeStyle = badgeTone === "none" ? null : BADGE_TONES[badgeTone]
            const secondaryLabel = block.data.secondaryLink
              ? getLocalizedValue(block.data.secondaryLink.label, language)
              : ""
            const secondaryUrl =
              block.data.secondaryLink?.urlByLang?.[language]?.trim() || block.data.secondaryLink?.url?.trim() || ""
            const isShowcase = block.data.layout === "showcase"
            const steps = (block.data.steps || [])
              .map((step) => ({
                title: getLocalizedValue(step.title, language),
                text: getLocalizedValue(step.text, language),
              }))
              .filter((step) => step.title)
            const isExternal = (url: string) => /^https?:\/\//.test(url)

            const badgeNode = badgeStyle && badgeLabel && (
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${badgeStyle.ring}`}>
                <span className={`h-2 w-2 rounded-full ${badgeStyle.dot}`} />
                {badgeLabel}
              </div>
            )

            const descriptionNode = (
              <div
                className="prose prose-invert prose-sm md:prose-base max-w-none leading-relaxed space-y-3 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_strong]:text-gray-100 [&_a]:text-sky-300 [&_a]:underline-offset-2 hover:[&_a]:underline"
                style={{ color: palette.pillars.descriptionColor }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )

            const buttonsNode = (block.data.linkUrl || secondaryUrl) && (
              <div className="flex flex-wrap gap-3 pt-2">
                {block.data.linkUrl && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className={
                      isShowcase
                        ? "border-sky-400/40 bg-sky-500/15 text-white hover:bg-sky-500/25 font-semibold shadow-lg shadow-sky-900/30"
                        : "border-gray-500/60 text-gray-100 hover:bg-gray-700/50 font-semibold"
                    }
                  >
                    <a
                      href={block.data.linkUrl}
                      {...(isExternal(block.data.linkUrl) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {linkLabel}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                )}
                {secondaryUrl && secondaryLabel && (
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="text-gray-300 hover:bg-gray-700/40 hover:text-white font-semibold"
                  >
                    <a
                      href={secondaryUrl}
                      {...(isExternal(secondaryUrl) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {secondaryLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            )

            if (isShowcase) {
              const frameUrl = (block.data.showcaseUrl || "").trim()
              return (
                <Reveal key={block.id} id={anchorFor(block)} className="px-4 scroll-mt-24">
                  <div className="mx-auto max-w-6xl">
                    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 via-slate-900/90 to-gray-900 p-8 md:p-12 lg:p-16 transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50">
                      {/* Glow decorations — a little warmer than the standard card */}
                      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
                      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

                      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
                        <div className="space-y-6">
                          {badgeNode}
                          <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white">{title}</h2>
                          {descriptionNode}
                          {buttonsNode}
                        </div>

                        {steps.length > 0 && (
                          <ol className="relative space-y-4 lg:pt-14">
                            {steps.map((step, index) => (
                              <RevealItem key={index} index={index}>
                                <li className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-colors duration-300 hover:border-sky-400/30 hover:bg-white/[0.05]">
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-sm font-bold text-white shadow-lg shadow-sky-900/40">
                                    {index + 1}
                                  </span>
                                  <div className="space-y-1">
                                    <p className="font-semibold text-white">{step.title}</p>
                                    {step.text && <p className="text-sm leading-relaxed text-gray-400">{step.text}</p>}
                                  </div>
                                </li>
                              </RevealItem>
                            ))}
                          </ol>
                        )}
                      </div>

                      {block.data.image.url && (
                        <RevealItem index={1} className="relative mt-12">
                          {/* Product screenshot in a browser window */}
                          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-2xl shadow-black/60 ring-1 ring-white/5 transition-transform duration-700 group-hover:-translate-y-1">
                            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-3">
                              <span className="h-3 w-3 rounded-full bg-red-400/70" />
                              <span className="h-3 w-3 rounded-full bg-amber-400/70" />
                              <span className="h-3 w-3 rounded-full bg-green-400/70" />
                              {frameUrl && (
                                <span className="ml-3 truncate rounded-md bg-black/40 px-3 py-1 font-mono text-xs text-gray-400">
                                  {frameUrl}
                                </span>
                              )}
                            </div>
                            <Image
                              src={block.data.image.url}
                              alt={alt || title}
                              width={block.data.image.width || 1600}
                              height={block.data.image.height || 900}
                              sizes="(min-width: 1152px) 1024px, 100vw"
                              className="h-auto w-full"
                            />
                          </div>
                        </RevealItem>
                      )}
                    </div>
                  </div>
                </Reveal>
              )
            }

            return (
              <Reveal key={block.id} id={anchorFor(block)} className="px-4 scroll-mt-24">
                <div className="mx-auto max-w-6xl">
                  <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 via-gray-800/80 to-gray-900 p-8 md:p-12 lg:p-16 transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50">
                    {/* Glow decorations */}
                    <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />

                    <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] items-start">
                      <div className="space-y-6 max-w-2xl">
                        {/* Status badge (configurable per block; legacy blocks show "Live") */}
                        {badgeNode}

                        <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                          {title}
                        </h2>

                        {descriptionNode}

                        {buttonsNode}
                      </div>

                      {/* Right (desktop) / top (mobile): image, or a server icon on desktop only */}
                      <div
                        className={`flex items-center justify-center lg:self-center ${
                          block.data.image.url ? "order-first lg:order-none" : "hidden lg:flex"
                        }`}
                      >
                        {block.data.image.url ? (
                          <div
                            className="overflow-hidden rounded-2xl max-w-full transition-transform duration-500 group-hover:scale-[1.02]"
                            style={{ width: `${block.data.image.width || 256}px`, height: `${block.data.image.height || 256}px` }}
                          >
                            <Image
                              src={block.data.image.url}
                              alt={alt || title}
                              width={block.data.image.width || 400}
                              height={block.data.image.height || 400}
                              sizes="(min-width: 1024px) 420px, 90vw"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-52 w-52 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/40 to-purple-900/40 shadow-2xl shadow-blue-900/20">
                            <Server className="h-24 w-24 text-blue-400/60" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          }
          case "richText": {
            const html = getLocalizedValue(block.data.content, language)
            const maxW = block.data.width === "full" ? "mx-auto max-w-6xl" : "mx-auto max-w-3xl"
            return (
              <section key={block.id} className="px-4">
                <div className={maxW}>
                  <Card className="glass-card border-white/10">
                    <CardContent className="pt-8 pb-8 px-8 md:px-12">
                      <div
                        className="prose prose-invert prose-sm md:prose-base max-w-none text-gray-300 space-y-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_a]:text-sky-300 hover:[&_a]:underline"
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    </CardContent>
                  </Card>
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
              <Reveal key={block.id} id={block.id} className="px-4 scroll-mt-24">
                <div className="mx-auto max-w-3xl">
                  <Card
                    className="glass-card border-white/20 overflow-hidden"
                    style={{ backgroundColor: palette.callout.backgroundColor || "rgba(255,255,255,0.05)" }}
                  >
                    <CardContent className="relative pt-12 pb-12 text-center space-y-5 px-8 md:px-14">
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
                      <h3
                        className="relative text-3xl md:text-4xl font-bold leading-tight"
                        style={{ color: palette.callout.titleColor }}
                      >
                        {title}
                      </h3>
                      {description && (
                        <p
                          className="relative text-base md:text-lg max-w-xl mx-auto"
                          style={{ color: palette.callout.descriptionColor }}
                        >
                          {description}
                        </p>
                      )}
                      {block.data.buttonUrl && (
                        <div className="relative pt-2">
                          <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-gray-500/60 text-gray-100 hover:bg-gray-700/50 font-semibold"
                          >
                            <a href={block.data.buttonUrl}>
                              {buttonLabel}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </Reveal>
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
              <Reveal key={block.id} id="contact" className="px-4 scroll-mt-24">
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
              </Reveal>
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
