import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function TestPage() {
    let dbStatus = "Checking..."
    let userCount = -1
    let envStatus = "Checking..."

    try {
        const count = await prisma.user.count()
        userCount = count
        dbStatus = "Connected"
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error"
        dbStatus = `Failed: ${message}`
    }

    try {
        envStatus = `
      NEXTAUTH_URL: ${process.env.NEXTAUTH_URL ? "Set" : "Missing"}
      AUTH_SECRET: ${process.env.AUTH_SECRET ? "Set" : "Missing"}
      GOOGLE_ID: ${process.env.GOOGLE_CLIENT_ID ? "Set" : "Missing"}
      GOOGLE_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Missing"}
    `
    } catch {
        envStatus = "Error reading env"
    }

    return (
        <div className="p-10 font-mono text-white bg-black min-h-screen">
            <h1 className="text-2xl mb-4">System Diagnostics</h1>

            <div className="mb-6 border p-4 rounded">
                <h2 className="text-xl font-bold mb-2">Database</h2>
                <p>Status: {dbStatus}</p>
                <p>User Count: {userCount}</p>
            </div>

            <div className="border p-4 rounded">
                <h2 className="text-xl font-bold mb-2">Environment</h2>
                <pre className="whitespace-pre-wrap">{envStatus}</pre>
            </div>
        </div>
    )
}
