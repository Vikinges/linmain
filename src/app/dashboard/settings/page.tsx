import { GlassShell } from "@/components/layout/shell"
import { UserNav } from "@/components/navigation/user-nav"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/auth"
import { isAdminUser } from "@/lib/admin"
import { redirect } from "next/navigation"
import {
    User,
    Bell,
    Shield,
    Palette,
    Mail,
    Key,
    Globe,
    Save
} from "lucide-react"

export default async function SettingsPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    const user = {
        name: session.user.name || "User",
        email: session.user.email || "",
        image: session.user.image || ""
    }

    return (
        <>
            <UserNav user={user} isAdmin={isAdminUser(session.user)} />
            <GlassShell>
                <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">

                    {/* Header */}
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                            Settings
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Manage your account preferences and settings
                        </p>
                    </div>

                    {/* Profile Settings */}
                    <Card className="glass-card border-white/20 shadow-xl">
                        <CardHeader className="border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <User className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>Update your personal details</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input
                                        id="name"
                                        defaultValue={user.name}
                                        className="bg-white/5 border-white/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={user.email}
                                        className="bg-white/5 border-white/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Input
                                    id="bio"
                                    placeholder="Tell us about yourself..."
                                    className="bg-white/5 border-white/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            id="website"
                                            placeholder="https://yourwebsite.com"
                                            className="bg-white/5 border-white/20"
                                        />
                                    </div>
                                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                                        <Globe className="h-4 w-4 mr-2" />
                                        Verify
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card className="glass-card border-white/20 shadow-xl">
                        <CardHeader className="border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <Bell className="h-5 w-5 text-orange-400" />
                                </div>
                                <div>
                                    <CardTitle>Notifications</CardTitle>
                                    <CardDescription>Configure how you receive updates</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Email Notifications</Label>
                                    <p className="text-sm text-gray-400">Receive email about your account activity</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <Separator className="bg-white/10" />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">New Message Alerts</Label>
                                    <p className="text-sm text-gray-400">Get notified when you receive new messages</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <Separator className="bg-white/10" />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Weekly Reports</Label>
                                    <p className="text-sm text-gray-400">Receive weekly analytics summary</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card className="glass-card border-white/20 shadow-xl">
                        <CardHeader className="border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/20 rounded-lg">
                                    <Shield className="h-5 w-5 text-red-400" />
                                </div>
                                <div>
                                    <CardTitle>Security</CardTitle>
                                    <CardDescription>Keep your account secure</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    placeholder="Enter current password"
                                    className="bg-white/5 border-white/20"
                                />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        placeholder="Enter new password"
                                        className="bg-white/5 border-white/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Confirm new password"
                                        className="bg-white/5 border-white/20"
                                    />
                                </div>
                            </div>

                            <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                                <Key className="h-4 w-4 mr-2" />
                                Update Password
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Appearance */}
                    <Card className="glass-card border-white/20 shadow-xl">
                        <CardHeader className="border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Palette className="h-5 w-5 text-purple-400" />
                                </div>
                                <div>
                                    <CardTitle>Appearance</CardTitle>
                                    <CardDescription>Customize your interface</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Dark Mode</Label>
                                    <p className="text-sm text-gray-400">Use dark theme throughout the app</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <Separator className="bg-white/10" />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Compact View</Label>
                                    <p className="text-sm text-gray-400">Show more content on screen</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" className="border-white/20 hover:bg-white/10">
                            Cancel
                        </Button>
                        <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/30">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>

                    {/* Info */}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-blue-400">
                            <strong>ℹ️ Mock Settings:</strong> These settings are for demonstration.
                            Full functionality available in production deployment.
                        </p>
                    </div>

                </div>
            </GlassShell>
        </>
    )
}
