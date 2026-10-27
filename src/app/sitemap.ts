import type { MetadataRoute } from "next"

// Rendered per request: at build time NEXTAUTH_URL is the local one (localhost), which ended up in the live file.
export const dynamic = "force-dynamic"

const SITE_URL = process.env.NEXTAUTH_URL?.startsWith("http") ? process.env.NEXTAUTH_URL.replace(/\/+$/, "") : "https://linart.club"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tester`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/duet`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/p/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/p/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ]
}
