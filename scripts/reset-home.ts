import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.pageRevision.deleteMany({ where: { page: { slug: 'home' } } })
  await prisma.page.deleteMany({ where: { slug: 'home' } })
  console.log('deleted home page successfully')
}

main()
