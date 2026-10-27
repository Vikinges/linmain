import type { MetadataRoute } from "next"

// Rendered per request: at build time NEXTAUTH_URL is the local one (localhost), which ended up in the live file.
export const dynamic = "force-dynamic"

const SITE_URL = process.env.NEXTAUTH_URL?.startsWith("http") ? process.env.NEXTAUTH_URL.replace(/\/+$/, "") : "https://linart.club"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/dashboard", "/login", "/register", "/test-db"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
