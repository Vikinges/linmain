import type { TesterRequest } from "@prisma/client"

/**
 * Tells the owner about a new tester request. linart.club has no mail of its own, so it calls a small
 * endpoint on host.crm-iot.com, which sends an e-mail and a push to the owner (it already has both).
 *
 * Enabled only when both TESTER_NOTIFY_URL and TESTER_NOTIFY_TOKEN are set. Never throws: the request is
 * already saved, and the admin inbox (/admin/requests) is the source of truth.
 */
export async function notifyTesterRequest(request: TesterRequest) {
  const url = process.env.TESTER_NOTIFY_URL?.trim()
  const token = process.env.TESTER_NOTIFY_TOKEN?.trim()
  if (!url || !token) return

  const site = (process.env.NEXTAUTH_URL || "https://linart.club").replace(/\/+$/, "")
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        id: request.id,
        createdAt: request.createdAt.toISOString(),
        name: request.name,
        email: request.email,
        phone: request.phone,
        company: request.company,
        kind: request.kind,
        units: request.units,
        channels: request.channels,
        interests: request.interests,
        address: request.address,
        lat: request.lat,
        lng: request.lng,
        message: request.message,
        lang: request.lang,
        adminUrl: `${site}/admin/requests`,
      }),
      signal: controller.signal,
    })
    if (!res.ok) console.error(`tester-notify: ${res.status} from ${url}`)
  } catch (error) {
    console.error("tester-notify: call failed", error instanceof Error ? error.message : error)
  } finally {
    clearTimeout(timer)
  }
}
