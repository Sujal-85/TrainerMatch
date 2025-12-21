"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const userCount = await prisma.user.count();
    const vendorCount = await prisma.vendor.count();
    const collegeCount = await prisma.college.count();
    const trainerCount = await prisma.trainer.count();
    console.log('--- Database Counts ---');
    console.log(`Users: ${userCount}`);
    console.log(`Vendors: ${vendorCount}`);
    console.log(`Colleges: ${collegeCount}`);
    console.log(`Trainers: ${trainerCount}`);
}
main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
//# sourceMappingURL=check_data.js.map