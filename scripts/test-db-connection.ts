import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Attempting to connect to database...')
    console.log(`📡 URL: ${process.env.DATABASE_URL?.replace(/:[^:]+@/, ':****@')}`) // Hide password

    try {
        await prisma.$connect()
        console.log('✅ Connection successful!')

        const count = await prisma.user.count()
        console.log(`📊 Validated: Found ${count} users in database.`)

    } catch (e: any) {
        console.error('❌ Connection failed!')
        console.error('---------------------------------------------------')
        console.error(e.message)
        console.error('---------------------------------------------------')
    } finally {
        await prisma.$disconnect()
    }
}

main()
