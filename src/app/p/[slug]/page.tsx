import { notFound } from "next/navigation"
import { PublicPage } from "@/components/editor/public-page"
import { getPublishedPage } from "@/lib/editor/pages"
import { readSiteConfig } from "@/lib/editor/site-config"
import type { PageBlock } from "@/lib/editor/types"

export const dynamic = "force-dynamic"

export default async function PublicSlugPage({ params }: { params: { slug: string } }) {
  const page = await getPublishedPage(params.slug)
  if (!page?.publishedRevision) {
    notFound()
  }

  const { theme, content, styles } = await readSiteConfig()
  const blocks = (page.publishedRevision.blocks as PageBlock[]) || []

  return <PublicPage blocks={blocks} globalContent={content} theme={theme} styles={styles} />
}
