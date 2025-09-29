import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';

async function seed() {
  const password = await bcrypt.hash('Password123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'founder@prompthelper.dev' },
    update: {},
    create: {
      email: 'founder@prompthelper.dev',
      password
    }
  });

  const existingPrompts = await prisma.prompt.count({ where: { ownerId: user.id } });
  if (existingPrompts === 0) {
    await prisma.prompt.createMany({
      data: [
        {
          title: 'Brand Voice Generator',
          content: 'Craft a product description for {{product}} using a playful and confident tone.',
          category: 'Copywriting',
          ownerId: user.id
        },
        {
          title: 'Campaign Brainstorm',
          content: 'Generate five creative campaign angles for {{audience}} promoting {{offer}}.',
          category: 'Strategy',
          ownerId: user.id
        }
      ]
    });
  }

  logger.info({ user: user.email }, 'Seed completed');
}

seed()
  .catch((error) => {
    logger.error({ err: error }, 'Seed failed');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
