"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const MAX_MESSAGE_LENGTH = 500
const MAX_LINKS = 2
const COOLDOWN_MS = 5000
const WINDOW_MS = 60000
const MAX_MESSAGES_PER_WINDOW = 8
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000

const normalizeMessage = (value: string) => value.trim().replace(/\s+/g, " ")

export async function sendMessage(content: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const normalized = normalizeMessage(content)
    if (!normalized) return
    if (normalized.length > MAX_MESSAGE_LENGTH) {
        throw new Error(`Message too long. Max ${MAX_MESSAGE_LENGTH} characters.`)
    }

    const linkMatches = normalized.match(/https?:\/\/\S+/gi) ?? []
    if (linkMatches.length > MAX_LINKS) {
        throw new Error("Too many links in one message.")
    }

    if (!session.user.isAdmin) {
        const now = Date.now()
        const [lastMessage, recentCount] = await Promise.all([
            prisma.chatMessage.findFirst({
                where: { userId: session.user.id! },
                orderBy: { createdAt: "desc" },
                select: { createdAt: true, content: true }
            }),
            prisma.chatMessage.count({
                where: {
                    userId: session.user.id!,
                    createdAt: { gte: new Date(now - WINDOW_MS) }
                }
            })
        ])

        if (lastMessage) {
            const delta = now - lastMessage.createdAt.getTime()
            if (delta < COOLDOWN_MS) {
                throw new Error("Too fast. Please wait a few seconds.")
            }
            const sameContent = lastMessage.content.trim().toLowerCase() === normalized.toLowerCase()
            if (sameContent && delta < DUPLICATE_WINDOW_MS) {
                throw new Error("Duplicate message blocked.")
            }
        }

        if (recentCount >= MAX_MESSAGES_PER_WINDOW) {
            throw new Error("Rate limit exceeded. Try again later.")
        }
    }

    await prisma.chatMessage.create({
        data: {
            content: normalized,
            userId: session.user.id!
        }
    })

    revalidatePath("/dashboard")
    revalidatePath("/admin/chat")
}

export async function getMessages() {
    const messages = await prisma.chatMessage.findMany({
        take: 50,
        orderBy: { createdAt: 'asc' }, // Oldest first for chat flow
        include: {
            user: {
                select: { name: true, image: true, id: true }
            }
        }
    })
    return messages
}
