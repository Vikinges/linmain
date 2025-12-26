import { requireAdmin } from "@/lib/admin"
import { PageEditor } from "@/components/editor/page-editor"

export default async function AdminPageEditor({ params }: { params: { pageId: string } }) {
  await requireAdmin()
  return <PageEditor pageId={params.pageId} />
}
