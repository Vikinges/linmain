import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"

export async function GET(
  _request: Request,
  { params }: { params: { pageId: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const revisions = await prisma.pageRevision.findMany({
    where: { pageId: params.pageId },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  return NextResponse.json({ revisions })
}
