import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Hash passwords
    const adminPasswordHash = await bcrypt.hash('admin', 10)
    const userPasswordHash = await bcrypt.hash('user', 10)

    // Create Admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: adminPasswordHash,
            role: Role.ADMIN,
            bio: 'System Administrator'
        },
    })

    // Create Regular user
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'Test User',
            password: userPasswordHash,
            role: Role.USER,
            bio: 'Regular User'
        },
    })

    console.log('Created users:', { admin, user })

    // Create some groups
    const familyGroup = await prisma.group.upsert({
        where: { name: 'Family' },
        update: {},
        create: {
            name: 'Family',
            description: 'Family members only',
            users: {
                connect: [{ id: admin.id }]
            }
        }
    })

    const workGroup = await prisma.group.upsert({
        where: { name: 'Work' },
        update: {},
        create: {
            name: 'Work',
            description: 'Work colleagues',
            users: {
                connect: [{ id: admin.id }, { id: user.id }]
            }
        }
    })

    console.log('Created groups:', { familyGroup, workGroup })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
