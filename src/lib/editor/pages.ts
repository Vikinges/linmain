import { prisma } from "@/lib/db"

export async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
    include: {
      publishedRevision: true,
      draftRevision: true,
    },
  })
}

export async function getPageByIdOrSlug(value: string) {
  if (!value) return null
  return prisma.page.findFirst({
    where: {
      OR: [{ id: value }, { slug: value }],
    },
    include: {
      publishedRevision: true,
      draftRevision: true,
    },
  })
}

export async function getPageIdByIdOrSlug(value: string) {
  if (!value) return null
  return prisma.page.findFirst({
    where: {
      OR: [{ id: value }, { slug: value }],
    },
    select: { id: true },
  })
}

export async function getPublishedPage(slug: string) {
  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      publishedRevision: true,
    },
  })

  if (!page?.publishedRevision) return null
  return page
}
