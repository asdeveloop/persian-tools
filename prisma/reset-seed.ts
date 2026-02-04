/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const databaseUrl = process.env['DATABASE_URL'];
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function resetSeed(): Promise<void> {
  const emails = [
    process.env['SEED_ADMIN_EMAIL']?.trim(),
    process.env['SEED_DEMO_EMAIL']?.trim(),
    'admin@persian-tools.local',
    'demo@persian-tools.local',
  ].filter(Boolean) as string[];

  if (!emails.length) {
    console.log('[seed:reset] no seed emails provided');
    return;
  }

  const result = await prisma.user.deleteMany({
    where: {
      email: { in: emails.map((email) => email.toLowerCase()) },
    },
  });

  console.log(`[seed:reset] deleted ${result.count} user(s)`);
}

resetSeed()
  .catch((error) => {
    console.error('[seed:reset] failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
