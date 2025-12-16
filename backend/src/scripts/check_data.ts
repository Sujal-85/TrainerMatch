
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userCount = await prisma.user.count();
    const vendorCount = await prisma.vendor.count();
    const trainerCount = await prisma.trainer.count();

    console.log(`Users: ${userCount}`);
    console.log(`Vendors: ${vendorCount}`);
    console.log(`Trainers: ${trainerCount}`);

    if (vendorCount === 0 && userCount > 0) {
        const users = await prisma.user.findMany({
            where: { role: 'VENDOR_ADMIN' },
            take: 5
        });
        console.log('Vendor Admins:', users);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
