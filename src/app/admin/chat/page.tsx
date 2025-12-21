import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminChatPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Chat Management</h2>
                <p className="text-muted-foreground">View and moderate community chat messages.</p>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Chat Messages</CardTitle>
                    <CardDescription>Recent chat activity and moderation tools.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                        Chat moderation interface - Coming soon
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
