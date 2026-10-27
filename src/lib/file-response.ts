import { createReadStream } from "fs"
import { Readable } from "stream"

export function parseRange(range: string, size: number) {
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

/**
 * Streams a file with Range support (resumable downloads, video seeking). `headers` carries the caller's
 * Content-Type / Cache-Control; length, range and Accept-Ranges are set here. HEAD answers without a body.
 */
export function fileResponse(request: Request, filePath: string, size: number, headers: Headers) {
  headers.set("Accept-Ranges", "bytes")
  const withBody = request.method !== "HEAD"

  const rangeHeader = request.headers.get("range")
  if (rangeHeader) {
    const range = parseRange(rangeHeader, size)
    if (!range) {
      headers.set("Content-Range", `bytes */${size}`)
      return new Response(null, { status: 416, headers })
    }

    const { start, end } = range
    headers.set("Content-Length", (end - start + 1).toString())
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`)
    const body = withBody ? (Readable.toWeb(createReadStream(filePath, { start, end })) as unknown as ReadableStream<Uint8Array>) : null
    return new Response(body, { status: 206, headers })
  }

  headers.set("Content-Length", size.toString())
  const body = withBody ? (Readable.toWeb(createReadStream(filePath)) as unknown as ReadableStream<Uint8Array>) : null
  return new Response(body, { status: 200, headers })
}
