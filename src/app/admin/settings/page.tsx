import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettingsPage() {
    const nextauthUrl = process.env.NEXTAUTH_URL || "Not set"
    const adminEmails = process.env.ADMIN_EMAILS || "Not set"
    const authTrustHost = process.env.AUTH_TRUST_HOST || "true"
    const googleClientId = process.env.GOOGLE_CLIENT_ID || ""
    const googleClientSummary = googleClientId
        ? `${googleClientId.slice(0, 6)}...${googleClientId.slice(-6)}`
        : "Not set"

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
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border border-white/10 rounded-lg p-4">
                            <div>
                                <p className="font-medium">NEXTAUTH_URL</p>
                                <p className="text-sm text-muted-foreground">{nextauthUrl}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border border-white/10 rounded-lg p-4">
                            <div>
                                <p className="font-medium">ADMIN_EMAILS</p>
                                <p className="text-sm text-muted-foreground">{adminEmails}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border border-white/10 rounded-lg p-4">
                            <div>
                                <p className="font-medium">GOOGLE_CLIENT_ID</p>
                                <p className="text-sm text-muted-foreground">{googleClientSummary}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border border-white/10 rounded-lg p-4">
                            <div>
                                <p className="font-medium">AUTH_TRUST_HOST</p>
                                <p className="text-sm text-muted-foreground">{authTrustHost}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
