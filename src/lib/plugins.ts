/**
 * Сторонние скрипты, подключаемые к сайту («плагины»): чат-виджеты, аналитика,
 * пиксели. Хранятся в SiteConfig, а не отдельной таблицей — список крошечный,
 * а так админка меняет их без миграции и рестарта контейнера.
 *
 * Модуль намеренно без импорта Prisma: типы и хелперы отсюда тянут и клиентские
 * компоненты, а чтение из базы живёт в `plugins-store.ts`.
 */
export const PLUGINS_CONFIG_KEY = "plugins"

export type PluginAttribute = {
    name: string
    value: string
}

export type SitePlugin = {
    id: string
    name: string
    /** URL скрипта. Только http(s): javascript:-схема здесь была бы дырой. */
    src: string
    /** Атрибуты тега, напр. data-client=105. */
    attributes: PluginAttribute[]
    /** Пути, где плагин не нужен: точное совпадение или префикс сегмента. */
    hiddenPaths: string[]
    /**
     * CSS-селектор узлов плагина. Нужен потому, что выгрузить уже загруженный
     * сторонний скрипт нельзя: при клиентском переходе на скрытый путь узлы
     * остаются в DOM, и убрать их можно только стилем.
     */
    hideSelector: string
    enabled: boolean
}

/** Имена атрибутов ограничиваем, чтобы в разметку не уехал мусор вроде "><script". */
const ATTRIBUTE_NAME = /^[a-zA-Z][\w:.-]*$/

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function str(value: unknown): string {
    return typeof value === "string" ? value.trim() : ""
}

export function isSafeScriptUrl(value: string): boolean {
    try {
        const url = new URL(value)
        return url.protocol === "https:" || url.protocol === "http:"
    } catch {
        return false
    }
}

/** Путь приводим к виду "/admin": без хвостового слеша, всегда с ведущим. */
export function normalizePath(value: string): string {
    const trimmed = value.trim()
    if (!trimmed) return ""
    const withLeading = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
    return withLeading.length > 1 ? withLeading.replace(/\/+$/, "") : withLeading
}

export function isHiddenOn(plugin: SitePlugin, pathname: string): boolean {
    return plugin.hiddenPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    )
}

function normalizeAttributes(value: unknown): PluginAttribute[] {
    if (!Array.isArray(value)) return []
    const out: PluginAttribute[] = []
    for (const item of value) {
        if (!isRecord(item)) continue
        const name = str(item.name)
        if (!ATTRIBUTE_NAME.test(name)) continue
        out.push({ name, value: str(item.value) })
    }
    return out
}

function normalizePlugin(value: unknown, index: number): SitePlugin | null {
    if (!isRecord(value)) return null
    const src = str(value.src)
    if (!isSafeScriptUrl(src)) return null

    const hiddenPaths = Array.isArray(value.hiddenPaths)
        ? value.hiddenPaths.map((path) => normalizePath(String(path))).filter(Boolean)
        : []

    return {
        id: str(value.id) || `plugin-${index + 1}`,
        name: str(value.name) || "Plugin",
        src,
        attributes: normalizeAttributes(value.attributes),
        hiddenPaths: Array.from(new Set(hiddenPaths)),
        hideSelector: str(value.hideSelector),
        enabled: value.enabled !== false,
    }
}

export function normalizePlugins(value: unknown): SitePlugin[] {
    const list = Array.isArray(value)
        ? value
        : isRecord(value) && Array.isArray(value.plugins)
            ? value.plugins
            : []

    const seen = new Set<string>()
    const out: SitePlugin[] = []
    for (const [index, item] of list.entries()) {
        const plugin = normalizePlugin(item, index)
        if (!plugin || seen.has(plugin.id)) continue
        seen.add(plugin.id)
        out.push(plugin)
    }
    return out
}

/**
 * Пока админ ни разу не сохранял список, берём консультанта из env — иначе при
 * выкатке этой версии виджет молча пропал бы с сайта.
 */
export function pluginsFromEnv(): SitePlugin[] {
    const clientId = process.env.AI_CONSULTANT_CLIENT_ID?.trim()
    if (!clientId) return []

    const api = (process.env.AI_CONSULTANT_API_URL?.trim() || "https://ai.crm-iot.com")
        .replace(/\/+$/, "")

    return [
        {
            id: "ai-consultant",
            name: "AI-консультант",
            src: `${api}/widget.js`,
            attributes: [{ name: "data-client", value: clientId }],
            // Плавающая кнопка чата перекрывает интерфейс редактора.
            hiddenPaths: ["/admin"],
            // Виджет живёт в shadow-root: селекторы по .lac-* внутрь не проходят,
            // поэтому прячем host-элемент. .lac-* — для до-shadow версий из кэша.
            hideSelector: "[data-linart-widget], .lac-btn, .lac-panel",
            enabled: true,
        },
    ]
}

export type LoadedPlugins = {
    plugins: SitePlugin[]
    /** db — админ уже сохранял список; env — ещё нет, показываем унаследованное. */
    source: "db" | "env"
}

/** Сниппет, эквивалентный тому, что вставляют на чужой сайт руками. */
export function pluginSnippet(plugin: Pick<SitePlugin, "src" | "attributes">): string {
    const attrs = plugin.attributes
        .filter((attribute) => ATTRIBUTE_NAME.test(attribute.name))
        .map((attribute) => ` ${attribute.name}="${attribute.value.replace(/"/g, "&quot;")}"`)
        .join("")
    return `<script src="${plugin.src}"${attrs}></script>`
}
