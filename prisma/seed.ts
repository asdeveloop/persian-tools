import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { hashPassword } from '@/lib/server/passwords';

const databaseUrl = process.env['DATABASE_URL'];
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

type SeedResult = {
  createdAdmin: boolean;
  createdDemo: boolean;
};

async function upsertUser(email: string, password: string): Promise<boolean> {
  const normalized = email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    return false;
  }
  const now = BigInt(Date.now());
  await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      email: normalized,
      passwordHash: hashPassword(password),
      createdAt: now,
    },
  });
  return true;
}

async function seed(): Promise<SeedResult> {
  const adminEmail = process.env['SEED_ADMIN_EMAIL']?.trim();
  const adminPassword = process.env['SEED_ADMIN_PASSWORD']?.trim();
  const demoEmail = process.env['SEED_DEMO_EMAIL']?.trim();
  const demoPassword = process.env['SEED_DEMO_PASSWORD']?.trim();

  let createdAdmin = false;
  let createdDemo = false;

  if (adminEmail && adminPassword) {
    createdAdmin = await upsertUser(adminEmail, adminPassword);
  }

  if (demoEmail && demoPassword) {
    createdDemo = await upsertUser(demoEmail, demoPassword);
  }

  return { createdAdmin, createdDemo };
}

seed()
  .then((result) => {
    const summary = [];
    summary.push(result.createdAdmin ? 'admin created' : 'admin skipped');
    summary.push(result.createdDemo ? 'demo created' : 'demo skipped');
    console.log(`[seed] ${summary.join(' | ')}`);
  })
  .catch((error) => {
    console.error('[seed] failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
