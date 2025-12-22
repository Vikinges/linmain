import { GlassShell } from "@/components/layout/shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UserNav } from "@/components/navigation/user-nav"
import { LinkCard } from "@/components/ui/link-card"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { isAdminUser } from "@/lib/admin"
import { redirect } from "next/navigation"
import {
    TrendingUp,
    MessageSquare,
    Link as LinkIcon,
    Clock,
    Users,
    Eye,
    Plus,
    Zap,
    Activity
} from "lucide-react"

// Mock version for Windows testing
export default async function DashboardPage() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }

    const user = {
        name: session.user.name || "User",
        email: session.user.email || "",
        image: session.user.image || ""
    }

    const mockLinks = [
        { id: "1", title: "My Portfolio", url: "https://example.com", icon: "Globe" },
        { id: "2", title: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
        { id: "3", title: "Private Cloud", url: "https://cloud.example.com", icon: "Cloud" },
    ]

    const isAdmin = isAdminUser(session.user)

    return (
        <>
            <UserNav user={user} isAdmin={isAdmin} />
            <GlassShell>
                <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">

                    {/* Hero Welcome Section */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12 shadow-2xl shadow-black/40 border border-white/10">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-6 h-6 text-gray-200 fill-gray-200" />
                                <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Premium Dashboard</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
                                Welcome back, {user.name}!
                            </h1>
                            <p className="text-xl text-gray-300 max-w-2xl">
                                Your personal command center is ready. Track your performance and engage with your community.
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid - Colorful Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {/* Total Views Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-slate-900/80 p-6 shadow-xl shadow-black/30 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                        <Eye className="h-6 w-6 text-white" />
                                    </div>
                                    <Activity className="h-5 w-5 text-white/40" />
                                </div>
                                <p className="text-sm font-medium text-gray-300 mb-1">Total Views</p>
                                <p className="text-4xl font-bold text-white mb-2">2,345</p>
                                <div className="flex items-center text-sm text-white/80">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    <span className="font-semibold">+12%</span>
                                    <span className="ml-1 text-white/60">vs last week</span>
                                </div>
                            </div>
                        </div>

                        {/* Link Clicks Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-slate-900/80 p-6 shadow-xl shadow-black/30 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                        <LinkIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <Activity className="h-5 w-5 text-white/40" />
                                </div>
                                <p className="text-sm font-medium text-gray-300 mb-1">Link Clicks</p>
                                <p className="text-4xl font-bold text-white mb-2">1,234</p>
                                <div className="flex items-center text-sm text-white/80">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    <span className="font-semibold">+8%</span>
                                    <span className="ml-1 text-white/60">vs last week</span>
                                </div>
                            </div>
                        </div>

                        {/* Messages Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-slate-900/80 p-6 shadow-xl shadow-black/30 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                        <MessageSquare className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="px-2 py-1 bg-gray-200 text-gray-900 text-xs font-bold rounded-full">
                                        12 NEW
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-300 mb-1">Messages</p>
                                <p className="text-4xl font-bold text-white mb-2">58</p>
                                <p className="text-sm text-white/70">12 unread messages</p>
                            </div>
                        </div>

                        {/* Active Links Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-slate-900/80 p-6 shadow-xl shadow-black/30 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                        <Zap className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="px-2 py-1 bg-gray-200 text-gray-900 text-xs font-bold rounded-full">
                                        ACTIVE
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-300 mb-1">Active Links</p>
                                <p className="text-4xl font-bold text-white mb-2">{mockLinks.length}</p>
                                <p className="text-sm text-white/70">All systems operational</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid gap-6 lg:grid-cols-3">

                        {/* Links Section */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="glass-card border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                <CardHeader className="border-b border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                                                Your Links
                                            </CardTitle>
                                            <CardDescription className="text-gray-400 mt-1">
                                                Quick access - 3 active
                                            </CardDescription>
                                        </div>
                                        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 shadow-lg shadow-black/30">
                                            <Plus className="h-4 w-4 mr-1" />
                                            Add
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3 pt-6">
                                    {mockLinks.map((link) => (
                                        <LinkCard
                                            key={link.id}
                                            title={link.title}
                                            url={link.url}
                                            icon={link.icon}
                                            className="bg-gradient-to-r from-white/5 to-white/10 border-white/20 hover:from-white/10 hover:to-white/15 hover:border-white/30 shadow-lg hover:shadow-xl transition-all"
                                        />
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Recent Activity */}
                            <Card className="glass-card border-white/20 shadow-xl">
                                <CardHeader className="border-b border-white/10">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                                            <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 animate-pulse" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">LinkedIn link clicked</p>
                                                <p className="text-xs text-gray-400 mt-0.5">2 hours ago - From mobile</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                                            <div className="w-2 h-2 rounded-full bg-gray-400 mt-2" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">New message received</p>
                                                <p className="text-xs text-gray-400 mt-0.5">5 hours ago - Community</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                                            <div className="w-2 h-2 rounded-full bg-gray-400 mt-2" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">Portfolio visited</p>
                                                <p className="text-xs text-gray-400 mt-0.5">1 day ago - Desktop</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Community Chat - Large Section */}
                        <div className="lg:col-span-2">
                            <Card className="h-[700px] flex flex-col glass-card border-white/20 shadow-2xl">
                                <CardHeader className="border-b border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl flex items-center gap-3">
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500 shadow-lg shadow-black/40"></span>
                                                </span>
                                                Community Chat
                                            </CardTitle>
                                            <CardDescription className="text-gray-400 mt-2 flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                45 members online now
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="px-3 py-1.5 bg-white/10 text-gray-300 text-xs font-semibold rounded-full border border-white/10">
                                                LIVE
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-y-auto p-6">
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center space-y-4">
                                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-2xl shadow-black/40">
                                                <MessageSquare className="h-10 w-10 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-white mb-2">Chat Coming Soon</p>
                                                <p className="text-sm text-gray-400 max-w-md">
                                                    Real-time chat functionality is available in Docker deployment
                                                </p>
                                                <p className="text-xs text-gray-400 mt-3 bg-white/5 px-4 py-2 rounded-lg inline-block border border-white/10">
                                                    Development Mode - Windows Testing
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    </div>

                </div>
            </GlassShell>
        </>
    )
}



