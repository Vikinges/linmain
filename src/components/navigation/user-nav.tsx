"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, LayoutDashboard, LogOut, Settings, User } from "lucide-react"

interface UserNavProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
    isAdmin?: boolean
}

export function UserNav({ user, isAdmin }: UserNavProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <div className="relative w-8 h-8">
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Linart
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/">
                            <Home className="h-4 w-4 mr-2" />
                            Home
                        </Link>
                    </Button>

                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Dashboard
                        </Link>
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10 border-2 border-primary/50">
                                    <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                                    <AvatarFallback className="bg-primary/20 text-primary">
                                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 glass-card border-white/10" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email || ""}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard" className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings" className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>

                            {isAdmin && (
                                <>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin" className="cursor-pointer text-violet-400">
                                            <LayoutDashboard className="mr-2 h-4 w-4" />
                                            Admin Panel
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            )}

                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem className="cursor-pointer text-red-400">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>
            </div>
        </header>
    )
}
