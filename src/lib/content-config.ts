// Homepage content configuration and defaults

export interface PortfolioLocaleOverrides {
    title: string
    subtitle: string
    minecraft: {
        title: string
        description: string
        linkLabel: string
    }
    sensorHub: {
        title: string
        description: string
        linkLabel: string
    }
    commercial: {
        title: string
        description: string
        linkLabel: string
    }
}

export interface HomepageLocaleOverrides {
    hero: {
        badge: string
        name: string
        subtitle: string
        description: string
    }
    cta: {
        primaryButton: string
        secondaryButton: string
    }
    callout: {
        title: string
        description: string
    }
    nav: {
        getStarted: string
    }
    footer: {
        copyright: string
    }
}

export interface HomepageContent {
    hero: {
        badge: string
        name: string
        subtitle: string
        description: string
    }
    pillars: {
        business: {
            title: string
            description: string
        }
        content: {
            title: string
            description: string
        }
        tech: {
            title: string
            description: string
        }
    }
    portfolio: {
        locales: {
            en: PortfolioLocaleOverrides
            de: PortfolioLocaleOverrides
            ru: PortfolioLocaleOverrides
        }
        minecraft: {
            mapUrl: string
            linkUrl: string
        }
        sensorHub: {
            videoUrl: string
            linkUrl: string
        }
        commercial: {
            linkUrl: string
        }
    }
    locales: {
        en: HomepageLocaleOverrides
        de: HomepageLocaleOverrides
        ru: HomepageLocaleOverrides
    }
    cta: {
        primaryButton: string
        secondaryButton: string
    }
    callout: {
        title: string
        description: string
    }
    media: {
        logoUrl: string
        heroImageUrl: string
        heroImageAlt: string
    }
    social: {
        linkedinUrl: string
        youtubeUrl: string
    }
    nav: {
        getStarted: string
    }
    footer: {
        copyright: string
    }
}

