import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

type UserLike = {
    email?: string | null
    role?: string | null
}

function parseAdminEmails(): string[] {
    const raw = process.env.ADMIN_EMAILS || ""
    return raw
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
}

export function isAdminUser(user?: UserLike | null): boolean {
    if (!user) return false
    const email = user.email?.trim().toLowerCase()
    const adminEmails = parseAdminEmails()

    if (adminEmails.length > 0 && email) {
        return adminEmails.includes(email)
    }

    return user.role === "ADMIN"
}

export async function getAdminSession() {
    const session = await auth()
    if (!session?.user) return null
    if (!isAdminUser(session.user)) return null
    return session
}

export async function requireAdmin() {
    const session = await auth()
    if (!session?.user) {
        redirect("/login")
    }
    if (!isAdminUser(session.user)) {
        redirect("/")
    }
    return session
}
