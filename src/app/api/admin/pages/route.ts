import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"
import { ensureDefaultPages } from "@/lib/editor/seed"

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await ensureDefaultPages()

  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      publishedRevision: true,
      draftRevision: true,
    },
  })

  return NextResponse.json({ pages })
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let payload: { title?: string; slug?: string } = {}
  try {
    payload = await request.json()
  } catch {
    payload = {}
  }

  const title = (payload.title || "New Page").trim() || "New Page"
  const slug = (payload.slug || "").trim().toLowerCase()

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 })
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: "Slug can contain only latin letters, numbers, and dashes" },
      { status: 400 }
    )
  }

  const reserved = new Set([
    "admin",
    "login",
    "register",
    "dashboard",
    "api",
    "p",
    "uploads",
    "auth",
    "settings",
    "editor",
    "appearance",
    "content",
  ])

  if (reserved.has(slug)) {
    return NextResponse.json({ error: "Slug is reserved" }, { status: 400 })
  }

  let page
  try {
    page = await prisma.page.create({
      data: {
        slug,
        title,
      },
    })
  } catch {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
  }

  const revision = await prisma.pageRevision.create({
    data: {
      pageId: page.id,
      title,
      blocks: [],
      createdById: session.user.id,
    },
  })

  const updated = await prisma.page.update({
    where: { id: page.id },
    data: { draftRevisionId: revision.id },
    include: {
      publishedRevision: true,
      draftRevision: true,
    },
  })

  return NextResponse.json({ page: updated })
}
