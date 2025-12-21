import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Download, Upload } from "lucide-react"

export default function DatabasePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Database Management</h2>
                <p className="text-muted-foreground">Backup, restore, and manage your database.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-base">Database Size</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">2.4 MB</div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-base">Total Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">1,245</div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-base">Last Backup</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-medium">2 hours ago</div>
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
                                <p className="font-medium">Create Backup</p>
                                <p className="text-sm text-muted-foreground">Download a full database backup</p>
                            </div>
                        </div>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Backup
                        </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Upload className="w-8 h-8 text-primary" />
                            <div>
                                <p className="font-medium">Restore Database</p>
                                <p className="text-sm text-muted-foreground">Upload and restore from backup file</p>
                            </div>
                        </div>
                        <Button variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Restore
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
