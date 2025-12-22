import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [users, links, groups, messages, siteConfig] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.serviceLink.findMany({
      select: {
        id: true,
        title: true,
        url: true,
        icon: true,
        description: true,
        isPublic: true,
        order: true,
      },
    }),
    prisma.group.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
      },
    }),
    prisma.chatMessage.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        userId: true,
      },
    }),
    prisma.siteConfig.findMany({
      select: {
        key: true,
        value: true,
        updatedAt: true,
      },
    }),
  ])

  const payload = {
    exportedAt: new Date().toISOString(),
    users,
    links,
    groups,
    messages,
    siteConfig,
  }

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=linart-backup.json",
    },
  })
}
