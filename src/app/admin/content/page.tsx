"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorPicker } from "@/components/admin/color-picker"
import { Save, RotateCcw, LayoutTemplate, Type, MessageSquare, Briefcase } from "lucide-react"
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

export default function ContentPage() {
    const [content, setContent] = useState<HomepageContent>(defaultContent)
    const [styles, setStyles] = useState<TextStyles>(defaultStyles)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        setContent(loadContent())
        setStyles(loadContentStyles())
    }, [])

    const handleSave = () => {
        setIsSaving(true)
        saveContent(content)
        saveContentStyles(styles)
        setTimeout(() => setIsSaving(false), 500)
    }

    const handleReset = () => {
        setContent(defaultContent)
        setStyles(defaultStyles)
    }

    // Helper to update state deeply
    const updateContent = (path: string, value: string) => {
        const keys = path.split('.')
        const newContent = { ...content }
        let current: any = newContent
        for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]]
        current[keys[keys.length - 1]] = value
        setContent(newContent)
    }

    const updateStyle = (path: string, value: any) => {
        const keys = path.split('.')
        const newStyles = { ...styles }
        let current: any = newStyles
        for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]]
        current[keys[keys.length - 1]] = value
        setStyles(newStyles)
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Homepage Editor</h2>
                    <p className="text-muted-foreground mt-1">Manage text and colors visually</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleReset} className="border-white/20 hover:bg-white/10">
                        <RotateCcw className="h-4 w-4 mr-2" /> Reset
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                        <Save className="h-4 w-4 mr-2" /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="callout" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-white/5">
                    <TabsTrigger value="hero"><LayoutTemplate className="h-4 w-4 mr-2" /> Hero</TabsTrigger>
                    <TabsTrigger value="pillars"><Briefcase className="h-4 w-4 mr-2" /> Pillars</TabsTrigger>
                    <TabsTrigger value="callout"><MessageSquare className="h-4 w-4 mr-2" /> Callout</TabsTrigger>
                    <TabsTrigger value="meta"><Type className="h-4 w-4 mr-2" /> Badge & Other</TabsTrigger>
                    <TabsTrigger value="links"><Type className="h-4 w-4 mr-2" /> Links & Footer</TabsTrigger>
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
                                        value={content.callout.title}
                                        onChange={(e) => updateContent('callout.title', e.target.value)}
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
                                        value={content.callout.description}
                                        onChange={(e) => updateContent('callout.description', e.target.value)}
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
                                        {content.callout.title}
                                    </h2>
                                    <p className="text-xl leading-relaxed max-w-lg mx-auto" style={{ color: styles.callout.descriptionColor }}>
                                        {content.callout.description}
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
                                        value={content.hero.name}
                                        onChange={(e) => updateContent('hero.name', e.target.value)}
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
                                        value={content.hero.subtitle}
                                        onChange={(e) => updateContent('hero.subtitle', e.target.value)}
                                        className="bg-white/5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={content.hero.description}
                                        onChange={(e) => updateContent('hero.description', e.target.value)}
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
                                        {content.hero.name}
                                    </h1>
                                    <p className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600">
                                        {content.hero.subtitle}
                                    </p>
                                    <p style={{ color: styles.description.textColor }}>
                                        {content.hero.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Pillars Tab */}
                <TabsContent value="pillars" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="glass-card border-white/20">
                            <CardHeader><CardTitle>Pillars Styling</CardTitle></CardHeader>
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
                                    <Label className="text-lg">Business Pillar</Label>
                                    <Input
                                        value={content.pillars.business.title}
                                        onChange={(e) => updateContent('pillars.business.title', e.target.value)}
                                    />
                                    <Textarea
                                        value={content.pillars.business.description}
                                        onChange={(e) => updateContent('pillars.business.description', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-4 border-t border-white/10 pt-4">
                                    <Label className="text-lg">Content Creation Pillar</Label>
                                    <Input
                                        value={content.pillars.content.title}
                                        onChange={(e) => updateContent('pillars.content.title', e.target.value)}
                                    />
                                    <Textarea
                                        value={content.pillars.content.description}
                                        onChange={(e) => updateContent('pillars.content.description', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-4 border-t border-white/10 pt-4">
                                    <Label className="text-lg">Tech Development Pillar</Label>
                                    <Input
                                        value={content.pillars.tech.title}
                                        onChange={(e) => updateContent('pillars.tech.title', e.target.value)}
                                    />
                                    <Textarea
                                        value={content.pillars.tech.description}
                                        onChange={(e) => updateContent('pillars.tech.description', e.target.value)}
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
                                <CardDescription>Visual check for contrast</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 bg-card/50 rounded-lg border border-dashed border-white/10">
                                <div
                                    className="p-6 rounded-xl border border-white/10 text-center space-y-4 shadow-xl transition-all"
                                    style={{ backgroundColor: styles.pillars.backgroundColor || 'rgba(17, 24, 39, 0.5)' }}
                                >
                                    <div className="w-12 h-12 mx-auto rounded-xl bg-white/10 flex items-center justify-center">
                                        <Briefcase className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold" style={{ color: styles.pillars.titleColor }}>
                                        {content.pillars.business.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed" style={{ color: styles.pillars.descriptionColor }}>
                                        {content.pillars.business.description}
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
                                    value={content.hero.badge}
                                    onChange={(e) => updateContent('hero.badge', e.target.value)}
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
                                            value={content.cta.primaryButton}
                                            onChange={(e) => updateContent('cta.primaryButton', e.target.value)}
                                            className="bg-white/5"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Secondary CTA (Hero)</Label>
                                        <Input
                                            value={content.cta.secondaryButton}
                                            onChange={(e) => updateContent('cta.secondaryButton', e.target.value)}
                                            className="bg-white/5"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Nav Button</Label>
                                        <Input
                                            value={content.nav?.getStarted || ""}
                                            onChange={(e) => updateContent('nav.getStarted', e.target.value)}
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
                                        value={content.footer?.copyright || ""}
                                        onChange={(e) => updateContent('footer.copyright', e.target.value)}
                                        className="bg-white/5"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
