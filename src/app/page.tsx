"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BackgroundVideo } from "@/components/layout/background-video"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { loadTheme, saveTheme, type ThemeConfig } from "@/lib/theme-config"
import {
  loadContent,
  saveContent,
  loadContentStyles,
  saveContentStyles,
  type HomepageContent,
  type TextStyles,
} from "@/lib/content-config"
import { loadLanguage, type Language } from "@/lib/i18n-config"
import { getTranslations, type Translations } from "@/lib/translations"
import {
  Briefcase,
  Video,
  Code,
  ArrowRight,
  Linkedin,
  Youtube,
  Mail,
  Sparkles
} from "lucide-react"

export default function HomePage() {
  const [theme, setTheme] = useState<ThemeConfig>(() => loadTheme())
  const [language, setLanguage] = useState<Language>(() => loadLanguage())
  const [translations, setTranslations] = useState<Translations>(() => getTranslations(loadLanguage()))
  const [styles, setStyles] = useState<TextStyles>(() => loadContentStyles())
  const [content, setContent] = useState<HomepageContent>(() => loadContent())
  const { data: session } = useSession()
  const isAdmin = Boolean(session?.user?.isAdmin || session?.user?.role === "ADMIN")
  const isAuthenticated = Boolean(session?.user)

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
                <Button size="lg" className="bg-gray-700 hover:bg-gray-600 shadow-lg shadow-gray-900/50 text-lg h-14 px-8 text-white">
                  {translations.cta.primary}
                  <ArrowRight className="ml-2 h-5 w-5" />
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

        {/* Three Pillars */}
        <section className="relative z-10 px-4 py-20 bg-gradient-to-b from-transparent to-black/60">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6">

              {/* Business */}
              <Card className="group bg-gray-900/50 backdrop-blur-xl border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-lg shadow-gray-900/50 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-8 h-8 text-gray-200" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: styles.pillars.titleColor }}>
                    {translations.pillars.business.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: styles.pillars.descriptionColor }}>
                    {translations.pillars.business.description}
                  </p>
                </CardContent>
              </Card>

              {/* Video Creation */}
              <Card className="group bg-gray-900/50 backdrop-blur-xl border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-lg shadow-gray-900/50 group-hover:scale-110 transition-transform">
                    <Video className="w-8 h-8 text-gray-200" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: styles.pillars.titleColor }}>
                    {translations.pillars.content.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: styles.pillars.descriptionColor }}>
                    {translations.pillars.content.description}
                  </p>
                </CardContent>
              </Card>

              {/* Technology */}
              <Card className="group bg-gray-900/50 backdrop-blur-xl border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg shadow-gray-900/50 group-hover:scale-110 transition-transform">
                    <Code className="w-8 h-8 text-gray-200" />
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: styles.pillars.titleColor }}>
                    {translations.pillars.tech.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: styles.pillars.descriptionColor }}>
                    {translations.pillars.tech.description}
                  </p>
                </CardContent>
              </Card>

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
