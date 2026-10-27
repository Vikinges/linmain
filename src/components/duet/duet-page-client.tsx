"use client"

import { PublicPage } from "@/components/editor/public-page"
import { DuetLanding } from "@/components/duet/duet-landing"
import type { HomepageContent, TextStyles } from "@/lib/content-config"
import type { DuetRelease } from "@/lib/duet"
import type { ThemeConfig } from "@/lib/theme-config"

type Props = {
  globalContent: HomepageContent
  theme: ThemeConfig
  styles: TextStyles
  release: DuetRelease | null
}

/** linart.club/duet inside the normal public page frame. */
export function DuetPageClient({ globalContent, theme, styles, release }: Props) {
  return (
    <PublicPage
      blocks={[]}
      globalContent={globalContent}
      theme={theme}
      styles={styles}
      // key: rebuilt on a language switch, see the PageRenderer note in PublicPage (browser page translation)
      renderExtra={(language) => <DuetLanding key={language} language={language} release={release} />}
    />
  )
}
