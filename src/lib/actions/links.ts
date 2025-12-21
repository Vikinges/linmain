"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"
import { getAdminSession } from "@/lib/admin"

const LinkSchema = z.object({
    title: z.string().min(1, "Title is required"),
    url: z.string().url("Must be a valid URL"),
    icon: z.string().optional(),
    description: z.string().optional(),
    isPublic: z.boolean().default(false),
})

export async function createLink(formData: FormData) {
    const session = await getAdminSession()
    if (!session) {
        throw new Error("Unauthorized")
    }

    const rawData = {
        title: formData.get("title"),
        url: formData.get("url"),
        icon: formData.get("icon"),
        description: formData.get("description"),
        isPublic: formData.get("isPublic") === "on",
    }

    const validatedData = LinkSchema.parse(rawData)

    await prisma.serviceLink.create({
        data: {
            ...validatedData,
            order: 0, // Default order
        }
    })

    revalidatePath("/admin/links")
    revalidatePath("/")
    revalidatePath("/dashboard")
}

export async function deleteLink(id: string) {
    const session = await getAdminSession()
    if (!session) {
        throw new Error("Unauthorized")
    }

    await prisma.serviceLink.delete({
        where: { id }
    })
    revalidatePath("/admin/links")
    revalidatePath("/")
}

export async function getLinks() {
    return await prisma.serviceLink.findMany({
        orderBy: { order: 'asc' },
        include: { groups: true }
    })
}
