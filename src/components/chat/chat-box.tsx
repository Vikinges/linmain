"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMessages, sendMessage } from "@/lib/actions/chat"
import { cn } from "@/lib/utils"
// import { useSession } from "next-auth/react" // Client-side session

type Message = {
    id: string
    content: string
    createdAt: Date
    userId: string
    user: {
        name: string | null
        image: string | null
        id: string
    }
}

export function ChatBox() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    //   const { data: session } = useSession()

    // Polling for messages
    useEffect(() => {
        const fetchMessages = async () => {
            const msgs = await getMessages()
            setMessages(msgs)
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

        setLoading(true)
        const originalInput = input
        setInput("") // Optimistic clear

        try {
            await sendMessage(originalInput)
            const msgs = await getMessages()
            setMessages(msgs)
        } catch (err) {
            console.error("Failed to send", err)
            setInput(originalInput) // Revert
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="h-[600px] flex flex-col glass-card border-none shadow-2xl">
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
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="bg-white/5 border-white/10"
                    />
                    <Button type="submit" disabled={loading || !input.trim()}>
                        Send
                    </Button>
                </form>
            </div>
        </Card>
    )
}
