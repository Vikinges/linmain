"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import React from "react"
import { cn } from "@/lib/utils"
import * as Icons from "lucide-react"

interface LinkCardProps {
    title: string
    url: string
    icon?: string | null
    className?: string
}

export function LinkCard({ title, url, icon, className }: LinkCardProps) {
    const IconComponent = icon && (Icons as any)[icon] ? (Icons as any)[icon] : Icons.Link

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
        >
            <Link href={url} target="_blank" rel="noopener noreferrer">
                <div className={cn(
                    "group relative flex items-center justify-between p-4 mb-3 rounded-xl",
                    "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20",
                    "backdrop-blur-md transition-all duration-300",
                    "shadow-lg hover:shadow-primary/10",
                    className
                )}>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-center space-x-4 z-10">
                        <div className="p-2 bg-background/20 rounded-lg text-primary group-hover:scale-110 transition-transform">
                            <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{title}</span>
                    </div>

                    <div className="z-10 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Icons.ExternalLink className="w-5 h-5 text-muted-foreground" />
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
