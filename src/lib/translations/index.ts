// Translation index - exports all languages

import { en } from './en'
import { de } from './de'
import { ru } from './ru'
import { Language } from '../i18n-config'
import type { Translations } from './en'

export const translations: Record<Language, Translations> = {
    en,
    de,
    ru
}

export function getTranslations(language: Language): Translations {
    return translations[language] || translations.en
}

export type { Translations }
