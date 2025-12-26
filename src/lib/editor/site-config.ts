import { prisma } from "@/lib/db"
import { defaultTheme, type ThemeConfig } from "@/lib/theme-config"
import { defaultContent, defaultStyles, type HomepageContent, type TextStyles } from "@/lib/content-config"

type SiteConfigPayload = {
  theme: ThemeConfig
  content: HomepageContent
  styles: TextStyles
}

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

export async function readSiteConfig(): Promise<SiteConfigPayload> {
  const rows = await prisma.siteConfig.findMany({
    where: { key: { in: ["theme", "content", "contentStyles"] } },
  })

  const map = new Map(rows.map((row) => [row.key, row.value]))
  const theme = deepMerge(defaultTheme, (map.get("theme") as Partial<ThemeConfig>) || {})
  const content = deepMerge(defaultContent, (map.get("content") as Partial<HomepageContent>) || {})
  const styles = deepMerge(defaultStyles, (map.get("contentStyles") as Partial<TextStyles>) || {})

  return { theme, content, styles }
}
