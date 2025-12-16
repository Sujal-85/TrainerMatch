import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- DEBUG START ---');
  try {
    const rCount = await prisma.requirement.count();
    console.log(`Requirement Count: ${rCount}`);

    const mCount = await prisma.match.count();
    console.log(`Match Count: ${mCount}`);

    const tCount = await prisma.trainer.count();
    console.log(`Trainer Count: ${tCount}`);

    if (rCount > 0) {
        const reqs = await prisma.requirement.findMany({ take: 3, include: { matches: true } });
        console.log('First 3 Requirements:');
        reqs.forEach(r => {
            console.log(`- ID: ${r.id} | Title: ${r.title} | Matches: ${r.matches.length}`);
        });
    } else {
        console.log('No Requirements found.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
  console.log('--- DEBUG END ---');
}

main();
