import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"

export async function GET(request: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const q = (searchParams.get("q") || "").trim()
  const limit = Math.min(Number(searchParams.get("limit") || 50), 200)

  const assets = await prisma.mediaAsset.findMany({
    where: q
      ? {
          OR: [
            { originalName: { contains: q, mode: "insensitive" } },
            { url: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
  })

  return NextResponse.json({ assets })
}
