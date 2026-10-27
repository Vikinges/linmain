import { createPublicKey, verify } from "crypto"
import { readFile } from "fs/promises"
import { join } from "path"

/**
 * LinArt Duet (free Windows file manager, repo linartduet) is released into DUET_DIR, a volume next to the app
 * (/opt/linart/duet on the VPS): `update.json` + `LinArtDuet-Setup-<version>.exe`, both made by `build-release.ps1`.
 * The app itself polls https://linart.club/duet/update.json, so the file names and the feed format are a contract.
 */
export const DUET_DIR = process.env.DUET_DIR || join(process.cwd(), "duet")

/** Public half of the release key (compiled into the app too, UpdateService.cs). Not a secret. */
const RELEASE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE+iEhAj2M/9XaNqk98n1R0DIYcxDq
bKhBzhWJJyy4QzG298tVUOIMMy+aGXMEVHJZ9O3Nw89QnHWJPCae7e0KWg==
-----END PUBLIC KEY-----`

/** Names the /duet/<file> route may serve. */
export const DUET_FILE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]{0,120}$/

export type DuetRelease = {
  version: string
  published: string
  /** File name of the setup exe inside DUET_DIR. */
  file: string
  size: number
  sha256: string
  notes: Record<string, string>
}

let cache: { at: number; release: DuetRelease | null } | null = null
const CACHE_MS = 60 * 1000

/**
 * The current release from update.json — only when the manifest carries a valid signature of the release key,
 * so the site never advertises a file the app itself would refuse. null when nothing (valid) is published.
 */
export async function readDuetRelease(): Promise<DuetRelease | null> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.release
  const release = await loadRelease()
  cache = { at: Date.now(), release }
  return release
}

async function loadRelease(): Promise<DuetRelease | null> {
  try {
    const envelope = JSON.parse(await readFile(join(DUET_DIR, "update.json"), "utf8")) as { manifest?: string; signature?: string }
    if (!envelope.manifest || !envelope.signature) return null
    const bytes = Buffer.from(envelope.manifest, "base64")
    const signature = Buffer.from(envelope.signature, "base64")
    const key = createPublicKey(RELEASE_PUBLIC_KEY)
    // The app signs with IEEE P1363 (r||s), not DER.
    if (!verify("sha256", bytes, { key, dsaEncoding: "ieee-p1363" }, signature)) {
      console.error("duet: update.json signature is not valid")
      return null
    }
    const m = JSON.parse(bytes.toString("utf8")) as {
      product?: string
      version?: string
      published?: string
      url?: string
      size?: number
      sha256?: string
      notes?: Record<string, string>
    }
    if (m.product !== "LinArtDuet" || !m.version || !m.url || !DUET_FILE_NAME.test(m.url) || !m.size || m.sha256?.length !== 64) {
      console.error("duet: update.json does not describe a local setup file")
      return null
    }
    return {
      version: m.version,
      published: m.published || "",
      file: m.url,
      size: m.size,
      sha256: m.sha256,
      notes: m.notes || {},
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") console.error("duet: cannot read update.json", error)
    return null
  }
}
