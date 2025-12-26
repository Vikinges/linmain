import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"

export async function POST(
  _request: Request,
  { params }: { params: { pageId: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const page = await prisma.page.findUnique({
    where: { id: params.pageId },
    include: { draftRevision: true },
  })

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (!page.draftRevisionId) {
    return NextResponse.json({ error: "No draft to publish" }, { status: 400 })
  }

  const updated = await prisma.page.update({
    where: { id: page.id },
    data: { publishedRevisionId: page.draftRevisionId },
    include: {
      publishedRevision: true,
      draftRevision: true,
    },
  })

  return NextResponse.json({ page: updated })
}
