import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { isAdminUser } from "@/lib/admin"

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const debugEnabled = process.env.NEXTAUTH_DEBUG === "true"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    debug: debugEnabled || process.env.NODE_ENV !== "production",
    trustHost: process.env.AUTH_TRUST_HOST === "true",
    providers: [
        ...(googleClientId && googleClientSecret
            ? [
                Google({
                    clientId: googleClientId,
                    clientSecret: googleClientSecret,
                }),
            ]
            : []),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if (!user || !user.password) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role
                }
            }
        })
    ],
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
                session.user.role = token.role as string
                session.user.isAdmin = token.isAdmin === true
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.isAdmin = isAdminUser({ email: user.email, role: user.role })
            }
            if (token.email && token.isAdmin === undefined) {
                token.isAdmin = isAdminUser({ email: token.email as string, role: token.role as string })
            }
            return token
        }
    }
})
