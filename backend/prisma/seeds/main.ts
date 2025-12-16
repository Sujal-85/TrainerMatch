import { PrismaClient } from '@prisma/client';
import { colleges, trainers, requirements, sessions, documents } from './data';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 0. Ensure Vendor Exists
    console.log('Ensuring Vendor...');
    // Check if first user has a vendor, or just create a specific seed vendor
    let vendor = await prisma.vendor.findFirst({
        where: { name: 'Seed Vendor' }
    });

    if (!vendor) {
        vendor = await prisma.vendor.create({
            data: {
                name: 'Seed Vendor',
                description: 'Vendor created for seeding data',
                website: 'https://seed-vendor.com'
            }
        });
    }

    // 1. Seed Colleges
    console.log('Seeding Colleges...');
    const collegeRecords = [];
    for (const c of colleges) {
        const college = await prisma.college.create({
            data: {
                ...c,
                vendorId: vendor.id // Link to vendor
            },
        });
        collegeRecords.push(college);
    }

    // 2. Seed Trainers
    console.log('Seeding Trainers...');
    const trainerRecords = [];
    // Function to generate fake ObjectId
    const genId = () => Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    for (const t of trainers) {
        const trainer = await prisma.trainer.create({
            data: {
                name: t.name,
                email: t.email,
                skills: t.skills,
                hourlyRate: t.hourlyRate,
                location: t.location,
                bio: t.bio,
                latitude: 37.7749,
                longitude: -122.4194,
                userId: genId(), // Fake User ID to satisfy unique index
            },
        });
        trainerRecords.push(trainer);
    }

    // 3. Seed Requirements
    console.log('Seeding Requirements...');
    const requirementRecords = [];
    for (const r of requirements) {
        const randomCollege = collegeRecords[Math.floor(Math.random() * collegeRecords.length)];
        const req = await prisma.requirement.create({
            data: {
                ...r,
                status: r.status as any, // Cast to match Enum
                collegeId: randomCollege.id,
                // Since we have a vendor now, using it directly is better than creating deeper nested
                // But Schema says Requirement belongs to College AND Vendor (via College? No, direct relation?)
                // Let's check relation. Requirement -> Vendor is NOT explicitly required in create if optional?
                // Schema: vendor Vendor? @relation
                // But usually we want it.
                vendorId: vendor.id
            },
        });
        requirementRecords.push(req);
    }

    // 4. Seed Matches
    console.log('Seeding Matches...');
    for (const req of requirementRecords) {
        const numMatches = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < numMatches; i++) {
            const randomTrainer = trainerRecords[Math.floor(Math.random() * trainerRecords.length)];
            const score = Math.random() * 0.5 + 0.5; // 0.5 to 1.0

            // Use upsert or try-catch for unique, here just create
            // Assuming no strict unique constraint on (req, trainer) for now or it's just a seed
            await prisma.match.create({
                data: {
                    requirementId: req.id,
                    trainerId: randomTrainer.id,
                    score: score,
                    explanation: 'Seeded match explanation.',
                    status: (score > 0.8 ? 'ACCEPTED' : 'PENDING') as any
                }
            }).catch((e) => { });
        }
    }

    // 5. Seed Sessions
    console.log('Seeding Sessions...');
    for (const s of sessions) {
        const randomTrainer = trainerRecords[Math.floor(Math.random() * trainerRecords.length)];
        const randomReq = requirementRecords[Math.floor(Math.random() * requirementRecords.length)];
        const randomCollege = collegeRecords.find(c => c.id === randomReq.collegeId);

        await prisma.session.create({
            data: {
                ...s,
                status: s.status as any, // Cast to match Enum
                collegeId: randomCollege?.id!,
                trainerId: randomTrainer.id,
                // requirementId is NOT in Session model based on Schema shown earlier! 
                // Wait, let me check Schema again.
                // Session: collegeId, trainerId. NO requirementId in Lines 232-252.
                // So I remove requirementId.
                attendance: ["Student A", "Student B", "Student C"], // Mock attendance list
                topic: s.title,
                feedbackRating: s.status === 'COMPLETED' ? Math.floor(Math.random() * 2) + 4 : null,
            }
        });
    }

    // 6. Seed Documents
    console.log('Seeding Documents...');
    for (const d of documents) {
        const college = collegeRecords.find(c => c.name === d.folder);

        await prisma.document.create({
            data: {
                title: d.title,
                type: d.type as any,
                url: 'https://example.com/doc.pdf',
                folderName: d.folder,
                collegeId: college ? college.id : null,
                // Removed size
            }
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
