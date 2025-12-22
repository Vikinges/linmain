"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type AuthSettingsResponse = {
    googleClientId: string
    googleClientIdSource: "db" | "env" | "none"
    googleClientSecretSet: boolean
    storedClientId: string
    storedSecretSet: boolean
}

export function AuthSettingsForm() {
    const [status, setStatus] = useState<AuthSettingsResponse | null>(null)
    const [clientId, setClientId] = useState("")
    const [clientSecret, setClientSecret] = useState("")
    const [message, setMessage] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        let active = true
        const load = async () => {
            try {
                const response = await fetch("/api/admin/auth-settings", { cache: "no-store" })
                if (!response.ok) return
                const data: AuthSettingsResponse = await response.json()
                if (!active) return
                setStatus(data)
                setClientId(data.storedClientId || data.googleClientId || "")
            } catch (error) {
                console.error("Failed to load auth settings:", error)
            }
        }

        load()
        return () => {
            active = false
        }
    }, [])

    const handleSave = async () => {
        setMessage(null)
        const trimmedClientId = clientId.trim()
        const trimmedSecret = clientSecret.trim()

        if (!trimmedClientId && !trimmedSecret) {
            setMessage("Enter a client ID or a client secret before saving.")
            return
        }

        setIsSaving(true)
        try {
            const response = await fetch("/api/admin/auth-settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    googleClientId: trimmedClientId || undefined,
                    googleClientSecret: trimmedSecret || undefined,
                })
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}))
                setMessage(payload?.error || "Failed to save settings.")
                return
            }

            const data: AuthSettingsResponse = await response.json()
            setStatus(data)
            setClientSecret("")
            setMessage("Saved. New logins will use the updated settings.")
        } catch (error) {
            console.error("Failed to save auth settings:", error)
            setMessage("Failed to save settings.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle>Google OAuth</CardTitle>
                <CardDescription>Override Google OAuth keys from the admin panel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Client ID</Label>
                        <Input
                            value={clientId}
                            onChange={(event) => setClientId(event.target.value)}
                            placeholder="Google Client ID"
                            className="bg-white/5 border-white/10"
                        />
                        <p className="text-xs text-muted-foreground">
                            Source: {status?.googleClientIdSource || "unknown"}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label>Client Secret</Label>
                        <Input
                            value={clientSecret}
                            onChange={(event) => setClientSecret(event.target.value)}
                            placeholder="Enter a new secret to update"
                            type="password"
                            className="bg-white/5 border-white/10"
                        />
                        <p className="text-xs text-muted-foreground">
                            Stored secret: {status?.storedSecretSet ? "yes" : "no"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gray-700 hover:bg-gray-600 text-white"
                    >
                        {isSaving ? "Saving..." : "Save OAuth Settings"}
                    </Button>
                    {message && <p className="text-sm text-muted-foreground">{message}</p>}
                </div>

                <p className="text-xs text-muted-foreground">
                    Leaving the secret blank keeps the currently stored secret. Updates affect new sign-ins immediately.
                </p>
            </CardContent>
        </Card>
    )
}
