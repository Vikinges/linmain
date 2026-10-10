import type { Metadata } from "next"
import { TesterPageClient } from "@/components/tester/tester-page-client"
import { readSiteConfig } from "@/lib/editor/site-config"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "CRM-IoT — free tester access",
  description:
    "Request free tester access to CRM-IoT, the LinArt host app for rentals: bookings become door codes, guest cards and cleaning tasks. Optional smart locks, air-quality sensors, heating and AC control.",
  alternates: { canonical: "/tester" },
}

export default async function TesterPage() {
  const { theme, content, styles } = await readSiteConfig()
  return <TesterPageClient globalContent={content} theme={theme} styles={styles} />
}
