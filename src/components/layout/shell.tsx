import React from "react"
import { cn } from "@/lib/utils"
import { AppBackground } from "@/components/layout/app-background"

interface ShellProps {
    children: React.ReactNode
    className?: string
}

export function Shell({ children, className }: ShellProps) {
    return (
        <div className={cn("min-h-screen bg-background font-sans antialiased", className)}>
            {children}
        </div>
    )
}

export function GlassShell({ children, className }: ShellProps) {
    return (
        <div className={cn("min-h-screen relative overflow-hidden bg-background font-sans antialiased selection:bg-primary selection:text-primary-foreground", className)}>
            <AppBackground />

            <main className="relative z-10 container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}
