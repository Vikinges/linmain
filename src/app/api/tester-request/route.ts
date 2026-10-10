import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { validateTesterRequest } from "@/lib/tester-request"

/**
 * Public endpoint behind linart.club/tester. A plain route handler (not a server action) on purpose:
 * server actions failed behind the proxy before (see v1.17 upload fix).
 */

const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 5
const DUPLICATE_MS = 10 * 60 * 1000

// Per-IP limiter in memory: good enough for one small container; nothing about the IP is stored.
const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key)
  }
  return recent.length > MAX_PER_WINDOW
}

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || request.headers.get("x-real-ip") || "local"
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 })
  }

  const result = validateTesterRequest(body)
  if (!result.ok) {
    // Pretend success to bots so they do not retry with variations.
    if (result.error === "spam") return NextResponse.json({ ok: true })
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 })
  }

  const data = result.data
  try {
    const duplicate = await prisma.testerRequest.findFirst({
      where: { email: data.email, createdAt: { gte: new Date(Date.now() - DUPLICATE_MS) } },
      select: { id: true },
    })
    if (duplicate) return NextResponse.json({ ok: true, duplicate: true })

    await prisma.testerRequest.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        company: data.company ?? null,
        kind: data.kind,
        units: data.units ?? null,
        channels: data.channels,
        interests: data.interests,
        address: data.address ?? null,
        lat: data.lat ?? null,
        lng: data.lng ?? null,
        message: data.message ?? null,
        lang: data.lang,
      },
    })
  } catch (error) {
    console.error("tester-request: save failed", error)
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
