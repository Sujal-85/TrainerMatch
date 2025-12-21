"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Checking admin user...');
    const user = await prisma.user.findUnique({
        where: { email: 'admin@gmail.com' }
    });
    if (user) {
        console.log('Admin user found:', user);
        console.log('Role:', user.role);
    }
    else {
        console.log('Admin user NOT found in database.');
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
//# sourceMappingURL=check_admin.js.map