import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"
import { defaultTheme, type ThemeConfig } from "@/lib/theme-config"
import {
  defaultContent,
  defaultStyles,
  type HomepageContent,
  type TextStyles,
} from "@/lib/content-config"

const CONFIG_KEYS = {
  theme: "theme",
  content: "content",
  styles: "contentStyles",
} as const

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

async function readConfig(): Promise<SiteConfigPayload> {
  const rows = await prisma.siteConfig.findMany({
    where: { key: { in: Object.values(CONFIG_KEYS) } },
  })

  const map = new Map(rows.map((row) => [row.key, row.value]))
  const theme = deepMerge(defaultTheme, (map.get(CONFIG_KEYS.theme) as Partial<ThemeConfig>) || {})
  const content = deepMerge(
    defaultContent,
    (map.get(CONFIG_KEYS.content) as Partial<HomepageContent>) || {}
  )
  const styles = deepMerge(
    defaultStyles,
    (map.get(CONFIG_KEYS.styles) as Partial<TextStyles>) || {}
  )

  return { theme, content, styles }
}

export async function GET() {
  const config = await readConfig()
  return NextResponse.json(config)
}

export async function PUT(request: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let payload: Partial<SiteConfigPayload> = {}
  try {
    payload = await request.json()
  } catch {
    payload = {}
  }

  const updates: Array<{ key: string; value: Prisma.InputJsonValue }> = []

  if (payload.theme) {
    updates.push({
      key: CONFIG_KEYS.theme,
      value: deepMerge(defaultTheme, payload.theme) as unknown as Prisma.InputJsonValue,
    })
  }

  if (payload.content) {
    updates.push({
      key: CONFIG_KEYS.content,
      value: deepMerge(defaultContent, payload.content) as unknown as Prisma.InputJsonValue,
    })
  }

  if (payload.styles) {
    updates.push({
      key: CONFIG_KEYS.styles,
      value: deepMerge(defaultStyles, payload.styles) as unknown as Prisma.InputJsonValue,
    })
  }

  if (!updates.length) {
    return NextResponse.json({ ok: true })
  }

  await Promise.all(
    updates.map((update) =>
      prisma.siteConfig.upsert({
        where: { key: update.key },
        update: { value: update.value },
        create: { key: update.key, value: update.value },
      })
    )
  )

  return NextResponse.json({ ok: true })
}