export interface TextStyles {
    hero: {
        nameColor: string
        nameOutline: string
        nameOutlineWidth: number
        nameGlow: string
        nameGlowIntensity: number
        subtitleGradientFrom: string
        subtitleGradientTo: string
    }
    badge: {
        textColor: string
        backgroundColor: string
        borderColor: string
    }
    description: {
        textColor: string
    }
    pillars: {
        titleColor: string
        descriptionColor: string
        backgroundColor: string
    }
    callout: {
        titleColor: string
        descriptionColor: string
        backgroundColor: string
    }
    nav: {
        getStarted: string
    }
    footer: {
        copyright: string
    }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function deepMerge<T>(base: T, override: Partial<T>): T {
    if (!isPlainObject(base) || !isPlainObject(override)) {
        return (override as T) ?? base
    }

    const result = { ...(base as Record<string, unknown>) }
    for (const [key, value] of Object.entries(override)) {
        if (value === undefined) continue
        const baseValue = result[key]
        result[key] = isPlainObject(baseValue) && isPlainObject(value)
            ? deepMerge(baseValue, value)
            : value
    }
    return result as T
}

export const defaultContent: HomepageContent = {
    hero: {
        badge: "Always curious to try new things",
        name: "VLADIMIR LINARTAS",
        subtitle: "Entrepreneur - Creator - Developer",
        description: "I've always been curious to try new things - and even better, build something useful myself. Good people, let's unite! Quality matters more than quantity."
    },
    pillars: {
        business: {
            title: "Business",
            description: "20+ years of experience managing multi-profile companies and leading diverse teams to achieve ambitious business goals"
        },
        content: {
            title: "Content Creation",
            description: "Crafting engaging video content that tells compelling stories and connects with audiences worldwide"
        },
        tech: {
            title: "Tech Development",
            description: "Developing innovative electronics and software products from concept to market, pushing boundaries of technology"
        }
    },
    portfolio: {
        locales: {
            en: {
                title: "",
                subtitle: "",
                minecraft: {
                    title: "",
                    description: "",
                    linkLabel: ""
                },
                sensorHub: {
                    title: "",
                    description: "",
                    linkLabel: ""
                },
                commercial: {
                    title: "",
                    description: "",
                    linkLabel: ""
                }
            },
            de: {
                title: "",
                subtitle: "",
                minecraft: {
                    title: "",
                    description: "",
                    linkLabel: ""
                },
                sensorHub: {
                    title: "",
                    description: "",
                    linkLabel: ""
                },
                commercial: {
                    title: "",
                    description: "",
                    linkLabel: ""
                }
            },
            ru: {
                title: "",
                subtitle: "",
                minecraft: {
                    title: "",
                    description: "",
                    linkLabel: ""
                },
                sensorHub: {
                    title: "",
                    description: "",
                    linkLabel: ""
                },
                commercial: {
                    title: "",
                    description: "",
                    linkLabel: ""
                }
            }
        },
        minecraft: {
            mapUrl: "https://linart.club/map/",
            linkUrl: "https://linart.club/map/"
        },
        sensorHub: {
            videoUrl: "",
            linkUrl: "https://www.youtube.com/@LinArt"
        },
        commercial: {
            linkUrl: "https://hub.linart.club"
        }
    },
    locales: {
        en: {
            hero: {
                badge: "",
                name: "",
                subtitle: "",
                description: ""
            },
            cta: {
                primaryButton: "",
                secondaryButton: ""
            },
            callout: {
                title: "",
                description: ""
            },
            nav: {
                getStarted: ""
            },
            footer: {
                copyright: ""
            }
        },
        de: {
            hero: {
                badge: "",
                name: "",
                subtitle: "",
                description: ""
            },
            cta: {
                primaryButton: "",
                secondaryButton: ""
            },
            callout: {
                title: "",
                description: ""
            },
            nav: {
                getStarted: ""
            },
            footer: {
                copyright: ""
            }
        },
        ru: {
            hero: {
                badge: "",
                name: "",
                subtitle: "",
                description: ""
            },
            cta: {
                primaryButton: "",
                secondaryButton: ""
            },
            callout: {
                title: "",
                description: ""
            },
            nav: {
                getStarted: ""
            },
            footer: {
                copyright: ""
            }
        }
    },
    cta: {
        primaryButton: "View Projects",
        secondaryButton: "Contact Me"
    },
    callout: {
        title: "Let's Team Up",
        description: "Looking for good people for interesting projects. Quality matters more than quantity. If you're interested in building useful things together - let's connect!"
    },
    media: {
        logoUrl: "",
        heroImageUrl: "",
        heroImageAlt: ""
    },
    social: {
        linkedinUrl: "https://linkedin.com/in/vladimir-linartas",
        youtubeUrl: "https://www.youtube.com/@LinArt"
    },
    nav: {
        getStarted: "Get Started"
    },
    footer: {
        copyright: "(c) 2025 Vladimir Linartas. All rights reserved."
    }
}

export const defaultStyles: TextStyles = {
    hero: {
        nameColor: "#ffffff",
        nameOutline: "#4A4A4A",
        nameOutlineWidth: 0,
        nameGlow: "#8b5cf6",
        nameGlowIntensity: 0,
        subtitleGradientFrom: "#9ca3af",
        subtitleGradientTo: "#6b7280"
    },
    badge: {
        textColor: "#d1d5db",
        backgroundColor: "rgba(31, 41, 55, 0.5)",
        borderColor: "rgba(55, 65, 81, 0.5)"
    },
    description: {
        textColor: "#9ca3af"
    },
    pillars: {
        titleColor: "#ffffff",
        descriptionColor: "#9ca3af",
        backgroundColor: "rgba(17, 24, 39, 0.5)"
    },
    callout: {
        titleColor: "#ffffff",
        descriptionColor: "#d1d5db",
        backgroundColor: "rgba(255, 255, 255, 0.05)"
    },
    nav: {
        getStarted: "Get Started"
    },
    footer: {
        copyright: "(c) 2025 Vladimir Linartas. All rights reserved."
    }
}

// Convert styles to CSS variables
export function stylesToCssVariables(styles: TextStyles): Record<string, string> {
    return {
        '--hero-name-color': styles.hero.nameColor,
        '--hero-name-outline': styles.hero.nameOutline,
        '--hero-name-outline-width': `${styles.hero.nameOutlineWidth}px`,
        '--hero-name-glow': styles.hero.nameGlow,
        '--hero-name-glow-intensity': `${styles.hero.nameGlowIntensity}px`,
        '--subtitle-gradient-from': styles.hero.subtitleGradientFrom,
        '--subtitle-gradient-to': styles.hero.subtitleGradientTo,
        '--badge-text-color': styles.badge.textColor,
        '--badge-bg-color': styles.badge.backgroundColor,
        '--badge-border-color': styles.badge.borderColor,
        '--description-text-color': styles.description.textColor,
        '--pillar-title-color': styles.pillars.titleColor,
        '--pillar-description-color': styles.pillars.descriptionColor,
        '--pillar-bg-color': styles.pillars.backgroundColor,
        '--callout-title-color': styles.callout.titleColor,
        '--callout-description-color': styles.callout.descriptionColor,
        '--callout-bg-color': styles.callout.backgroundColor
    }
}

// Apply styles to document
export function applyContentStyles(styles: TextStyles) {
    if (typeof document === 'undefined') return

    const cssVars = stylesToCssVariables(styles)
    const root = document.documentElement

    Object.entries(cssVars).forEach(([key, value]) => {
        root.style.setProperty(key, value)
    })
}

// Load content from localStorage
export function loadContent(): HomepageContent {
    if (typeof window === 'undefined') return defaultContent

    try {
        const stored = localStorage.getItem('linart-homepage-content')
        if (!stored) return defaultContent

        const parsed = JSON.parse(stored) as Partial<HomepageContent>
        return deepMerge(defaultContent, parsed)
    } catch {
        return defaultContent
    }
}

// Save content to localStorage
export function saveContent(content: HomepageContent) {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem('linart-homepage-content', JSON.stringify(content))
    } catch (error) {
        console.error('Failed to save content:', error)
    }
}

// Load styles from localStorage
export function loadContentStyles(): TextStyles {
    if (typeof window === 'undefined') return defaultStyles

    try {
        const stored = localStorage.getItem('linart-homepage-styles')
        if (!stored) return defaultStyles

        const parsed = JSON.parse(stored)
        const styles = { ...defaultStyles, ...parsed } as TextStyles
        applyContentStyles(styles)
        return styles
    } catch {
        return defaultStyles
    }
}

// Save styles to localStorage
export function saveContentStyles(styles: TextStyles) {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem('linart-homepage-styles', JSON.stringify(styles))
        applyContentStyles(styles)
    } catch (error) {
        console.error('Failed to save styles:', error)
    }
}

