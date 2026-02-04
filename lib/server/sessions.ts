import { randomBytes, randomUUID } from 'node:crypto';
import { prisma } from './db';
import type { Session as PrismaSession } from '@prisma/client';

export type Session = {
  id: string;
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
};

const DEFAULT_TTL_DAYS = Number(process.env['SESSION_TTL_DAYS'] ?? '7');

function mapSession(session: PrismaSession): Session {
  return {
    id: session.id,
    token: session.token,
    userId: session.userId,
    createdAt: Number(session.createdAt),
    expiresAt: Number(session.expiresAt),
  };
}

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export async function createSession(userId: string): Promise<Session> {
  const now = Date.now();
  const expiresAt = now + DEFAULT_TTL_DAYS * 24 * 60 * 60 * 1000;
  const session = await prisma.session.create({
    data: {
      id: randomUUID(),
      token: generateToken(),
      userId,
      createdAt: BigInt(now),
      expiresAt: BigInt(expiresAt),
    },
  });
  return mapSession(session);
}

export async function getSessionByToken(token: string): Promise<Session | null> {
  const session = await prisma.session.findUnique({ where: { token } });
  if (!session) {
    return null;
  }
  const mapped = mapSession(session);
  if (mapped.expiresAt < Date.now()) {
    await deleteSession(token);
    return null;
  }
  return mapped;
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { token } });
}
