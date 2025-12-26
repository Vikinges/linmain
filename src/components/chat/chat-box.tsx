"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMessages, sendMessage } from "@/lib/actions/chat"
import { cn } from "@/lib/utils"

type Message = {
    id: string
    content: string
    createdAt: string | Date
    userId: string
    user: {
        name: string | null
        image: string | null
        id: string
    }
}

type ChatBoxProps = {
    className?: string
}

export function ChatBox({ className }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const { status } = useSession()
    const isAuthenticated = status === "authenticated"

    // Polling for messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const msgs = await getMessages()
                setMessages(msgs)
            } catch (err) {
                console.error("Failed to load messages", err)
                setError("Failed to load messages. Please refresh.")
            }
        }

        fetchMessages()
        const interval = setInterval(fetchMessages, 3000) // Poll every 3 seconds
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    async function handleSend(e: React.FormEvent) {
        e.preventDefault()
        if (!input.trim()) return
        if (!isAuthenticated) {
            setError("Please sign in to send messages.")
            return
        }

        setLoading(true)
        setError(null)
        const originalInput = input
        setInput("") // Optimistic clear

        try {
            await sendMessage(originalInput)
            const msgs = await getMessages()
            setMessages(msgs)
        } catch (err) {
            console.error("Failed to send", err)
            const message = err instanceof Error ? err.message : "Failed to send message."
            setError(message)
            setInput(originalInput) // Revert
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className={cn("h-[700px] flex flex-col glass-card border-none shadow-2xl", className)}>
            <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="flex items-center">
                    <span className="relative flex h-3 w-3 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Community Chat
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex items-start gap-3", "justify-start")}>
                        <Avatar className="w-8 h-8 border border-white/20">
                            <AvatarImage src={msg.user.image || ""} />
                            <AvatarFallback>{msg.user.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground mb-1 ml-1">{msg.user.name}</span>
                            <div className={cn(
                                "rounded-xl px-4 py-2 max-w-[80%]",
                                "bg-white/10 text-foreground border border-white/10"
                            )}>
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1 ml-1 opacity-50">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </CardContent>
            <div className="p-4 border-t border-white/10 bg-black/20">
                {!isAuthenticated && status !== "loading" && (
                    <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300">
                        <span>Sign in to join the chat.</span>
                        <Button asChild size="sm" variant="outline" className="border-gray-600/70 text-gray-200 hover:bg-gray-800/60">
                            <Link href="/login">Login</Link>
                        </Button>
                    </div>
                )}
                {error && (
                    <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setError(null)}
                        placeholder={isAuthenticated ? "Type a message..." : "Login to start chatting"}
                        className="bg-white/5 border-white/10"
                        maxLength={500}
                        disabled={!isAuthenticated || loading}
                    />
                    <Button type="submit" disabled={loading || !input.trim() || !isAuthenticated}>
                        Send
                    </Button>
                </form>
            </div>
        </Card>
    )
}
