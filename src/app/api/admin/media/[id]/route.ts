import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"
import { unlink } from "fs/promises"
import { join, normalize } from "path"

function getUploadPath(url: string) {
  if (!url.startsWith("/uploads/")) return null
  const uploadDir = join(process.cwd(), "public", "uploads")
  const target = normalize(join(process.cwd(), "public", url))
  if (!target.startsWith(uploadDir)) return null
  return target
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const asset = await prisma.mediaAsset.findUnique({
    where: { id: params.id },
  })

  if (!asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.mediaAsset.delete({ where: { id: asset.id } })

  const path = getUploadPath(asset.url)
  if (path) {
    try {
      await unlink(path)
    } catch {
      // Ignore missing files
    }
  }

  return NextResponse.json({ ok: true })
}
