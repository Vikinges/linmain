import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"
import { getPageIdByIdOrSlug } from "@/lib/editor/pages"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const page = await getPageIdByIdOrSlug(pageId)
  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const revisions = await prisma.pageRevision.findMany({
    where: { pageId: page.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  return NextResponse.json({ revisions })
}
