import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import { PageEditor } from "@/components/editor/page-editor"

export default async function AdminPageEditor({ params }: { params: { pageId: string } }) {
  await requireAdmin()
  const pageId = params.pageId
  if (!pageId || pageId === "undefined" || pageId === "null") {
    redirect("/admin/editor")
  }
  return <PageEditor pageId={pageId} />
}
