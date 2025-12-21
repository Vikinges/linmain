import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Configure site settings and preferences.</p>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Site configuration options.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                        Settings interface - Coming soon
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
