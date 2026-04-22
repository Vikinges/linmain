import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const uniqueId = randomUUID()
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "") // Sanitize filename
    const filename = `${uniqueId}-${originalName}`

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), "public", "uploads")
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch {
      // Ignore error if directory exists
    }

    // Write file
    const path = join(uploadDir, filename)
    await writeFile(path, buffer)

    const url = `/uploads/${filename}`
    await prisma.mediaAsset.create({
      data: {
        url,
        originalName: originalName || filename,
        mimeType: file.type || "application/octet-stream",
        size: file.size,
        createdById: session.user.id,
      },
    })

    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 })
  }
}
