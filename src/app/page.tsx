import { PublicPage } from "@/components/editor/public-page"
import { ensureDefaultPages } from "@/lib/editor/seed"
import { getPublishedPage } from "@/lib/editor/pages"
import { readSiteConfig } from "@/lib/editor/site-config"
import type { PageBlock } from "@/lib/editor/types"

export default async function HomePage() {
  await ensureDefaultPages()
  const page = await getPublishedPage("home")
  const { theme, content, styles } = await readSiteConfig()

  const blocks = (page?.publishedRevision?.blocks as PageBlock[]) || []

  return <PublicPage blocks={blocks} globalContent={content} theme={theme} styles={styles} />
}
