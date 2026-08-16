"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { isHiddenOn, type SitePlugin } from "@/lib/plugins"

const STYLE_ID = "site-plugins-visibility"
const ATTRIBUTE_NAME = /^[a-zA-Z][\w:.-]*$/

const scriptElementId = (pluginId: string) => `site-plugin-${pluginId}`

/**
 * Подключает сторонние скрипты, настроенные в админке (/admin/plugins).
 *
 * Сторонний виджет — не React-дерево: он сам создаёт узлы в <body> и живёт до
 * перезагрузки страницы. Размонтировать его нельзя, поэтому на скрытых путях
 * скрипт либо не грузится вовсе (первый заход), либо его узлы прячутся стилем
 * (если пользователь пришёл клиентской навигацией и скрипт уже отработал).
 */
export function SitePlugins({ plugins }: { plugins: SitePlugin[] }) {
    const pathname = usePathname()

    useEffect(() => {
        const selectors = plugins
            .filter((plugin) => plugin.enabled && plugin.hideSelector && isHiddenOn(plugin, pathname))
            .flatMap((plugin) =>
                plugin.hideSelector
                    .split(",")
                    .map((selector) => selector.trim())
                    .filter(Boolean)
            )

        let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
        if (!style) {
            style = document.createElement("style")
            style.id = STYLE_ID
            document.head.appendChild(style)
        }

        // !important — виджеты переключают свою видимость инлайновым display.
        style.textContent = selectors.length
            ? `${selectors.join(",")}{display:none !important}`
            : ""
    }, [plugins, pathname])

    useEffect(() => {
        for (const plugin of plugins) {
            if (!plugin.enabled || !plugin.src) continue
            if (isHiddenOn(plugin, pathname)) continue
            if (document.getElementById(scriptElementId(plugin.id))) continue

            const script = document.createElement("script")
            script.id = scriptElementId(plugin.id)
            script.src = plugin.src
            script.async = true
            for (const attribute of plugin.attributes) {
                if (!ATTRIBUTE_NAME.test(attribute.name)) continue
                script.setAttribute(attribute.name, attribute.value)
            }
            document.body.appendChild(script)
        }
    }, [plugins, pathname])

    return null
}
