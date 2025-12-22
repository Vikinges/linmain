"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorPicker } from "@/components/admin/color-picker"
import { MediaUploader } from "@/components/admin/media-uploader"
import {
    Palette,
    Video,
    Type,
    Square,
    Save,
    RotateCcw
} from "lucide-react"
import { ThemeConfig, defaultTheme, loadTheme, saveTheme } from "@/lib/theme-config"
import { uploadFile } from "@/lib/actions/upload"

export default function AppearancePage() {
    const [theme, setTheme] = useState<ThemeConfig>(defaultTheme)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const loaded = loadTheme()
        setTheme(loaded)

        let active = true
        const loadRemoteConfig = async () => {
            try {
                const response = await fetch("/api/site-config", { cache: "no-store" })
                if (!response.ok) return
                const data = await response.json()
                if (!active) return
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
        saveTheme(theme)
        try {
            await fetch("/api/site-config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ theme })
            })
        } catch (error) {
            console.error("Failed to save site config:", error)
        }
        setTimeout(() => {
            setIsSaving(false)
        }, 500)
    }

    const handleReset = async () => {
        setTheme(defaultTheme)
        saveTheme(defaultTheme)
        try {
            await fetch("/api/site-config", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ theme: defaultTheme })
            })
        } catch (error) {
            console.error("Failed to reset site config:", error)
        }
    }

    const updateTheme = (path: string, value: any) => {
        const keys = path.split('.')
        const newTheme = { ...theme }
        let current: any = newTheme

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = value

        setTheme(newTheme)
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Appearance</h2>
                    <p className="text-muted-foreground mt-1">
                        Customize the visual style of your site
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="border-white/20 hover:bg-white/10"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="colors" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/5">
                    <TabsTrigger value="colors">
                        <Palette className="h-4 w-4 mr-2" />
                        Colors
                    </TabsTrigger>
                    <TabsTrigger value="background">
                        <Video className="h-4 w-4 mr-2" />
                        Background
                    </TabsTrigger>
                    <TabsTrigger value="typography">
                        <Type className="h-4 w-4 mr-2" />
                        Typography
                    </TabsTrigger>
                    <TabsTrigger value="components">
                        <Square className="h-4 w-4 mr-2" />
                        Components
                    </TabsTrigger>
                </TabsList>

                {/* Colors Tab */}
                <TabsContent value="colors" className="space-y-4">
                    <Card className="glass-card border-white/20">
                        <CardHeader>
                            <CardTitle>Theme Colors</CardTitle>
                            <CardDescription>Define your brand colors</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <ColorPicker
                                    label="Primary Color"
                                    color={theme.colors.primary}
                                    onChange={(c) => updateTheme('colors.primary', c)}
                                />
                                <ColorPicker
                                    label="Secondary Color"
                                    color={theme.colors.secondary}
                                    onChange={(c) => updateTheme('colors.secondary', c)}
                                />
                                <ColorPicker
                                    label="Accent Color"
                                    color={theme.colors.accent}
                                    onChange={(c) => updateTheme('colors.accent', c)}
                                />
                                <ColorPicker
                                    label="Background Color"
                                    color={theme.colors.background}
                                    onChange={(c) => updateTheme('colors.background', c)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Background Tab */}
                <TabsContent value="background" className="space-y-4">
                    <Card className="glass-card border-white/20">
                        <CardHeader>
                            <CardTitle>Background Video</CardTitle>
                            <CardDescription>Upload video or add URL with customizable effects</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Video Upload */}
                            <div className="space-y-2">
                                <Label>Upload Video from Computer</Label>
                                <MediaUploader
                                    accept="video/mp4,video/webm"
                                    maxSize={100}
                                    type="video"
                                    currentUrl={theme.background.videoUrl}
                                    onUrlChange={(url) => updateTheme('background.videoUrl', url)}
                                    uploadAction={uploadFile}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Upload MP4 or WebM video (max 100MB)
                                </p>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-slate-900 px-2 text-muted-foreground">Or use URL</span>
                                </div>
                            </div>

                            {/* Video URL */}
                            <div className="space-y-2">
                                <Label>Video URL</Label>
                                <Input
                                    value={theme.background.videoUrl}
                                    onChange={(e) => updateTheme('background.videoUrl', e.target.value)}
                                    placeholder="https://example.com/video.mp4"
                                    className="bg-white/5 border-white/20"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Or enter a direct link to MP4 or WebM video
                                </p>
                            </div>

                            {/* Fallback Image Upload */}
                            <div className="space-y-2">
                                <Label>Fallback Image (optional)</Label>
                                <MediaUploader
                                    accept="image/*"
                                    maxSize={10}
                                    type="image"
                                    currentUrl={theme.background.fallbackImage}
                                    onUrlChange={(url) => updateTheme('background.fallbackImage', url)}
                                    uploadAction={uploadFile}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Shown if video fails to load
                                </p>
                            </div>

                            <div className="h-px bg-white/10" />

                            {/* Blur Amount */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Blur Amount</Label>
                                    <span className="text-sm text-muted-foreground">{theme.background.blurAmount}px</span>
                                </div>
                                <Slider
                                    value={[theme.background.blurAmount]}
                                    onValueChange={([v]) => updateTheme('background.blurAmount', v)}
                                    min={0}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Recommended: 20-30px for readability
                                </p>
                            </div>

                            {/* Opacity */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Opacity</Label>
                                    <span className="text-sm text-muted-foreground">{theme.background.opacity}%</span>
                                </div>
                                <Slider
                                    value={[theme.background.opacity]}
                                    onValueChange={([v]) => updateTheme('background.opacity', v)}
                                    min={0}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Recommended: 40-60% for subtle effect
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Typography Tab */}
                <TabsContent value="typography" className="space-y-4">
                    <Card className="glass-card border-white/20">
                        <CardHeader>
                            <CardTitle>Typography Settings</CardTitle>
                            <CardDescription>Customize fonts and text sizing</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Font Family</Label>
                                <select
                                    value={theme.typography.fontFamily}
                                    onChange={(e) => updateTheme('typography.fontFamily', e.target.value)}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
                                >
                                    <option value="Inter">Inter</option>
                                    <option value="Poppins">Poppins</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Outfit">Outfit</option>
                                    <option value="Space Grotesk">Space Grotesk</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Base Font Size</Label>
                                    <span className="text-sm text-muted-foreground">{theme.typography.fontSize}px</span>
                                </div>
                                <Slider
                                    value={[theme.typography.fontSize]}
                                    onValueChange={([v]) => updateTheme('typography.fontSize', v)}
                                    min={12}
                                    max={20}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Components Tab */}
                <TabsContent value="components" className="space-y-4">
                    <Card className="glass-card border-white/20">
                        <CardHeader>
                            <CardTitle>Component Transparency</CardTitle>
                            <CardDescription>Adjust glassmorphism effects</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Menu Transparency</Label>
                                    <span className="text-sm text-muted-foreground">{theme.transparency.menu}%</span>
                                </div>
                                <Slider
                                    value={[theme.transparency.menu]}
                                    onValueChange={([v]) => updateTheme('transparency.menu', v)}
                                    min={0}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Cards Transparency</Label>
                                    <span className="text-sm text-muted-foreground">{theme.transparency.cards}%</span>
                                </div>
                                <Slider
                                    value={[theme.transparency.cards]}
                                    onValueChange={([v]) => updateTheme('transparency.cards', v)}
                                    min={0}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Buttons Transparency</Label>
                                    <span className="text-sm text-muted-foreground">{theme.transparency.buttons}%</span>
                                </div>
                                <Slider
                                    value={[theme.transparency.buttons]}
                                    onValueChange={([v]) => updateTheme('transparency.buttons', v)}
                                    min={0}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/20">
                        <CardHeader>
                            <CardTitle>Border Settings</CardTitle>
                            <CardDescription>Customize component borders</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Border Radius</Label>
                                    <span className="text-sm text-muted-foreground">{theme.borders.radius}px</span>
                                </div>
                                <Slider
                                    value={[theme.borders.radius]}
                                    onValueChange={([v]) => updateTheme('borders.radius', v)}
                                    min={0}
                                    max={50}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label>Border Width</Label>
                                    <span className="text-sm text-muted-foreground">{theme.borders.width}px</span>
                                </div>
                                <Slider
                                    value={[theme.borders.width]}
                                    onValueChange={([v]) => updateTheme('borders.width', v)}
                                    min={0}
                                    max={5}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Preview Info */}
            <Card className="glass-card border-blue-500/20 bg-blue-500/10">
                <CardContent className="pt-6">
                    <p className="text-sm text-blue-400">
                        <strong>💡 Tip:</strong> Changes are automatically applied. Click "Save Changes" to persist your settings.
                    </p>
                </CardContent>
            </Card>

        </div>
    )
}
