import { randomUUID } from 'node:crypto';
import { prisma } from './db';
import { getHistoryEntryById, type HistoryEntry } from './history';
import { normalizeShareExpiryHours } from '@/shared/history/share';
import type { HistoryShareLink as PrismaHistoryShareLink } from '@prisma/client';

export type HistoryShareLink = {
  token: string;
  entryId: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
  outputUrl: string | null;
};

function mapShareLink(link: PrismaHistoryShareLink, outputUrl: string | null): HistoryShareLink {
  return {
    token: link.token,
    entryId: link.entryId,
    userId: link.userId,
    createdAt: Number(link.createdAt),
    expiresAt: Number(link.expiresAt),
    outputUrl,
  };
}

export async function createHistoryShareLink(
  userId: string,
  entryId: string,
  expiresInHours?: number,
): Promise<{ link: HistoryShareLink; entry: HistoryEntry } | null> {
  const entry = await getHistoryEntryById(userId, entryId);
  if (!entry?.outputUrl) {
    return null;
  }

  const token = randomUUID();
  const createdAt = Date.now();
  const hours = normalizeShareExpiryHours(expiresInHours);
  const expiresAt = createdAt + hours * 60 * 60 * 1000;

  const link = await prisma.historyShareLink.create({
    data: {
      token,
      entryId: entry.id,
      userId,
      createdAt: BigInt(createdAt),
      expiresAt: BigInt(expiresAt),
    },
  });

  return {
    link: mapShareLink(link, entry.outputUrl ?? null),
    entry,
  };
}

export async function getHistoryShareLink(token: string): Promise<HistoryShareLink | null> {
  const link = await prisma.historyShareLink.findUnique({
    where: { token },
    include: { entry: true },
  });

  if (!link) {
    return null;
  }

  return mapShareLink(link, link.entry.outputUrl ?? null);
}
