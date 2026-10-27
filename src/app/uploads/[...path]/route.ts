import { stat } from "fs/promises"
import { extname, join, normalize, sep } from "path"
import { NextRequest } from "next/server"
import { fileResponse } from "@/lib/file-response"

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365
const CONTENT_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
}

function getContentType(filePath: string) {
  return CONTENT_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream"
}

function resolveUploadPath(pathParts: string[]) {
  const baseDir = join(process.cwd(), "public", "uploads")
  const filePath = join(baseDir, ...pathParts)
  const normalized = normalize(filePath)
  if (!normalized.startsWith(baseDir + sep) && normalized !== baseDir) {
    return null
  }
  return normalized
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path = [] } = await params
  const filePath = resolveUploadPath(path)
  if (!filePath) {
    return new Response("Not found", { status: 404 })
  }

  let fileStat
  try {
    fileStat = await stat(filePath)
  } catch {
    return new Response("Not found", { status: 404 })
  }

  if (!fileStat.isFile()) {
    return new Response("Not found", { status: 404 })
  }

  const headers = new Headers()
  headers.set("Content-Type", getContentType(filePath))
  headers.set("Cache-Control", `public, max-age=${ONE_YEAR_IN_SECONDS}, immutable`)
  return fileResponse(request, filePath, fileStat.size, headers)
}
