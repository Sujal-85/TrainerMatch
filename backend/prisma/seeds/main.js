"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const data_1 = require("./data");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Start seeding ...');
    console.log('Ensuring Vendor...');
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
    console.log('Seeding Colleges...');
    const collegeRecords = [];
    for (const c of data_1.colleges) {
        const college = await prisma.college.create({
            data: {
                ...c,
                vendorId: vendor.id
            },
        });
        collegeRecords.push(college);
    }
    console.log('Seeding Trainers...');
    const trainerRecords = [];
    const genId = () => Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    for (const t of data_1.trainers) {
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
                userId: genId(),
            },
        });
        trainerRecords.push(trainer);
    }
    console.log('Seeding Requirements...');
    const requirementRecords = [];
    for (const r of data_1.requirements) {
        const randomCollege = collegeRecords[Math.floor(Math.random() * collegeRecords.length)];
        const req = await prisma.requirement.create({
            data: {
                ...r,
                status: r.status,
                collegeId: randomCollege.id,
                vendorId: vendor.id
            },
        });
        requirementRecords.push(req);
    }
    console.log('Seeding Matches...');
    for (const req of requirementRecords) {
        const numMatches = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < numMatches; i++) {
            const randomTrainer = trainerRecords[Math.floor(Math.random() * trainerRecords.length)];
            const score = Math.random() * 0.5 + 0.5;
            await prisma.match.create({
                data: {
                    requirementId: req.id,
                    trainerId: randomTrainer.id,
                    score: score,
                    explanation: 'Seeded match explanation.',
                    status: (score > 0.8 ? 'ACCEPTED' : 'PENDING')
                }
            }).catch((e) => { });
        }
    }
    console.log('Seeding Sessions...');
    for (const s of data_1.sessions) {
        const randomTrainer = trainerRecords[Math.floor(Math.random() * trainerRecords.length)];
        const randomReq = requirementRecords[Math.floor(Math.random() * requirementRecords.length)];
        const randomCollege = collegeRecords.find(c => c.id === randomReq.collegeId);
        await prisma.session.create({
            data: {
                ...s,
                status: s.status,
                collegeId: randomCollege?.id,
                trainerId: randomTrainer.id,
                attendance: ["Student A", "Student B", "Student C"],
                topic: s.title,
                feedbackRating: s.status === 'COMPLETED' ? Math.floor(Math.random() * 2) + 4 : null,
            }
        });
    }
    console.log('Seeding Documents...');
    for (const d of data_1.documents) {
        const college = collegeRecords.find(c => c.name === d.folder);
        await prisma.document.create({
            data: {
                title: d.title,
                type: d.type,
                url: 'https://example.com/doc.pdf',
                folderName: d.folder,
                collegeId: college ? college.id : null,
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
//# sourceMappingURL=main.js.map