import { PluginsManager } from "@/components/admin/plugins-manager"

export const dynamic = "force-dynamic"

export default function PluginsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Plugins</h2>
                <p className="text-muted-foreground">
                    Embed third-party scripts — chat widgets, analytics, pixels — without a redeploy.
                </p>
            </div>

            <PluginsManager />

            <p className="text-xs text-muted-foreground">
                Scripts added here run on every public page with full access to it. Only add sources
                you trust.
            </p>
        </div>
    )
}
