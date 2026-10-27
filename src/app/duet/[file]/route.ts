import { stat } from "fs/promises"
import { extname, join } from "path"
import { DUET_DIR, DUET_FILE_NAME, readDuetRelease } from "@/lib/duet"
import { fileResponse } from "@/lib/file-response"

/**
 * linart.club/duet/<file> — the LinArt Duet update folder (DUET_DIR volume, see src/lib/duet.ts).
 *   update.json   polled by every installed app: never cached, so a new release shows up at once
 *   *.exe         the setup / update download (versioned names), resumable
 *   download      302 to the current setup, for links that should not change with each version
 */

const CONTENT_TYPES: Record<string, string> = {
  ".json": "application/json; charset=utf-8",
  ".exe": "application/vnd.microsoft.portable-executable",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".txt": "text/plain; charset=utf-8",
}

async function serve(request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params

  if (file === "download") {
    const release = await readDuetRelease()
    const target = release ? `/duet/${release.file}` : "/duet"
    return new Response(null, { status: 302, headers: { Location: target, "Cache-Control": "no-store" } })
  }

  if (!DUET_FILE_NAME.test(file)) return new Response("Not found", { status: 404 })
  const filePath = join(DUET_DIR, file)
  let size: number
  try {
    const info = await stat(filePath)
    if (!info.isFile()) return new Response("Not found", { status: 404 })
    size = info.size
  } catch {
    return new Response("Not found", { status: 404 })
  }

  const ext = extname(file).toLowerCase()
  const headers = new Headers()
  headers.set("Content-Type", CONTENT_TYPES[ext] || "application/octet-stream")
  if (file === "update.json") {
    headers.set("Cache-Control", "no-cache")
  } else {
    // A version is never re-uploaded under the same name in normal use; a day keeps a wrong upload fixable.
    headers.set("Cache-Control", "public, max-age=86400")
  }
  if (ext === ".exe") headers.set("Content-Disposition", `attachment; filename="${file}"`)
  return fileResponse(request, filePath, size, headers)
}

export const GET = serve
export const HEAD = serve
