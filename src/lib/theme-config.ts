// Theme configuration types and defaults

export interface ThemeConfig {
    colors: {
        primary: string
        secondary: string
        accent: string
        background: string
    }
    transparency: {
        menu: number      // 0-100
        cards: number     // 0-100
        buttons: number   // 0-100
    }
    background: {
        videoUrl: string
        blurAmount: number  // 0-100
        opacity: number     // 0-100
        fallbackImage: string
    }
    typography: {
        fontFamily: string
        fontSize: number
    }
    borders: {
        radius: number
        width: number
    }
}

export const defaultTheme: ThemeConfig = {
    colors: {
        primary: '#4A4A4A',      // Dark Gray (from logo)
        secondary: '#808080',    // Medium Gray (from logo)
        accent: '#C0C0C0',       // Light Gray (from logo)
        background: '#1a1a1a'    // Very Dark Gray
    },
    transparency: {
        menu: 10,
        cards: 5,
        buttons: 0
    },
    background: {
        videoUrl: '',
        blurAmount: 20,
        opacity: 50,
        fallbackImage: ''
    },
    typography: {
        fontFamily: 'Inter',
        fontSize: 16
    },
    borders: {
        radius: 12,
        width: 1
    }
}

// Convert theme to CSS variables
export function themeToCssVariables(theme: ThemeConfig): Record<string, string> {
    return {
        '--color-primary': theme.colors.primary,
        '--color-secondary': theme.colors.secondary,
        '--color-accent': theme.colors.accent,
        '--color-background': theme.colors.background,
        '--transparency-menu': `${theme.transparency.menu}%`,
        '--transparency-cards': `${theme.transparency.cards}%`,
        '--transparency-buttons': `${theme.transparency.buttons}%`,
        '--blur-amount': `${theme.background.blurAmount}px`,
        '--overlay-opacity': `${theme.background.opacity}%`,
        '--font-family': theme.typography.fontFamily,
        '--font-size-base': `${theme.typography.fontSize}px`,
        '--border-radius': `${theme.borders.radius}px`,
        '--border-width': `${theme.borders.width}px`
    }
}

// Apply theme to document
export function applyTheme(theme: ThemeConfig) {
    if (typeof document === 'undefined') return

    const cssVars = themeToCssVariables(theme)
    const root = document.documentElement

    Object.entries(cssVars).forEach(([key, value]) => {
        root.style.setProperty(key, value)
    })
}

// Load theme from localStorage
export function loadTheme(): ThemeConfig {
    if (typeof window === 'undefined') return defaultTheme

    try {
        const stored = localStorage.getItem('linart-theme')
        if (!stored) return defaultTheme

        const parsed = JSON.parse(stored) as ThemeConfig

        // Sanitize stale blob URLs (they expire on page reload)
        if (parsed.background.videoUrl?.startsWith('blob:')) {
            parsed.background.videoUrl = ''
        }
        if (parsed.background.fallbackImage?.startsWith('blob:')) {
            parsed.background.fallbackImage = ''
        }

        return parsed
    } catch {
        return defaultTheme
    }
}

// Save theme to localStorage
export function saveTheme(theme: ThemeConfig) {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem('linart-theme', JSON.stringify(theme))
        applyTheme(theme)
    } catch (error) {
        console.error('Failed to save theme:', error)
    }
}
