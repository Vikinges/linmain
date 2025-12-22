"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ColorPicker } from "@/components/admin/color-picker"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface TextStyleEditorProps {
    styles: {
        nameColor: string
        nameOutline: string
        nameOutlineWidth: number
        nameGlow: string
        nameGlowIntensity: number
        subtitleGradientFrom: string
        subtitleGradientTo: string
    }
    onChange: (styles: TextStyleEditorProps["styles"]) => void
    title?: string
}

export function HeroTextStyleEditor({ styles, onChange, title = "Hero Text Styling" }: TextStyleEditorProps) {
    const updateStyle = <K extends keyof TextStyleEditorProps["styles"]>(
        key: K,
        value: TextStyleEditorProps["styles"][K]
    ) => {
        onChange({ ...styles, [key]: value })
    }

    return (
        <Card className="glass-card border-white/20">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Customize text colors, outline, and glow effects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Name Styling */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white">Name Text</h4>

                    <ColorPicker
                        label="Text Color"
                        color={styles.nameColor}
                        onChange={(c) => updateStyle('nameColor', c)}
                    />

                    <ColorPicker
                        label="Outline Color"
                        color={styles.nameOutline}
                        onChange={(c) => updateStyle('nameOutline', c)}
                    />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Outline Width</Label>
                            <span className="text-sm text-muted-foreground">{styles.nameOutlineWidth}px</span>
                        </div>
                        <Slider
                            value={[styles.nameOutlineWidth]}
                            onValueChange={([v]) => updateStyle('nameOutlineWidth', v)}
                            min={0}
                            max={5}
                            step={0.5}
                            className="w-full"
                        />
                    </div>

                    <ColorPicker
                        label="Glow Color"
                        color={styles.nameGlow}
                        onChange={(c) => updateStyle('nameGlow', c)}
                    />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Glow Intensity</Label>
                            <span className="text-sm text-muted-foreground">{styles.nameGlowIntensity}px</span>
                        </div>
                        <Slider
                            value={[styles.nameGlowIntensity]}
                            onValueChange={([v]) => updateStyle('nameGlowIntensity', v)}
                            min={0}
                            max={100}
                            step={5}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Subtitle Gradient */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white">Subtitle Gradient</h4>

                    <ColorPicker
                        label="Gradient Start"
                        color={styles.subtitleGradientFrom}
                        onChange={(c) => updateStyle('subtitleGradientFrom', c)}
                    />

                    <ColorPicker
                        label="Gradient End"
                        color={styles.subtitleGradientTo}
                        onChange={(c) => updateStyle('subtitleGradientTo', c)}
                    />
                </div>

            </CardContent>
        </Card>
    )
}

interface SimpleStyleEditorProps {
    styles: {
        textColor: string
        backgroundColor?: string
        borderColor?: string
    }
    onChange: (styles: SimpleStyleEditorProps["styles"]) => void
    title: string
    description?: string
}

export function SimpleTextStyleEditor({ styles, onChange, title, description }: SimpleStyleEditorProps) {
    const updateStyle = <K extends keyof SimpleStyleEditorProps["styles"]>(
        key: K,
        value: SimpleStyleEditorProps["styles"][K]
    ) => {
        onChange({ ...styles, [key]: value })
    }

    return (
        <Card className="glass-card border-white/20">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4">

                <ColorPicker
                    label="Text Color"
                    color={styles.textColor}
                    onChange={(c) => updateStyle('textColor', c)}
                />

                {styles.backgroundColor !== undefined && (
                    <ColorPicker
                        label="Background Color"
                        color={styles.backgroundColor}
                        onChange={(c) => updateStyle('backgroundColor', c)}
                    />
                )}

                {styles.borderColor !== undefined && (
                    <ColorPicker
                        label="Border Color"
                        color={styles.borderColor}
                        onChange={(c) => updateStyle('borderColor', c)}
                    />
                )}

            </CardContent>
        </Card>
    )
}
