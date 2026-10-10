import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const rows = await prisma.testerRequest.findMany({ orderBy: { createdAt: "desc" }, take: 500 })
  return NextResponse.json({
    requests: rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString() })),
  })
}
