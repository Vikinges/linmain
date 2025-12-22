import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import { BarChart3, Link as LinkIcon, MessageSquare, Users } from "lucide-react"

export default async function AnalyticsPage() {
    const [userCount, linkCount, messageCount, groupCount] = await Promise.all([
        prisma.user.count(),
        prisma.serviceLink.count(),
        prisma.chatMessage.count(),
        prisma.group.count(),
    ])

    const topLinks = await prisma.serviceLink.findMany({
        orderBy: { order: "asc" },
        take: 5,
    })

    const groups = await prisma.group.findMany({
        orderBy: { name: "asc" },
        include: { users: true },
        take: 5,
    })

    const recentMessages = await prisma.chatMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: true },
    })

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                <p className="text-muted-foreground">Live stats from your database.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                        <p className="text-xs text-muted-foreground">Registered accounts</p>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{linkCount}</div>
                        <p className="text-xs text-muted-foreground">Service links stored</p>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chat Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{messageCount}</div>
                        <p className="text-xs text-muted-foreground">Messages stored</p>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Groups</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{groupCount}</div>
                        <p className="text-xs text-muted-foreground">Defined groups</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Latest Messages</CardTitle>
                    <CardDescription>Recent chat activity from users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentMessages.length === 0 && (
                            <div className="text-muted-foreground">No messages yet</div>
                        )}
                        {recentMessages.map((message) => (
                            <div key={message.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {(message.user.name || message.user.email || "U").charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {message.user.name || message.user.email || "Unknown User"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {message.content.slice(0, 160)}
                                    </p>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {message.createdAt.toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Top Links</CardTitle>
                        <CardDescription>Links configured in the system.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topLinks.length === 0 && (
                                <div className="text-muted-foreground">No links configured</div>
                            )}
                            {topLinks.map((link) => (
                                <div key={link.id} className="flex items-center justify-between">
                                    <span className="font-medium">{link.title}</span>
                                    <span className="text-xs text-muted-foreground">{link.url}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Groups Overview</CardTitle>
                        <CardDescription>Active groups and member counts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {groups.length === 0 && (
                                <div className="text-muted-foreground">No groups configured</div>
                            )}
                            {groups.map((group) => (
                                <div key={group.id} className="flex items-center justify-between text-sm">
                                    <span>{group.name}</span>
                                    <span className="font-medium">{group.users.length} members</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
