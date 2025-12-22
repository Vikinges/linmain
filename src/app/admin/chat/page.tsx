import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"

export default async function AdminChatPage() {
    const messages = await prisma.chatMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { user: true },
    })

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
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="text-muted-foreground">No messages yet</div>
                        )}
                        {messages.map((message) => (
                            <div key={message.id} className="flex items-start gap-4 rounded-lg border border-white/10 p-4">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {(message.user.name || message.user.email || "U").charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">
                                            {message.user.name || message.user.email || "Unknown User"}
                                        </p>
                                        <span className="text-xs text-muted-foreground">
                                            {message.createdAt.toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{message.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
