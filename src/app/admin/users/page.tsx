import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/db"
import { UserPlus, Shield, Mail, Calendar } from "lucide-react"

export default async function UsersPage() {
    const [users, groups] = await Promise.all([
        prisma.user.findMany({
            include: { groups: true },
            orderBy: { createdAt: "desc" },
        }),
        prisma.group.findMany({
            include: { users: true },
            orderBy: { name: "asc" },
        }),
    ])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users & Groups</h2>
                    <p className="text-muted-foreground">Manage user access and group permissions.</p>
                </div>
                <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite User
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground">Registered accounts</p>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{groups.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage user roles and group assignments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Groups</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Mail className="w-3 h-3 mr-2 text-muted-foreground" />
                                            {user.email || "No email"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.role === "ADMIN" ? (
                                            <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">Admin</Badge>
                                        ) : (
                                            <Badge variant="secondary">User</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.groups.length === 0 ? (
                                            <span className="text-xs text-muted-foreground">No groups</span>
                                        ) : (
                                            <div className="flex gap-1">
                                                {user.groups.map((group) => (
                                                    <Badge key={group.id} variant="outline" className="text-xs">
                                                        {group.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Calendar className="w-3 h-3 mr-2" />
                                            {user.createdAt.toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Groups Section */}
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Groups</CardTitle>
                    <CardDescription>Organize users into groups for access control.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {groups.map((group) => (
                            <Card key={group.id} className="bg-white/5 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-base">{group.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-primary">{group.users.length}</p>
                                    <p className="text-xs text-muted-foreground">members</p>
                                    <Button variant="outline" size="sm" className="mt-3 w-full">
                                        Manage
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                        <Card className="bg-white/5 border-white/10 border-dashed flex items-center justify-center cursor-pointer hover:bg-white/10 transition">
                            <CardContent className="text-center py-8">
                                <UserPlus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Create Group</p>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
