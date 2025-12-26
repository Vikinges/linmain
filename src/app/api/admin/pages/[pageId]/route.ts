import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"
import { sanitizeBlocks } from "@/lib/editor/sanitize"

export async function GET(
  _request: Request,
  { params }: { params: { pageId: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const page = await prisma.page.findUnique({
    where: { id: params.pageId },
    include: {
      publishedRevision: true,
      draftRevision: true,
    },
  })

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ page })
}

export async function PUT(
  request: Request,
  { params }: { params: { pageId: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let payload: { title?: string; blocks?: unknown } = {}
  try {
    payload = await request.json()
  } catch {
    payload = {}
  }

  const page = await prisma.page.findUnique({ where: { id: params.pageId } })
  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const title = (payload.title || page.title).trim() || page.title
  const blocks = sanitizeBlocks(payload.blocks)

  const revision = await prisma.pageRevision.create({
    data: {
      pageId: page.id,
      title,
      blocks,
      createdById: session.user.id,
    },
  })

  const updated = await prisma.page.update({
    where: { id: page.id },
    data: {
      title,
      draftRevisionId: revision.id,
    },
    include: {
      publishedRevision: true,
      draftRevision: true,
    },
  })

  const revisions = await prisma.pageRevision.findMany({
    where: { pageId: page.id },
    orderBy: { createdAt: "desc" },
  })

  const keep = new Set<string>()
  if (updated.publishedRevisionId) keep.add(updated.publishedRevisionId)
  for (const rev of revisions.slice(0, 10)) {
    keep.add(rev.id)
  }

  const toDelete = revisions.filter((rev) => !keep.has(rev.id))
  if (toDelete.length > 0) {
    await prisma.pageRevision.deleteMany({
      where: { id: { in: toDelete.map((rev) => rev.id) } },
    })
  }

  return NextResponse.json({ page: updated })
}

export async function DELETE(
  _request: Request,
  { params }: { params: { pageId: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.page.delete({ where: { id: params.pageId } })
  return NextResponse.json({ ok: true })
}
