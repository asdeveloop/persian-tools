import { randomUUID } from 'node:crypto';
import { prisma } from './db';
import { hashPassword, verifyPassword } from './passwords';
import type { User as PrismaUser } from '@prisma/client';

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: number;
};

function mapUser(user: PrismaUser): User {
  return {
    id: user.id,
    email: user.email,
    passwordHash: user.passwordHash,
    createdAt: Number(user.createdAt),
  };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  );
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const normalized = email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) {
    return undefined;
  }
  return mapUser(user);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return undefined;
  }
  return mapUser(user);
}

export async function createUser(email: string, password: string): Promise<User> {
  const normalized = email.toLowerCase();
  const now = BigInt(Date.now());
  const user: User = {
    id: randomUUID(),
    email: normalized,
    passwordHash: hashPassword(password),
    createdAt: Number(now),
  };
  try {
    const created = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        createdAt: now,
      },
    });
    return mapUser(created);
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error('USER_EXISTS');
    }
    throw error;
  }
}

export async function validateUser(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }
  if (!verifyPassword(password, user.passwordHash)) {
    return null;
  }
  return user;
}
