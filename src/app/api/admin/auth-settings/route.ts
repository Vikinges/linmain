import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"

const AUTH_CONFIG_KEY = "auth"

type AuthConfigValue = {
    google?: {
        clientId?: string
        clientSecret?: string
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function readAuthConfig(value: unknown): AuthConfigValue {
    if (!isRecord(value)) return {}

    const google = isRecord(value.google) ? value.google : undefined
    return {
        google: google
            ? {
                clientId: typeof google.clientId === "string" ? google.clientId : undefined,
                clientSecret: typeof google.clientSecret === "string" ? google.clientSecret : undefined,
            }
            : undefined,
    }
}

function buildResponse(config: AuthConfigValue) {
    const storedClientId = config.google?.clientId?.trim() || ""
    const storedSecret = config.google?.clientSecret?.trim() || ""
    const envClientId = process.env.GOOGLE_CLIENT_ID?.trim() || ""
    const envSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || ""

    const effectiveClientId = storedClientId || envClientId
    const effectiveSecretSet = Boolean(storedSecret || envSecret)
    const source = storedClientId || storedSecret
        ? "db"
        : envClientId || envSecret
            ? "env"
            : "none"

    return {
        googleClientId: effectiveClientId,
        googleClientIdSource: source,
        googleClientSecretSet: effectiveSecretSet,
        storedClientId,
        storedSecretSet: Boolean(storedSecret),
    }
}

export async function GET() {
    const session = await getAdminSession()
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const row = await prisma.siteConfig.findUnique({ where: { key: AUTH_CONFIG_KEY } })
    const config = readAuthConfig(row?.value)
    return NextResponse.json(buildResponse(config))
}

export async function PUT(request: Request) {
    const session = await getAdminSession()
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let payload: unknown = {}
    try {
        payload = await request.json()
    } catch {
        payload = {}
    }

    const body = isRecord(payload) ? payload : {}
    const clientId = typeof body.googleClientId === "string" ? body.googleClientId.trim() : ""
    const clientSecret = typeof body.googleClientSecret === "string" ? body.googleClientSecret.trim() : ""

    if (!clientId && !clientSecret) {
        return NextResponse.json({ error: "No changes provided" }, { status: 400 })
    }

    const row = await prisma.siteConfig.findUnique({ where: { key: AUTH_CONFIG_KEY } })
    const current = readAuthConfig(row?.value)
    const nextGoogle = { ...(current.google || {}) }

    if (clientId) {
        nextGoogle.clientId = clientId
    }
    if (clientSecret) {
        nextGoogle.clientSecret = clientSecret
    }

    const updated: AuthConfigValue = {
        ...current,
        google: nextGoogle
    }

    await prisma.siteConfig.upsert({
        where: { key: AUTH_CONFIG_KEY },
        update: { value: updated },
        create: { key: AUTH_CONFIG_KEY, value: updated },
    })

    return NextResponse.json(buildResponse(updated))
}
