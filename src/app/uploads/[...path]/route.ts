import { createReadStream } from "fs"
import { stat } from "fs/promises"
import { extname, join, normalize, sep } from "path"
import { Readable } from "stream"
import { NextRequest } from "next/server"

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

function parseRange(range: string, size: number) {
  const match = /bytes=(\d*)-(\d*)/.exec(range)
  if (!match) return null

  const startStr = match[1]
  const endStr = match[2]

  if (startStr === "" && endStr === "") return null

  if (startStr === "") {
    const suffixLength = Number.parseInt(endStr, 10)
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) return null
    const start = Math.max(size - suffixLength, 0)
    return { start, end: size - 1 }
  }

  const start = Number.parseInt(startStr, 10)
  const end = endStr ? Number.parseInt(endStr, 10) : size - 1

  if (!Number.isFinite(start) || !Number.isFinite(end)) return null
  if (start < 0 || end < start || start >= size) return null

  return { start, end: Math.min(end, size - 1) }
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
  headers.set("Accept-Ranges", "bytes")
  headers.set("Cache-Control", `public, max-age=${ONE_YEAR_IN_SECONDS}, immutable`)

  const rangeHeader = request.headers.get("range")
  if (rangeHeader) {
    const range = parseRange(rangeHeader, fileStat.size)
    if (!range) {
      headers.set("Content-Range", `bytes */${fileStat.size}`)
      return new Response(null, { status: 416, headers })
    }

    const { start, end } = range
    headers.set("Content-Length", (end - start + 1).toString())
    headers.set("Content-Range", `bytes ${start}-${end}/${fileStat.size}`)
    const stream = createReadStream(filePath, { start, end })
    const body = Readable.toWeb(stream) as unknown as ReadableStream<Uint8Array>
    return new Response(body, { status: 206, headers })
  }

  headers.set("Content-Length", fileStat.size.toString())
  const stream = createReadStream(filePath)
  const body = Readable.toWeb(stream) as unknown as ReadableStream<Uint8Array>
  return new Response(body, { status: 200, headers })
}
