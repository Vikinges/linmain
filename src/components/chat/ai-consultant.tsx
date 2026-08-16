"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

type AiConsultantProps = {
    /** ID сайта в LinArt AI Consultant (портал → Sites). */
    clientId: string
    /** Базовый URL бэкенда консультанта, он же источник widget.js. */
    apiUrl: string
}

/** Админка — рабочий инструмент, плавающая кнопка виджета перекрывает UI редактора. */
const HIDDEN_PREFIXES = ["/admin"]

const SCRIPT_ID = "linart-ai-consultant"
const STYLE_ID = "linart-ai-consultant-visibility"

/**
 * Подключает внешний чат-виджет LinArt AI Consultant.
 *
 * Виджет — обычный не-React скрипт: он сам создаёт `.lac-btn` / `.lac-panel`
 * в `<body>` и держит поллинг диалога. Размонтировать его как React-дерево
 * нельзя, поэтому на служебных маршрутах прячем узлы правилом CSS, а сам
 * скрипт грузим один раз за жизнь страницы.
 */
export function AiConsultant({ clientId, apiUrl }: AiConsultantProps) {
    const pathname = usePathname()
    const hidden = HIDDEN_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )

    useEffect(() => {
        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement("style")
            style.id = STYLE_ID
            // !important — панель виджета переключается инлайновым display.
            style.textContent =
                '[data-linart-consultant="hidden"] .lac-btn,' +
                '[data-linart-consultant="hidden"] .lac-panel{display:none !important}'
            document.head.appendChild(style)
        }
        document.documentElement.dataset.linartConsultant = hidden ? "hidden" : "visible"
    }, [hidden])

    useEffect(() => {
        if (hidden) return
        if (document.getElementById(SCRIPT_ID)) return

        const base = apiUrl.replace(/\/+$/, "")
        const script = document.createElement("script")
        script.id = SCRIPT_ID
        script.src = `${base}/widget.js`
        script.async = true
        script.dataset.client = clientId
        script.dataset.api = base
        document.body.appendChild(script)
    }, [hidden, clientId, apiUrl])

    return null
}
