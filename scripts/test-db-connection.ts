import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Attempting to connect to database...")
    console.log(`DB URL: ${process.env.DATABASE_URL?.replace(/:[^:]+@/, ":****@")}`)

    try {
        await prisma.$connect()
        console.log("Connection successful!")

        const count = await prisma.user.count()
        console.log(`Validated: Found ${count} users in database.`)
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error"
        console.error("Connection failed!")
        console.error("---------------------------------------------------")
        console.error(message)
        console.error("---------------------------------------------------")
    } finally {
        await prisma.$disconnect()
    }
}

main()

