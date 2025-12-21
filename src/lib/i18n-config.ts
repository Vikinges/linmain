// i18n (internationalization) configuration

export type Language = 'en' | 'de' | 'ru'

export interface LanguageOption {
    code: Language
    name: string
    flag: string
}

export const languages: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
]

export const defaultLanguage: Language = 'en'

// Detect browser language
export function detectBrowserLanguage(): Language {
    if (typeof window === 'undefined') return defaultLanguage

    const browserLang = navigator.language.toLowerCase()

    if (browserLang.startsWith('ru')) return 'ru'
    if (browserLang.startsWith('de')) return 'de'
    return 'en'
}

// Load language from localStorage
export function loadLanguage(): Language {
    if (typeof window === 'undefined') return defaultLanguage

    try {
        const stored = localStorage.getItem('linart-language') as Language
        if (stored && languages.find(l => l.code === stored)) {
            return stored
        }

        // First visit - detect browser language
        const detected = detectBrowserLanguage()
        saveLanguage(detected)
        return detected
    } catch {
        return defaultLanguage
    }
}

// Save language to localStorage
export function saveLanguage(language: Language) {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem('linart-language', language)
    } catch (error) {
        console.error('Failed to save language:', error)
    }
}

// Get language name
export function getLanguageName(code: Language): string {
    return languages.find(l => l.code === code)?.name || 'English'
}

// Get language flag
export function getLanguageFlag(code: Language): string {
    return languages.find(l => l.code === code)?.flag || '🇬🇧'
}
