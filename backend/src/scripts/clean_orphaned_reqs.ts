
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting cleanup of orphaned requirements...');

    // 1. Get all valid Vendor IDs
    const vendors = await prisma.vendor.findMany({ select: { id: true } });
    const vendorIds = new Set(vendors.map(v => v.id));
    console.log(`Found ${vendorIds.size} valid vendors.`);

    // 2. Get all Requirements
    const requirements = await prisma.requirement.findMany({
        select: { id: true, vendorId: true, title: true }
    });
    console.log(`Found ${requirements.length} requirements total.`);

    // 3. Identify Orphans
    const orphans = requirements.filter(req => !req.vendorId || !vendorIds.has(req.vendorId));

    if (orphans.length === 0) {
        console.log('No orphaned requirements found. Data integrity looks good!');
        return;
    }

    console.log(`Found ${orphans.length} orphaned requirements:`);
    orphans.forEach(req => {
        console.log(` - ID: ${req.id}, Title: "${req.title}", Invalid VendorId: ${req.vendorId}`);
    });

    // 4. Delete Dependencies First
    console.log('Deleting dependencies...');
    const orphanIds = orphans.map(req => req.id);

    const matches = await prisma.match.deleteMany({ where: { requirementId: { in: orphanIds } } });
    console.log(`Deleted ${matches.count} matches.`);

    const proposals = await prisma.proposal.deleteMany({ where: { requirementId: { in: orphanIds } } });
    console.log(`Deleted ${proposals.count} proposals.`);

    const collegeProposals = await prisma.collegeProposal.deleteMany({ where: { requirementId: { in: orphanIds } } });
    console.log(`Deleted ${collegeProposals.count} college proposals.`);

    const documents = await prisma.document.deleteMany({ where: { requirementId: { in: orphanIds } } });
    console.log(`Deleted ${documents.count} documents.`);

    // 5. Delete Requirements
    console.log('Deleting requirements...');
    const result = await prisma.requirement.deleteMany({
        where: {
            id: {
                in: orphanIds
            }
        }
    });

    console.log(`Deleted ${result.count} orphaned requirements.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
