"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createLink } from "@/lib/actions/links"
import { useState } from "react"
import { DialogFooter } from "@/components/ui/dialog"

export function LinkForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            await createLink(formData)
            if (onSuccess) onSuccess()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="My Website" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" name="url" placeholder="https://example.com" type="url" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="icon">Icon Name (Lucide)</Label>
                <Input id="icon" name="icon" placeholder="Globe" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" placeholder="Short description" />
            </div>
            <div className="flex items-center space-x-2">
                <input type="checkbox" id="isPublic" name="isPublic" className="w-4 h-4" />
                <Label htmlFor="isPublic">Publicly Visible</Label>
            </div>

            <DialogFooter>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Link"}
                </Button>
            </DialogFooter>
        </form>
    )
}
