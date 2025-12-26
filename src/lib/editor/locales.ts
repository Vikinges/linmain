import type { Language } from "@/lib/i18n-config"
import type { LocalizedHtml, LocalizedString } from "@/lib/editor/types"

type LocalizedValue = LocalizedString | LocalizedHtml

export const getLocalizedValue = (
  value: LocalizedValue,
  language: Language
) => {
  return value[language] || value.en || value.de || value.ru || ""
}

export const setLocalizedValue = <T extends LocalizedValue>(
  value: T,
  language: Language,
  next: string
): T => ({
  ...value,
  [language]: next,
})
