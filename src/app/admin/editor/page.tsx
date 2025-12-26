import { requireAdmin } from "@/lib/admin"
import { EditorDashboard } from "@/components/editor/editor-dashboard"

export default async function AdminEditorPage() {
  await requireAdmin()
  return <EditorDashboard />
}
