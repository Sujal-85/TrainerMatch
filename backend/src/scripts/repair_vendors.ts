
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking for users with missing vendors...');

    const users = await prisma.user.findMany({
        where: {
            role: { in: ['VENDOR_ADMIN', 'VENDOR_USER'] },
            vendorId: { not: null }
        }
    });

    for (const user of users) {
        if (!user.vendorId) continue;

        const vendor = await prisma.vendor.findUnique({
            where: { id: user.vendorId }
        });

        if (!vendor) {
            console.log(`User ${user.email} has missing vendor ${user.vendorId}. Recreating...`);

            try {
                const newVendor = await prisma.vendor.create({
                    data: {
                        id: user.vendorId, // Restore the link
                        name: "Restored Vendor",
                        description: "Automatically restored vendor profile",
                        website: "https://example.com"
                    }
                });
                console.log(`Restored vendor for ${user.email}:`, newVendor);
            } catch (e) {
                console.error(`Failed to restore vendor with ID ${user.vendorId}. Creating new one and updating user...`);
                const newVendor = await prisma.vendor.create({
                    data: {
                        name: "Restored Vendor (New)",
                        description: "Automatically restored vendor profile",
                    }
                });
                await prisma.user.update({
                    where: { id: user.id },
                    data: { vendorId: newVendor.id }
                });
                console.log(`Created NEW vendor ${newVendor.id} and updated user.`);
            }
        } else {
            console.log(`User ${user.email} has valid vendor.`);
        }
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
