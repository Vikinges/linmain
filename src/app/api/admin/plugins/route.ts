import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db"
import { getAdminSession } from "@/lib/admin"
import { PLUGINS_CONFIG_KEY, normalizePlugins, isSafeScriptUrl } from "@/lib/plugins"
import { loadSitePlugins } from "@/lib/plugins-store"

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

export async function GET() {
    const session = await getAdminSession()
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const loaded = await loadSitePlugins()
    return NextResponse.json(loaded)
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
    if (!Array.isArray(body.plugins)) {
        return NextResponse.json({ error: "Expected a plugins array" }, { status: 400 })
    }

    // Отбрасывать молча нельзя: админ решит, что сохранилось, а плагин исчезнет.
    const rejected = body.plugins.filter(
        (item) => !isRecord(item) || !isSafeScriptUrl(typeof item.src === "string" ? item.src.trim() : "")
    )
    if (rejected.length > 0) {
        return NextResponse.json(
            { error: "Every plugin needs a script URL starting with http:// or https://" },
            { status: 400 }
        )
    }

    const plugins = normalizePlugins(body.plugins)

    await prisma.siteConfig.upsert({
        where: { key: PLUGINS_CONFIG_KEY },
        update: { value: plugins as unknown as Prisma.InputJsonValue },
        create: { key: PLUGINS_CONFIG_KEY, value: plugins as unknown as Prisma.InputJsonValue },
    })

    return NextResponse.json({ plugins, source: "db" })
}
