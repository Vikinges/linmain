"use client"

import { useEffect } from "react"
import { applyTheme, defaultTheme, type ThemeConfig } from "@/lib/theme-config"

type SiteConfigResponse = {
  theme?: ThemeConfig
}

export function ThemeProvider() {
  useEffect(() => {
    let isMounted = true

    const loadTheme = async () => {
      try {
        const response = await fetch("/api/site-config", { cache: "no-store" })
        if (!response.ok) return
        const data = (await response.json()) as SiteConfigResponse
        if (!isMounted) return
        applyTheme(data.theme || defaultTheme)
      } catch {
        if (isMounted) {
          applyTheme(defaultTheme)
        }
      }
    }

    loadTheme()
    return () => {
      isMounted = false
    }
  }, [])

  return null
}
