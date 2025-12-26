"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BackgroundVideo } from "@/components/layout/background-video"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { applyTheme, defaultTheme, loadTheme, saveTheme, type ThemeConfig } from "@/lib/theme-config"
import {
  loadContent,
  saveContent,
  loadContentStyles,
  saveContentStyles,
  defaultContent,
  defaultStyles,
  type HomepageContent,
  type TextStyles,
} from "@/lib/content-config"
import { defaultLanguage, loadLanguage, type Language } from "@/lib/i18n-config"
import { getTranslations, type Translations } from "@/lib/translations"
import {
  ArrowRight,
  Linkedin,
  Youtube,
  Mail,
  Sparkles,
  Server,
  Cpu,
  Lock
} from "lucide-react"

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
      const id = parsed.searchParams.get("v")
      return id ? `https://www.youtube.com/embed/${id}` : ""
    }
  } catch {
    return ""
  }

  return ""
}

export default function HomePage() {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme)
  const [language, setLanguage] = useState<Language>(defaultLanguage)
  const [translations, setTranslations] = useState<Translations>(() => getTranslations(defaultLanguage))
  const [styles, setStyles] = useState<TextStyles>(defaultStyles)
  const [content, setContent] = useState<HomepageContent>(defaultContent)
  const { data: session } = useSession()
  const isAdmin = Boolean(session?.user?.isAdmin || session?.user?.role === "ADMIN")
  const isAuthenticated = Boolean(session?.user)

  useEffect(() => {
    const syncLocalConfig = () => {
      const storedTheme = loadTheme()
      setTheme(storedTheme)
      applyTheme(storedTheme)

      const storedStyles = loadContentStyles()
      setStyles(storedStyles)

      const storedContent = loadContent()
      setContent(storedContent)

      const storedLanguage = loadLanguage()
      setLanguage(storedLanguage)
      setTranslations(getTranslations(storedLanguage))
    }

    syncLocalConfig()
  }, [])

  useEffect(() => {
    let active = true
    const loadRemoteConfig = async () => {
      try {
        const response = await fetch("/api/site-config", { cache: "no-store" })
        if (!response.ok) return
        const data = await response.json()
        if (!active) return

        if (data.theme) {
          setTheme(data.theme)
          saveTheme(data.theme)
        }
        if (data.styles) {
          setStyles(data.styles)
          saveContentStyles(data.styles)
        }
        if (data.content) {
          setContent(data.content)
          saveContent(data.content)
        }
      } catch (error) {
        console.error("Failed to load site config:", error)
      }
    }

    loadRemoteConfig()
    return () => {
      active = false
    }
  }, [])

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang)
    setTranslations(getTranslations(newLang))
  }

  const portfolioContent = content.portfolio ?? defaultContent.portfolio
  const portfolioOverrides = portfolioContent.locales?.[language]
  const portfolioFallback = translations.portfolio
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
  const portfolioText = {
    title: pickText(portfolioOverrides?.title, portfolioFallback.title),
    subtitle: pickText(portfolioOverrides?.subtitle, portfolioFallback.subtitle),
    minecraft: {
      title: pickText(portfolioOverrides?.minecraft?.title, portfolioFallback.minecraft.title),
      description: pickText(portfolioOverrides?.minecraft?.description, portfolioFallback.minecraft.description),
      linkLabel: pickText(portfolioOverrides?.minecraft?.linkLabel, portfolioFallback.minecraft.linkLabel),
    },
    sensorHub: {
      title: pickText(portfolioOverrides?.sensorHub?.title, portfolioFallback.sensorHub.title),
      description: pickText(portfolioOverrides?.sensorHub?.description, portfolioFallback.sensorHub.description),
      linkLabel: pickText(portfolioOverrides?.sensorHub?.linkLabel, portfolioFallback.sensorHub.linkLabel),
    },
    commercial: {
      title: pickText(portfolioOverrides?.commercial?.title, portfolioFallback.commercial.title),
      description: pickText(portfolioOverrides?.commercial?.description, portfolioFallback.commercial.description),
      linkLabel: pickText(portfolioOverrides?.commercial?.linkLabel, portfolioFallback.commercial.linkLabel),
    },
  }
  const minecraftMapUrl = (portfolioContent.minecraft?.mapUrl || "").trim()
  const minecraftLinkUrl = (portfolioContent.minecraft?.linkUrl || minecraftMapUrl).trim()
  const sensorHubVideoUrl = (portfolioContent.sensorHub?.videoUrl || "").trim()
  const sensorHubEmbedUrl = getYoutubeEmbedUrl(sensorHubVideoUrl)
  const sensorHubLinkUrl = (portfolioContent.sensorHub?.linkUrl || sensorHubVideoUrl).trim()
  const commercialLinkUrl = (portfolioContent.commercial?.linkUrl || "").trim()
  const linkedinUrl = (content.social?.linkedinUrl || "").trim()
  const youtubeUrl = (content.social?.youtubeUrl || "").trim()

  return (
    <>
      {/* Background Video */}
      {theme && (
        <BackgroundVideo
          videoUrl={theme.background.videoUrl}
          blurAmount={theme.background.blurAmount}
          opacity={theme.background.opacity}
          fallbackImage={theme.background.fallbackImage}
        />
      )}

      <div className="min-h-screen flex flex-col">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-black/30">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.png"
                alt="Linart Logo"
                width={48}
                height={48}
                className="transition-transform group-hover:scale-105"
              />
              <span className="text-2xl font-bold text-gray-200">LINART</span>
            </Link>

            {/* Language Switcher & Login */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher
                currentLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
              <Link href="/login">
                <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                  {translations.nav.login}
                </Button>
              </Link>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white">
                {content.nav?.getStarted || "Get Started"}
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 flex-1 flex items-center justify-center px-4 py-20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-8">

              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm"
                style={{
                  color: styles.badge.textColor,
                  backgroundColor: styles.badge.backgroundColor,
                  borderColor: styles.badge.borderColor
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">{translations.hero.badge}</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold">
                  <span
                    className="block mb-2"
                    style={{
                      color: styles.hero.nameColor,
                      WebkitTextStroke: styles.hero.nameOutlineWidth > 0
                        ? `${styles.hero.nameOutlineWidth}px ${styles.hero.nameOutline}`
                        : 'none',
                      textShadow: styles.hero.nameGlowIntensity > 0
                        ? `0 0 ${styles.hero.nameGlowIntensity}px ${styles.hero.nameGlow}`
                        : 'none'
                    }}
                  >
                    {translations.hero.name}
                  </span>
                  <span
                    className="block bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${styles.hero.subtitleGradientFrom}, ${styles.hero.subtitleGradientTo})`
                    }}
                  >
                    {translations.hero.subtitle}
                  </span>
                </h1>
                <p
                  className="text-xl md:text-2xl max-w-3xl mx-auto"
                  style={{ color: styles.description.textColor }}
                >
                  {translations.hero.description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-gray-700 hover:bg-gray-600 shadow-lg shadow-gray-900/50 text-lg h-14 px-8 text-white"
                >
                  <a href="#projects">
                    {translations.cta.primary}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-gray-600 hover:bg-gray-800/50 text-lg h-14 px-8 text-gray-300">
                  <Mail className="mr-2 h-5 w-5" />
                  {translations.cta.secondary}
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-4 pt-6">
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600 transition-all group"
                  >
                    <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition" />
                  </a>
                )}
                {youtubeUrl && (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600 transition-all group"
                  >
                    <Youtube className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section id="projects" className="relative z-10 px-4 py-20 bg-gradient-to-b from-transparent to-black/60 scroll-mt-24">
          <div className="container mx-auto max-w-6xl">
            <div className="space-y-10">
              <div className="text-center space-y-3">
                <h2 className="text-4xl font-bold" style={{ color: styles.pillars.titleColor }}>
                  {portfolioText.title}
                </h2>
                {portfolioText.subtitle?.trim() && (
                  <p className="text-lg max-w-3xl mx-auto" style={{ color: styles.pillars.descriptionColor }}>
                    {portfolioText.subtitle}
                  </p>
                )}
              </div>

              <div className="space-y-6">
                <Card
                  className="group border-gray-700/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2"
                  style={{ backgroundColor: styles.pillars.backgroundColor || "rgba(17, 24, 39, 0.5)" }}
                >
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 h-[240px] md:h-[280px] lg:h-[320px]">
                        {minecraftMapUrl ? (
                          <iframe
                            src={minecraftMapUrl}
                            style={{ border: "none" }}
                            className="h-full w-full"
                            loading="lazy"
                            allowFullScreen
                            title="Minecraft Server Map"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-gray-400">
                            <Server className="h-8 w-8 text-gray-200" />
                            <p className="text-sm">{portfolioFallback.placeholders.mapMissing}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex h-full flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-lg shadow-gray-900/50">
                            <Server className="w-6 h-6 text-gray-200" />
                          </div>
                          <h3 className="text-xl font-bold" style={{ color: styles.pillars.titleColor }}>
                            {portfolioText.minecraft.title}
                          </h3>
                        </div>
                        <p className="leading-relaxed" style={{ color: styles.pillars.descriptionColor }}>
                          {portfolioText.minecraft.description}
                        </p>
                        {minecraftLinkUrl && (
                          <div className="pt-2 mt-auto">
                            <Button asChild variant="outline" className="border-gray-600/70 text-gray-200 hover:bg-gray-800/60">
                              <a href={minecraftLinkUrl} target="_blank" rel="noopener noreferrer">
                                {portfolioText.minecraft.linkLabel}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="group border-gray-700/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2"
                  style={{ backgroundColor: styles.pillars.backgroundColor || "rgba(17, 24, 39, 0.5)" }}
                >
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40 h-[240px] md:h-[280px] lg:h-[320px]">
                        {sensorHubEmbedUrl ? (
                          <iframe
                            src={sensorHubEmbedUrl}
                            style={{ border: "none" }}
                            className="h-full w-full"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            title="SensorHub Video"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-gray-400">
                            <Cpu className="h-8 w-8 text-gray-200" />
                            <p className="text-sm">{portfolioFallback.placeholders.videoMissing}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex h-full flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-lg shadow-gray-900/50">
                            <Cpu className="w-6 h-6 text-gray-200" />
                          </div>
                          <h3 className="text-xl font-bold" style={{ color: styles.pillars.titleColor }}>
                            {portfolioText.sensorHub.title}
                          </h3>
                        </div>
                        <p className="leading-relaxed" style={{ color: styles.pillars.descriptionColor }}>
                          {portfolioText.sensorHub.description}
                        </p>
                        {sensorHubLinkUrl && (
                          <div className="pt-2 mt-auto">
                            <Button asChild variant="outline" className="border-gray-600/70 text-gray-200 hover:bg-gray-800/60">
                              <a href={sensorHubLinkUrl} target="_blank" rel="noopener noreferrer">
                                {portfolioText.sensorHub.linkLabel}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="group border-gray-700/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2"
                  style={{ backgroundColor: styles.pillars.backgroundColor || "rgba(17, 24, 39, 0.5)" }}
                >
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
                      <div className="rounded-2xl border border-white/10 bg-black/40 h-[240px] md:h-[280px] lg:h-[320px] px-6 py-10 text-center text-gray-400 flex flex-col items-center justify-center">
                        <Lock className="mx-auto h-8 w-8 text-gray-200" />
                        <p className="mt-3 text-sm">{portfolioFallback.placeholders.lockedHint}</p>
                      </div>
                      <div className="flex h-full flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg shadow-gray-900/50">
                            <Lock className="w-6 h-6 text-gray-200" />
                          </div>
                          <h3 className="text-xl font-bold" style={{ color: styles.pillars.titleColor }}>
                            {portfolioText.commercial.title}
                          </h3>
                        </div>
                        <p className="leading-relaxed" style={{ color: styles.pillars.descriptionColor }}>
                          {portfolioText.commercial.description}
                        </p>
                        {commercialLinkUrl && (
                          <div className="pt-2 mt-auto">
                            <Button asChild variant="outline" className="border-gray-600/70 text-gray-200 hover:bg-gray-800/60">
                              <a href={commercialLinkUrl} target="_blank" rel="noopener noreferrer">
                                {portfolioText.commercial.linkLabel}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Call-out Section */}
        <section className="relative py-24">
          <div className="container mx-auto px-4">
            <Card
              className="glass-card border-white/20 max-w-3xl mx-auto"
              style={{ backgroundColor: styles.callout?.backgroundColor || 'rgba(255, 255, 255, 0.05)' }}
            >
              <CardContent className="pt-12 pb-12 text-center space-y-6">
                <h2 className="text-4xl font-bold" style={{ color: styles.callout.titleColor }}>
                  {content.callout.title || translations.callout.title}
                </h2>
                <p className="text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: styles.callout.descriptionColor }}>
                  {content.callout.description || translations.callout.description}
                </p>
                <div className="pt-4">
                  <Link href="/login">
                    <Button size="lg" className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white text-lg h-14 px-10">
                      {translations.nav.getStarted}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-gray-700/50 bg-black/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                {content.footer?.copyright || "(c) 2025 Vladimir Linartas. All rights reserved."}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                {isAdmin && (
                  <Link href="/admin" className="hover:text-gray-300 transition">
                    Admin
                  </Link>
                )}
                {isAuthenticated && (
                  <Link href="/dashboard" className="hover:text-gray-300 transition">
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
