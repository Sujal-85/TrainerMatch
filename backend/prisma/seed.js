"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    let seedVendor = await prisma.vendor.findFirst({ where: { name: 'Global Education Partners' } });
    if (!seedVendor) {
        seedVendor = await prisma.vendor.create({
            data: {
                name: 'Global Education Partners',
                description: 'Platform partner for educational institutions'
            }
        });
        console.log('Created seed vendor:', seedVendor.id);
    }
    const colleges = [
        {
            name: 'Stanford University',
            description: 'Private research university',
            city: 'Stanford',
            state: 'CA',
            address: '450 Serra Mall',
            contact: { name: 'Admissions Office', email: 'admissions@stanford.edu', phone: '650-723-2300' }
        },
        {
            name: 'MIT',
            description: 'Massachusetts Institute of Technology',
            city: 'Cambridge',
            state: 'MA',
            address: '77 Massachusetts Ave',
            contact: { name: 'Info Desk', email: 'info@mit.edu', phone: '617-253-1000' }
        },
        {
            name: 'Harvard University',
            description: 'Private Ivy League research university',
            city: 'Cambridge',
            state: 'MA',
            address: 'Massachusetts Hall',
            contact: null
        }
    ];
    for (const collegeData of colleges) {
        const existingCollege = await prisma.college.findFirst({ where: { name: collegeData.name } });
        let collegeId = existingCollege?.id;
        if (!existingCollege) {
            const newCollege = await prisma.college.create({
                data: {
                    name: collegeData.name,
                    description: collegeData.description,
                    city: collegeData.city,
                    state: collegeData.state,
                    address: collegeData.address,
                    vendorId: seedVendor.id
                }
            });
            collegeId = newCollege.id;
            console.log(`Created college: ${collegeData.name}`);
        }
        if (collegeId && collegeData.contact) {
            const existingContact = await prisma.contact.findFirst({ where: { collegeId: collegeId, email: collegeData.contact.email } });
            if (!existingContact) {
                await prisma.contact.create({
                    data: {
                        name: collegeData.contact.name,
                        email: collegeData.contact.email,
                        phone: collegeData.contact.phone,
                        collegeId: collegeId
                    }
                });
            }
        }
    }
    const trainers = [
        {
            name: 'Dr. Emily Chen',
            email: 'emily.chen@example.com',
            skills: ['Machine Learning', 'Python', 'Data Science'],
            bio: 'PhD in AI with 5 years industry experience.'
        },
        {
            name: 'Mark Johnson',
            email: 'mark.johnson@example.com',
            skills: ['React', 'Node.js', 'Full Stack'],
            bio: 'Senior Software Engineer and technical trainer.'
        }
    ];
    for (const trainerData of trainers) {
        const exists = await prisma.trainer.findUnique({ where: { email: trainerData.email } });
        if (!exists) {
            await prisma.trainer.create({
                data: {
                    name: trainerData.name,
                    email: trainerData.email,
                    skills: trainerData.skills,
                    bio: trainerData.bio
                }
            });
            console.log(`Created trainer: ${trainerData.name}`);
        }
    }
    console.log('Seeding completed.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map