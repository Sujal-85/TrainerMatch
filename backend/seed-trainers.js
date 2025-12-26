"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const trainers = [
        {
            name: 'Alex Rivera',
            email: 'alex.rivera.ai@example.com',
            bio: 'Full-stack developer with 10 years of experience in React and Node.js. Expert in cloud architectures.',
            skills: ['React', 'Node.js', 'Typescript', 'AWS', 'Docker'],
            domain: ['Web Development', 'Cloud Computing'],
            experience: 10,
            hourlyRate: 85,
            location: 'New York, NY',
            tags: ['Senior', 'Full-stack', 'Expert'],
            rating: 4.8
        },
        {
            name: 'Sarah Chen',
            email: 'sarah.chen.ai@example.com',
            bio: 'Data Scientist specializing in Machine Learning and AI. Former researcher at AI Labs.',
            skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'SQL'],
            domain: ['Artificial Intelligence', 'Data Science', 'Machine Learning'],
            experience: 7,
            hourlyRate: 95,
            location: 'San Francisco, CA',
            tags: ['AI', 'Data Science', 'PhD'],
            rating: 4.9
        },
        {
            name: 'Michael Smith',
            email: 'michael.smith.ai@example.com',
            bio: 'Java Enterprise developer with a focus on scalable microservices and spring boot.',
            skills: ['Java', 'Spring Boot', 'Microservices', 'Kubernetes', 'PostgreSQL'],
            domain: ['Enterprise Software', 'Backend Development'],
            experience: 12,
            hourlyRate: 75,
            location: 'Austin, TX',
            tags: ['Enterprise', 'Java', 'Architect'],
            rating: 4.7
        },
        {
            name: 'Priya Sharma',
            email: 'priya.sharma.ai@example.com',
            bio: 'Frontend enthusiast and UI/UX advocate. Specialized in creating beautiful, accessible web applications.',
            skills: ['React', 'Vue', 'Tailwind CSS', 'Figma', 'Accessibility'],
            domain: ['Frontend Development', 'UI/UX Design'],
            experience: 5,
            hourlyRate: 65,
            location: 'Pune, Maharashtra',
            tags: ['Frontend', 'UI/UX', 'Accessible'],
            rating: 4.6
        },
        {
            name: 'David Wilson',
            email: 'david.wilson.ai@example.com',
            bio: 'Cybersecurity expert and ethical hacker. Helping companies secure their infrastructure.',
            skills: ['Ethical Hacking', 'Networking', 'Security Audit', 'Pentesting', 'Linux'],
            domain: ['Cybersecurity', 'Network Security'],
            experience: 8,
            hourlyRate: 110,
            location: 'London, UK',
            tags: ['Security', 'Ethical Hacker', 'Certified'],
            rating: 4.9
        }
    ];
    console.log('Seeding using simple create to avoid upsert complexity...');
    for (const trainerData of trainers) {
        try {
            await prisma.trainer.deleteMany({ where: { email: trainerData.email } });
            await prisma.user.deleteMany({ where: { email: trainerData.email } });
            const user = await prisma.user.create({
                data: {
                    email: trainerData.email,
                    role: 'TRAINER',
                    passwordHash: 'dummy_hash'
                }
            });
            const { name, email, bio, skills, domain, experience, hourlyRate, location, tags, rating } = trainerData;
            await prisma.trainer.create({
                data: {
                    name, bio, skills, domain, experience, hourlyRate, location, tags, rating,
                    email: email,
                    userId: user.id
                }
            });
        }
        catch (e) {
            console.error(`Error processing ${trainerData.email}:`, e.message);
        }
    }
    console.log('Successfully seeded trainers.');
}
main()
    .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-trainers.js.map