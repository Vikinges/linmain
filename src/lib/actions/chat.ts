"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function sendMessage(content: string) {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    // Ideally validate content with Zod
    if (!content.trim()) return

    await prisma.chatMessage.create({
        data: {
            content,
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
