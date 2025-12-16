
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@gmail.com';
    console.log(`Checking if user ${email} exists...`);

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        console.log('User already exists. Updating role to SUPER_ADMIN...');
        await prisma.user.update({
            where: { email },
            data: { role: 'SUPER_ADMIN' }
        });
        console.log('User role updated.');
    } else {
        console.log('User does not exist. Creating admin user...');
        await prisma.user.create({
            data: {
                email,
                role: 'SUPER_ADMIN',
                firebaseUid: 'manual-admin-create', // Placeholder
            }
        });
        console.log('Admin user created successfully.');
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
