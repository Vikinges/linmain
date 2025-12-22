import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db"
import { Database, Download, Upload } from "lucide-react"

export default async function DatabasePage() {
    const [userCount, linkCount, messageCount, configCount] = await Promise.all([
        prisma.user.count(),
        prisma.serviceLink.count(),
        prisma.chatMessage.count(),
        prisma.siteConfig.count(),
    ])

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Database Management</h2>
                <p className="text-muted-foreground">Backup, restore, and manage your database.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-base">Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{userCount}</div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-base">Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{linkCount}</div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-base">Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{messageCount}</div>
                        <p className="text-xs text-muted-foreground">{configCount} site config entries</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Database Operations</CardTitle>
                    <CardDescription>Backup and restore operations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Database className="w-8 h-8 text-primary" />
                            <div>
                                <p className="font-medium">Export Data</p>
                                <p className="text-sm text-muted-foreground">Download a JSON snapshot</p>
                            </div>
                        </div>
                        <Button variant="outline" asChild>
                            <a href="/api/admin/db-export">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </a>
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Upload className="w-8 h-8 text-primary" />
                            <div>
                                <p className="font-medium">Restore Database</p>
                                <p className="text-sm text-muted-foreground">Restore from JSON (manual)</p>
                            </div>
                        </div>
                        <Button variant="outline" disabled>
                            <Upload className="w-4 h-4 mr-2" />
                            Restore
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
