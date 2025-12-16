import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const info = await prisma.$runCommandRaw({ buildInfo: 1 })
        console.log(JSON.stringify(info, null, 2))
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
