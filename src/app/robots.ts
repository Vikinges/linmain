import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXTAUTH_URL?.startsWith("http") ? process.env.NEXTAUTH_URL.replace(/\/+$/, "") : "https://linart.club"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/dashboard", "/login", "/register", "/test-db"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
