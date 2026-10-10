import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"
import { TESTER_STATUSES } from "@/lib/tester-request"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  let body: Record<string, unknown> = {}
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const data: { status?: string; note?: string | null } = {}
  if (typeof body.status === "string") {
    if (!(TESTER_STATUSES as readonly string[]).includes(body.status)) {
      return NextResponse.json({ error: "Unknown status" }, { status: 400 })
    }
    data.status = body.status
  }
  if (typeof body.note === "string") data.note = body.note.trim().slice(0, 2000) || null

  try {
    const updated = await prisma.testerRequest.update({ where: { id }, data })
    return NextResponse.json({ ok: true, status: updated.status, note: updated.note })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  try {
    await prisma.testerRequest.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}
