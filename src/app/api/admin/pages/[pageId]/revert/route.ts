import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"

export async function POST(
  request: Request,
  { params }: { params: { pageId: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let payload: { revisionId?: string } = {}
  try {
    payload = await request.json()
  } catch {
    payload = {}
  }

  if (!payload.revisionId) {
    return NextResponse.json({ error: "revisionId required" }, { status: 400 })
  }

  const revision = await prisma.pageRevision.findUnique({
    where: { id: payload.revisionId },
  })

  if (!revision) {
    return NextResponse.json({ error: "Revision not found" }, { status: 404 })
  }

  const newRevision = await prisma.pageRevision.create({
    data: {
      pageId: revision.pageId,
      title: revision.title,
      blocks: revision.blocks,
      createdById: session.user.id,
    },
  })

  const updated = await prisma.page.update({
    where: { id: params.pageId },
    data: { draftRevisionId: newRevision.id },
    include: {
      publishedRevision: true,
      draftRevision: true,
    },
  })

  return NextResponse.json({ page: updated })
}
