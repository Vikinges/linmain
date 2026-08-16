// Только для серверных модулей: тянет Prisma. Клиентские компоненты берут типы и
// хелперы из "@/lib/plugins", иначе Prisma уедет в браузерный бандл.
import { prisma } from "@/lib/db"
import {
    PLUGINS_CONFIG_KEY,
    normalizePlugins,
    pluginsFromEnv,
    type LoadedPlugins,
} from "@/lib/plugins"

export async function loadSitePlugins(): Promise<LoadedPlugins> {
    try {
        const row = await prisma.siteConfig.findUnique({ where: { key: PLUGINS_CONFIG_KEY } })
        if (!row) return { plugins: pluginsFromEnv(), source: "env" }
        return { plugins: normalizePlugins(row.value), source: "db" }
    } catch (error) {
        // Сборка идёт без базы: статические маршруты не должны из-за этого падать.
        console.error("Failed to load site plugins:", error)
        return { plugins: pluginsFromEnv(), source: "env" }
    }
}
