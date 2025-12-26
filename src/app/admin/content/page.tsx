"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ColorPicker } from "@/components/admin/color-picker"
import { MediaUploader } from "@/components/admin/media-uploader"
import { Save, RotateCcw, LayoutTemplate, Type, MessageSquare, Briefcase, Server, Image as ImageIcon } from "lucide-react"
import {
    HomepageContent,
    TextStyles,
    defaultContent,
    defaultStyles,
    loadContent,
    saveContent,
    loadContentStyles,
    saveContentStyles
} from "@/lib/content-config"
import { getTranslations } from "@/lib/translations"
import { loadLanguage, type Language } from "@/lib/i18n-config"
import { ThemeConfig, defaultTheme, loadTheme, saveTheme } from "@/lib/theme-config"
import { uploadFile } from "@/lib/actions/upload"

export default function ContentPage() {
    const [content, setContent] = useState<HomepageContent>(() => loadContent())
    const [styles, setStyles] = useState<TextStyles>(() => loadContentStyles())
    const [theme, setTheme] = useState<ThemeConfig>(() => loadTheme())
    const [isSaving, setIsSaving] = useState(false)
    const [contentLanguage, setContentLanguage] = useState<Language>(() => loadLanguage())

    useEffect(() => {
        let active = true
        const loadRemoteConfig = async () => {
            try {
                const response = await fetch("/api/site-config", { cache: "no-store" })
                if (!response.ok) return
                const data = await response.json()
                if (!active) return
                if (data.content) {
                    setContent(data.content)
                    saveContent(data.content)
                }
                if (data.styles) {
                    setStyles(data.styles)
                    saveContentStyles(data.styles)
                }
                if (data.theme) {
                    setTheme(data.theme)
                    saveTheme(data.theme)
                }
            } catch (error) {
                console.error("Failed to load site config:", error)
            }
        }

        loadRemoteConfig()
        return () => {
            active = false
        }
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        saveContent(content)
        saveContentStyles(styles)
        saveTheme(theme)
        try {
            await fetch("/api/site-config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, styles, theme })
            })
        } catch (error) {
            console.error("Failed to save site config:", error)
        }
        setTimeout(() => setIsSaving(false), 500)
    }

    const handleReset = async () => {
        setContent(defaultContent)
        setStyles(defaultStyles)
        setTheme(defaultTheme)
        saveContent(defaultContent)
        saveContentStyles(defaultStyles)
        saveTheme(defaultTheme)
        try {
            await fetch("/api/site-config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: defaultContent, styles: defaultStyles, theme: defaultTheme })
            })
        } catch (error) {
            console.error("Failed to reset site config:", error)
        }
    }

    const updateNestedValue = <T extends object>(
        base: T,
        path: string,
        value: unknown
    ): T => {
        const keys = path.split(".")
        const updated = { ...base } as Record<string, unknown>
        let cursor = updated

        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i]
            const next = cursor[key]
            cursor[key] = typeof next === "object" && next !== null && !Array.isArray(next)
                ? { ...(next as Record<string, unknown>) }
                : {}
            cursor = cursor[key] as Record<string, unknown>
        }

        cursor[keys[keys.length - 1]] = value
        return updated as T
    }

    const updateContent = (path: string, value: string) => {
        setContent((current) => updateNestedValue(current, path, value))
    }

    const updateStyle = (path: string, value: string | number) => {
        setStyles((current) => updateNestedValue(current, path, value))
    }
    const updateThemeValue = (path: string, value: string | number) => {
        setTheme((current) => updateNestedValue(current, path, value))
    }

    const translations = getTranslations(contentLanguage)
    const localeOverrides = content.locales?.[contentLanguage]
    const portfolioFallback = translations.portfolio
    const portfolioOverrides = content.portfolio?.locales?.[contentLanguage]
    const isReadableText = (value: string | undefined) => {
        if (!value) return false
        const trimmed = value.trim()
        if (!trimmed) return false
        if (/^\?+$/.test(trimmed)) return false
        if (/[\u00d0\u00d1]/.test(trimmed)) return false
        return /[\p{L}\p{N}]/u.test(trimmed)
    }
    const pickText = (value: string | undefined, fallback: string) =>
        isReadableText(value) ? value!.trim() : fallback
    const legacyEnabled = contentLanguage === "en"
    const heroLegacy = legacyEnabled ? content.hero : undefined
    const ctaLegacy = legacyEnabled ? content.cta : undefined
    const calloutLegacy = legacyEnabled ? content.callout : undefined
    const navLegacy = legacyEnabled ? content.nav : undefined
    const footerLegacy = legacyEnabled ? content.footer : undefined
    const heroText = {
        badge: pickText(localeOverrides?.hero?.badge, pickText(heroLegacy?.badge, translations.hero.badge)),
        name: pickText(localeOverrides?.hero?.name, pickText(heroLegacy?.name, translations.hero.name)),
        subtitle: pickText(localeOverrides?.hero?.subtitle, pickText(heroLegacy?.subtitle, translations.hero.subtitle)),
        description: pickText(localeOverrides?.hero?.description, pickText(heroLegacy?.description, translations.hero.description))
    }
    const ctaText = {
        primaryButton: pickText(localeOverrides?.cta?.primaryButton, pickText(ctaLegacy?.primaryButton, translations.cta.primary)),
        secondaryButton: pickText(localeOverrides?.cta?.secondaryButton, pickText(ctaLegacy?.secondaryButton, translations.cta.secondary))
    }
    const calloutText = {
        title: pickText(localeOverrides?.callout?.title, pickText(calloutLegacy?.title, translations.callout.title)),
        description: pickText(localeOverrides?.callout?.description, pickText(calloutLegacy?.description, translations.callout.description))
    }
    const navText = {
        getStarted: pickText(localeOverrides?.nav?.getStarted, pickText(navLegacy?.getStarted, translations.nav.getStarted))
    }
    const footerText = {
        copyright: pickText(localeOverrides?.footer?.copyright, pickText(footerLegacy?.copyright, translations.footer.copyright))
    }
    const portfolioText = {
        title: pickText(portfolioOverrides?.title, portfolioFallback.title),
        subtitle: pickText(portfolioOverrides?.subtitle, portfolioFallback.subtitle),
        minecraft: {
            title: pickText(portfolioOverrides?.minecraft?.title, portfolioFallback.minecraft.title),
            description: pickText(portfolioOverrides?.minecraft?.description, portfolioFallback.minecraft.description),
            linkLabel: pickText(portfolioOverrides?.minecraft?.linkLabel, portfolioFallback.minecraft.linkLabel)
        },
        sensorHub: {
            title: pickText(portfolioOverrides?.sensorHub?.title, portfolioFallback.sensorHub.title),
            description: pickText(portfolioOverrides?.sensorHub?.description, portfolioFallback.sensorHub.description),
            linkLabel: pickText(portfolioOverrides?.sensorHub?.linkLabel, portfolioFallback.sensorHub.linkLabel)
        },
        commercial: {
            title: pickText(portfolioOverrides?.commercial?.title, portfolioFallback.commercial.title),
            description: pickText(portfolioOverrides?.commercial?.description, portfolioFallback.commercial.description),
            linkLabel: pickText(portfolioOverrides?.commercial?.linkLabel, portfolioFallback.commercial.linkLabel)
        }
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Homepage Editor</h2>
                    <p className="text-muted-foreground mt-1">Manage text and colors visually</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                        <Label className="text-xs text-muted-foreground">Language</Label>
                        <Select
                            value={contentLanguage}
                            onValueChange={(value) => setContentLanguage(value as Language)}
                        >
                            <SelectTrigger className="h-8 w-24">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">EN</SelectItem>
                                <SelectItem value="de">DE</SelectItem>
                                <SelectItem value="ru">RU</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button variant="outline" onClick={handleReset} className="border-white/20 hover:bg-white/10">
                        <RotateCcw className="h-4 w-4 mr-2" /> Reset
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                        <Save className="h-4 w-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="callout" className="w-full">
                <TabsList className="grid w-full grid-cols-6 bg-white/5">
                    <TabsTrigger value="hero"><LayoutTemplate className="h-4 w-4 mr-2" /> Hero</TabsTrigger>
                    <TabsTrigger value="portfolio"><Briefcase className="h-4 w-4 mr-2" /> Portfolio</TabsTrigger>
                    <TabsTrigger value="callout"><MessageSquare className="h-4 w-4 mr-2" /> Callout</TabsTrigger>
                    <TabsTrigger value="meta"><Type className="h-4 w-4 mr-2" /> Badge & Other</TabsTrigger>
                    <TabsTrigger value="links"><Type className="h-4 w-4 mr-2" /> Links & Footer</TabsTrigger>
                    <TabsTrigger value="media"><ImageIcon className="h-4 w-4 mr-2" /> Media</TabsTrigger>
                </TabsList>

                {/* Callout Tab (Priority) */}
                <TabsContent value="callout" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Editor */}
                        <Card className="glass-card border-white/20">
                            <CardHeader><CardTitle>Edit Content</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title Text</Label>
                                    <Input
                                        value={calloutText.title}
                                        onChange={(e) => updateContent(`locales.${contentLanguage}.callout.title`, e.target.value)}
                                        className="bg-white/5"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title Color</Label>
                                        <ColorPicker
                                            color={styles.callout.titleColor}
                                            onChange={(c) => updateStyle('callout.titleColor', c)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Background</Label>
                                        <ColorPicker
                                            color={styles.callout.backgroundColor || 'rgba(255, 255, 255, 0.05)'}
                                            onChange={(c) => updateStyle('callout.backgroundColor', c)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description Text</Label>
                                    <Textarea
                                        value={calloutText.description}
                                        onChange={(e) => updateContent(`locales.${contentLanguage}.callout.description`, e.target.value)}
                                        className="bg-white/5 h-32"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description Color</Label>
                                    <ColorPicker
                                        color={styles.callout.descriptionColor}
                                        onChange={(c) => updateStyle('callout.descriptionColor', c)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Live Preview */}
                        <Card className="glass-card border-white/20 bg-black/40 h-fit sticky top-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    Live Preview
                                </CardTitle>
                                <CardDescription>This is how it looks on the site</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center min-h-[300px] p-8 bg-card/50 rounded-lg border border-dashed border-white/10">
                                <div
                                    className="text-center space-y-6 w-full p-8 rounded-xl transition-colors"
                                    style={{ backgroundColor: styles.callout.backgroundColor || 'rgba(255, 255, 255, 0.05)' }}
                                >
                                    <h2 className="text-4xl font-bold" style={{ color: styles.callout.titleColor }}>
                                        {calloutText.title}
                                    </h2>
                                    <p className="text-xl leading-relaxed max-w-lg mx-auto" style={{ color: styles.callout.descriptionColor }}>
                                        {calloutText.description}
                                    </p>
                                    <div className="pt-4 opacity-50 grayscale">
                                        <Button size="lg" className="bg-gradient-to-r from-gray-700 to-gray-600 text-white pointer-events-none">
                                            Get Started
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Hero Tab */}
                <TabsContent value="hero" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="glass-card border-white/20">
                            <CardHeader><CardTitle>Hero Configuration</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Main Name</Label>
                                    <Input
                                        value={heroText.name}
                                        onChange={(e) => updateContent(`locales.${contentLanguage}.hero.name`, e.target.value)}
                                        className="bg-white/5"
                                    />
                                    <ColorPicker
                                        label="Name Color"
                                        color={styles.hero.nameColor}
                                        onChange={(c) => updateStyle('hero.nameColor', c)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Subtitle</Label>
                                    <Input
                                        value={heroText.subtitle}
                                        onChange={(e) => updateContent(`locales.${contentLanguage}.hero.subtitle`, e.target.value)}
                                        className="bg-white/5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={heroText.description}
                                        onChange={(e) => updateContent(`locales.${contentLanguage}.hero.description`, e.target.value)}
                                        className="bg-white/5 h-24"
                                    />
                                    <ColorPicker
                                        label="Description Color"
                                        color={styles.description.textColor}
                                        onChange={(c) => updateStyle('description.textColor', c)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="glass-card border-white/20 bg-black/40">
                            <CardHeader><CardTitle>Preview</CardTitle></CardHeader>
                            <CardContent className="flex items-center justify-center min-h-[300px] p-8">
                                <div className="text-center space-y-4">
                                    <h1 className="text-4xl font-bold" style={{ color: styles.hero.nameColor }}>
                                        {heroText.name}
                                    </h1>
                                    <p className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600">
                                        {heroText.subtitle}
                                    </p>
                                    <p style={{ color: styles.description.textColor }}>
                                        {heroText.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Portfolio Tab */}
                <TabsContent value="portfolio" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="glass-card border-white/20">
                            <CardHeader><CardTitle>Portfolio Content</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <ColorPicker
                                        label="Title Color"
                                        color={styles.pillars.titleColor}
                                        onChange={(c) => updateStyle('pillars.titleColor', c)}
                                    />
                                    <ColorPicker
                                        label="Description Color"
                                        color={styles.pillars.descriptionColor}
                                        onChange={(c) => updateStyle('pillars.descriptionColor', c)}
                                    />
                                    <div className="col-span-2">
                                        <ColorPicker
                                            label="Card Background"
                                            color={styles.pillars.backgroundColor || 'rgba(17, 24, 39, 0.5)'}
                                            onChange={(c) => updateStyle('pillars.backgroundColor', c)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-4">
                                    <Label className="text-lg">Section Header</Label>
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={portfolioText.title}
                                            onChange={(e) => updateContent(`portfolio.locales.${contentLanguage}.title`, e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Subtitle</Label>
                                        <Textarea
                                            value={portfolioText.subtitle}
                                            onChange={(e) => updateContent(`portfolio.locales.${contentLanguage}.subtitle`, e.target.value)}
                                            className="h-20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-4">
                                    <Label className="text-lg">Minecraft Server Map</Label>
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={portfolioText.minecraft.title}
                                            onChange={(e) => updateContent(`portfolio.locales.${contentLanguage}.minecraft.title`, e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={portfolioText.minecraft.description}
                                            onChange={(e) => updateContent(`portfolio.locales.${contentLanguage}.minecraft.description`, e.target.value)}
                                            className="h-24"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Map Embed URL</Label>
                                        <Input
                                            value={content.portfolio.minecraft.mapUrl}
                                            onChange={(e) => updateContent('portfolio.minecraft.mapUrl', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Button Label</Label>
                                            <Input
                                                value={portfolioText.minecraft.linkLabel}
                                                onChange={(e) => updateContent(`portfolio.locales.${contentLanguage}.minecraft.linkLabel`, e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Button URL</Label>
                                            <Input
                                                value={content.portfolio.minecraft.linkUrl}
                                                onChange={(e) => updateContent('portfolio.minecraft.linkUrl', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-4">
                                    <Label className="text-lg">SensorHub</Label>
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={portfolioText.sensorHub.title}
                                            onChange={(e) => updateContent(`portfolio.locales.${contentLanguage}.sensorHub.title`, e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={portfolioText.sensorHub.description}
                                            onChange={(e) => updateContent(`portfolio.locales.${contentLanguage}.sensorHub.description`, e.target.value)}
                                            className="h-24"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>YouTube URL</Label>
                                        <Input
                                            value={content.portfolio.sensorHub.videoUrl}
                                            onChange={(e) => updateContent('portfolio.sensorHub.videoUrl', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Button Label</Label>
                                            <Input
                                                value={portfolioText.sensorHub.linkLabel}
                                                onChange={(e) => updateContent(`portfolio.locales.${contentLanguage}.sensorHub.linkLabel`, e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Button URL</Label>
                                            <Input
                                                value={content.portfolio.sensorHub.linkUrl}
                                                onChange={(e) => updateContent('portfolio.sensorHub.linkUrl', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-white/10 pt-4">
                                    <Label className="text-lg">Commercial Hub</Label>
                                    <div className="space-y-2">
                                        <Label>Title</Label>
                                        <Input
                                            value={portfolioText.commercial.title}
                                            onChange={(e) => updateContent(`portfolio.locales.${contentLanguage}.commercial.title`, e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={portfolioText.commercial.description}
                                            onChange={(e) => updateContent(`portfolio.locales.${contentLanguage}.commercial.description`, e.target.value)}
                                            className="h-24"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Button Label</Label>
                                            <Input
                                                value={portfolioText.commercial.linkLabel}
                                                onChange={(e) => updateContent(`portfolio.locales.${contentLanguage}.commercial.linkLabel`, e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Button URL</Label>
                                            <Input
                                                value={content.portfolio.commercial.linkUrl}
                                                onChange={(e) => updateContent('portfolio.commercial.linkUrl', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Live Preview */}
                        <Card className="glass-card border-white/20 bg-black/40 h-fit sticky top-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    Live Preview
                                </CardTitle>
                                <CardDescription>Portfolio card preview</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 bg-card/50 rounded-lg border border-dashed border-white/10">
                                <div
                                    className="p-6 rounded-xl border border-white/10 text-center space-y-4 shadow-xl transition-all"
                                    style={{ backgroundColor: styles.pillars.backgroundColor || 'rgba(17, 24, 39, 0.5)' }}
                                >
                                    <div className="w-12 h-12 mx-auto rounded-xl bg-white/10 flex items-center justify-center">
                                        <Server className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold" style={{ color: styles.pillars.titleColor }}>
                                        {portfolioText.minecraft.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed" style={{ color: styles.pillars.descriptionColor }}>
                                        {portfolioText.minecraft.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Meta Tab */}
                <TabsContent value="meta" className="space-y-6">
                    <Card className="glass-card border-white/20">
                        <CardHeader><CardTitle>Badge & Buttons</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Experience Badge Text</Label>
                                <Input
                                    value={heroText.badge}
                                    onChange={(e) => updateContent(`locales.${contentLanguage}.hero.badge`, e.target.value)}
                                />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <ColorPicker label="Text Color" color={styles.badge.textColor} onChange={c => updateStyle('badge.textColor', c)} />
                                <ColorPicker label="Background" color={styles.badge.backgroundColor} onChange={c => updateStyle('badge.backgroundColor', c)} />
                                <ColorPicker label="Border" color={styles.badge.borderColor} onChange={c => updateStyle('badge.borderColor', c)} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Links, Footer & Nav Tab */}
                <TabsContent value="links" className="space-y-6">
                    <Card className="glass-card border-white/20">
                        <CardHeader><CardTitle>Links & Navigation</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Social Media</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>LinkedIn URL</Label>
                                        <Input
                                            value={content.social.linkedinUrl}
                                            onChange={(e) => updateContent('social.linkedinUrl', e.target.value)}
                                            className="bg-white/5"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>YouTube URL</Label>
                                        <Input
                                            value={content.social.youtubeUrl}
                                            onChange={(e) => updateContent('social.youtubeUrl', e.target.value)}
                                            className="bg-white/5"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Buttons & Labels</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                    <Label>Primary CTA (Hero)</Label>
                                    <Input
                                        value={ctaText.primaryButton}
                                        onChange={(e) => updateContent(`locales.${contentLanguage}.cta.primaryButton`, e.target.value)}
                                        className="bg-white/5"
                                    />
                                    </div>
                                    <div className="space-y-2">
                                    <Label>Secondary CTA (Hero)</Label>
                                    <Input
                                        value={ctaText.secondaryButton}
                                        onChange={(e) => updateContent(`locales.${contentLanguage}.cta.secondaryButton`, e.target.value)}
                                        className="bg-white/5"
                                    />
                                    </div>
                                    <div className="space-y-2">
                                    <Label>Nav Button</Label>
                                    <Input
                                        value={navText.getStarted}
                                        onChange={(e) => updateContent(`locales.${contentLanguage}.nav.getStarted`, e.target.value)}
                                        className="bg-white/5"
                                    />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Footer</h3>
                                <div className="space-y-2">
                                    <Label>Copyright Text</Label>
                                    <Input
                                        value={footerText.copyright}
                                        onChange={(e) => updateContent(`locales.${contentLanguage}.footer.copyright`, e.target.value)}
                                        className="bg-white/5"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="glass-card border-white/20">
                            <CardHeader>
                                <CardTitle>Branding & Hero Media</CardTitle>
                                <CardDescription>Upload logo and hero photo for the homepage</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <MediaUploader
                                    label="Site Logo"
                                    accept="image/*"
                                    maxSize={5}
                                    type="image"
                                    currentUrl={content.media.logoUrl}
                                    onUrlChange={(url) => updateContent("media.logoUrl", url)}
                                    uploadAction={uploadFile}
                                />
                                <MediaUploader
                                    label="Hero Photo"
                                    accept="image/*"
                                    maxSize={10}
                                    type="image"
                                    currentUrl={content.media.heroImageUrl}
                                    onUrlChange={(url) => updateContent("media.heroImageUrl", url)}
                                    uploadAction={uploadFile}
                                />
                                <div className="space-y-2">
                                    <Label>Hero Image Alt Text</Label>
                                    <Input
                                        value={content.media.heroImageAlt}
                                        onChange={(e) => updateContent("media.heroImageAlt", e.target.value)}
                                        className="bg-white/5"
                                        placeholder="Alt text for accessibility"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass-card border-white/20">
                            <CardHeader>
                                <CardTitle>Background Media</CardTitle>
                                <CardDescription>Control the homepage background video</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <MediaUploader
                                    label="Background Video"
                                    accept="video/mp4,video/webm"
                                    maxSize={100}
                                    type="video"
                                    currentUrl={theme.background.videoUrl}
                                    onUrlChange={(url) => updateThemeValue("background.videoUrl", url)}
                                    uploadAction={uploadFile}
                                />
                                <div className="space-y-2">
                                    <Label>Video URL</Label>
                                    <Input
                                        value={theme.background.videoUrl}
                                        onChange={(e) => updateThemeValue("background.videoUrl", e.target.value)}
                                        placeholder="https://example.com/video.mp4"
                                        className="bg-white/5"
                                    />
                                </div>
                                <MediaUploader
                                    label="Fallback Image"
                                    accept="image/*"
                                    maxSize={10}
                                    type="image"
                                    currentUrl={theme.background.fallbackImage}
                                    onUrlChange={(url) => updateThemeValue("background.fallbackImage", url)}
                                    uploadAction={uploadFile}
                                />
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Blur Amount</Label>
                                        <span className="text-sm text-muted-foreground">{theme.background.blurAmount}px</span>
                                    </div>
                                    <Slider
                                        value={[theme.background.blurAmount]}
                                        onValueChange={([v]) => updateThemeValue("background.blurAmount", v)}
                                        min={0}
                                        max={100}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Opacity</Label>
                                        <span className="text-sm text-muted-foreground">{theme.background.opacity}%</span>
                                    </div>
                                    <Slider
                                        value={[theme.background.opacity]}
                                        onValueChange={([v]) => updateThemeValue("background.opacity", v)}
                                        min={0}
                                        max={100}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
