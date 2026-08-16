"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"
import { pluginSnippet, type SitePlugin } from "@/lib/plugins"

type PluginsResponse = {
    plugins: SitePlugin[]
    source: "db" | "env"
}

const emptyPlugin = (): SitePlugin => ({
    id: `plugin-${Date.now().toString(36)}`,
    name: "",
    src: "",
    attributes: [{ name: "data-client", value: "" }],
    hiddenPaths: ["/admin"],
    hideSelector: "",
    enabled: true,
})

export function PluginsManager() {
    const [plugins, setPlugins] = useState<SitePlugin[]>([])
    const [source, setSource] = useState<"db" | "env" | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        let active = true
        const load = async () => {
            try {
                const response = await fetch("/api/admin/plugins", { cache: "no-store" })
                if (!response.ok) return
                const data: PluginsResponse = await response.json()
                if (!active) return
                setPlugins(data.plugins)
                setSource(data.source)
            } catch (error) {
                console.error("Failed to load plugins:", error)
            } finally {
                if (active) setIsLoading(false)
            }
        }

        load()
        return () => {
            active = false
        }
    }, [])

    const update = (id: string, patch: Partial<SitePlugin>) => {
        setPlugins((current) =>
            current.map((plugin) => (plugin.id === id ? { ...plugin, ...patch } : plugin))
        )
    }

    const handleSave = async () => {
        setMessage(null)

        const incomplete = plugins.find((plugin) => !plugin.src.trim())
        if (incomplete) {
            setMessage("Every plugin needs a script URL.")
            return
        }

        setIsSaving(true)
        try {
            const response = await fetch("/api/admin/plugins", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plugins }),
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}))
                setMessage(payload?.error || "Failed to save plugins.")
                return
            }

            const data: PluginsResponse = await response.json()
            setPlugins(data.plugins)
            setSource(data.source)
            setMessage("Saved. Reload the public site to see the change.")
        } catch (error) {
            console.error("Failed to save plugins:", error)
            setMessage("Failed to save plugins.")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <Card className="glass-card">
                <CardContent className="py-8">
                    <p className="text-sm text-muted-foreground">Loading plugins…</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {source === "env" && (
                <Card className="glass-card border-amber-500/30">
                    <CardContent className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Not saved to the database yet — this list is inherited from the{" "}
                            <code className="text-xs">AI_CONSULTANT_CLIENT_ID</code> environment
                            variable. Press Save once and the admin panel takes over: after that the
                            environment variable is ignored.
                        </p>
                    </CardContent>
                </Card>
            )}

            {plugins.length === 0 && (
                <Card className="glass-card">
                    <CardContent className="py-8">
                        <p className="text-sm text-muted-foreground">
                            No plugins yet. Add one to embed a script such as a chat widget or an
                            analytics tag.
                        </p>
                    </CardContent>
                </Card>
            )}

            {plugins.map((plugin) => (
                <Card key={plugin.id} className="glass-card">
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle>{plugin.name || "Untitled plugin"}</CardTitle>
                            <CardDescription>
                                {plugin.enabled ? "Active on the public site" : "Disabled"}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                checked={plugin.enabled}
                                onCheckedChange={(checked) => update(plugin.id, { enabled: checked })}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Remove plugin"
                                onClick={() =>
                                    setPlugins((current) => current.filter((item) => item.id !== plugin.id))
                                }
                            >
                                <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input
                                    value={plugin.name}
                                    onChange={(event) => update(plugin.id, { name: event.target.value })}
                                    placeholder="AI consultant"
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Script URL</Label>
                                <Input
                                    value={plugin.src}
                                    onChange={(event) => update(plugin.id, { src: event.target.value })}
                                    placeholder="https://ai.crm-iot.com/widget.js"
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                        </div>

                        <Separator className="bg-white/10" />

                        <div className="space-y-2">
                            <Label>Attributes</Label>
                            <p className="text-xs text-muted-foreground">
                                The values the vendor gives you, such as{" "}
                                <code className="text-xs">data-client</code> = 105.
                            </p>
                            <div className="space-y-2">
                                {plugin.attributes.map((attribute, index) => (
                                    <div key={index} className="flex flex-wrap items-center gap-2">
                                        <Input
                                            value={attribute.name}
                                            onChange={(event) => {
                                                const attributes = [...plugin.attributes]
                                                attributes[index] = { ...attribute, name: event.target.value }
                                                update(plugin.id, { attributes })
                                            }}
                                            placeholder="data-client"
                                            className="w-48 bg-white/5 border-white/10"
                                        />
                                        <Input
                                            value={attribute.value}
                                            onChange={(event) => {
                                                const attributes = [...plugin.attributes]
                                                attributes[index] = { ...attribute, value: event.target.value }
                                                update(plugin.id, { attributes })
                                            }}
                                            placeholder="105"
                                            className="w-48 bg-white/5 border-white/10"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Remove attribute"
                                            onClick={() =>
                                                update(plugin.id, {
                                                    attributes: plugin.attributes.filter((_, i) => i !== index),
                                                })
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    update(plugin.id, {
                                        attributes: [...plugin.attributes, { name: "", value: "" }],
                                    })
                                }
                                className="border-white/10 bg-white/5"
                            >
                                <Plus className="mr-2 h-3 w-3" />
                                Add attribute
                            </Button>
                        </div>

                        <Separator className="bg-white/10" />

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Hide on paths</Label>
                                <Input
                                    value={plugin.hiddenPaths.join(", ")}
                                    onChange={(event) =>
                                        update(plugin.id, {
                                            hiddenPaths: event.target.value
                                                .split(",")
                                                .map((path) => path.trim())
                                                .filter(Boolean),
                                        })
                                    }
                                    placeholder="/admin"
                                    className="bg-white/5 border-white/10"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Comma-separated. The path and everything under it. Keep{" "}
                                    <code className="text-xs">/admin</code> so a floating chat button
                                    does not cover the editor.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Hide selector</Label>
                                <Input
                                    value={plugin.hideSelector}
                                    onChange={(event) => update(plugin.id, { hideSelector: event.target.value })}
                                    placeholder="[data-linart-widget]"
                                    className="bg-white/5 border-white/10"
                                />
                                <p className="text-xs text-muted-foreground">
                                    A loaded third-party script cannot be unloaded. This selector
                                    hides what it already put on the page when you navigate to a
                                    hidden path without a full reload.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Resulting tag</Label>
                            <code className="block overflow-x-auto rounded-md border border-white/10 bg-white/5 p-3 text-xs">
                                {plugin.src ? pluginSnippet(plugin) : "Add a script URL to see the tag"}
                            </code>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <div className="flex flex-wrap items-center gap-3">
                <Button
                    variant="outline"
                    onClick={() => setPlugins((current) => [...current, emptyPlugin()])}
                    className="border-white/10 bg-white/5"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add plugin
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                    {isSaving ? "Saving..." : "Save plugins"}
                </Button>
                {message && <p className="text-sm text-muted-foreground">{message}</p>}
            </div>
        </div>
    )
}
