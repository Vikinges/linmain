import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"
import { getPageIdByIdOrSlug } from "@/lib/editor/pages"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params
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

  const page = await getPageIdByIdOrSlug(pageId)
  if (!page || page.id !== revision.pageId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const blocks = (revision.blocks ?? []) as Prisma.InputJsonValue

  const newRevision = await prisma.pageRevision.create({
    data: {
      pageId: revision.pageId,
      title: revision.title,
      blocks,
      createdById: session.user.id,
    },
  })

  const updated = await prisma.page.update({
    where: { id: page.id },
    data: { draftRevisionId: newRevision.id },
    include: {
      publishedRevision: true,
      draftRevision: true,
    },
  })

  return NextResponse.json({ page: updated })
}
