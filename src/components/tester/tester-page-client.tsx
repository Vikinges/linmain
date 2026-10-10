"use client"

import { PublicPage } from "@/components/editor/public-page"
import { TesterForm } from "@/components/tester/tester-form"
import type { HomepageContent, TextStyles } from "@/lib/content-config"
import type { ThemeConfig } from "@/lib/theme-config"

type Props = {
  globalContent: HomepageContent
  theme: ThemeConfig
  styles: TextStyles
}

/** linart.club/tester — the CRM-IoT tester request form inside the normal public page frame. */
export function TesterPageClient({ globalContent, theme, styles }: Props) {
  return (
    <PublicPage
      blocks={[]}
      globalContent={globalContent}
      theme={theme}
      styles={styles}
      renderExtra={(language) => <TesterForm language={language} />}
    />
  )
}
