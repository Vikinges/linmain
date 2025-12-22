import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            role?: string
            isAdmin?: boolean
            id?: string
        } & DefaultSession["user"]
    }

    interface User {
        role?: string
    }
}
