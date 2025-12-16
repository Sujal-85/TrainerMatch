import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Creating collections...')
    const collections = ['Vendor', 'College', 'Trainer', 'User', 'Requirement', 'Session']

    for (const col of collections) {
        try {
            await prisma.$runCommandRaw({ create: col })
            console.log(`Created ${col}`)
        } catch (e: any) {
            if (e.message && e.message.includes('already exists')) {
                console.log(`${col} already exists`)
            } else {
                console.log(`Failed to create ${col}:`, e.message || e)
            }
        }
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())
