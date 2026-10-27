import type { Metadata } from "next"
import { DuetPageClient } from "@/components/duet/duet-page-client"
import { readDuetRelease } from "@/lib/duet"
import { readSiteConfig } from "@/lib/editor/site-config"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "LinArt Duet — free two-pane file manager for Windows",
  description:
    "LinArt Duet is a completely free two-pane file manager for Windows 10 and 11 in the spirit of Total Commander: tabs, Quick Look, command palette, folder sync, multi-rename, colour labels. No ads, no account.",
  alternates: { canonical: "/duet" },
}

export default async function DuetPage() {
  const [{ theme, content, styles }, release] = await Promise.all([readSiteConfig(), readDuetRelease()])
  return <DuetPageClient globalContent={content} theme={theme} styles={styles} release={release} />
}
