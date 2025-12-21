"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        const info = await prisma.$runCommandRaw({ buildInfo: 1 });
        console.log(JSON.stringify(info, null, 2));
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=check_version.js.map