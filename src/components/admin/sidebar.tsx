"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BrandLogo } from "@/components/layout/brand-logo"
import { signOut } from "next-auth/react"
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    BarChart3,
    FileText,
    Database
} from "lucide-react"

interface AdminSidebarProps {
    user?: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
}

export function AdminSidebar({ user }: AdminSidebarProps) {
    const pathname = usePathname()

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin",
            color: "text-sky-500",
            description: "Overview & Stats"
        },
        {
            label: "Users & Groups",
            icon: Users,
            href: "/admin/users",
            color: "text-pink-500",
            description: "User management"
        },
        {
            label: "Chat Messages",
            icon: MessageSquare,
            href: "/admin/chat",
            color: "text-orange-500",
            description: "View chat history"
        },
        {
            label: "Analytics",
            icon: BarChart3,
            href: "/admin/analytics",
            color: "text-green-500",
            description: "Traffic & Stats"
        },
        {
            label: "Editor",
            icon: FileText,
            href: "/admin/editor",
            color: "text-blue-500",
            description: "Page editor"
        },
        {
            label: "Database",
            icon: Database,
            href: "/admin/database",
            color: "text-cyan-500",
            description: "Data management"
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/admin/settings",
            color: "text-gray-400",
            description: "Site settings"
        },
    ]

    return (
        <div className="space-y-4 py-4 flex flex-col h-screen min-h-0 overflow-hidden bg-slate-900 text-white">
            <div className="px-3 py-2 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {/* Header */}
                <div className="pl-3 mb-8">
                    <BrandLogo
                        href="/admin"
                        label="LINART"
                        size={40}
                        subLabel="Admin Panel"
                        labelClassName="text-xl font-bold text-white"
                        subLabelClassName="text-xs text-gray-400"
                    />
                </div>

                {/* Quick Navigation */}
                <div className="mb-6 space-y-2">
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Quick Access
                    </p>
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                        <div className="p-1.5 bg-blue-500/20 rounded-lg">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium">Home Page</span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                        <div className="p-1.5 bg-green-500/20 rounded-lg">
                            <LayoutDashboard className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-sm font-medium">User Dashboard</span>
                    </Link>
                </div>

                {/* User Info */}
                {user && (
                    <div className="mb-6 px-3 py-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 border-2 border-primary/50">
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback className="bg-primary/20">
                                    {user.name?.charAt(0)?.toUpperCase() || "A"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user.name || "Admin"}
                                </p>
                                <p className="text-xs text-gray-400 truncate">
                                    {user.email || "admin@linart.com"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-1">
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Main Menu
                    </p>
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "group flex flex-col p-3 rounded-lg transition-all duration-200",
                                pathname === route.href
                                    ? "bg-white/10 text-white shadow-lg"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center">
                                <route.icon className={cn("h-5 w-5 mr-3 transition-transform group-hover:scale-110", route.color)} />
                                <span className="font-medium">{route.label}</span>
                            </div>
                            <span className="text-xs text-gray-500 ml-8 mt-0.5">{route.description}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-3 py-2 border-t border-white/10">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                </Button>

                <div className="mt-3 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-xs text-gray-400">
                        <span className="font-semibold text-primary">Linart v1.0</span>
                        <br />
                        (c) 2025 All rights reserved
                    </p>
                </div>
            </div>
        </div>
    )
}
