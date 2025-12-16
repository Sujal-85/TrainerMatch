import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting simple seed...');

    try {
        // 1. Create Vendor
        const vendor = await prisma.vendor.create({
            data: {
                name: 'Seed Organization',
                description: 'Initial seed vendor',
                website: 'https://example.com'
            }
        });
        console.log('Created Vendor:', vendor.id);

        // 2. Create College
        const college = await prisma.college.create({
            data: {
                name: 'Stanford University',
                description: 'Private research university',
                city: 'Stanford',
                state: 'CA',
                address: '450 Serra Mall',
                vendorId: vendor.id
            }
        });
        console.log('Created College:', college.id);

        // 3. Create Trainer
        const trainer = await prisma.trainer.create({
            data: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                bio: 'Expert in AI',
                skills: ['AI', 'Python'],
                vendorId: vendor.id
            }
        });
        console.log('Created Trainer:', trainer.id);

    } catch (e) {
        console.error('Seed failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
