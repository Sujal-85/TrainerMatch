"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Starting simple seed...');
    try {
        const vendor = await prisma.vendor.create({
            data: {
                name: 'Seed Organization',
                description: 'Initial seed vendor',
                website: 'https://example.com'
            }
        });
        console.log('Created Vendor:', vendor.id);
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
    }
    catch (e) {
        console.error('Seed failed:', e);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=simple_seed.js.map