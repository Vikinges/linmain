import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/admin"

type TranslateRequest = {
  texts: string[]
  source?: string
  target: string
  format?: "text" | "html"
}

const DEFAULT_URL = "https://libretranslate.com/translate"

async function translateText(
  url: string,
  text: string,
  source: string,
  target: string,
  format: "text" | "html",
  apiKey?: string
) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source,
      target,
      format,
      api_key: apiKey || undefined,
    }),
  })

  if (!response.ok) {
    throw new Error(`Translate failed: ${response.status}`)
  }

  const payload = await response.json()
  return typeof payload?.translatedText === "string" ? payload.translatedText : ""
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let payload: TranslateRequest | null = null
  try {
    payload = (await request.json()) as TranslateRequest
  } catch {
    payload = null
  }

  if (!payload || !Array.isArray(payload.texts) || !payload.target) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const url = process.env.LIBRETRANSLATE_URL || DEFAULT_URL
  const apiKey = process.env.LIBRETRANSLATE_API_KEY || undefined
  const source = payload.source || "auto"
  const format = payload.format || "text"

  const results: string[] = []
  for (const text of payload.texts) {
    if (!text) {
      results.push("")
      continue
    }
    const translated = await translateText(url, text, source, payload.target, format, apiKey)
    results.push(translated)
  }

  return NextResponse.json({ translations: results })
}
