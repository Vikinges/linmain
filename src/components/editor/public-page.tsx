"use client"

import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { BackgroundVideo } from "@/components/layout/background-video"
import { BrandLogo } from "@/components/layout/brand-logo"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { Button } from "@/components/ui/button"
import { applyTheme, type ThemeConfig, defaultTheme } from "@/lib/theme-config"
import { defaultLanguage, languages, loadLanguage, saveLanguage, type Language } from "@/lib/i18n-config"
import { getTranslations } from "@/lib/translations"
import { applyContentStyles, type HomepageContent, type TextStyles } from "@/lib/content-config"
import type { PageBlock } from "@/lib/editor/types"
import { PageRenderer } from "@/components/editor/page-renderer"
import { APP_VERSION } from "@/lib/app-version"

type PublicPageProps = {
  blocks: PageBlock[]
  globalContent: HomepageContent
  theme: ThemeConfig
  styles: TextStyles
  /** Extra content rendered after the blocks (e.g. the tester request form), in the current UI language. */
  renderExtra?: (language: Language) => ReactNode
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

// UI language as an external store: the server (and the hydration pass) render the default language, the
// browser then switches to the visitor's language without a hydration mismatch.
const LANGUAGE_EVENT = "linart:language"

const subscribeLanguage = (onChange: () => void) => {
  window.addEventListener(LANGUAGE_EVENT, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(LANGUAGE_EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

/** ?lang=de|en|ru in the URL wins (links from host.crm-iot.com, e-mails) and is remembered; else saved / browser language. */
const readClientLanguage = (): Language => {
  const wanted = new URLSearchParams(window.location.search).get("lang")
  if (wanted && languages.some((l) => l.code === wanted)) {
    saveLanguage(wanted as Language)
    return wanted as Language
  }
  return loadLanguage()
}

const readServerLanguage = (): Language => defaultLanguage

export function PublicPage({ blocks, globalContent, theme, styles, renderExtra }: PublicPageProps) {
  const language = useSyncExternalStore(subscribeLanguage, readClientLanguage, readServerLanguage)
  const translations = useMemo(() => getTranslations(language), [language])
  const { data: session } = useSession()
  const isAdmin = Boolean(session?.user?.isAdmin || session?.user?.role === "ADMIN")
  const isLoggedIn = Boolean(session?.user)

  useEffect(() => {
    applyTheme(theme || defaultTheme)
  }, [theme])

  useEffect(() => {
    applyContentStyles(styles)
  }, [styles])

  // Keep <html lang> in sync with the chosen UI language (SEO + screen readers).
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const handleLanguageChange = (nextLang: Language) => {
    saveLanguage(nextLang)
    // A manual choice beats the ?lang= of the link the visitor came from.
    const url = new URL(window.location.href)
    if (url.searchParams.has("lang")) {
      url.searchParams.delete("lang")
      window.history.replaceState(window.history.state, "", url.toString())
    }
    window.dispatchEvent(new Event(LANGUAGE_EVENT))
  }

  const localeOverrides = globalContent.locales?.[language]
  const legacyNav = language === "en" ? globalContent.nav : undefined
  const legacyFooter = language === "en" ? globalContent.footer : undefined
  const navLabel = pickText(localeOverrides?.nav?.getStarted, pickText(legacyNav?.getStarted, translations.nav.getStarted))
  const footerText = pickText(localeOverrides?.footer?.copyright, pickText(legacyFooter?.copyright, translations.footer.copyright))
  const dashboardLabel = translations.footer.dashboard || "Dashboard"
  // The renderer puts id="projects" on the first project/portfolio block, so "#projects" always resolves.
  const hasProjects = useMemo(
    () =>
      blocks.some(
        (block) =>
          block.type === "project" ||
          (block.type === "portfolio" && Array.isArray(block.data.items) && block.data.items.length > 0)
      ),
    [blocks]
  )
  const navHref = hasProjects ? "#projects" : "/#projects"

  const logoUrl = (globalContent.media?.logoUrl || "/logo.png").trim() || "/logo.png"

  return (
    <>
      <BackgroundVideo
        videoUrl={theme.background.videoUrl}
        blurAmount={theme.background.blurAmount}
        opacity={theme.background.opacity}
        fallbackImage={theme.background.fallbackImage}
      />

      {/* Soft colour glows behind the glass — gives the dark page depth without competing with content. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[380px] w-[380px] rounded-full bg-emerald-500/[0.07] blur-3xl" />
      </div>

      <div className="min-h-screen flex flex-col">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 backdrop-blur-md bg-background/70">
          <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-3">
            <BrandLogo
              href="/"
              label="LINART"
              logoUrl={logoUrl}
              size={44}
              className="shrink-0"
              labelClassName="hidden sm:block text-2xl font-bold text-gray-200"
            />

            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
              <Link href={isLoggedIn ? "/dashboard" : "/login"} className="hidden sm:block">
                <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                  {isLoggedIn ? dashboardLabel : translations.nav.login}
                </Button>
              </Link>
              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" asChild>
                <Link href={navHref}>{navLabel}</Link>
              </Button>
            </div>
          </div>
        </nav>

        <main className="flex-1 pt-32 pb-24">
          {/* key: a language switch rebuilds the blocks. Browser page translation (Chrome/Edge) swaps text
              nodes for its own <font> wrappers, so an in-place update left icon buttons in the old language. */}
          <PageRenderer key={`blocks-${language}`} blocks={blocks} language={language} styles={styles} />
          {renderExtra?.(language)}
        </main>

        <footer className="relative z-10 border-t border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-8 flex flex-col items-center gap-4 text-muted-foreground text-sm">
            <p>{footerText}</p>
            <p className="text-xs text-muted-foreground/90">Linart v{APP_VERSION}</p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground/90">
              <Link href="/p/impressum" className="px-3 py-2 hover:text-foreground transition-colors">
                Impressum
              </Link>
              <Link href="/p/datenschutz" className="px-3 py-2 hover:text-foreground transition-colors">
                Datenschutz
              </Link>
              {!isLoggedIn && (
                <Link href="/login" className="px-3 py-2 sm:hidden hover:text-foreground transition-colors">
                  {translations.nav.login}
                </Link>
              )}
              {isLoggedIn && (
                <Link href="/dashboard" className="px-3 py-2 sm:hidden hover:text-foreground transition-colors">
                  {dashboardLabel}
                </Link>
              )}
            </div>
            {isAdmin && (
              <Link href="/admin" className="text-xs text-muted-foreground/90 hover:text-foreground">
                Admin
              </Link>
            )}
          </div>
        </footer>
      </div>
    </>
  )
}
