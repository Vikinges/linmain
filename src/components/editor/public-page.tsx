"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { BackgroundVideo } from "@/components/layout/background-video"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { Button } from "@/components/ui/button"
import { applyTheme, type ThemeConfig, defaultTheme } from "@/lib/theme-config"
import { loadLanguage, saveLanguage, type Language } from "@/lib/i18n-config"
import { getTranslations } from "@/lib/translations"
import { applyContentStyles, type HomepageContent, type TextStyles } from "@/lib/content-config"
import type { PageBlock } from "@/lib/editor/types"
import { PageRenderer } from "@/components/editor/page-renderer"

type PublicPageProps = {
  blocks: PageBlock[]
  globalContent: HomepageContent
  theme: ThemeConfig
  styles: TextStyles
}

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

export function PublicPage({ blocks, globalContent, theme, styles }: PublicPageProps) {
  const [language, setLanguage] = useState<Language>(() => loadLanguage())
  const translations = useMemo(() => getTranslations(language), [language])
  const { data: session } = useSession()
  const isAdmin = Boolean(session?.user?.isAdmin || session?.user?.role === "ADMIN")

  useEffect(() => {
    applyTheme(theme || defaultTheme)
  }, [theme])

  useEffect(() => {
    applyContentStyles(styles)
  }, [styles])

  const handleLanguageChange = (nextLang: Language) => {
    setLanguage(nextLang)
    saveLanguage(nextLang)
  }

  const localeOverrides = globalContent.locales?.[language]
  const legacyNav = language === "en" ? globalContent.nav : undefined
  const legacyFooter = language === "en" ? globalContent.footer : undefined
  const navLabel = pickText(localeOverrides?.nav?.getStarted, pickText(legacyNav?.getStarted, translations.nav.getStarted))
  const footerText = pickText(localeOverrides?.footer?.copyright, pickText(legacyFooter?.copyright, translations.footer.copyright))

  const logoUrl = (globalContent.media?.logoUrl || "/logo.png").trim() || "/logo.png"

  return (
    <>
      <BackgroundVideo
        videoUrl={theme.background.videoUrl}
        blurAmount={theme.background.blurAmount}
        opacity={theme.background.opacity}
        fallbackImage={theme.background.fallbackImage}
      />

      <div className="min-h-screen flex flex-col">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-black/30">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src={logoUrl}
                alt="Linart Logo"
                width={48}
                height={48}
                className="transition-transform group-hover:scale-105"
              />
              <span className="text-2xl font-bold text-gray-200">LINART</span>
            </Link>

            <div className="flex items-center gap-3">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
              <Link href="/login">
                <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                  {translations.nav.login}
                </Button>
              </Link>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white">
                {navLabel}
              </Button>
            </div>
          </div>
        </nav>

        <main className="flex-1 pt-32 pb-24">
          <PageRenderer blocks={blocks} language={language} styles={styles} />
        </main>

        <footer className="relative z-10 border-t border-gray-700/50 bg-black/50 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-4 text-gray-400 text-sm">
            <p>{footerText}</p>
            {isAdmin && (
              <Link href="/admin" className="text-xs text-gray-500 hover:text-gray-200">
                Admin
              </Link>
            )}
          </div>
        </footer>
      </div>
    </>
  )
}
