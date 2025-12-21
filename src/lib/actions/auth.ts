"use server"

import { redirect } from "next/navigation"

// Simple mock login action - replace with real auth in production
export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Mock authentication
    if (email === "admin@example.com" && password === "admin") {
        redirect("/admin")
    } else if (email === "user@example.com" && password === "user") {
        redirect("/dashboard")
    } else {
        return { error: "Invalid credentials" }
    }
}
